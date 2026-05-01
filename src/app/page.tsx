"use client";

import { useEffect, useState } from "react";
import { Uploader } from "@/components/Uploader";
import { Results } from "@/components/Results";
import { LetterPreview } from "@/components/LetterPreview";
import { Disclaimer } from "@/components/Disclaimer";
import { Paywall } from "@/components/Paywall";
import { markFreeUsed, shouldShowPaywall } from "@/lib/unlock";
import type {
  DecodeRequest,
  DecodeResponse,
  DecodedBill,
  DraftLetterResponse,
  AppealLetter,
} from "@/lib/types";

export default function HomePage() {
  const [decoded, setDecoded] = useState<DecodedBill | null>(null);
  const [letter, setLetter] = useState<AppealLetter | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [decoding, setDecoding] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paywall state. Hydration-safe: starts null on SSR, set after mount.
  // While null we render neither uploader nor paywall (a tiny flash is
  // better than mismatched markup).
  const [paywalled, setPaywalled] = useState<boolean | null>(null);
  useEffect(() => {
    setPaywalled(shouldShowPaywall());
  }, []);

  async function handleDecode(req: DecodeRequest) {
    setError(null);
    setLetter(null);
    setDecoded(null);
    setDecoding(true);
    try {
      const r = await fetch("/api/decode", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(req),
      });
      const j = (await r.json()) as DecodeResponse;
      if (!j.ok) throw new Error(j.error || "Unknown error");
      setDecoded(j.data);
      // Mark free used after a successful decode. Future decode attempts
      // hit the paywall unless the user has unlocked.
      markFreeUsed();
      // Pre-select high-confidence anomalies
      const auto = new Set<number>();
      j.data.anomalies.forEach((a, i) => {
        if (a.confidence === "high") auto.add(i);
      });
      setSelected(auto);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDecoding(false);
    }
  }

  async function handleDraftLetter() {
    if (!decoded) return;
    setError(null);
    setLetter(null);
    setDrafting(true);
    try {
      const r = await fetch("/api/draft-letter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          decoded,
          anomalyIndices: Array.from(selected),
        }),
      });
      const j = (await r.json()) as DraftLetterResponse;
      if (!j.ok) throw new Error(j.error || "Unknown error");
      setLetter(j.letter);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDrafting(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-8 md:py-10">
      <header className="mb-8 md:mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold">
          Pushback
        </h1>
        <p className="mt-2 text-base md:text-lg text-ink/80 leading-relaxed">
          Got a medical bill or insurance denial that doesn&rsquo;t look right?
          Take a photo or upload it. We&rsquo;ll explain it in plain English,
          flag what&rsquo;s wrong, and write the appeal letter for you. The
          first one&rsquo;s free.
        </p>
        <p className="mt-3 text-sm">
          <a href="/case-study" className="text-accent underline">
            See a real walkthrough on a $2,820 ER bill →
          </a>
        </p>
        <div className="mt-4">
          <Disclaimer tone="prominent" />
        </div>
      </header>

      <section className="mb-10">
        {/*
          Render Uploader by default so SSR (and the brief pre-hydration
          window) shows a working interface to first-time visitors —
          who are 99% of inbound traffic. Paywall only swaps in once
          hydration confirms the user has already used the free decode
          (paywalled === true). Trade-off: a returning paywalled user
          sees a 100ms flash of Uploader before Paywall takes over,
          which is far better than every first-time visitor seeing a
          blank section while JS hydrates.
        */}
        {paywalled === true && !decoded && !letter ? (
          <Paywall />
        ) : (
          <Uploader onDecode={handleDecode} isLoading={decoding} />
        )}
      </section>

      {error && (
        <div className="border border-bad/40 bg-bad/5 text-bad rounded-md px-4 py-3 mb-8 text-sm">
          {error}
        </div>
      )}

      {decoded && !letter && (
        <Results
          decoded={decoded}
          selected={selected}
          setSelected={setSelected}
          onDraftLetter={handleDraftLetter}
          isDraftingLetter={drafting}
        />
      )}

      {letter && (
        <div className="space-y-10">
          <LetterPreview letter={letter} />
          <button
            type="button"
            onClick={() => setLetter(null)}
            className="text-sm text-muted underline"
          >
            Back to results
          </button>
        </div>
      )}

      <footer className="mt-16 pt-8 border-t border-muted/20 text-xs text-muted leading-relaxed">
        <Disclaimer />
        <p className="mt-3">
          Built by Sunny Jaymes. Free for the first bill, then $19 per bill or
          $49 for a year of unlimited decodes. Refund on appeal failure if you
          mailed the letter.
        </p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          <a href="/case-study" className="hover:text-accent">Case study</a>
          <a href="/values" className="hover:text-accent">What we will + won&rsquo;t do</a>
          <a
            href="https://github.com/WoodrowLove/pushback"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            Source (MIT)
          </a>
        </p>
      </footer>
    </main>
  );
}
