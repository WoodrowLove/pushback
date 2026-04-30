// GET /api/verify-payment?session_id=cs_xxx
//
// Called from /paid after Stripe redirects the user back. Verifies the
// Stripe Checkout Session was actually paid, reads back the plan from
// metadata, and returns an unlock window.
//
// Response: { ok: true, plan, unlockUntil } | { ok: false, error }

import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, type Plan } from "@/lib/stripe-server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const s = stripe();
  if (!s) {
    return NextResponse.json(
      { ok: false, error: "Payment temporarily unavailable" },
      { status: 503 },
    );
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json(
      { ok: false, error: "Missing session_id" },
      { status: 400 },
    );
  }

  try {
    const session = await s.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { ok: false, error: `Payment status: ${session.payment_status}` },
        { status: 402 },
      );
    }
    const plan = session.metadata?.plan as Plan | undefined;
    if (!plan || !(plan in PLANS)) {
      return NextResponse.json(
        { ok: false, error: "Plan metadata missing on session" },
        { status: 500 },
      );
    }
    const unlockUntil = Date.now() + PLANS[plan].unlockMs;
    return NextResponse.json({ ok: true, plan, unlockUntil });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message || "Verification failed" },
      { status: 500 },
    );
  }
}
