// POST /api/draft-letter
//
// Accepts a JSON body matching DraftLetterRequest. Returns DraftLetterResponse.
// Run this AFTER /api/decode succeeds and the user has reviewed the anomalies.

import { NextRequest, NextResponse } from "next/server";
import { draftAppealLetter } from "@/lib/letter";
import { draftLetterRequestSchema } from "@/lib/schemas";
import type { DraftLetterResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  req: NextRequest
): Promise<NextResponse<DraftLetterResponse>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = draftLetterRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") },
      { status: 400 }
    );
  }

  try {
    const letter = await draftAppealLetter(parsed.data);
    return NextResponse.json({ ok: true, letter });
  } catch (e) {
    const message = (e as Error).message;
    console.error("[/api/draft-letter] failure:", message);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't draft the letter. Please try again.",
      },
      { status: 500 }
    );
  }
}
