# Show HN — Pushback (paste-ready, fire Tuesday 8:30am ET)

**Why Tuesday 8:30am ET:** HN's daytime crowd is biggest 8–11am ET; Tuesday/Wednesday are highest-traffic days. Avoid Mondays (people catching up on email) and Fridays (sliding into weekend). Avoid evenings (front page churn slower).

**URL to submit:** https://news.ycombinator.com/submit

**Title (paste exact, 80 char limit, this is 75):**

```
Show HN: Pushback – paste a medical bill, get a plain-English decode and appeal letter
```

**URL field:**

```
https://pushback-two.vercel.app/case-study
```

**(Submit URL → case study, NOT home page. The case study is the asset; HN crowd needs to see proof before clicking around.)**

**First comment (post immediately after submitting, top-pin position — this is what people actually read):**

```
Author here. Built this because I watched too many people I know get bullied into paying medical bills they shouldn't have. The system is calibrated to make appealing harder than paying — opaque codes, short windows, byzantine procedures.

What it does:
- Upload a PDF or image of an EOB / bill / denial letter (or paste the text)
- Returns a structured breakdown: line items decoded, anomalies flagged with confidence levels, recommended actions tied to deadlines
- If it finds something appealable, drafts a real appeal letter citing specific federal rules (No Surprises Act, ACA appeal rights, ERISA), with a phone script for the member-services call

Architecture:
- Next.js + Anthropic API (Claude Sonnet 4.5) on Vercel
- Two-call pipeline: /api/decode → DecodedBill, /api/draft-letter → AppealLetter
- All LLM output Zod-validated; one retry on schema fail before surfacing failure
- Grounded against curated CARC code table + federal patient-protection rules — the prompt explicitly forbids the model from inventing codes or citations
- No persistence, no DB; documents processed in memory and discarded; Anthropic is the only third party that sees content

What it's NOT:
- Legal advice. The user reads the draft, edits it, signs, mails it. Full disclaimer in app.
- A replacement for a real patient advocate on complex cases.
- Currently citing state-specific surprise-billing law (federal only). State corpora are next.

Honest about cost:
- ~$0.10–0.15 per full appeal flow at current Sonnet pricing
- Free for the first bill; paid tier ($19/bill or $49/yr unlimited) coming when there's enough traffic to bother

Repo (MIT): https://github.com/WoodrowLove/pushback
Architecture + scaling notes: https://github.com/WoodrowLove/pushback/blob/main/BUILD_NOTES.md

Would love feedback on:
1. Cases the case-study walkthrough doesn't cover well
2. State surprise-billing laws I should prioritize ingesting first (TX, CA, NY, FL, IL, PA on the list)
3. Any architectural choice you'd push back on

Critique welcome. Especially the kind that points out where the LLM gets things wrong on real bills — that's the only data that matters at this stage.
```

## After submitting

1. **First 30 minutes is critical.** HN ranks new posts on early upvote velocity + comments. Your top-pinned author comment is what most readers read first; it has to be solid.
2. **Reply to every comment within 5–10 minutes for the first 2 hours.** Substantive replies. If someone asks "doesn't [other tool] do this," answer the diff honestly.
3. **Don't argue with critics.** Acknowledge the limitation. HN respects intellectual honesty far more than defensive posture.
4. **Do not submit your own URL twice.** HN bans dupes hard.
5. **Watch for the "show dead" issue.** New accounts sometimes get caught in the spam filter; if your post is dead, email hn@ycombinator.com politely asking for a check.

## Pre-submission checklist (run morning of)

- [ ] Production endpoints respond in <30s (run `curl https://pushback-two.vercel.app/api/decode -d '{"documentText":"test"}'` — if it 500s, delay)
- [ ] Anthropic spend cap is set (if HN front-pages this, traffic could spike to 5K-50K visitors. At $0.15/use that's $750-7500 if every visitor decodes a bill. Set the cap accordingly.)
- [ ] Vercel function execution limits are not at the Hobby plan ceiling
- [ ] Have your phone nearby — first 2 hours of comments matter most

## Risk

Worst case: the post flops, sinks to page 3, gets ~100 visitors. We learn what the title/positioning didn't catch and try a different angle in 4-6 weeks (HN won't penalize a re-submission with substantively different framing after a cooling-off).

Best case: front page, 100K+ visitors, 1K+ first-time users, real outcome data starts flowing back. We have 24 hours to handle the surge — Vercel scales automatically, but we should pre-cache the case study aggressively (it's already statically prerendered) and watch for any rate-limit issues with Anthropic.

There is no medium-bad case. HN posts either catch or don't; very little messy middle.
