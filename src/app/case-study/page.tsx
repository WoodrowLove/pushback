// Public case study page. Static — no API calls, no PII. Captured output from
// a synthetic-but-realistic EOB run through Pushback during validation.
//
// Why this page exists: every Reddit/HN/journalist visitor wants proof before
// they paste their own bill. A canonical walkthrough is the single highest-
// converting asset we can put on the site.
//
// To swap the example: replace the constants in the BILL/ANOMALIES/LETTER
// blocks below with new captured output. No other code changes needed.

import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata = {
  title: "Case study — how Pushback decoded a $2,820 ER bill",
  description:
    "Real walkthrough: how Pushback reads an Explanation of Benefits, flags duplicate charges and No Surprises Act violations, and drafts a real appeal letter — in under a minute.",
};

const BILL_TEXT = `BLUE CROSS BLUE SHIELD — EXPLANATION OF BENEFITS
Member: JANE DOE   Member ID: ABC123456
Claim #: BCBS-2025-99887

Provider: GENERAL HOSPITAL EMERGENCY DEPT
Date of Service: 2025-08-14

LINE ITEMS
1. EMERGENCY DEPT VISIT LEVEL 4 (CPT 99284)
   Billed $1,250.00   Allowed $0.00   Patient owes $1,250.00   CARC 50

2. CHEST X-RAY 2 VIEWS (CPT 71046)
   Billed $320.00   Allowed $0.00   Patient owes $320.00   CARC 50

3. EMERGENCY DEPT VISIT LEVEL 4 (CPT 99284)
   Billed $1,250.00   Allowed $0.00   Patient owes $1,250.00   CARC 18

Total patient responsibility: $2,820.00`;

type Anomaly = {
  kind: string;
  confidence: "high" | "medium" | "low";
  potentialRecovery?: number;
  explanation: string;
};

const ANOMALIES: Anomaly[] = [
  {
    kind: "Duplicate charge",
    confidence: "high",
    potentialRecovery: 1250,
    explanation:
      "Line items 1 and 3 are identical charges for the same CPT code (99284) on the same date. Line 3 was denied as an exact duplicate (CARC 18). The duplicate should not have been billed and the patient should not be held responsible for it.",
  },
  {
    kind: "Medical-necessity denial on emergency care",
    confidence: "high",
    potentialRecovery: 1570,
    explanation:
      "Lines 1 and 2 were denied with CARC 50 — 'not deemed a medical necessity by the payer.' Emergency services for chest pain are typically covered regardless of final diagnosis under the prudent layperson standard. The patient presented with chest pain — a symptom that could indicate a life-threatening condition — making this a protected emergency visit.",
  },
  {
    kind: "Possible No Surprises Act violation",
    confidence: "high",
    potentialRecovery: 1570,
    explanation:
      "The insurer paid $0 and allowed $0 on both non-duplicate lines, which is atypical for in-network emergency care. The patient was told the provider was in-network. If the hospital or any treating provider was out-of-network, the No Surprises Act requires that emergency services be billed at in-network rates with in-network cost-sharing.",
  },
];

const ACTIONS = [
  {
    title: "Challenge the duplicate charge immediately",
    detail:
      "Contact the hospital billing department and reference line 3 (CPT 99284, claim BCBS-2025-99887). Note that this is an exact duplicate of line 1 and was flagged as CARC 18 by the insurer themselves. Request immediate removal of the $1,250 duplicate from the balance. Document in writing.",
    priority: "urgent" as const,
    deadline: undefined,
  },
  {
    title: "File internal appeal with BCBS for medical-necessity denial",
    detail:
      "Cite the prudent-layperson standard. Under federal law (ERISA appeal rights, 29 CFR § 2560.503-1; ACA, 45 CFR § 147.136), emergency services cannot be denied solely because the final diagnosis was non-serious. Request reprocessing as a covered emergency visit. 180-day window from EOB date.",
    priority: "urgent" as const,
    deadline: "Feb 10, 2026",
  },
  {
    title: "Assert No Surprises Act protection",
    detail:
      "Cite 45 CFR §§ 149.110, 149.120. Request written confirmation of network status for the ED and all treating providers on Aug 14. If any were out-of-network, demand reprocessing at in-network rates.",
    priority: "important" as const,
    deadline: undefined,
  },
];

const LETTER_BODY = `Jane Doe
[YOUR ADDRESS]
[YOUR PHONE]
Member ID: ABC123456

Date: [Today's Date]

Blue Cross Blue Shield
[Claims Appeals Department Address]

RE: Internal Appeal — Claim Number BCBS-2025-99887 — Emergency Services Denial

Dear Blue Cross Blue Shield Appeals Team,

I am writing to formally appeal the complete denial of my emergency room claim from August 14, 2025 at General Hospital Emergency Dept. Your Explanation of Benefits shows $2,820 denied and assigned entirely to me as patient responsibility. This denial is incorrect for three reasons.

ISSUE 1 — Duplicate Charge — Remove $1,250 Immediately

Your EOB lists two identical charges for CPT code 99284 (Emergency Dept Visit Level 4) on the same date:
  • Line 1: $1,250 billed, denied with CARC 50
  • Line 3: $1,250 billed, denied with CARC 18 (exact duplicate)

Your own system flagged Line 3 as a duplicate. I should not be billed twice for the same service. I request written confirmation that the $1,250 duplicate is removed from my patient responsibility and that you notify the hospital billing department.

ISSUE 2 — Emergency Services Cannot Be Denied for "Medical Necessity"

Lines 1 and 2 (the ER visit and chest X-ray totaling $1,570) were denied with CARC 50 — "not medically necessary." This violates federal standards for emergency care.

I presented to the ER with chest pain. Chest pain is a symptom that a reasonable person would consider a medical emergency requiring immediate evaluation. Under the prudent-layperson standard, emergency services must be covered based on presenting symptoms, not the final diagnosis.

I request reprocessing of this claim as a covered emergency visit, with in-network cost-sharing applied per my plan.

Cite: ERISA appeal rights (29 CFR § 2560.503-1) and ACA internal appeal rights (45 CFR § 147.136) require a full and fair review of emergency-service denials.

ISSUE 3 — No Surprises Act — Emergency Services Must Be Billed In-Network

Your EOB shows $0 allowed and $0 paid on Lines 1 and 2. This is atypical for in-network emergency care and suggests possible out-of-network billing. I was told the provider was in-network.

If any provider who treated me on August 14 was out-of-network, the No Surprises Act requires that:
  • Emergency services be billed at in-network rates
  • My cost-sharing be calculated as if the service were in-network
  • I cannot be balance billed or denied coverage for out-of-network status

Cite: No Surprises Act, 45 CFR §§ 149.110, 149.120.

I request written confirmation of the network status of General Hospital Emergency Dept and all treating providers on August 14. If any were out-of-network, reprocess this claim under NSA protections.

REQUESTED ACTIONS

  1. Remove the $1,250 duplicate charge.
  2. Reprocess Lines 1 and 2 ($1,570) as covered emergency services and apply my in-network cost-sharing.
  3. Confirm in writing the network status of the hospital and all providers who treated me on August 14, 2025.
  4. Provide a corrected EOB.

I am enclosing a copy of the original EOB. Under federal law, you must respond to this internal appeal within 30 days for pre-service or 60 days for post-service claims.

If this appeal is denied, I will exercise my right to external review by an independent third party under 45 CFR § 147.136.

Sincerely,
Jane Doe`;

const CITATIONS = [
  { label: "No Surprises Act", source: "45 CFR §§ 149.110, 149.120 — emergency services must be billed at in-network rates", url: "https://www.cms.gov/nosurprises" },
  { label: "ERISA Internal Appeal Rights", source: "29 CFR § 2560.503-1 — 30/60 day response timeline for internal appeals", url: "https://www.dol.gov/agencies/ebsa/laws-and-regulations/laws/erisa" },
  { label: "ACA Internal Appeal + External Review", source: "45 CFR § 147.136 — 180 days to file internal appeal; right to external review", url: "https://www.healthcare.gov/appeal-insurance-company-decision/appeals/" },
];

function ConfidencePill({ confidence }: { confidence: "high" | "medium" | "low" }) {
  const cls =
    confidence === "high" ? "bg-bad/10 text-bad" :
    confidence === "medium" ? "bg-warn/10 text-warn" :
    "bg-muted/10 text-muted";
  return (
    <span className={`ml-2 inline-block text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide ${cls}`}>
      {confidence} confidence
    </span>
  );
}

export default function CaseStudyPage() {
  return (
    <main className="max-w-3xl mx-auto px-5 py-8 md:py-10">
      <header className="mb-8">
        <Link href="/" className="text-sm text-muted hover:text-accent">
          ← Back to Pushback
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-3">
          What Pushback actually does
        </h1>
        <p className="mt-2 text-base md:text-lg text-ink/80 leading-relaxed">
          A real walkthrough on a synthetic-but-realistic Explanation of
          Benefits. We&rsquo;ll show you the bill, what Pushback flagged,
          and the appeal letter it drafted — produced in under 60 seconds.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Step 1: The bill</h2>
        <p className="text-sm text-muted mb-3">
          A patient went to the ER for chest pain. The hospital was in-network on
          their BCBS plan. They later received this EOB.
        </p>
        <pre className="bg-ink/5 border border-muted/20 rounded-md p-4 text-xs md:text-sm whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
{BILL_TEXT}
        </pre>
        <p className="mt-3 text-sm text-ink/80">
          Reading this in 30 seconds, the patient sees: <strong>$2,820 owed</strong>,
          two denied line items, and a third line that looks the same as the first.
          What can&rsquo;t be seen at a glance is what each denial code means, what
          federal law says about emergency-service coverage, or whether the duplicate
          can be reversed. That&rsquo;s where the asymmetry sits — and that&rsquo;s
          what Pushback flattens.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Step 2: What Pushback found</h2>
        <p className="text-sm text-muted mb-4">
          Three high-confidence anomalies, each tied to specific dollars and a specific
          legal basis. The total potential recovery is the entire $2,820 bill.
        </p>
        <div className="space-y-4">
          {ANOMALIES.map((a, i) => (
            <div key={i} className="border border-muted/30 rounded-md p-4">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h3 className="font-semibold">
                  {a.kind}
                  <ConfidencePill confidence={a.confidence} />
                </h3>
                {a.potentialRecovery !== undefined && (
                  <span className="text-sm text-good font-medium">
                    potential recovery ~${a.potentialRecovery.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-ink/80 leading-relaxed">{a.explanation}</p>
            </div>
          ))}
        </div>

        <h3 className="text-base font-semibold mt-8 mb-3">Recommended actions</h3>
        <ol className="space-y-3">
          {ACTIONS.map((a, i) => (
            <li
              key={i}
              className="border-l-4 pl-4 py-1"
              style={{ borderColor: a.priority === "urgent" ? "var(--bad)" : "var(--accent)" }}
            >
              <div className="font-medium">
                {a.title}
                {a.deadline && (
                  <span className="ml-2 text-xs text-warn">by {a.deadline}</span>
                )}
              </div>
              <div className="text-sm text-ink/80 mt-1">{a.detail}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Step 3: The drafted appeal letter</h2>
        <p className="text-sm text-muted mb-3">
          Patient-specific, formatted for mail. Cites the actual federal rules.
          The patient reads it, edits anything wrong, signs, and sends certified
          mail with return receipt.
        </p>
        <pre className="bg-white border border-muted/20 rounded-md p-5 text-sm whitespace-pre-wrap font-sans leading-relaxed">
{LETTER_BODY}
        </pre>

        <h3 className="text-base font-semibold mt-6 mb-2">What this letter is grounded in</h3>
        <ul className="space-y-2 text-sm">
          {CITATIONS.map((c, i) => (
            <li key={i}>
              <strong>{c.label}</strong> — {c.source}{" "}
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline ml-1"
              >
                source
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10 border-t border-muted/20 pt-8">
        <h2 className="text-xl font-semibold mb-3">Want this for your bill?</h2>
        <p className="text-base text-ink/80 leading-relaxed">
          Take a photo or upload a PDF. Get the same kind of analysis and a
          drafted letter you can mail. The first one is free.
        </p>
        <div className="mt-5">
          <Link
            href="/"
            className="inline-block bg-accent text-paper px-5 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Try Pushback on your bill →
          </Link>
        </div>
        <div className="mt-6">
          <Disclaimer tone="subtle" />
        </div>
        <p className="mt-4 text-sm">
          <a href="/values" className="text-accent underline">
            See what we will and won&rsquo;t do →
          </a>
        </p>
      </section>
    </main>
  );
}
