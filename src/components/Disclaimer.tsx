// Persistent disclaimer block. Don't ship without one.
//
// Why this is non-negotiable:
// - We give plain-English advice on insurance denials. That can sound legal.
// - We're not lawyers, we're not advocates of record, we're not a covered
//   entity under HIPAA, and the LLM is occasionally wrong.
// - The user's appeal letter is their letter. They sign it, they send it,
//   they own the outcome.
//
// If the language here changes, run it past a healthcare lawyer first.

export function Disclaimer({ tone = "subtle" }: { tone?: "subtle" | "prominent" }) {
  if (tone === "prominent") {
    return (
      <div className="border border-warn/40 bg-warn/5 text-ink px-4 py-3 rounded-md text-sm leading-relaxed">
        <strong className="font-semibold">Pushback is not legal or medical advice.</strong>{" "}
        We help you draft your own appeal in your own voice. Read what we
        produce. Edit it. Verify dates and addresses against your own
        documents. If your case involves serious money or legal exposure,
        bring in a real advocate or attorney. We never store the documents you
        upload.
      </div>
    );
  }
  return (
    <p className="text-xs text-muted leading-relaxed">
      Pushback is not legal or medical advice. We help you draft your own
      appeal — read it, edit it, and verify against your documents before you
      send. Documents are processed in memory and not stored.
    </p>
  );
}
