"use client";
import { useState } from "react";

type Source = { title: string; source: string; score: number };

export function SourceCitations({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);
  if (sources.length === 0) return null;
  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[var(--color-fg-muted)] hover:text-[var(--color-accent-cyan)] transition-colors"
      >
        {open ? "▾" : "▸"} {sources.length} sources cited
      </button>
      {open && (
        <ul className="mt-1.5 space-y-0.5 pl-3 border-l border-[var(--color-accent)]/20">
          {sources.map((s, i) => (
            <li key={i} className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-fg-muted)]">
              [{i + 1}] <span>{s.title}</span> <span className="opacity-50">· {s.source} · {(s.score * 100).toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
