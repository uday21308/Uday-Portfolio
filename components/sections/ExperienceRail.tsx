"use client";
import { useEffect, useRef } from "react";
import { experience } from "@/content/experience";
import { withItalicAccents } from "@/components/ui/ItalicAccent";
import { Reveal } from "@/components/ui/Reveal";

export function ExperienceRail() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return;

    if (reduce) {
      fill.style.height = "100%";
      dotRefs.current.forEach((d) => d?.classList.add("xp-dot-lit"));
      return;
    }

    let raf = 0;
    function update() {
      if (!wrap || !fill) return;
      const rect = wrap.getBoundingClientRect();
      const anchor = window.innerHeight * 0.55;
      const rel = anchor - rect.top;
      const p = Math.max(0, Math.min(1, rel / rect.height));
      fill.style.height = `${p * 100}%`;
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("xp-dot-lit");
          } else {
            (e.target as HTMLElement).classList.remove("xp-dot-lit");
          }
        }
      },
      { rootMargin: "-35% 0px -35% 0px" }
    );
    dotRefs.current.forEach((d) => d && observer.observe(d));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative pl-7 md:pl-8">
      <div
        className="absolute left-[6px] md:left-[7px] top-3 bottom-3 w-px bg-[var(--color-accent)]/15"
        aria-hidden
      />
      <div
        ref={fillRef}
        className="absolute left-[6px] md:left-[7px] top-3 w-px bg-gradient-to-b from-[var(--color-accent-violet)] via-[var(--color-accent)] to-[var(--color-accent-cyan)]"
        aria-hidden
        style={{ height: "0%", boxShadow: "0 0 12px rgba(167,139,250,0.55)" }}
      />

      {experience.map((entry, i) => (
        <Reveal key={entry.company} delay={i * 0.1} variant="slide-right">
          <article className="relative grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-8 py-6 border-b border-[var(--color-accent)]/10 last:border-b-0">
            <span
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="xp-dot absolute -left-[27px] md:-left-[30px] top-[28px] w-3 h-3 rounded-full border-2 border-[var(--color-accent)]/70 bg-[var(--color-bg)] transition-all duration-300"
              aria-hidden
            />
            <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-accent-cyan)] opacity-85 pt-1 whitespace-pre-line">
              {entry.dateRange.replace(" — ", "\n— ")}
            </p>
            <div>
              <h3 className="font-[family-name:var(--font-display-alt)] font-extrabold text-2xl md:text-3xl uppercase tracking-[-0.005em] m-0">
                {entry.role}
              </h3>
              <p className="font-[family-name:var(--font-sans)] text-sm text-[var(--color-accent-cyan)] mb-3 mt-1">
                {entry.company}
              </p>
              <ul className="font-[family-name:var(--font-sans)] text-sm md:text-[15px] leading-[1.6] text-[var(--color-fg-muted)] pl-5 list-disc space-y-1.5 marker:text-[var(--color-accent)]/50">
                {entry.bullets.map((b, j) => (
                  <li key={j}>{withItalicAccents(b)}</li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>
      ))}

      <style>{`
        .xp-dot.xp-dot-lit {
          background: var(--color-accent);
          border-color: var(--color-accent);
          box-shadow: 0 0 14px rgba(167,139,250,0.7), 0 0 28px rgba(167,139,250,0.35);
        }
      `}</style>
    </div>
  );
}
