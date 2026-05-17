"use client";
import { useState } from "react";

type Source = { title: string; source: string; score: number };

/**
 * Turn raw source identifiers into recruiter-friendly labels.
 *   "resume"                                 → "Resume"
 *   "linkedin"                               → "LinkedIn"
 *   "faq"                                    → "FAQ"
 *   "github:Healthcare-RAG-Assistant"        → "Healthcare RAG Assistant"
 *   "github:FruitFreshnessDetection"         → "Fruit Freshness Detection"
 *   "extra:code-aware-rag"                   → "Code Aware Rag"
 */
function formatSource(source: string): string {
  if (source === "resume") return "Resume";
  if (source === "linkedin") return "LinkedIn";
  if (source === "faq") return "FAQ";
  if (source.startsWith("github:")) {
    return source
      .slice(7)
      .replace(/-/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2");
  }
  if (source.startsWith("extra:")) {
    return source
      .slice(6)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return source;
}

/**
 * For FAQ + LinkedIn chunks the chunker's title carries real signal
 * (the question text, the LinkedIn document title). For everything
 * else the source name alone is enough — titles are noisy or redundant.
 */
function shouldShowTitle(source: string): boolean {
  return source === "faq" || source === "linkedin";
}

export function SourceCitations({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);
  if (sources.length === 0) return null;
  return (
    <div className="mt-2 text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[var(--color-fg-muted)] hover:text-[var(--color-accent-cyan)] transition-colors"
      >
        {open ? "▾" : "▸"} {sources.length} {sources.length === 1 ? "source" : "sources"}
      </button>
      {open && (
        <ul className="mt-1.5 space-y-0.5 pl-3 border-l border-[var(--color-accent)]/20">
          {sources.map((s, i) => (
            <li
              key={i}
              className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-fg-muted)]"
            >
              [{i + 1}] <span className="text-[var(--color-fg)]">{formatSource(s.source)}</span>
              {shouldShowTitle(s.source) && (
                <span className="opacity-70"> — {s.title}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
