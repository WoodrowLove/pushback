// POST /api/decode
//
// Accepts a JSON body matching DecodeRequest. Returns DecodeResponse.
//
// This is intentionally a single, synchronous request. We do NOT stream the
// LLM response back — for a 30-60 second decode, the user gets a loading
// state on the frontend, and a clean payload at the end. Streaming becomes
// worth it once we cross 90 seconds, which only happens for very long bills.
//
// Privacy: we receive PHI here. We never persist it. The only side effect is
// the inbound request to the Anthropic API.

import { NextRequest, NextResponse } from "next/server";
import { decodeDocument } from "@/lib/extract";
import { decodeRequestSchema } from "@/lib/schemas";
import type { DecodeResponse } from "@/lib/types";

export const runtime = "nodejs"; // node, not edge — we use node SDK + larger body
export const maxDuration = 60; // Vercel default cap on Hobby is 60s; tune up on Pro

export async function POST(req: NextRequest): Promise<NextResponse<DecodeResponse>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = decodeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Request validation failed.",
        suggestion: parsed.error.issues.map((i) => i.message).join("; "),
      },
      { status: 400 }
    );
  }

  try {
    const decoded = await decodeDocument(parsed.data);
    return NextResponse.json({ ok: true, data: decoded });
  } catch (e) {
    const message = (e as Error).message;
    console.error("[/api/decode] failure:", message);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't decode that document. Please try again or paste the bill text directly.",
        suggestion: process.env.PUSHBACK_DEBUG ? message : undefined,
      },
      { status: 500 }
    );
  }
}
