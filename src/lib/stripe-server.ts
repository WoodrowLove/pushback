// Server-only Stripe client + plan definitions.
//
// Pricing follows STRATEGY.md: $19 unlocks one bill (with 24h to revisit
// the same flow), $49 unlocks a full year of unlimited decodes. The cap
// is roughly 1/50th of typical recovery — STRATEGY.md anti-pattern #4.
//
// Server-only — never import this from a client component (the secret
// key would leak into the bundle).

import Stripe from "stripe";

export const PLANS = {
  single: {
    label: "This bill",
    price: 1900, // cents
    description:
      "Decode this bill and draft the appeal. 24-hour window to revisit if you need to retry.",
    unlockMs: 24 * 60 * 60 * 1000,
  },
  annual: {
    label: "Unlimited for a year",
    price: 4900,
    description:
      "Pay once. Decode every bill, EOB, and denial that lands for the next year.",
    unlockMs: 365 * 24 * 60 * 60 * 1000,
  },
} as const;

export type Plan = keyof typeof PLANS;

let _stripe: Stripe | null = null;

/**
 * Returns a Stripe client, or null if STRIPE_SECRET_KEY is unset.
 * Endpoints should treat null as "payment temporarily unavailable" so
 * a missing key doesn't crash the build or break unrelated routes.
 */
export function stripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  _stripe = new Stripe(key);
  return _stripe;
}
