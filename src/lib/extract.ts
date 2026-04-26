// Decode a medical bill, EOB, or denial letter into structured data.
//
// This is the heavy-lift step. We:
// 1. Build a prompt that includes the bill (text or image), the user's context,
//    and a curated list of CARC codes Claude can reference instead of guessing.
// 2. Ask Claude for a strict JSON response matching `decodedBillSchema`.
// 3. Validate. If validation fails, retry once with a "your last response
//    didn't match the schema" nudge. If it fails twice, surface an error.
//
// Notes for scaling:
// - Right now we send the whole CARC table inline (~10KB). For a heavier
//   reference set (RARC, state laws, etc.), switch to selective retrieval —
//   pull only codes the bill references.
// - For multi-page PDFs, we pass each page as a separate image content block.
//   Claude's vision handles this natively up to the per-request size limit.
// - All processing is in-memory. Nothing persists. If you add persistence,
//   audit the entire pipeline for PHI handling.

import type { DecodedBill, DecodeRequest } from "./types";
import { decodedBillSchema } from "./schemas";
import { anthropic, DEFAULT_MODEL, DEBUG, extractJSON } from "./anthropic";
import carcCodes from "@/data/carc-codes.json";
import federalRules from "@/data/federal-rules.json";

const SYSTEM_PROMPT = `You are a medical-billing analyst working on behalf of a patient. Your job is to:

1. Read a medical bill, Explanation of Benefits (EOB), or denial letter.
2. Extract every line item into structured data — no summarization at this stage.
3. Identify anomalies the patient should challenge: duplicate charges, denials without
   real reasons, out-of-network when in-network was implied, billing for preventive care
   that should be free, balance billing that violates the No Surprises Act, upcoded
   procedures, missing prior auth that the provider should have on file, etc.
4. Produce plain-English explanations a non-expert can understand.
5. Recommend specific actions, ranked by priority and tied to deadlines.

You will be given:
- The document text (extracted from PDF/image), or the document image directly
- A reference table of CARC codes (Claim Adjustment Reason Codes) — use these to
  decode any denial codes you see. Do NOT hallucinate code meanings; if a code is
  not in the table, say so explicitly.
- A reference table of federal patient-protection rules — cite these where relevant.
- Optional patient-provided context

You will return STRICT JSON matching the schema given to you. No prose around it.
No markdown fences. Just the JSON object.

Critical guardrails:
- Never claim the patient owes any specific amount — extract what the document
  says, but don't inflate or invent.
- Never invent CARC codes that aren't in the reference table.
- Never invent legal citations. Cite only the IDs from the federal-rules table.
- If something is unclear, say so in the relevant field rather than guessing.
- Confidence levels: "high" only when there is a clear, documented violation.
  "medium" when the pattern is suspicious. "low" when worth asking but uncertain.`;

const SCHEMA_BLOCK = `JSON schema (TypeScript):

interface DecodedBill {
  meta: {
    documentType: "eob" | "provider_bill" | "denial_letter" | "unknown";
    insurer?: string;
    provider?: string;
    patientName?: string;
    claimNumber?: string;
    memberID?: string;
    documentDate?: string; // YYYY-MM-DD
    totalBilled?: number; // dollars
    totalPatientResponsibility?: number; // dollars
  };
  lineItems: Array<{
    description: string;
    procedureCode?: string;
    diagnosisCode?: string;
    serviceDate?: string;
    billedAmount?: number;
    allowedAmount?: number;
    insurerPaid?: number;
    patientResponsibility?: number;
    carcCodes?: string[]; // numeric strings, e.g. "50", "197"
    rarcCodes?: string[];
  }>;
  anomalies: Array<{
    kind: "duplicate_charge" | "out_of_network_unexpected" | "denied_no_explanation"
        | "denied_medical_necessity" | "denied_prior_auth_missing" | "denied_not_covered"
        | "upcoding_suspect" | "balance_billing_violation" | "preventive_care_charged"
        | "facility_fee_unexpected" | "code_unbundling_suspect" | "timely_filing_error"
        | "coordination_of_benefits_error" | "other";
    explanation: string; // plain English, 1-3 sentences
    lineItemIndices?: number[];
    confidence: "high" | "medium" | "low";
    potentialRecovery?: number;
  }>;
  hasDenial: boolean;
  summary: string; // 2-4 sentence overview for the patient
  recommendedActions: Array<{
    title: string;
    detail: string;
    deadline?: string; // YYYY-MM-DD
    priority: "urgent" | "important" | "informational";
  }>;
}`;

function buildReferencePrompt() {
  const carc = JSON.stringify(carcCodes.codes, null, 2);
  const rules = JSON.stringify(federalRules.rules, null, 2);
  return `### CARC Code Reference (only use codes that appear here)
${carc}

### Federal Patient Protection Rules (cite by id only)
${rules}`;
}

function buildContextPrompt(req: DecodeRequest) {
  const parts: string[] = [];
  if (req.context?.state) parts.push(`Patient state: ${req.context.state}`);
  if (req.context?.diagnosis) parts.push(`Diagnosis context: ${req.context.diagnosis}`);
  if (req.context?.wasInNetworkExpected) parts.push("Patient was told the provider was in-network.");
  if (req.context?.hadPriorAuth) parts.push("Patient had prior authorization.");
  if (req.context?.notes) parts.push(`Patient notes: ${req.context.notes}`);
  return parts.length ? `### Patient-provided context\n${parts.join("\n")}` : "";
}

/**
 * Run the decode. Throws on hard failure. Returns the validated DecodedBill on success.
 */
export async function decodeDocument(req: DecodeRequest): Promise<DecodedBill> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured on the server. Set it in your environment."
    );
  }

  const reference = buildReferencePrompt();
  const context = buildContextPrompt(req);

  // Build content blocks. If we have a base64 document, attach it as an image
  // (Claude vision handles PDFs and images). Otherwise send raw text.
  const contentBlocks: Array<
    | { type: "text"; text: string }
    | {
        type: "image";
        source: { type: "base64"; media_type: string; data: string };
      }
    | {
        type: "document";
        source: { type: "base64"; media_type: string; data: string };
      }
  > = [];

  contentBlocks.push({
    type: "text",
    text: `${reference}

${context}

${SCHEMA_BLOCK}

Return only the JSON. The document follows.`,
  });

  if (req.documentBase64 && req.documentMimeType) {
    if (req.documentMimeType === "application/pdf") {
      contentBlocks.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: req.documentBase64,
        },
      });
    } else {
      contentBlocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: req.documentMimeType,
          data: req.documentBase64,
        },
      });
    }
  } else if (req.documentText) {
    contentBlocks.push({
      type: "text",
      text: `### Document text\n${req.documentText}`,
    });
  } else {
    throw new Error("decodeDocument requires either documentBase64 or documentText.");
  }

  const tryDecode = async (extraNudge?: string): Promise<DecodedBill> => {
    if (extraNudge) {
      contentBlocks.push({ type: "text", text: extraNudge });
    }

    const resp = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: contentBlocks as unknown as Array<{
            type: "text";
            text: string;
          }>,
        },
      ],
    });

    const textBlock = resp.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("LLM returned no text content.");
    }
    if (DEBUG) {
      console.error("[pushback decode] raw:", textBlock.text.slice(0, 4000));
    }
    const parsed = extractJSON(textBlock.text);
    const validated = decodedBillSchema.safeParse(parsed);
    if (!validated.success) {
      throw new Error(
        `Schema validation failed: ${JSON.stringify(
          validated.error.issues.slice(0, 3)
        )}`
      );
    }
    return validated.data;
  };

  try {
    return await tryDecode();
  } catch (e) {
    const msg = (e as Error).message;
    if (DEBUG) console.error("[pushback decode] first try failed:", msg);
    return await tryDecode(
      `Your previous response did not match the schema. Error: ${msg}. Please return ONLY the JSON object, no fences, no prose.`
    );
  }
}
