# Night handoff — 2026-04-29 → 2026-04-30 morning

## What's true when you wake up

1. **Stripe is live in production.** `pk_live_...` and `sk_live_...` are
   set as Sensitive env vars on the `pushback` Vercel project. The
   redeploy of commit `f474393` picked them up. `POST /api/checkout`
   verified live: returns a real `cs_live_...` Stripe Checkout URL.
   Anyone who hits the paywall can pay you real money right now.

2. **The paywall is wired end-to-end.** First decode is free; second
   decode triggers the Paywall component with $19 single (24h) and $49
   annual (365d) options. localStorage soft-gate, honor system after
   first free use — matches /values posture.

3. **r/HealthInsurance link-posting is dead.** All 5 comments from
   2026-04-26 are auto-removed under their Rule 5 (no referral /
   affiliate links). The mod mail confirmed it. Score 1 was the giveaway
   — score-1-with-no-engagement at 30 hours = invisible to readers.

   Tombstone: `distribution/REDDIT-LINKS-DEAD.md`.

4. **First long-tail SEO post is shipped.** `/blog/carc-50-explained`
   — targets the keyword "carc 50" (~2,400/mo searches per Google).
   Plain-English explainer with federal-rule citations, soft CTA at the
   end. Will index in Google over the next 1–4 weeks.

5. **Marshall Allen Substack outreach killed** before send (he died
   May 2024). Tombstone in `distribution/MARSHALL-ALLEN-DECEASED.md`.

## What's queued, not yet done

- **Reddit AM batch (link-free).** Tomorrow morning when you're up,
  ask "load reddit AM batch" and I'll stage 3 expert-helpful comments
  with no Pushback URL. Profile bio is the discovery surface; quality
  pulls people there.

- **Facebook group scout list.** I'll have 8–12 medical-billing groups
  with member counts and mod-stance notes ready by mid-morning.

- **Wendell Potter Substack outreach** drafted by Wednesday once I've
  read his last 5 posts and can open with something specific.

- **Show HN window** — Tuesday (today, 2026-04-30) 8:30am ET. Title
  + first comment already staged in `distribution/show-hn-tuesday.md`.
  Ask "load Show HN" at 8:25am ET and I'll push to your clipboard.

## The 60-day deal — score so far

- Day 1 of 60.
- Paying users: 0 (expected — no traffic yet, just shipped paywall).
- Channels live: Reddit (now link-free posture), SEO (first post),
  Stripe + paywall.
- Channels staged: Show HN (today), Wendell Potter (Wed), X public
  reply to Sarah Kliff or Julie Appleby (whenever a fitting tweet
  appears).

## What to do first when you wake up

1. Verify the SEO post renders cleanly: open
   https://pushback-two.vercel.app/blog/carc-50-explained — should
   show the article. If yes, great. If no, tell me and I'll fix.
2. Tell me "load Show HN" if it's near 8:25am ET. Otherwise tell me
   "load reddit AM batch" and we start there.
3. If anyone replied to your one of your Reddit posts overnight (the
   visible-to-author cached versions might still attract a stray
   reply), tell me — I'll stage a follow-up that doesn't include the
   URL.

## Cost-of-running so far

- Vercel: free tier, well under quota.
- Anthropic API: ~$0.10 per decode flow at Sonnet pricing. Trivial at
  current traffic.
- Stripe: 2.9% + $0.30 per charge. On a $19 charge that's $0.85,
  netting you ~$18.15. On $49 annual: $1.72, netting ~$47.28.

## What's NOT happening (per the deal)

- No new projects. Not Namora, not civilOS, not Witness, not ADE.
- No new Pushback features unless directly required by a paying user
  or by a kill-criteria-driven pivot at day 60.
- No premature optimization (analytics, A/B testing infra, account
  system) until we have at least 1 paying user from organic.

Sleep. Tomorrow we go.
