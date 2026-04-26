// Single Anthropic client. All LLM traffic goes through here so we can
// (a) swap models centrally, (b) enforce timeouts, (c) attach safety
// preludes consistently, and (d) one day add caching.

import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey && process.env.NODE_ENV !== "test") {
  console.warn(
    "[pushback] ANTHROPIC_API_KEY is not set. /api/* endpoints will return 500."
  );
}

export const anthropic = new Anthropic({
  apiKey: apiKey || "",
  // 60s is generous for a single bill decode. If you stream, raise this.
  timeout: 60_000,
});

export const DEFAULT_MODEL =
  process.env.PUSHBACK_MODEL || "claude-sonnet-4-5-20250929";

export const DEBUG = process.env.PUSHBACK_DEBUG === "1";

/**
 * Helper: extract a single JSON object from a Claude text response.
 *
 * We ask Claude for JSON, but it sometimes wraps the JSON in fenced code
 * blocks or chats around it. This is defensive; if the LLM ever returns
 * truly malformed output we throw a descriptive error so the API can
 * surface a "couldn't parse, please retry" response to the user.
 */
export function extractJSON<T = unknown>(raw: string): T {
  const trimmed = raw.trim();

  // Strip markdown code fences if present
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : trimmed;

  // Find the outermost JSON object/array
  const firstObj = candidate.indexOf("{");
  const firstArr = candidate.indexOf("[");
  let start = -1;
  if (firstObj >= 0 && firstArr >= 0) start = Math.min(firstObj, firstArr);
  else if (firstObj >= 0) start = firstObj;
  else if (firstArr >= 0) start = firstArr;
  else throw new Error("LLM response contained no JSON object or array.");

  // Walk the string to find the matching closing bracket. Naive but adequate
  // for what Claude actually produces.
  const opener = candidate[start];
  const closer = opener === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escape = false;
  let end = -1;
  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === opener) depth++;
    else if (ch === closer) {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) {
    throw new Error("LLM JSON appears truncated; no matching close bracket.");
  }
  const jsonText = candidate.slice(start, end + 1);
  try {
    return JSON.parse(jsonText) as T;
  } catch (e) {
    throw new Error(
      `LLM JSON parse failed: ${(e as Error).message}. First 200 chars: ${jsonText.slice(0, 200)}`
    );
  }
}
