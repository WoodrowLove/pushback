// Public /values page. The single page that says explicitly what Pushback
// will and won't do. This is mission AND moat: every "AI healthcare" tool
// that hoards data, sells leads, or runs dark patterns competes against this
// page on terms we set.
//
// IMPORTANT: never water this language down without re-running both hats.
// Anything we say here, we have to mean. If a future feature would require
// editing this page to be more permissive, the answer is don't ship that
// feature.

import Link from "next/link";

export const metadata = {
  title: "What Pushback will and won't do — values",
  description:
    "Explicit commitments: how Pushback handles your documents, what we won't sell, why we don't run dark patterns, and what happens if your appeal fails.",
};

export default function ValuesPage() {
  return (
    <main className="max-w-2xl mx-auto px-5 py-8 md:py-10">
      <header className="mb-8">
        <Link href="/" className="text-sm text-muted hover:text-accent">
          ← Back to Pushback
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mt-3">
          What we will and won&rsquo;t do
        </h1>
        <p className="mt-2 text-base md:text-lg text-ink/80 leading-relaxed">
          Pushback exists to flatten the asymmetry between patients and the
          medical-billing system. That mission is brittle if we lie about it.
          So here&rsquo;s exactly where we&rsquo;ve drawn the lines.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">How we handle your documents</h2>
        <ul className="space-y-3 text-base leading-relaxed">
          <li>
            <strong className="text-good">We process in memory and discard.</strong>{" "}
            When you upload a bill, EOB, or denial letter, the file lives only
            in the memory of a single server request. When the response goes
            back to your browser, the document is gone. We do not write it to
            disk. We do not store it in a database.
          </li>
          <li>
            <strong className="text-good">We don&rsquo;t require an account for the first bill.</strong>{" "}
            No email gate. No phone number. No name. The most stressed,
            most-in-distress user can get help without giving us anything
            first.
          </li>
          <li>
            <strong className="text-good">We will never sell user data.</strong> Not
            aggregated. Not de-identified. Not for &ldquo;research.&rdquo; Not
            after we&rsquo;re profitable. Not after an offer that&rsquo;s
            irresistible.
          </li>
          <li>
            <strong className="text-good">Anthropic processes your text for the analysis.</strong>{" "}
            That&rsquo;s the one third party that sees your content, and only
            during the request itself. We don&rsquo;t share with anyone else.
          </li>
          <li>
            <strong className="text-good">If we ever add saved-cases, it is opt-in only.</strong>{" "}
            With end-to-end encryption. Never used to train models. Never
            disclosed to insurers, lawyers, employers, or anyone else.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">What we won&rsquo;t do as a business</h2>
        <ul className="space-y-3 text-base leading-relaxed">
          <li>
            <strong className="text-good">No dark patterns.</strong> No fake
            countdowns. No &ldquo;57 people are viewing this right now.&rdquo;
            No deceptive cancellation flows. No sign-up walls in front of help.
          </li>
          <li>
            <strong className="text-good">No outcome guarantees we can&rsquo;t back up.</strong>{" "}
            We won&rsquo;t claim &ldquo;guaranteed approval&rdquo; or &ldquo;save
            $X average.&rdquo; The only outcome numbers we&rsquo;ll publish are
            ones sourced from real users with their permission.
          </li>
          <li>
            <strong className="text-good">We won&rsquo;t accept acquisition by an insurer.</strong>{" "}
            Or any company whose business model depends on the asymmetry we
            exist to close. The most obvious acquirers are the worst ones; we
            will refuse them.
          </li>
          <li>
            <strong className="text-good">We won&rsquo;t take VC money</strong>{" "}
            on terms that demand growth-at-all-costs. We&rsquo;ll take
            mission-aligned capital (revenue-share, foundation grants, impact
            funds) when it accelerates the work without distorting it.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pricing and refunds</h2>
        <ul className="space-y-3 text-base leading-relaxed">
          <li>
            <strong className="text-good">First bill is free.</strong> No
            account, no email, no card. We won&rsquo;t change this.
          </li>
          <li>
            <strong className="text-good">Paid tier exists to keep this running.</strong>{" "}
            $19 per bill or $49/year unlimited (when we turn it on). The cap
            we&rsquo;ve set on what we charge is roughly 1/50th of what a
            successful appeal typically recovers. If we ever raise it past
            that ratio, we&rsquo;ve become part of the extraction system
            we exist to fight.
          </li>
          <li>
            <strong className="text-good">Refund on appeal failure.</strong>{" "}
            If you pay for an appeal letter and the appeal is denied (and
            you actually mailed the letter), you get a full refund. No
            forms. No phone tree. Email us, we refund.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">What we are honest about</h2>
        <ul className="space-y-3 text-base leading-relaxed">
          <li>
            <strong>Pushback is not legal advice.</strong> The letter we draft
            is your letter. You read it, edit it, sign it, mail it. You&rsquo;re
            the one filing the appeal.
          </li>
          <li>
            <strong>The LLM is occasionally wrong.</strong> Always verify
            against your own documents before mailing. We validate output
            against curated reference tables (CARC codes, federal rules), and
            the model is explicitly told never to invent citations — but it
            is software, not infallible.
          </li>
          <li>
            <strong>State surprise-billing law isn&rsquo;t in here yet.</strong>{" "}
            Federal rules (No Surprises Act, ACA appeal rights, ERISA, HIPAA)
            are in. State-specific laws are next.
          </li>
          <li>
            <strong>For complex cases, get a real human advocate.</strong>{" "}
            Pushback is the first move. For high-dollar denials, multi-claim
            disputes, or anything involving collections / credit damage, find
            a patient-billing advocate or legal aid clinic.
          </li>
        </ul>
      </section>

      <section className="mb-10 border-t border-muted/20 pt-6">
        <h2 className="text-xl font-semibold mb-3">If we ever cross any line above</h2>
        <p className="text-base leading-relaxed">
          Tell us. Loudly. Publicly. Email{" "}
          <a className="text-accent underline" href="mailto:hello@sunnyjaymes.com">
            hello@sunnyjaymes.com
          </a>{" "}
          or post in{" "}
          <a
            className="text-accent underline"
            href="https://github.com/WoodrowLove/pushback/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            our public issue tracker
          </a>
          . If we drift, accountability is how we get pulled back. The repo
          is MIT-licensed and public. The decisions, the language, and the
          architecture are all auditable.
        </p>
      </section>

      <p className="text-sm text-muted mt-10">
        This page is part of the operating contract. To see the full strategy
        document we operate under,{" "}
        <a
          className="text-accent underline"
          href="https://github.com/WoodrowLove/pushback/blob/main/STRATEGY.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          read STRATEGY.md
        </a>
        .
      </p>
    </main>
  );
}
