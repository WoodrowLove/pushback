// Zod schemas matching `types.ts`.
//
// We use Zod for two reasons:
// 1. Validate API request bodies — clients can't send garbage and crash us.
// 2. Validate LLM JSON output — we ask Claude for structured data and verify
//    the shape before we trust it. If the LLM hallucinates fields, we reject.

import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string(),
  procedureCode: z.string().optional(),
  diagnosisCode: z.string().optional(),
  serviceDate: z.string().optional(),
  billedAmount: z.number().optional(),
  allowedAmount: z.number().optional(),
  insurerPaid: z.number().optional(),
  patientResponsibility: z.number().optional(),
  carcCodes: z.array(z.string()).optional(),
  rarcCodes: z.array(z.string()).optional(),
});

export const anomalyKindSchema = z.enum([
  "duplicate_charge",
  "out_of_network_unexpected",
  "denied_no_explanation",
  "denied_medical_necessity",
  "denied_prior_auth_missing",
  "denied_not_covered",
  "upcoding_suspect",
  "balance_billing_violation",
  "preventive_care_charged",
  "facility_fee_unexpected",
  "code_unbundling_suspect",
  "timely_filing_error",
  "coordination_of_benefits_error",
  "other",
]);

export const anomalySchema = z.object({
  kind: anomalyKindSchema,
  explanation: z.string(),
  lineItemIndices: z.array(z.number()).optional(),
  confidence: z.enum(["high", "medium", "low"]),
  potentialRecovery: z.number().optional(),
});

export const documentTypeSchema = z.enum([
  "eob",
  "provider_bill",
  "denial_letter",
  "unknown",
]);

export const documentMetaSchema = z.object({
  documentType: documentTypeSchema,
  insurer: z.string().optional(),
  provider: z.string().optional(),
  patientName: z.string().optional(),
  claimNumber: z.string().optional(),
  memberID: z.string().optional(),
  documentDate: z.string().optional(),
  totalBilled: z.number().optional(),
  totalPatientResponsibility: z.number().optional(),
});

export const recommendedActionSchema = z.object({
  title: z.string(),
  detail: z.string(),
  deadline: z.string().optional(),
  priority: z.enum(["urgent", "important", "informational"]),
});

export const decodedBillSchema = z.object({
  meta: documentMetaSchema,
  lineItems: z.array(lineItemSchema),
  anomalies: z.array(anomalySchema),
  hasDenial: z.boolean(),
  summary: z.string(),
  recommendedActions: z.array(recommendedActionSchema),
});

export const decodeRequestSchema = z
  .object({
    documentBase64: z.string().optional(),
    documentMimeType: z.string().optional(),
    documentText: z.string().optional(),
    context: z
      .object({
        state: z.string().length(2).optional(),
        diagnosis: z.string().optional(),
        wasInNetworkExpected: z.boolean().optional(),
        hadPriorAuth: z.boolean().optional(),
        notes: z.string().optional(),
      })
      .optional(),
  })
  .refine((d) => !!(d.documentBase64 || d.documentText), {
    message: "Provide either documentBase64 or documentText.",
  });

export const draftLetterRequestSchema = z.object({
  decoded: decodedBillSchema,
  anomalyIndices: z.array(z.number()).optional(),
  patientStatement: z.string().optional(),
  patientInfo: z
    .object({
      name: z.string(),
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
});

export const appealLetterSchema = z.object({
  body: z.string(),
  subject: z.string(),
  mailingAddress: z.string().optional(),
  callScript: z.string(),
  deadlines: z.array(
    z.object({
      label: z.string(),
      date: z.string(),
      note: z.string().optional(),
    })
  ),
  citations: z.array(
    z.object({
      label: z.string(),
      source: z.string(),
      url: z.string().optional(),
    })
  ),
});
