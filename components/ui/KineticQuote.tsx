"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  text: string;
  className?: string;
  /** Optional huge outlined word that drifts horizontally behind the quote. */
  ghost?: string;
};

type Token = { text: string; italic: boolean };

function parseTokens(input: string): Token[] {
  const segments: Token[] = [];
  const regex = /\*([^*]+)\*|([^*]+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(input)) !== null) {
    if (m[1] !== undefined) segments.push({ text: m[1], italic: true });
    else if (m[2] !== undefined) segments.push({ text: m[2], italic: false });
  }
  const tokens: Token[] = [];
  for (const seg of segments) {
    const parts = seg.text.split(/\s+/).filter((w) => w.length > 0);
    for (const w of parts) tokens.push({ text: w, italic: seg.italic });
  }
  return tokens;
}

const ITALIC_VARIATION: CSSProperties = {
  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
};

export function KineticQuote({ text, className, ghost }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [played, setPlayed] = useState(false);
  const tokens = parseTokens(text);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlayed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      setPlayed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlayed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="kq-host">
      {ghost ? (
        <span className="kq-ghost" aria-hidden>
          {ghost}
        </span>
      ) : null}
      <p ref={ref} className={`kq ${played ? "kq-play" : ""} ${className ?? ""}`}>
        {tokens.map((t, i) => (
          <span
            key={i}
            className="kq-word"
            style={{ transitionDelay: `${Math.min(i * 0.05, 0.8)}s` }}
          >
            {t.italic ? (
              <em
                className="kq-em font-[family-name:var(--font-serif)] italic font-medium text-[var(--color-accent)] normal-case"
                style={ITALIC_VARIATION}
              >
                {t.text}
              </em>
            ) : (
              t.text
            )}
          </span>
        ))}
      </p>
      <style>{`
        .kq-host {
          position: relative;
          overflow: hidden;
        }
        .kq-ghost {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translate(-10%, -50%);
          font-family: var(--font-display-alt), sans-serif;
          font-weight: 900;
          font-size: clamp(3rem, 8vw, 6rem);
          line-height: 0.9;
          color: transparent;
          -webkit-text-stroke: 1px rgba(167, 139, 250, 0.18);
          text-transform: uppercase;
          letter-spacing: -0.02em;
          pointer-events: none;
          white-space: nowrap;
          z-index: 0;
          animation: kq-ghost-drift 20s ease-in-out infinite alternate;
          will-change: transform;
        }
        @keyframes kq-ghost-drift {
          from { transform: translate(-12%, -50%); }
          to   { transform: translate(12%, -50%); }
        }
        .kq {
          position: relative;
          z-index: 1;
          margin: 0;
        }
        .kq .kq-word {
          display: inline-block;
          margin-right: 0.25em;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .kq .kq-word:last-child { margin-right: 0; }
        .kq.kq-play .kq-word {
          opacity: 1;
          transform: translateY(0);
        }
        .kq em.kq-em {
          display: inline-block;
        }
        @media (prefers-reduced-motion: reduce) {
          .kq .kq-word { opacity: 1; transform: none; transition: none; }
          .kq-ghost { animation: none; }
        }
      `}</style>
    </div>
  );
}
