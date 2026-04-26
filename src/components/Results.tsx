"use client";

import { useMemo } from "react";
import type { DecodedBill, Anomaly } from "@/lib/types";

type Props = {
  decoded: DecodedBill;
  selected: Set<number>;
  setSelected: (s: Set<number>) => void;
  onDraftLetter: () => void;
  isDraftingLetter: boolean;
};

const KIND_LABELS: Record<Anomaly["kind"], string> = {
  duplicate_charge: "Duplicate charge",
  out_of_network_unexpected: "Unexpected out-of-network",
  denied_no_explanation: "Denied without real reason",
  denied_medical_necessity: "Denied for medical necessity",
  denied_prior_auth_missing: "Denied for missing prior auth",
  denied_not_covered: "Denied as not covered",
  upcoding_suspect: "Possible upcoding",
  balance_billing_violation: "Balance billing — possibly illegal",
  preventive_care_charged: "Preventive care charged",
  facility_fee_unexpected: "Unexpected facility fee",
  code_unbundling_suspect: "Possible code unbundling",
  timely_filing_error: "Timely filing error",
  coordination_of_benefits_error: "Coordination-of-benefits error",
  other: "Other issue",
};

export function Results({
  decoded,
  selected,
  setSelected,
  onDraftLetter,
  isDraftingLetter,
}: Props) {
  const argueable = useMemo(
    () =>
      decoded.anomalies
        .map((a, i) => ({ a, i }))
        .filter(({ a }) => a.confidence !== "low"),
    [decoded.anomalies]
  );

  const toggle = (i: number) => {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-serif font-semibold">What we found</h2>
        <p className="mt-2 text-base leading-relaxed">{decoded.summary}</p>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {decoded.meta.insurer && (
            <>
              <dt className="text-muted">Insurer</dt>
              <dd>{decoded.meta.insurer}</dd>
            </>
          )}
          {decoded.meta.provider && (
            <>
              <dt className="text-muted">Provider</dt>
              <dd>{decoded.meta.provider}</dd>
            </>
          )}
          {decoded.meta.claimNumber && (
            <>
              <dt className="text-muted">Claim #</dt>
              <dd className="font-mono text-sm">{decoded.meta.claimNumber}</dd>
            </>
          )}
          {decoded.meta.totalPatientResponsibility !== undefined && (
            <>
              <dt className="text-muted">They say you owe</dt>
              <dd className="font-semibold">${decoded.meta.totalPatientResponsibility.toFixed(2)}</dd>
            </>
          )}
        </dl>
      </section>

      {decoded.recommendedActions.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold">What to do</h3>
          <ol className="mt-3 space-y-3">
            {decoded.recommendedActions.map((a, i) => (
              <li key={i} className="border-l-4 pl-4 py-1" style={{
                borderColor: a.priority === "urgent" ? "var(--bad)" : a.priority === "important" ? "var(--accent)" : "var(--muted)",
              }}>
                <div className="font-medium">
                  {a.title}
                  {a.deadline && (
                    <span className="ml-2 text-xs text-warn">by {a.deadline}</span>
                  )}
                </div>
                <div className="text-sm text-ink/80 mt-1">{a.detail}</div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {argueable.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">Things to push back on</h3>
            <button
              type="button"
              disabled={isDraftingLetter || selected.size === 0}
              onClick={onDraftLetter}
              className="bg-accent text-paper px-4 py-2 rounded-md disabled:opacity-40 text-sm"
            >
              {isDraftingLetter ? "Drafting…" : `Draft appeal letter (${selected.size})`}
            </button>
          </div>
          <p className="mt-2 text-sm text-muted">
            Select the ones you want the letter to argue. Unselect what you'd
            rather skip.
          </p>
          <ul className="mt-3 space-y-2">
            {argueable.map(({ a, i }) => (
              <li
                key={i}
                className={`border rounded-md p-3 cursor-pointer transition-colors ${
                  selected.has(i) ? "border-accent bg-accent/5" : "border-muted/30 hover:border-muted"
                }`}
                onClick={() => toggle(i)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(i)}
                    readOnly
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-medium">
                      {KIND_LABELS[a.kind]}
                      <ConfidencePill confidence={a.confidence} />
                      {a.potentialRecovery !== undefined && a.potentialRecovery > 0 && (
                        <span className="ml-2 text-xs text-good">
                          potential recovery ~${a.potentialRecovery.toFixed(0)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink/80 mt-1">{a.explanation}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3 className="text-lg font-semibold">Line items</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted text-xs uppercase">
              <tr>
                <th className="py-2 pr-3">Description</th>
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3 text-right">Billed</th>
                <th className="py-2 pr-3 text-right">Allowed</th>
                <th className="py-2 pr-3 text-right">Insurer paid</th>
                <th className="py-2 pr-3 text-right">You owe</th>
                <th className="py-2 pr-3">Codes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/15">
              {decoded.lineItems.map((li, idx) => (
                <tr key={idx} className="align-top">
                  <td className="py-2 pr-3">{li.description}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{li.procedureCode || "—"}</td>
                  <td className="py-2 pr-3 text-right">{fmt(li.billedAmount)}</td>
                  <td className="py-2 pr-3 text-right">{fmt(li.allowedAmount)}</td>
                  <td className="py-2 pr-3 text-right">{fmt(li.insurerPaid)}</td>
                  <td className="py-2 pr-3 text-right font-semibold">
                    {fmt(li.patientResponsibility)}
                  </td>
                  <td className="py-2 pr-3 font-mono text-xs">
                    {[...(li.carcCodes || []), ...(li.rarcCodes || [])].join(", ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function fmt(n?: number) {
  if (n === undefined || n === null) return "—";
  return `$${n.toFixed(2)}`;
}

function ConfidencePill({ confidence }: { confidence: Anomaly["confidence"] }) {
  const cls =
    confidence === "high"
      ? "bg-bad/10 text-bad"
      : confidence === "medium"
      ? "bg-warn/10 text-warn"
      : "bg-muted/10 text-muted";
  return (
    <span className={`ml-2 inline-block text-[10px] px-1.5 py-0.5 rounded uppercase ${cls}`}>
      {confidence}
    </span>
  );
}
