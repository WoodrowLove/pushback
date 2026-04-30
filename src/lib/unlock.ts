// Client-side localStorage helpers for paywall state.
//
// Privacy posture (per /values): no accounts, no server-side session
// store. Unlock state lives entirely in the user's browser. The flow:
//
//   1. First decode → markFreeUsed() flips a flag.
//   2. Subsequent decodes → shouldShowPaywall() returns true if no
//      unlock token is present (or it expired).
//   3. After Stripe checkout → /paid page calls verify-payment, then
//      setUnlock() with plan + expiry.
//
// This is honor-system gating: a user who clears localStorage gets the
// free tier again. That's intentional — matches the mission ("the most
// stressed user can get help without giving us anything"). Honest users
// pay; desperate users still get help. The maker hat won this argument.

"use client";

const UNLOCK_KEY = "pushback_unlock_v1";
const FREE_USED_KEY = "pushback_free_used_v1";

export type Unlock = {
  plan: "single" | "annual";
  unlockUntil: number; // ms since epoch
};

export function getUnlock(): Unlock | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(UNLOCK_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as Unlock;
    if (typeof u.unlockUntil !== "number" || u.unlockUntil < Date.now()) {
      window.localStorage.removeItem(UNLOCK_KEY);
      return null;
    }
    return u;
  } catch {
    return null;
  }
}

export function setUnlock(u: Unlock) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UNLOCK_KEY, JSON.stringify(u));
}

export function clearUnlock() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(UNLOCK_KEY);
}

export function markFreeUsed() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FREE_USED_KEY, "1");
}

export function hasUsedFree(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(FREE_USED_KEY) === "1";
}

export function isUnlocked(): boolean {
  return getUnlock() !== null;
}

export function shouldShowPaywall(): boolean {
  return hasUsedFree() && !isUnlocked();
}
