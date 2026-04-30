// /paid — Stripe success-redirect target.
//
// Reads ?session_id from the URL, calls /api/verify-payment, and on
// success stashes the unlock in localStorage and bounces home. Any
// failure here is caught and surfaced with a real email contact —
// not a phone tree.

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setUnlock } from "@/lib/unlock";

function PaidInner() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"verifying" | "ok" | "error">("verifying");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setErr("Missing session id in URL.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(
          `/api/verify-payment?session_id=${encodeURIComponent(sessionId)}`,
        );
        const j = (await r.json()) as
          | { ok: true; plan: "single" | "annual"; unlockUntil: number }
          | { ok: false; error: string };
        if (cancelled) return;
        if (!j.ok) throw new Error(j.error || "Verification failed");
        setUnlock({ plan: j.plan, unlockUntil: j.unlockUntil });
        setStatus("ok");
        setTimeout(() => {
          if (!cancelled) router.push("/");
        }, 1800);
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setErr((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  return (
    <main className="max-w-2xl mx-auto px-5 py-16 text-center">
      {status === "verifying" && (
        <p className="text-base text-ink/80">Confirming your payment…</p>
      )}
      {status === "ok" && (
        <>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold">
            You&rsquo;re in.
          </h1>
          <p className="mt-3 text-base text-ink/80 leading-relaxed">
            Taking you back to decode the bill. If this hangs, click{" "}
            <a href="/" className="text-accent underline">
              here
            </a>
            .
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-serif font-semibold">
            Something went sideways.
          </h1>
          <p className="mt-3 text-sm text-ink/80">{err}</p>
          <p className="mt-4 text-sm leading-relaxed">
            If you were charged, email{" "}
            <a
              href="mailto:hello@sunnyjaymes.com"
              className="text-accent underline"
            >
              hello@sunnyjaymes.com
            </a>{" "}
            and we&rsquo;ll fix it same-day. We don&rsquo;t use forms or a
            phone tree for this.
          </p>
          <a
            href="/"
            className="mt-6 inline-block text-accent underline"
          >
            Back to Pushback
          </a>
        </>
      )}
    </main>
  );
}

export default function PaidPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-2xl mx-auto px-5 py-16 text-center">
          <p className="text-base text-ink/80">Loading…</p>
        </main>
      }
    >
      <PaidInner />
    </Suspense>
  );
}
