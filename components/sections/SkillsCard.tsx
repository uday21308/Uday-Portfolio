"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, Brain, Server, Cloud } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { tagUsage } from "@/content/skills";

export type SkillIcon = "sparkles" | "brain" | "server" | "cloud";

const ICONS = {
  sparkles: Sparkles,
  brain: Brain,
  server: Server,
  cloud: Cloud,
} as const;

type Props = {
  label: string;
  items: string[];
  icon: SkillIcon;
  accentGradient: string;
  reverse?: boolean;
};

type TipState = { tag: string; rect: DOMRect } | null;

export function SkillsCard({ label, items, icon, accentGradient, reverse }: Props) {
  const Icon = ICONS[icon];
  const [tip, setTip] = useState<TipState>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onTagEnter(e: React.PointerEvent<HTMLSpanElement>, tag: string) {
    const projects = tagUsage[tag];
    if (!projects || projects.length === 0) return;
    setTip({ tag, rect: e.currentTarget.getBoundingClientRect() });
  }

  function onTagLeave() {
    setTip(null);
  }

  const projects = tip ? tagUsage[tip.tag] ?? [] : [];

  const blobRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: blobProgress } = useScroll({
    target: blobRef,
    offset: ["start end", "end start"],
  });
  const blobY = useTransform(blobProgress, [0, 1], [-30, 30]);

  return (
    <div className="skc-root group relative h-full p-6 rounded-2xl border border-[var(--color-accent)]/12 bg-[var(--color-bg-elevated)] overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)]/40">
      <motion.div
        ref={blobRef}
        className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${accentGradient} blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500`}
        style={{ y: blobY }}
      />
      <div className="relative flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)]">
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <h4 className="font-[family-name:var(--font-display-alt)] font-extrabold text-lg uppercase tracking-[-0.005em] text-[var(--color-fg)] m-0">
          {label}
        </h4>
      </div>

      <div className="skc-mq relative">
        <div className={`skc-row ${reverse ? "skc-row-reverse" : ""}`}>
          {[...items, ...items].map((item, i) => {
            const hasProjects = (tagUsage[item]?.length ?? 0) > 0;
            return (
              <span
                key={`${item}-${i}`}
                onPointerEnter={(e) => onTagEnter(e, item)}
                onPointerLeave={onTagLeave}
                className={`shrink-0 whitespace-nowrap font-[family-name:var(--font-mono)] text-[11px] tracking-[0.04em] px-2.5 py-1 rounded-md border bg-[var(--color-bg)]/40 transition-colors ${
                  hasProjects
                    ? "border-[var(--color-accent)]/20 text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/50 cursor-help"
                    : "border-[var(--color-accent)]/10 text-[var(--color-fg-muted)]/70"
                }`}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>

      {mounted && tip && projects.length > 0
        ? createPortal(
            <div
              className="skc-tip"
              style={{
                left: tip.rect.left + tip.rect.width / 2,
                top: tip.rect.top - 10,
              }}
            >
              <div className="skc-tip-head">Used in</div>
              <ul>
                {projects.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </div>,
            document.body
          )
        : null}

      <style>{`
        .skc-mq {
          overflow: hidden;
          padding: 2px 0;
          min-width: 0;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
                  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .skc-row {
          display: flex;
          gap: 6px;
          width: max-content;
          animation: skc-scroll 26s linear infinite;
          will-change: transform;
        }
        .skc-row-reverse { animation-direction: reverse; animation-duration: 30s; }
        .skc-root:hover .skc-row { animation-play-state: paused; }
        @keyframes skc-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .skc-tip {
          position: fixed;
          transform: translate(-50%, -100%);
          background: #181a24;
          border: 1px solid rgba(108,207,255,0.4);
          border-radius: 8px;
          padding: 9px 12px;
          min-width: 200px;
          max-width: 280px;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: 12px;
          color: #c0c4cf;
          line-height: 1.5;
          box-shadow: 0 12px 32px -8px rgba(0,0,0,0.7);
          pointer-events: none;
          z-index: 100;
          animation: skc-tip-in 0.15s ease-out;
        }
        .skc-tip::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 9px;
          height: 9px;
          background: #181a24;
          border-right: 1px solid rgba(108,207,255,0.4);
          border-bottom: 1px solid rgba(108,207,255,0.4);
        }
        .skc-tip-head {
          color: #6ccfff;
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 5px;
          font-weight: 700;
        }
        .skc-tip ul { margin: 0; padding: 0; list-style: none; }
        .skc-tip li { padding: 1px 0; }
        @keyframes skc-tip-in {
          from { opacity: 0; transform: translate(-50%, calc(-100% + 4px)); }
          to   { opacity: 1; transform: translate(-50%, -100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .skc-row { animation: none !important; }
          .skc-tip { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
