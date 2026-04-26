# Pushback — Build Notes

Notes for whoever extends this codebase. **Read before you change anything in `/src/lib/` or the API routes.**

---

## Mental model

Two LLM calls, in sequence.

```
User document (PDF/image/text)
        │
        ▼
┌─────────────────────┐
│  /api/decode        │
│  extract.ts         │
│  └─ Claude vision   │
│  └─ CARC reference  │   →  DecodedBill {meta, lineItems, anomalies, summary, actions}
│  └─ Federal rules   │
│  └─ Zod schema      │
└─────────────────────┘
        │
        ▼ user reviews + selects anomalies to argue
        │
┌─────────────────────┐
│  /api/draft-letter  │
│  letter.ts          │
│  └─ Claude (text)   │   →  AppealLetter {body, callScript, deadlines, citations}
│  └─ Federal rules   │
│  └─ Zod schema      │
└─────────────────────┘
        │
        ▼
User mails the letter, makes the phone call.
```

Both LLM calls return strict JSON validated against `src/lib/schemas.ts`. If the LLM returns something that doesn't match, we retry once with an error nudge, then surface the failure. This is the core safety mechanism: we never hand the user prose we couldn't structurally validate.

## Data flow

| File | Responsibility |
|---|---|
| `src/lib/types.ts` | The single source of truth for every payload. |
| `src/lib/schemas.ts` | Zod runtime validation. Mirrors `types.ts`. Update both together. |
| `src/lib/anthropic.ts` | Single Anthropic client. Centralizes model name, timeouts, JSON extraction. |
| `src/lib/extract.ts` | The decode prompt + execution. Grounds against `data/carc-codes.json` and `data/federal-rules.json`. |
| `src/lib/letter.ts` | The appeal letter prompt + execution. Grounds against `data/federal-rules.json`. |
| `src/data/carc-codes.json` | Curated subset of CMS Claim Adjustment Reason Codes. |
| `src/data/federal-rules.json` | Federal patient-protection rules (NSA, ERISA appeals, ACA, HIPAA records). |
| `src/app/api/decode/route.ts` | POST handler. Validates request, calls `decodeDocument`, returns response. |
| `src/app/api/draft-letter/route.ts` | POST handler. Validates request, calls `draftAppealLetter`, returns response. |
| `src/app/page.tsx` | Single-page client UI. Manages decode → review → draft state machine. |
| `src/components/Uploader.tsx` | File upload + paste-text + optional context form. |
| `src/components/Results.tsx` | Renders decoded output. User picks anomalies to argue. |
| `src/components/LetterPreview.tsx` | Renders the appeal letter, deadlines, citations, phone script. |
| `src/components/Disclaimer.tsx` | Persistent legal disclaimer. Don't ship without it visible. |

## Grounding strategy (do not skip this)

The LLM is **not** allowed to invent:
- CARC code meanings — we ship the table inline; if a code isn't in our table the prompt instructs it to say "code not in reference table" rather than guess.
- Federal rule citations — only the IDs in `federal-rules.json` are valid citations; the model cites by ID and we show users a real link.
- State-specific laws — currently absent (see "Add state law" below).

Rule for adding any new factual claim: if the LLM might be wrong, ground it. Add the data file. Reference it in the prompt. Cite by ID. Never let the LLM "remember" a citation.

## Privacy & data handling

- Nothing is persisted. No DB, no logs of document content, no `tmp` files written.
- The Anthropic API call is the only network egress that touches user data.
- `PUSHBACK_DEBUG=1` enables stderr logging of full prompts/responses. **Never in production.** The variable name is intentionally explicit so it's hard to leave on accidentally.
- We do not currently sign Business Associate Agreements (BAA). If a covered entity wants to use this on behalf of patients, we'd need:
  - A formal BAA with Anthropic (their enterprise plans support this)
  - Audit logging that explicitly does not capture PHI
  - Documented data-flow diagrams
  - A privacy review

## Cost model

Per decoded bill (claude-sonnet-4-5):
- Decode: ~3K-6K input tokens + ~1K output tokens = ~$0.05-0.10
- Draft letter: ~2K input + ~1.5K output = ~$0.04-0.07
- **Total: ~$0.10-0.20 per full appeal flow**

At $19/appeal pricing, gross margin is ~99% on the LLM cost. The real costs come from hosting (Vercel free tier handles MVP traffic) and the eventual paid tools (state law database, Stripe fees, support time).

## Adding state surprise-billing law (next big quality win)

1. Create `src/data/state-laws/<XX>.json` with curated law summaries. Keep the structure parallel to `federal-rules.json`.
2. In `src/lib/extract.ts` and `src/lib/letter.ts`, when `req.context.state` is provided, load the corresponding state file and inject its contents alongside the federal rules.
3. Update the prompt: "Cite federal rules by ID; cite state rules by ID."
4. Start with TX, CA, NY, FL, IL, PA — covers ~50% of the US population.

Stretch: load state corpus selectively based on issue kind (e.g. only inject air-ambulance laws if a flagged anomaly is air-ambulance-related). Cuts token cost.

## Adding payment

The first bill is free; subsequent bills should be paid. v0.2 design:

1. Add Stripe Checkout for one-time $19 / appeal OR $39/mo unlimited.
2. After the first decode, prompt the user for email — gates the appeal-letter draft for free-tier users.
3. Track usage server-side via a tiny KV store (Vercel KV / Upstash). Email + count. **Don't** key on PHI.
4. Add a usage-counter middleware in `route.ts`.

## Improving accuracy on real bills

1. **Build a fixture suite.** Capture (with permission) 10-20 anonymized real bills covering: EOB, hospital bill, denial letter, prior-auth refusal, surprise billing, balance billing, preventive-care error, duplicate charge, upcoding. Run them through the decoder and hand-check the output. Add as integration tests once stable.
2. **Add an OCR fallback** for image-only PDFs that Claude vision doesn't parse cleanly. Either a Tesseract pipeline server-side or a cheaper model just for OCR.
3. **Add a "did this look right?" thumbs up/down** at the end of each session. Aggregate (no PHI) into a quality dashboard.
4. **Multi-page handling.** When PDFs exceed Claude's per-document token budget, split by page and stitch.

## Distribution channels (when ready to push)

- r/HealthInsurance, r/personalfinance — high-intent, hostile to spam, generous to genuine help. Lead with a real bill example, not a pitch.
- Patient-advocate TikTok / Instagram. Caitlyn Mai is the biggest in this space. DM with a free analysis of one of their submitted-bill posts.
- ProPublica + Kaiser Health News reporters who cover medical billing — they love stories about tools that actually work for patients.
- Show HN — wait until the tool is well-polished. Lead with a real before/after appeal-letter example.
- Direct to legal-aid clinics — they handle far more bill disputes than they have capacity for; this is a force multiplier.

## Hard rules for future commits

1. **Never make the LLM the only source of truth for a factual claim.** Always ground.
2. **Never persist a user's document content.** If you need analytics, hash, redact, or skip.
3. **Never weaken the disclaimer language without a lawyer review.** It's the single biggest legal risk surface.
4. **Always validate LLM output with Zod before returning.** Schema is the firewall.
5. **No paid features unlocked client-side.** Always check entitlements server-side.

## Punch list (what's next)

In priority order. Strategic context decided 2026-04-25 with the founder:
go PWA-first (mobile-installable from any browser), drop monthly subscription
in favor of pay-per-bill + low annual unlimited, defer benefits-package
ingestion until user accounts exist.

1. **Real-bill end-to-end test.** ✅ Validated 2026-04-25 against two synthetic-but-realistic EOBs (one clean, one anomalous). The anomalous one had 6 distinct errors (date-before-service, allowed > billed, negative charge, MRI denial without explanation, "Unknown Service" line, totals not reconciling) — all six caught at high confidence.
2. **PWA polish.** ✅ 2026-04-25: added \`manifest.json\`, theme color, apple-web-app meta, \`capture="environment"\` on the mobile camera input. Installable via "Add to Home Screen" on any phone browser.
3. **Deploy to Vercel** + custom domain (when picked). Set \`ANTHROPIC_API_KEY\` in Vercel env vars.
4. **Pricing page + Stripe Checkout** — pay-per-bill ($19) and annual ($49). NO monthly. Free first bill stays free with no signup.
5. **PDF export of the letter** — print directly without copy/paste. Big for older users. Can use \`@react-pdf/renderer\` or just CSS print styles.
6. **Mailing-address lookup** by insurer name. Known list of top 30 insurer appeal addresses ships as JSON; LLM cites by lookup, not memory. Critical because NSA appeals get sent to the wrong address all the time.
7. **State law corpora** for top 6 states (TX, CA, NY, FL, IL, PA).
8. **"Did this work?" follow-up** — opt-in email at 30 days asking whether the appeal succeeded. Real outcome data is the best marketing + quality signal we'll ever have.
9. **Spanish translation** of the UI and appeal letter output.
10. **User accounts + benefits-package ingestion (v0.2).** Plan: NextAuth.js + Vercel Postgres. User uploads their plan's Summary of Benefits and Coverage (SBC); we parse copays, network type, formulary, deductible. That context goes into every future analysis. Privacy review required before this ships.
11. **Native app wrap.** AFTER we have paying users. Capacitor or React Native + Expo, submit to both stores. PWA stays the canonical product.
12. **Email capture** for users who skip the paid tier. Tied to "did the appeal work?" follow-up.
13. **OCR fallback** for image-only PDFs Claude vision struggles with.
14. **Quality feedback widget** at end of each flow.

## Pricing model (decided)

- **Free** — 1 bill / year. No signup. Kept simple to remove all friction for first contact.
- **Pay per bill — $19** — Stripe Checkout, no account required. Friction-free for "I just got a weird bill, fix this one."
- **Annual unlimited — $49/year** — for chronic patients, pregnancies, families managing aging adults. Low enough that "is it worth it?" doesn't enter the calculation.
- **No monthly subscription.** Wrong shape for this use case — too much friction for occasional users, too low value for regulars.

## Mobile strategy (decided)

Ship a PWA before any native app. Reasons captured in priority list above.
The current codebase already produces an installable PWA with camera-first
upload on mobile. Native wrap (Capacitor) is queued for after first paying
users. Apple medical-app review is unpredictable; we don't want our launch
gated on it.

## Known limitations

- **Mailing addresses.** We extract from documents when present, but most denial letters bury the appeal address. We should ship a known-insurers lookup table (Aetna, BCBS variants, UHC, Cigna, Humana — covers ~70% of US plans).
- **Multi-document appeals.** Some appeals require attaching medical records, the original denial, and the bill. Currently we draft the letter only; the user is responsible for attachments. Future: a "what to include with this letter" checklist.
- **No Spanish.** Critical gap given the patient population most affected.
- **No accessibility audit.** Should pass WCAG AA before public push. Current TODO.

## Contact / coordination

- Owner: Sunny Jaymes / @WoodrowLove (GitHub) / @JaymesSunn27174 (X)
- Issues: GitHub issues on the repo.
- Critical privacy/security issues: don't open a public issue; contact directly.
