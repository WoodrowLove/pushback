"use client";

import { useState } from "react";
import type { DecodeRequest } from "@/lib/types";

type Props = {
  onDecode: (req: DecodeRequest) => void;
  isLoading: boolean;
};

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export function Uploader({ onDecode, isLoading }: Props) {
  const [mode, setMode] = useState<"file" | "text">("file");
  const [text, setText] = useState("");
  const [state, setState] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [wasInNetworkExpected, setWasInNetworkExpected] = useState(false);
  const [hadPriorAuth, setHadPriorAuth] = useState(false);
  const [notes, setNotes] = useState("");

  async function handleFile(file: File) {
    const buf = await file.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    onDecode({
      documentBase64: base64,
      documentMimeType: file.type || "application/pdf",
      context: buildContext(),
    });
  }

  function buildContext(): DecodeRequest["context"] {
    const c: NonNullable<DecodeRequest["context"]> = {};
    if (state) c.state = state;
    if (diagnosis) c.diagnosis = diagnosis;
    if (wasInNetworkExpected) c.wasInNetworkExpected = true;
    if (hadPriorAuth) c.hadPriorAuth = true;
    if (notes) c.notes = notes;
    return Object.keys(c).length ? c : undefined;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`px-3 py-1.5 rounded ${mode === "file" ? "bg-ink text-paper" : "border border-muted/30"}`}
        >
          Upload bill or EOB
        </button>
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`px-3 py-1.5 rounded ${mode === "text" ? "bg-ink text-paper" : "border border-muted/30"}`}
        >
          Paste text
        </button>
      </div>

      {mode === "file" ? (
        <div className="space-y-3">
          {/* Camera-first button — opens the phone's back camera directly on
              mobile. On desktop this still works as a normal file picker. */}
          <label className="block sm:hidden border-2 border-accent bg-accent/5 hover:bg-accent/10 transition-colors rounded-lg p-6 text-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              disabled={isLoading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="text-base font-medium">
              {isLoading ? "Reading…" : "📷 Take a photo of the bill"}
            </div>
            <div className="text-xs text-muted mt-1">Opens your camera</div>
          </label>

          <label className="block border-2 border-dashed border-muted/40 hover:border-accent transition-colors rounded-lg p-8 text-center cursor-pointer">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              disabled={isLoading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="text-base">
              {isLoading ? "Reading…" : "Or upload a PDF or image"}
            </div>
            <div className="text-xs text-muted mt-1">PDF or image. We process and discard.</div>
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the bill text here…"
            className="w-full min-h-[180px] border border-muted/30 rounded-md p-3 font-mono text-sm"
            disabled={isLoading}
          />
          <button
            type="button"
            disabled={isLoading || !text.trim()}
            onClick={() => onDecode({ documentText: text, context: buildContext() })}
            className="bg-accent text-paper px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? "Reading…" : "Decode this bill"}
          </button>
        </div>
      )}

      <details className="text-sm">
        <summary className="cursor-pointer text-muted">Optional context (helps quality)</summary>
        <div className="mt-3 space-y-3 pl-2 border-l border-muted/20">
          <label className="block">
            <span className="text-xs text-muted">Your state</span>
            <select
              className="mt-1 block w-32 border border-muted/30 rounded p-1.5 text-sm"
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={isLoading}
            >
              <option value="">—</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs text-muted">What were you treated for?</span>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. broken wrist, annual physical, MRI for back pain"
              className="mt-1 block w-full border border-muted/30 rounded p-1.5 text-sm"
              disabled={isLoading}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wasInNetworkExpected}
              onChange={(e) => setWasInNetworkExpected(e.target.checked)}
              disabled={isLoading}
            />
            I was told this provider was in-network
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hadPriorAuth}
              onChange={(e) => setHadPriorAuth(e.target.checked)}
              disabled={isLoading}
            />
            I had prior authorization
          </label>
          <label className="block">
            <span className="text-xs text-muted">Anything else? (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What you remember being told, when this got weird, anything that surprised you"
              className="mt-1 block w-full border border-muted/30 rounded p-2 text-sm min-h-[60px]"
              disabled={isLoading}
            />
          </label>
        </div>
      </details>
    </div>
  );
}
