// Paywall card shown after the free first bill has been used.
//
// Two options: $19 single (24h unlock) and $49 annual (365d unlock).
// Both kick out to Stripe Checkout — we never see card data, ever.
//
// Tone: not adversarial. The user already got the free bill. This is
// the moment to be straight with them, not pressure them.

"use client";

import { useState } from "react";

type Plan = "single" | "annual";

export function Paywall() {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(plan: Plan) {
    setError(null);
    setLoading(plan);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const j = (await r.json()) as { ok: boolean; url?: string; error?: string };
      if (!j.ok || !j.url) throw new Error(j.error || "Checkout failed");
      window.location.href = j.url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(null);
    }
  }

  return (
    <div className="border border-muted/30 rounded-lg p-6 md:p-8 bg-paper">
      <h2 className="text-xl md:text-2xl font-semibold font-serif">
        Pay once. Decode this bill — and the next one too.
      </h2>
      <p className="mt-2 text-sm md:text-base text-ink/80 leading-relaxed">
        You&rsquo;ve used the free first bill. No account, no email gate
        coming next. Pick what fits.
      </p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => checkout("single")}
          disabled={loading !== null}
          className="text-left border border-muted/40 hover:border-accent transition-colors rounded-md p-5 disabled:opacity-50"
        >
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-semibold">$19</span>
            <span className="text-xs text-muted uppercase tracking-wide">
              one bill
            </span>
          </div>
          <div className="text-sm mt-2 text-ink/80 leading-relaxed">
            Decode this bill and revisit for 24 hours if you need to retry
            or refine the letter.
          </div>
          <div className="text-xs text-accent mt-4 font-medium">
            {loading === "single" ? "Opening Stripe…" : "Pay for this bill →"}
          </div>
        </button>

        <button
          type="button"
          onClick={() => checkout("annual")}
          disabled={loading !== null}
          className="text-left border-2 border-accent bg-accent/5 hover:bg-accent/10 transition-colors rounded-md p-5 disabled:opacity-50"
        >
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl font-semibold">$49</span>
            <span className="text-xs text-muted uppercase tracking-wide">
              one year
            </span>
          </div>
          <div className="text-sm mt-2 text-ink/80 leading-relaxed">
            Decode every bill, EOB, and denial that lands for the next 365
            days. Best for households with a chronic condition or kids.
          </div>
          <div className="text-xs text-accent mt-4 font-medium">
            {loading === "annual" ? "Opening Stripe…" : "Get a year of Pushback →"}
          </div>
        </button>
      </div>

      {error && (
        <div className="mt-4 border border-bad/40 bg-bad/5 text-bad rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <p className="mt-6 text-xs text-muted leading-relaxed">
        Refund on appeal failure if you mailed the letter and were denied —
        email hello@sunnyjaymes.com, no forms.{" "}
        <a href="/values" className="underline hover:text-accent">
          See what we will and won&rsquo;t do
        </a>
        .
      </p>
    </div>
  );
}
