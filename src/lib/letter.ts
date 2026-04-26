// Generate an appeal letter and a phone-call script from a DecodedBill.
//
// This step is deliberately separate from `extract.ts` because:
// 1. The user reviews the decoded bill before drafting an appeal — they may
//    edit anomalies in/out, or add a personal statement.
// 2. The appeal step has different cost/quality tradeoffs. You may want to
//    run this with a stronger model than the decode step.
//
// Scaling note: when we add state-specific surprise-billing laws, ground the
// citations the same way we ground CARC codes — load the relevant state's
// JSON file and inject it into the prompt instead of letting the model
// generate citations.

import type { AppealLetter, DraftLetterRequest } from "./types";
import { appealLetterSchema } from "./schemas";
import { anthropic, DEFAULT_MODEL, DEBUG, extractJSON } from "./anthropic";
import federalRules from "@/data/federal-rules.json";

const SYSTEM_PROMPT = `You write health-insurance appeal letters and phone scripts on behalf of patients.

Voice rules:
- Direct, professional, polite. Never adversarial. Never threatening.
- First-person from the patient.
- Short paragraphs. Short sentences. Real names and amounts where the data has them.
- Cite only the federal rules whose IDs are listed in the reference block. Do not
  invent statutes, regulations, or case law.
- If you don't know the patient's full address, leave a [PLACEHOLDER] the user can
  fill in. Don't invent it.
- The phone script should be in plain spoken English — short bullets the user can
  read aloud.

Hard structural rules:
- Output STRICT JSON matching the provided schema. No fences. No prose around it.
- Body must be markdown formatted. Use real headings (## ) and **bold** for the
  parts the user is most likely to need to find quickly.
- Every "deadline" you list must be a real deadline you can point to in the
  document or in the cited rule. If unsure, omit rather than invent.`;

const SCHEMA_BLOCK = `JSON schema:

interface AppealLetter {
  body: string;          // markdown
  subject: string;
  mailingAddress?: string; // if extractable from document
  callScript: string;    // markdown bullets, second person, voice-friendly
  deadlines: Array<{ label: string; date: string; note?: string }>;
  citations: Array<{ label: string; source: string; url?: string }>;
}`;

export async function draftAppealLetter(
  req: DraftLetterRequest
): Promise<AppealLetter> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured on the server. Set it in your environment."
    );
  }

  const { decoded, anomalyIndices, patientStatement, patientInfo } = req;

  // Default: argue every high+medium anomaly. Filtered if user provided a list.
  const targets = anomalyIndices
    ? anomalyIndices.map((i) => decoded.anomalies[i]).filter(Boolean)
    : decoded.anomalies.filter(
        (a) => a.confidence === "high" || a.confidence === "medium"
      );

  if (targets.length === 0) {
    throw new Error(
      "No anomalies to argue. The document may not contain a denial or a clear billing error."
    );
  }

  const referenceJSON = JSON.stringify(federalRules.rules, null, 2);

  const userMessage = `### Federal rules (cite ONLY these by id)
${referenceJSON}

### Decoded document
${JSON.stringify(decoded, null, 2)}

### Anomalies to argue (the only ones the letter should address)
${JSON.stringify(targets, null, 2)}

### Patient info
${JSON.stringify(patientInfo || {}, null, 2)}

### Patient personal statement (optional, weave in if useful)
${patientStatement || "(none provided)"}

### Schema
${SCHEMA_BLOCK}

Now produce the appeal letter, mailing address (if extractable), call script, deadlines, and citations. JSON only.`;

  const tryDraft = async (extraNudge?: string): Promise<AppealLetter> => {
    const messages = [
      { role: "user" as const, content: userMessage + (extraNudge ? `\n\n${extraNudge}` : "") },
    ];

    const resp = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
    });

    const textBlock = resp.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("LLM returned no text content.");
    }
    if (DEBUG) console.error("[pushback letter] raw:", textBlock.text.slice(0, 4000));
    const parsed = extractJSON(textBlock.text);
    const validated = appealLetterSchema.safeParse(parsed);
    if (!validated.success) {
      throw new Error(
        `Schema validation failed: ${JSON.stringify(validated.error.issues.slice(0, 3))}`
      );
    }
    return validated.data;
  };

  try {
    return await tryDraft();
  } catch (e) {
    const msg = (e as Error).message;
    if (DEBUG) console.error("[pushback letter] first try failed:", msg);
    return await tryDraft(
      `Your previous response did not match the schema. Error: ${msg}. Please return ONLY the JSON object.`
    );
  }
}
