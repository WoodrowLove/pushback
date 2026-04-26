// Shared types. The single source of truth for every payload that
// crosses an API boundary. Keep these in sync with `schemas.ts` (zod).

/** A single line item on a bill or EOB. */
export type LineItem = {
  /** Free-text description as it appears on the document. */
  description: string;
  /** CPT/HCPCS code if present (5 chars). */
  procedureCode?: string;
  /** ICD-10 diagnosis code if present. */
  diagnosisCode?: string;
  /** Date of service, YYYY-MM-DD if parseable. */
  serviceDate?: string;
  /** Amount billed by the provider, in dollars. */
  billedAmount?: number;
  /** Amount the insurer agreed to (allowed amount), in dollars. */
  allowedAmount?: number;
  /** Amount the insurer paid, in dollars. */
  insurerPaid?: number;
  /** Amount the patient owes, in dollars. */
  patientResponsibility?: number;
  /** CARC (claim adjustment reason) codes that explain insurer decisions. */
  carcCodes?: string[];
  /** RARC (remittance advice remark) codes — supplementary explanations. */
  rarcCodes?: string[];
};

/** A flagged anomaly in the bill. Each one is something to push back on. */
export type Anomaly = {
  kind:
    | "duplicate_charge"
    | "out_of_network_unexpected"
    | "denied_no_explanation"
    | "denied_medical_necessity"
    | "denied_prior_auth_missing"
    | "denied_not_covered"
    | "upcoding_suspect"
    | "balance_billing_violation"
    | "preventive_care_charged"
    | "facility_fee_unexpected"
    | "code_unbundling_suspect"
    | "timely_filing_error"
    | "coordination_of_benefits_error"
    | "other";
  /** Plain-English explanation a patient can understand. */
  explanation: string;
  /** Which line items this anomaly refers to (indices into the LineItem[] array). */
  lineItemIndices?: number[];
  /** How confident we are. "high" = clear violation; "medium" = likely; "low" = worth asking. */
  confidence: "high" | "medium" | "low";
  /** Specific dollar impact if reversed, when known. */
  potentialRecovery?: number;
};

/** What the user uploaded — type tells us how to render results. */
export type DocumentType =
  | "eob" // Explanation of Benefits from insurer
  | "provider_bill" // Bill from a hospital, clinic, doctor
  | "denial_letter" // Standalone letter denying a claim
  | "unknown";

/** Metadata extracted from the document header. */
export type DocumentMeta = {
  documentType: DocumentType;
  /** Insurer name, if present. */
  insurer?: string;
  /** Provider/facility name, if present. */
  provider?: string;
  /** Patient name. We extract but should never render publicly. */
  patientName?: string;
  /** Patient's claim number / account number. Useful in the appeal letter. */
  claimNumber?: string;
  memberID?: string;
  /** Date the document was issued. */
  documentDate?: string;
  /** Total billed across all line items, in dollars. */
  totalBilled?: number;
  /** Total patient owes, in dollars. */
  totalPatientResponsibility?: number;
};

/** The structured output of the decode step. */
export type DecodedBill = {
  meta: DocumentMeta;
  lineItems: LineItem[];
  anomalies: Anomaly[];
  /** True if any line item shows a denial. Drives whether we draft an appeal. */
  hasDenial: boolean;
  /** Plain-English summary of what's happening on this document. */
  summary: string;
  /** What the user should do, ordered by priority. */
  recommendedActions: RecommendedAction[];
};

export type RecommendedAction = {
  /** Human-readable title. */
  title: string;
  /** Detailed instructions. Plain English. */
  detail: string;
  /** Hard deadline (YYYY-MM-DD) if applicable. */
  deadline?: string;
  /** How urgent — drives how prominently we display. */
  priority: "urgent" | "important" | "informational";
};

/** Input to the decoder API. */
export type DecodeRequest = {
  /** Base64-encoded image or PDF, OR plain text. */
  documentBase64?: string;
  documentMimeType?: string;
  /** If the user already has the bill text typed/pasted, send that instead. */
  documentText?: string;
  /** Optional context the user provides to improve analysis. */
  context?: {
    state?: string; // 2-letter US state code, for state-law citations
    diagnosis?: string; // what they were treated for
    wasInNetworkExpected?: boolean;
    hadPriorAuth?: boolean;
    notes?: string;
  };
};

export type DecodeResponse =
  | { ok: true; data: DecodedBill }
  | { ok: false; error: string; suggestion?: string };

/** Input to the appeal-letter drafter. */
export type DraftLetterRequest = {
  decoded: DecodedBill;
  /** Which anomalies to argue (indices). If omitted, drafts for all high+medium confidence anomalies. */
  anomalyIndices?: number[];
  /** What the user wants the letter to emphasize. */
  patientStatement?: string;
  /** Patient name + address — used in the letter header. */
  patientInfo?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
};

export type DraftLetterResponse =
  | {
      ok: true;
      letter: AppealLetter;
    }
  | { ok: false; error: string };

export type AppealLetter = {
  /** Markdown-formatted body of the letter, ready to print. */
  body: string;
  /** Suggested subject line (for email or fax cover). */
  subject: string;
  /** Where to send. We extract from the document where possible; otherwise generic. */
  mailingAddress?: string;
  /** A separate, shorter call script for the user to read on the phone. */
  callScript: string;
  /** Hard deadlines extracted from the document. */
  deadlines: {
    label: string;
    date: string;
    note?: string;
  }[];
  /** Citations the letter relies on. We surface these for transparency. */
  citations: {
    label: string;
    source: string;
    url?: string;
  }[];
};
