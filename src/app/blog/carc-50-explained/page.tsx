// /blog/carc-50-explained
//
// First long-tail SEO post. Target keyword: "carc 50" (~2,400/mo per
// Google, low competition because almost everyone ranking for it is
// either insurance jargon or behind a paywall).
//
// Structure follows the pattern that compounds for years:
//   - Definition in plain English up top (answers the query in 30 sec)
//   - Why insurers use it (context the EOB itself doesn't give you)
//   - When it's wrong (real appeal angles)
//   - What to do (concrete next steps)
//   - Sources
//   - Soft CTA — Pushback link is at the end, not the top
//
// Soft CTA is the rule for every SEO post: lead with value, end with
// "if you'd rather not write the letter yourself, here's the tool."
// Posts that lead with the tool read as marketing. Posts that lead
// with the answer read as expertise — and Google ranks them better.

import Link from "next/link";

export const metadata = {
  title: "CARC 50 on your EOB — what it means and how to fight it",
  description:
    "CARC 50 means the insurer denied your claim as 'not medically necessary.' For emergency care, this is often illegal under the prudent-layperson standard. Here's what to do.",
  alternates: { canonical: "/blog/carc-50-explained" },
};

export default function Carc50Page() {
  return (
    <main className="max-w-2xl mx-auto px-5 py-8 md:py-10">
      <header className="mb-8">
        <Link href="/" className="text-sm text-muted hover:text-accent">
          ← Pushback
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-3 leading-tight">
          CARC 50 on your EOB — what it means and how to fight it
        </h1>
        <p className="mt-3 text-sm text-muted">
          Plain-English explainer. About a 4-minute read.
        </p>
      </header>

      <article className="prose-pushback space-y-6 text-base leading-relaxed text-ink/90">
        <section>
          <h2 className="text-xl font-semibold mb-2">The short version</h2>
          <p>
            <strong>CARC 50</strong> stands for{" "}
            <em>&ldquo;non-covered services because this is not deemed a medical
            necessity by the payer.&rdquo;</em>{" "}
            Translation: the insurance company looked at your claim and
            decided the care you got wasn&rsquo;t necessary, so they&rsquo;re
            not paying for it. The full bill becomes your responsibility.
          </p>
          <p>
            CARC stands for &ldquo;Claim Adjustment Reason Code.&rdquo; It&rsquo;s
            part of a national list maintained by the X12 standards committee
            and used by every US insurer. Code 50 is one of the most common
            denial reasons — and one of the most appealable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Why insurers use CARC 50 so much</h2>
          <p>
            &ldquo;Medical necessity&rdquo; is intentionally vague. It gives
            the insurer wide latitude to deny things that almost anyone with a
            medical background would call necessary. Insurers use it on:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Emergency room visits where the final diagnosis turned out to be non-serious.</li>
            <li>Imaging (MRIs, CTs) when the insurer wanted you to try a cheaper test first.</li>
            <li>Surgeries that weren&rsquo;t pre-authorized, even when authorization wasn&rsquo;t obviously required.</li>
            <li>Specialist visits when the insurer&rsquo;s policy says you should have seen primary care first.</li>
            <li>Out-of-network services the insurer thinks you should have gotten in-network.</li>
          </ul>
          <p>
            None of these are slam-dunk denials. All of them are appealable.
            Most are won on appeal when patients actually file one — but per
            the federal data, fewer than 1 in 20 ever do.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">When CARC 50 is almost certainly wrong</h2>

          <h3 className="font-semibold mt-4">Emergency-room visits — the prudent-layperson standard</h3>
          <p>
            If you went to the ER for symptoms that a reasonable person would
            think were a medical emergency — chest pain, severe headache,
            difficulty breathing, abdominal pain you couldn&rsquo;t identify —
            and the insurer denied it under CARC 50, that denial likely
            violates federal law.
          </p>
          <p>
            The Affordable Care Act requires plans to use the{" "}
            <strong>prudent-layperson standard</strong>: emergency services
            must be covered based on your symptoms when you walked in, not on
            what the diagnosis turned out to be. Translation: you went in for
            chest pain, it turned out to be heartburn, your insurer cannot
            retroactively decide the visit wasn&rsquo;t an emergency.
          </p>
          <p>
            This is codified at <strong>45 CFR § 147.138(b)</strong>. If the
            denial is on an ER visit, cite this rule directly in your appeal.
          </p>

          <h3 className="font-semibold mt-4">Pre-authorized care that gets denied later</h3>
          <p>
            If your provider got prior authorization for a procedure and the
            insurer is now denying it under CARC 50, that&rsquo;s almost
            always reversible. Pull the pre-auth approval from your
            provider&rsquo;s office and reference the authorization number in
            your appeal. Insurers cannot generally retract authorizations
            after the service is performed.
          </p>

          <h3 className="font-semibold mt-4">No medical reviewer involved</h3>
          <p>
            Federal rules require that medical-necessity denials be reviewed
            by a clinician with relevant expertise — not by a billing clerk
            running an algorithm. Under <strong>29 CFR § 2560.503-1(h)</strong>{" "}
            (ERISA appeal rights), you have the right to demand to know who
            specifically denied your claim and what their qualifications are.
            Many initial denials are issued without any clinician review at
            all. Asking the question often reverses the denial.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">What to do, in order</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Get the claim file.</strong> Call the number on the back
              of your insurance card and request the &ldquo;adverse benefit
              determination notice&rdquo; in writing. Federal law requires
              they send it. This document tells you the exact reasoning, the
              clinician who reviewed it (if any), and your appeal deadline.
            </li>
            <li>
              <strong>Note the deadline.</strong> Under ACA rules (45 CFR §
              147.136), you have <strong>180 days</strong> from the date on
              the EOB to file an internal appeal for most plans. Mark this
              date. Missing it is the most common way denials become
              permanent.
            </li>
            <li>
              <strong>Write the internal appeal.</strong> Address it to the
              appeals department (the address is on the EOB or the back of
              your card). Cite the specific rule that applies — prudent
              layperson if it&rsquo;s ER, the pre-auth approval if it&rsquo;s
              authorized care, or the right to clinician review if neither
              applies. Send it certified mail with return receipt.
            </li>
            <li>
              <strong>If the internal appeal fails, request external review.</strong>{" "}
              Under 45 CFR § 147.136, you have the right to have an
              independent third party review the denial. The insurer pays for
              this review, and the third party&rsquo;s decision is binding on
              the insurer. About half of external reviews overturn the
              original denial. Request it within 4 months of the internal
              appeal denial.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">A short list of phrases that work in the appeal letter</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              &ldquo;The denial of this claim under CARC 50 violates the
              prudent-layperson standard codified at 45 CFR §
              147.138(b).&rdquo;
            </li>
            <li>
              &ldquo;I request the name and credentials of the clinician who
              reviewed this claim, as required by 29 CFR § 2560.503-1(h).&rdquo;
            </li>
            <li>
              &ldquo;If this internal appeal is denied, I will request external
              review under 45 CFR § 147.136.&rdquo;
            </li>
            <li>
              &ldquo;Per ERISA, your decision must be in writing, with a full
              explanation of the specific reasons for denial and the rule,
              guideline, or protocol relied upon.&rdquo;
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Sources</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                className="text-accent underline"
                href="https://www.cms.gov/medicare/coding-billing/electronic-billing/claim-adjustment-reason-codes"
                target="_blank"
                rel="noopener noreferrer"
              >
                CMS — Claim Adjustment Reason Codes (the official CARC list)
              </a>
            </li>
            <li>
              <a
                className="text-accent underline"
                href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-B/part-147/section-147.138"
                target="_blank"
                rel="noopener noreferrer"
              >
                45 CFR § 147.138 — emergency-services / prudent-layperson rule
              </a>
            </li>
            <li>
              <a
                className="text-accent underline"
                href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-B/part-147/section-147.136"
                target="_blank"
                rel="noopener noreferrer"
              >
                45 CFR § 147.136 — internal appeals + external review rights
              </a>
            </li>
            <li>
              <a
                className="text-accent underline"
                href="https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XXV/subchapter-L/part-2560/section-2560.503-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                29 CFR § 2560.503-1 — ERISA appeal rights
              </a>
            </li>
          </ul>
        </section>

        <section className="mt-10 border-t border-muted/20 pt-6">
          <h2 className="text-lg font-semibold mb-2">If you&rsquo;d rather not write the letter yourself</h2>
          <p className="text-base">
            <Link href="/" className="text-accent underline">
              Pushback
            </Link>{" "}
            takes a photo of your EOB, decodes it in plain English, flags the
            specific rules being violated, and drafts the appeal letter with
            the citations above already filled in. First bill is free, no
            account, processes in memory and never stores your documents.
          </p>
        </section>

        <section className="mt-10 text-xs text-muted leading-relaxed border-t border-muted/20 pt-6">
          <p>
            This article is general information, not legal or medical advice.
            For complex denials — high dollar amounts, collections, credit
            damage, multi-claim disputes — find a patient-billing advocate or
            legal aid clinic in your state.
          </p>
        </section>
      </article>
    </main>
  );
}
