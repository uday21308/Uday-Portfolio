"use client";
import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";

type Props = {
  /** Each line is one string. Use `*word*` for italic accents. */
  lines: string[];
  className?: string;
  /** Cipher animation step interval (ms). */
  stepMs?: number;
  /** Max distance (px) at which letters react to the cursor. */
  magnetRadius?: number;
  /** How strongly letters drift toward the cursor (0..1). */
  magnetPull?: number;
};

type Char = { ch: string; italic: boolean };

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%*<>?{}";

const ITALIC_VARIATION: CSSProperties = {
  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
};

function parseLine(line: string): Char[] {
  const out: Char[] = [];
  const regex = /\*([^*]+)\*|([^*]+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(line)) !== null) {
    const text = (m[1] ?? m[2])!;
    const italic = m[1] !== undefined;
    for (const ch of text) out.push({ ch, italic });
  }
  return out;
}

export function MagneticHeadline({
  lines,
  className,
  stepMs = 45,
  magnetRadius = 110,
  magnetPull = 0.18,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const revealedRef = useRef(false);
  const data = lines.map(parseLine);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealedRef.current = true;
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            runCipher();
            obs.disconnect();
            return;
          }
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runCipher() {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-real]"));
    const reals = spans.map((s) => s.dataset.real!);
    let iter = 0;
    const id = window.setInterval(() => {
      for (let i = 0; i < spans.length; i++) {
        const real = reals[i];
        if (i < iter || real === " ") {
          spans[i].textContent = real === " " ? " " : real;
        } else {
          spans[i].textContent = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
        }
      }
      iter++;
      if (iter > spans.length + 1) {
        window.clearInterval(id);
        for (let i = 0; i < spans.length; i++) {
          spans[i].textContent = reals[i] === " " ? " " : reals[i];
        }
        revealedRef.current = true;
      }
    }, stepMs);
  }

  function onMove(e: PointerEvent<HTMLHeadingElement>) {
    if (!revealedRef.current) return;
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLSpanElement>("[data-real]");
    spans.forEach((span) => {
      const r = span.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < magnetRadius) {
        const f = (magnetRadius - dist) / magnetRadius;
        span.style.transform = `translate(${dx * f * magnetPull}px, ${dy * f * magnetPull}px)`;
      } else {
        span.style.transform = "";
      }
    });
  }

  function onLeave() {
    if (!revealedRef.current) return;
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll<HTMLSpanElement>("[data-real]").forEach((s) => {
      s.style.transform = "";
    });
  }

  const charTransition: CSSProperties = {
    transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "transform",
  };

  return (
    <h2
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
    >
      {data.map((line, li) => (
        <span key={li} className="block">
          {line.map((c, i) => (
            <span
              key={i}
              data-real={c.ch}
              className="inline-block"
              style={
                c.italic
                  ? {
                      ...ITALIC_VARIATION,
                      ...charTransition,
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontWeight: 500,
                      color: "var(--color-accent)",
                      textTransform: "none",
                    }
                  : charTransition
              }
            >
              {c.ch === " " ? " " : c.ch}
            </span>
          ))}
        </span>
      ))}
    </h2>
  );
}
