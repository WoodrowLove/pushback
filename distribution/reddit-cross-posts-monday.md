# Reddit cross-posts — Monday morning push

**Goal:** broaden beyond r/HealthInsurance (~30K) into r/personalfinance (~18M) and r/povertyfinance (~4M). Same case study URL, different framing for each audience.

**Best post time:** Monday 8:30–10am ET. Working professionals scrolling before standup, mods awake, lower spam-filter heat than weekends.

**Order:** post r/personalfinance first (better signal-to-noise for billing topics), then r/povertyfinance ~2 hours later. Don't post both in the same minute — Reddit's anti-spam systems flag identical-content cross-posts too close together.

---

## r/personalfinance

**URL:** https://www.reddit.com/r/personalfinance/submit

**Title:**

```
I built a free tool that decodes medical bills and drafts insurance appeal letters — sharing in case it helps anyone here
```

**Body:**

```
Long-time lurker, first time posting in this sub. Sharing because I know from this community's threads that medical bills are one of the top stress sources for working families.

Quick context: 1 in 5 hospital bills contains a billing error. About 20% of in-network insurance claims are denied. ~95% of those denials are never appealed, even though about half of appealed denials get overturned. The reason isn't laziness — the system is calibrated to make appealing harder than paying.

What I built:

A free tool where you upload a photo or PDF of a medical bill, EOB, or insurance denial. It:

- Decodes every line item in plain English
- Flags anomalies: duplicate charges, denials without real reasons, balance billing that violates the No Surprises Act, preventive care that shouldn't have a copay, missing prior auth that the provider should have on file, possible upcoding
- If something is worth appealing, drafts an actual appeal letter you can sign and mail — cites specific federal rules (No Surprises Act, ACA appeal rights, ERISA)
- Includes a phone script for when you call member services
- Free for the first bill, no signup. Processes in memory; nothing stored.

There's a real walkthrough on a $2,820 ER bill at the case study page below — paste this in your browser and you'll know in 60 seconds whether it's the kind of thing that would help you.

https://pushback-two.vercel.app/case-study

I'd appreciate brutal honesty if anyone uses it on a real bill — what's missing, what it gets wrong, what's confusing. This is v0.1 and the only way it gets better is real-bill feedback.

Mods, if this crosses any line let me know and I'll edit or remove. Trying to be useful here, not promotional.
```

---

## r/povertyfinance

**Wait 2 hours after r/personalfinance, post separately.**

**URL:** https://www.reddit.com/r/povertyfinance/submit

**Title:**

```
Free tool: decodes medical bills and writes the insurance appeal letter for you (first one's free, no signup)
```

**Body:**

```
This sub has saved a lot of people from financial spirals over weird medical bills, so wanted to share something I built that might help.

Free tool: paste or photograph a medical bill, EOB, or denial letter. It explains it in plain English, flags errors, and writes an appeal letter you can sign and mail. Cites actual federal law (No Surprises Act, ACA, ERISA appeal rights). Includes a phone script for the call to member services.

No signup. No email required. Free for the first bill. Doesn't store anything — processes in memory and discards.

https://pushback-two.vercel.app

Real example walkthrough (a $2,820 ER bill that should have been $0): https://pushback-two.vercel.app/case-study

Why I'm posting here specifically: when you don't have a few hundred dollars sitting around, "just appeal it" feels like advice from another planet. The 8 hours of phone calls + writing the letter feel impossible. This tool collapses those 8 hours into about 2 minutes for the analysis + maybe 10 minutes to verify what it produced before you sign and mail.

Big disclaimers:
- Not legal advice. You read what it says, edit anything wrong, sign it, mail it. You're filing the appeal, not the tool.
- It's better at federal law than state law right now. State surprise-billing laws are next.
- The LLM is occasionally wrong. Always verify against your own documents before sending.

If anyone uses it on a real bill, please tell me what's broken. That's the only data that matters at this stage.
```

---

## Cross-post etiquette

- **Don't link your r/HealthInsurance comments in either post** — looks like astroturfing
- **Don't reply to your own posts to bump them** — Reddit detects this fast
- **First 30 minutes after posting** = highest-priority response window. Monitor closely.
- **If a mod removes the post**, DM them politely asking which rule. Reddit mods of these subs are generally reasonable about genuinely-useful tools.
- **Watch for "this looks like an AI-generated tool" skepticism.** Acknowledge upfront: "Yes, it uses an LLM. It also validates every output against a curated CARC code table and a list of federal rules so it can't invent citations. The repo is public if you want to verify." That preempts the most common attack.

## Risk per sub

| Sub | Risk | Upside |
|---|---|---|
| r/personalfinance | Could get removed under "no promotion" — they're strict but reasonable | 18M members, billing posts hit the front page often |
| r/povertyfinance | Lower removal risk, friendlier to genuine help | 4M members, exactly the demographic that benefits most |

**Bottom line:** post both. Even if one gets removed, the other usually stays up. The combined audience (22M members) is 700x larger than r/HealthInsurance.
