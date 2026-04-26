# Pushback

> Decode medical bills and insurance denials in plain English. Get an appeal letter drafted for you. Free for the first one.

Pushback is a tool that levels the asymmetry between American patients and the medical-billing machine. You upload a bill, an Explanation of Benefits, or a denial letter. We:

1. Parse it into structured line items.
2. Flag anomalies — duplicate charges, denials without real reasons, balance billing that violates the No Surprises Act, preventive care charged when it shouldn't be, missing prior auth that should have been on file, possible upcoding.
3. Draft an appeal letter you can sign and mail, citing the specific federal rules that apply to your situation.
4. Give you a phone script for when you call member services.

Built because most people pay things they shouldn't, because fighting takes hours and the system is calibrated to make it expensive.

## Status

**MVP. Single page. No accounts. No persistence.**

Tested locally; not yet deployed publicly. See [`BUILD_NOTES.md`](./BUILD_NOTES.md) for architecture, scaling guidance, and a punch list of what to build next.

## Quick start

```bash
git clone https://github.com/<you>/pushback.git
cd pushback
cp .env.example .env.local
# add your ANTHROPIC_API_KEY
npm install
npm run dev
# open http://localhost:3000
```

## What the MVP does

- Accepts a PDF or image of a bill / EOB / denial letter, OR pasted text.
- Returns a structured breakdown plus a list of anomalies, ranked by confidence.
- Lets the user pick which anomalies to argue.
- Drafts a print-ready appeal letter with citations and deadlines.
- Generates a short phone script for the member-services call.

## What it deliberately does NOT do (yet)

- Persistence. No accounts, no saved cases. We process and discard.
- Payment. The first bill is free; paid tier is a v0.2 task. See `BUILD_NOTES.md` for the plan.
- Email or fax submission. The user mails the letter themselves. Adding direct submission requires per-insurer integrations.
- State-specific surprise-billing law citations. We cite federal (No Surprises Act, ACA, ERISA, HIPAA) but not state law yet — adding state corpora is the next big quality win.
- Legal advice. We help you draft your letter; we are not your lawyer.

## Stack

- Next.js 15 (App Router) + TypeScript
- Anthropic SDK (Claude Sonnet for both decode and letter)
- Tailwind CSS for styling
- Zod for runtime validation
- Vercel-ready (free tier)

## Privacy posture

- Documents are processed in-memory on the server during a single request and discarded immediately. There is no database.
- The Anthropic API receives the document content for inference. No third party other than Anthropic sees it.
- Logs do not contain document content unless `PUSHBACK_DEBUG=1` is set, which should never be true in production.
- We are not currently a HIPAA business associate. If a covered entity wants to integrate, we'd need a BAA and a hardened pipeline. See `BUILD_NOTES.md`.

## Why this exists

1 in 5 hospital bills contains a billing error. About 20% of in-network insurance claims are denied. ~95% of those denials are never appealed, despite roughly half of appealed denials getting overturned. Most people don't fight because the system is *deliberately* expensive to fight — opaque codes, short windows, byzantine procedures. LLMs are good at exactly this kind of bullshit, so we're using them to flatten the asymmetry.

## License

MIT. See `LICENSE`.

## Contributing

Issues and PRs welcome. Especially:
- Real bills (scrubbed of PII) we can use as integration test fixtures.
- State surprise-billing law summaries.
- Polished phrasing on disclaimer language reviewed by a healthcare attorney.

## Disclaimer

Pushback is not legal or medical advice. We help you draft your own appeal in your own voice. Read what we produce. Edit it. Verify dates and addresses against your own documents.
