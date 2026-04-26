"use client";

import type { AppealLetter } from "@/lib/types";

export function LetterPreview({ letter }: { letter: AppealLetter }) {
  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(letter.body);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-serif font-semibold">Your appeal letter</h2>
        <p className="mt-2 text-sm text-muted">
          Read this carefully. Edit anything that doesn't match your situation.
          Sign it. Mail it certified, return-receipt requested.
        </p>
      </section>

      {letter.deadlines.length > 0 && (
        <div className="border border-warn/30 bg-warn/5 rounded p-4">
          <div className="text-xs uppercase tracking-wide text-warn font-semibold">
            Hard deadlines
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {letter.deadlines.map((d, i) => (
              <li key={i}>
                <strong>{d.label}:</strong> {d.date}
                {d.note && <span className="text-ink/70"> — {d.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {letter.mailingAddress && (
        <div>
          <div className="text-xs uppercase tracking-wide text-muted font-semibold">
            Mail to
          </div>
          <pre className="mt-1 whitespace-pre-wrap font-sans text-sm">{letter.mailingAddress}</pre>
        </div>
      )}

      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold">Letter</h3>
          <button
            type="button"
            onClick={copyLetter}
            className="text-sm border border-muted/40 rounded px-3 py-1 hover:bg-ink hover:text-paper transition-colors"
          >
            Copy
          </button>
        </div>
        <div className="mt-2 border border-muted/20 rounded-md p-5 bg-white">
          <RenderMarkdown source={letter.body} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Phone script</h3>
        <p className="text-sm text-muted">
          Read this aloud when you call the insurer's member services line.
        </p>
        <div className="mt-2 border border-muted/20 rounded-md p-5 bg-white">
          <RenderMarkdown source={letter.callScript} />
        </div>
      </div>

      {letter.citations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">What this letter is grounded in</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {letter.citations.map((c, i) => (
              <li key={i}>
                <strong>{c.label}</strong> — {c.source}
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-accent underline"
                  >
                    link
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Tiny markdown renderer. Handles headings, bold, lists, paragraphs.
 * We avoid pulling a full markdown lib for an MVP.
 */
function RenderMarkdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = (key: string) => {
    if (!listBuffer.length || !listType) return;
    const items = listBuffer.map((l, i) => (
      <li key={i} dangerouslySetInnerHTML={{ __html: inline(l) }} />
    ));
    if (listType === "ul") {
      blocks.push(<ul key={`ul-${key}`}>{items}</ul>);
    } else {
      blocks.push(<ol key={`ol-${key}`}>{items}</ol>);
    }
    listBuffer = [];
    listType = null;
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (/^\s*-\s+/.test(line)) {
      if (listType === "ol") flushList(`f${i}`);
      listType = "ul";
      listBuffer.push(line.replace(/^\s*-\s+/, ""));
      return;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      if (listType === "ul") flushList(`f${i}`);
      listType = "ol";
      listBuffer.push(line.replace(/^\s*\d+\.\s+/, ""));
      return;
    }
    flushList(`f${i}`);

    if (/^##\s+/.test(line)) {
      blocks.push(<h2 key={i} dangerouslySetInnerHTML={{ __html: inline(line.replace(/^##\s+/, "")) }} />);
    } else if (/^###\s+/.test(line)) {
      blocks.push(<h3 key={i} dangerouslySetInnerHTML={{ __html: inline(line.replace(/^###\s+/, "")) }} />);
    } else if (line.trim() === "") {
      blocks.push(<div key={i} className="h-2" />);
    } else {
      blocks.push(<p key={i} dangerouslySetInnerHTML={{ __html: inline(line) }} />);
    }
  });
  flushList("end");

  return <div className="prose-letter">{blocks}</div>;
}

function inline(s: string) {
  // Escape HTML, then re-introduce **bold** and *italic*.
  const safe = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return safe
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
