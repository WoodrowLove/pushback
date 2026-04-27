# Pushback — Strategy

This document is the operating contract for how Pushback grows without
compromising why it exists. Read this before any major product, pricing, or
distribution decision.

Last updated: 2026-04-27.

---

## What Pushback is, in one sentence

A free-first tool that flattens the calibrated asymmetry between American
patients and the medical-billing system, by turning a medical bill or denial
into a plain-English explanation, a flagged-anomaly list, and a real appeal
letter — in under a minute.

---

## The asymmetry we exist to close

- 1 in 5 hospital bills contains an error.
- ~20% of in-network insurance claims are denied.
- ~95% of denials are never appealed.
- ~50% of appealed denials get overturned.

The gap between "could be appealed" and "is appealed" is not patient laziness.
It is **a designed extraction**: the system makes appealing more expensive in
time, expertise, and stress than paying. We close that gap.

---

## The two hats

We operate with two simultaneous and equally serious mandates. They reinforce
each other when held cleanly. They corrupt each other when blurred.

### Maker hat

The hat that asks: *would a person in financial distress feel respected, or manipulated?*

- Free for the first bill, no signup, ever.
- Documents process in memory and discard. No retention even if it would help us improve the model.
- Disclaimers are honest, not lawyerly fog.
- Refund on a paid appeal that fails. No exceptions.
- No dark patterns: no fake countdowns, no "X people viewed this," no manipulative copy.
- Spanish translation is in v1, not deferred to v3.
- Accessibility (screen reader, high contrast, low bandwidth) is in v1.
- We don't sell the data. Ever. After we're profitable. After we're acquired.
  After the offer is irresistible.

### Marketer hat

The hat that asks: *if the tool is genuinely good, distribution is the
bottleneck — and the right distribution doesn't betray the mission.*

- The case study page is the conversion engine **because it is true**. Truth
  converts faster than spin.
- "Process and discard" is not legalese. It is a competitive moat against
  every "AI healthcare" tool that hoards data. Say it loudly.
- "Free for the first bill" is the most powerful acquisition mechanic in
  software, and the right thing to do, simultaneously.
- Earned media (journalists, advocates, real users) is 10× paid media in this
  category. Earned media respects mission; paid media corrupts it. We choose.
- Pricing reflects value created, not value extracted: $19/bill, $49/year
  unlimited, $99/month for advocate-pros. A successful appeal recovers $1,000+
  on average; we capture a fraction.

---

## Phasing

Order matters. Going to a later phase before earlier phases are real is the
trap most mission-driven products fall into. Each phase produces the evidence
the next phase needs.

### Phase 1 — Build proof. Months 1–3.

**Goal:** prove the tool works on real bills, generate first real outcome
data, build a small audience of users and advocates.

**Tactics:**
- Distribution channels: Marshall Allen, Show HN, Reddit (r/HealthInsurance,
  r/personalfinance, r/povertyfinance), public X replies to billing journalists.
- Outcome-tracking opt-in: "I'd like to hear how this turned out" — 30-day
  follow-up email. Real outcome data is the only marketing that compounds.
- Long-tail SEO: 1 substantive blog post per week on the site (CARC code
  explainers, NSA primers, state-specific guides). Each is a Google-rankable
  URL that compounds for years.
- Spanish translation infrastructure (i18n config, first content English-only
  is fine).

**Targets:** by month 4 — 50–500 real appeals filed, 5–20 paying users, 1–2
journalist mentions, 200+ email subscribers.

### Phase 2 — Force-multiply through advocates. Months 3–9.

**Goal:** each patient-billing advocate is a 50–200× force multiplier on the
mission. Convert 50 advocates into power users.

**Tactics:**
- Identify advocates via ACAP, LinkedIn search, Reddit r/medicalbilling.
- Free pro accounts to first 5 advocates as a gift, not a pitch.
- Ones who use it become evangelists; offer a $50/referred-paying-user
  referral program.
- Build a Pro tier with case-history persistence (opt-in only) and team
  accounts.

**Targets:** by month 9 — 50 paying advocates × $99/mo = ~$60K/yr run rate;
5K–20K appeals filed via the tool.

### Phase 3 — Foundation grants. Months 6–18.

**Goal:** mission-aligned capital that funds features whose ROI is moral, not
financial (Spanish, accessibility, state law corpora).

**Tactics:**
- Apply to RWJF Pioneer Fund, Commonwealth Fund Health Care Delivery System
  Reform, California HealthCare Foundation.
- Use 6 months of outcome data as the credibility base. Need to start
  application drafting in month 4, even though grants land in month 9–12.

**Targets:** $50K–$500K in grant capital across phase.

### Phase 4 — Employer / Medicaid pilots. Months 12–24.

**Goal:** order-of-magnitude scale via institutional channels.

**Tactics:**
- One employer pilot first. Mid-size, values-aligned (B-Corp, hospital
  workers' union, public utility, mid-size co-op). Free 90-day trial → $2/
  employee/month.
- Use pilot data + grant credibility to approach state Medicaid programs.
- One state Medicaid contract = millions of users.

**Targets:** by month 24 — 1 employer at $50K–$120K/yr; 1 state Medicaid
conversation in motion; $1M+ run rate.

### Phase 5 — Impact capital. Year 2+.

**Goal:** accelerate execution without distorting the mission.

**Tactics:**
- $250K–$1M from revenue-share-aligned capital: Calm Company Fund, TinySeed,
  Schmidt Futures-adjacent.
- Never VC. The exit for this product is *to keep helping people forever*,
  not to be acquired.
- Specifically: we will refuse acquisition by any health-insurer-adjacent
  entity. Acquisition by an insurer betrays the mission. The data we have on
  insurer behavior is the leverage that protects patients; selling it to an
  insurer is selling out the patients.

---

## Anti-patterns we will reject

These are not in priority order; any one disqualifies a decision:

1. **Selling user data.** Even aggregated. Even de-identified. Even for "research."
2. **Acquisition by an insurer or health-system entity** that has any role in
   creating the asymmetry we exist to close.
3. **Dark patterns.** Fake countdowns, "Y people are viewing this," forced
   account creation, deceptive cancellation flows.
4. **Pricing that extracts** — anything that treats "what we can charge" as
   a separate question from "what we should charge." Our cap on per-bill
   price is roughly 1/50th of typical recovery; if we cross that, we have
   become part of the extraction system we exist to fight.
5. **Marketing claims we can't back up.** No "guaranteed approval." No
   "we'll save you $X." Specific outcome data only, sourced from real users.
6. **Fundraising paths that demand growth-at-all-costs.** Standard VC term
   sheets. We optimize for sustained mission, not exit valuation.
7. **Feature debt that compromises privacy.** Persisting documents, even
   "for the user's convenience," creates a target. If we ever do persist,
   it is opt-in, end-to-end-encrypted, and never used for training.

---

## Decision tests

When considering any major change, run it through both hats:

**Maker test:** *Does this make it more or less likely that a real patient in
their worst week gets the money they're owed back?*

**Marketer test:** *Does this lower the cost of getting Pushback to 10× more
people, in a way the maker test still passes?*

A decision must pass both. If only one passes, we don't ship it.

---

## What "winning" looks like at year 5

- Hundreds of thousands of real appeals filed via Pushback.
- A measurable share of patient-recovered dollars from US insurers.
- Open-source crate(s) used by other patient-advocacy tools.
- Independent journalist coverage as a default reference for billing literacy.
- $5M–$50M ARR, mostly from the advocate-pro and employer/Medicaid channels,
  not from squeezing direct consumer pricing.
- Spanish-first feature parity. Accessibility audit at WCAG AA.
- A culture where the maker hat and the marketer hat are still talking to
  each other instead of warring.

We do not win by becoming the next big SaaS exit. We win by being the thing
that exists, that works, that helps, that stays.

---

## Decision history

- 2026-04-25: founder + co-builder agreed PWA-first, pay-per-bill + annual,
  no monthly subscription. Recorded in BUILD_NOTES.md.
- 2026-04-27: founder + co-builder agreed phasing as documented above; the
  two-hats framing committed as the operating contract. This document.
