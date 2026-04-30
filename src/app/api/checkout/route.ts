// POST /api/checkout
//
// Body: { plan: "single" | "annual" }
// Response: { ok: true, url: string } — redirect target (Stripe Checkout)
//   or  { ok: false, error: string }
//
// We use inline price_data so we don't need to maintain product/price IDs
// in the Stripe dashboard. The dollar amounts and labels are sourced from
// PLANS in stripe-server.ts which is the single source of truth.

import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, type Plan } from "@/lib/stripe-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const s = stripe();
  if (!s) {
    return NextResponse.json(
      { ok: false, error: "Payment temporarily unavailable. Email hello@sunnyjaymes.com." },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { plan?: string };
  const plan = body.plan as Plan | undefined;
  if (!plan || !(plan in PLANS)) {
    return NextResponse.json(
      { ok: false, error: "Invalid plan. Pick single or annual." },
      { status: 400 },
    );
  }

  const planDef = PLANS[plan];
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://pushback-two.vercel.app";

  try {
    const session = await s.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Pushback — ${planDef.label}`,
              description: planDef.description,
            },
            unit_amount: planDef.price,
          },
          quantity: 1,
        },
      ],
      metadata: { plan },
      success_url: `${origin}/paid?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=1`,
      allow_promotion_codes: false,
    });

    if (!session.url) {
      return NextResponse.json(
        { ok: false, error: "Stripe returned no checkout URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message || "Checkout failed" },
      { status: 500 },
    );
  }
}
