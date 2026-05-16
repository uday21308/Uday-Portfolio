"use client";
import { Brain, Cloud, Braces, Sparkles, MessageSquare, Terminal } from "lucide-react";

type PanelDef = {
  key: string;
  Icon: typeof Brain;
  label: string;
  value: string;
  sub: string;
  pulse?: boolean;
  okSub?: boolean;
  accent: "violet" | "cyan" | "cream" | "lime";
  /** position in percent (CSS top/left/right/bottom). Use number = %. */
  pos: { top?: number; left?: number; right?: number; bottom?: number };
  width: number; // percent
  delay: number;
};

const ACCENT: Record<PanelDef["accent"], { border: string; shadow: string; color: string }> = {
  violet: { border: "rgba(167,139,250,0.45)", shadow: "rgba(167,139,250,0.30)", color: "#a78bfa" },
  cyan: { border: "rgba(108,207,255,0.45)", shadow: "rgba(108,207,255,0.28)", color: "#6ccfff" },
  cream: { border: "rgba(245,224,170,0.45)", shadow: "rgba(245,224,170,0.25)", color: "#f5e0aa" },
  lime: { border: "rgba(154,255,154,0.40)", shadow: "rgba(154,255,154,0.22)", color: "#9aff9a" },
};

const PANELS: PanelDef[] = [
  {
    key: "llm",
    Icon: Brain,
    label: "LLM",
    value: "thinking · 247 t/s",
    sub: "claude · gemini · gpt",
    pulse: true,
    accent: "violet",
    pos: { top: 0, left: 0 },
    width: 44,
    delay: 0,
  },
  {
    key: "deploy",
    Icon: Cloud,
    label: "Deploy",
    value: "→ production",
    sub: "vercel · dokku · docker",
    accent: "cyan",
    pos: { top: 0, right: 0 },
    width: 44,
    delay: 0.5,
  },
  {
    key: "mcp",
    Icon: MessageSquare,
    label: "MCP",
    value: "12 tools · active",
    sub: "stdio · fastmcp · claude",
    pulse: true,
    accent: "lime",
    pos: { bottom: 0, left: 0 },
    width: 44,
    delay: 1,
  },
  {
    key: "claude-code",
    Icon: Braces,
    label: "Claude Code",
    value: "$ build agent",
    sub: "✓ shipped in 38s",
    okSub: true,
    accent: "cream",
    pos: { bottom: 0, right: 0 },
    width: 44,
    delay: 1.5,
  },
];

export function HoloWorkstation() {
  return (
    <div
      aria-hidden
      className="holo-root hidden lg:block absolute right-[2%] xl:right-[4%] top-[48%] -translate-y-1/2 z-[5] w-[460px] xl:w-[520px] h-[460px] xl:h-[520px] pointer-events-none"
    >
      <div className="holo-grid" />

      {/* central workspace monitor */}
      <div className="holo-monitor">
        <div className="holo-monitor-title">
          <Terminal size={12} />
          <span>workspace</span>
        </div>
        <div className="holo-monitor-body">
          <span className="text-[var(--color-accent-cyan)]">~</span> agent.run()
          <br />
          <span className="opacity-70">→ thinking...</span>
          <br />
          <span className="text-[#9aff9a]">✓ response ready</span>
        </div>
      </div>

      {/* connector beams from workspace to each of 4 corner panels */}
      <svg className="holo-beams" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(108,207,255,0)" />
            <stop offset="50%" stopColor="rgba(108,207,255,0.65)" />
            <stop offset="100%" stopColor="rgba(108,207,255,0)" />
          </linearGradient>
        </defs>
        <line x1="50" y1="50" x2="18" y2="14" stroke="url(#beamGrad)" strokeWidth="0.3" strokeDasharray="0.6 1.4" className="beam-l1" />
        <line x1="50" y1="50" x2="82" y2="14" stroke="url(#beamGrad)" strokeWidth="0.3" strokeDasharray="0.6 1.4" className="beam-l2" />
        <line x1="50" y1="50" x2="18" y2="86" stroke="url(#beamGrad)" strokeWidth="0.3" strokeDasharray="0.6 1.4" className="beam-l3" />
        <line x1="50" y1="50" x2="82" y2="86" stroke="url(#beamGrad)" strokeWidth="0.3" strokeDasharray="0.6 1.4" className="beam-l4" />
      </svg>

      {/* floating panels */}
      {PANELS.map((p) => {
        const s = ACCENT[p.accent];
        const style: React.CSSProperties = {
          borderColor: s.border,
          boxShadow: `0 0 18px ${s.shadow}, 0 4px 24px -8px ${s.shadow}`,
          animationDelay: `${p.delay}s`,
          width: `${p.width}%`,
        };
        if (p.pos.top !== undefined) style.top = typeof p.pos.top === "number" ? `${p.pos.top}%` : p.pos.top;
        if (p.pos.bottom !== undefined) style.bottom = typeof p.pos.bottom === "number" ? `${p.pos.bottom}%` : p.pos.bottom;
        if (p.pos.left !== undefined) style.left = typeof p.pos.left === "number" ? `${p.pos.left}%` : p.pos.left;
        if (p.pos.right !== undefined) style.right = typeof p.pos.right === "number" ? `${p.pos.right}%` : p.pos.right;
        return (
          <div key={p.key} className="holo-panel absolute" style={style}>
            <div className="holo-panel-h" style={{ color: s.color }}>
              <p.Icon size={11} strokeWidth={2} />
              <span>{p.label}</span>
            </div>
            <div className="holo-panel-v">
              {p.pulse && <span className="holo-pulse" />}
              {p.value}
            </div>
            <div className={`holo-panel-s ${p.okSub ? "text-[#9aff9a] opacity-100" : ""}`}>
              {p.sub}
            </div>
          </div>
        );
      })}

      <style>{`
        .holo-root {
          isolation: isolate;
        }
        /* grid backdrop — flat, behind everything */
        .holo-grid {
          position: absolute;
          inset: 8% 6%;
          background:
            linear-gradient(0deg, transparent 49%, rgba(108,207,255,0.10) 50%, transparent 51%),
            linear-gradient(90deg, transparent 49%, rgba(108,207,255,0.10) 50%, transparent 51%),
            radial-gradient(circle at 50% 50%, rgba(108,207,255,0.07) 0%, transparent 65%);
          background-size: 32px 32px, 32px 32px, 100% 100%;
          border: 1px solid rgba(108,207,255,0.18);
          border-radius: 12px;
          z-index: 0;
        }

        .holo-monitor {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 34%;
          aspect-ratio: 16/11;
          background: linear-gradient(135deg, rgba(108,207,255,0.20) 0%, rgba(167,139,250,0.20) 100%);
          border: 1.5px solid rgba(108,207,255,0.7);
          border-radius: 7px;
          backdrop-filter: blur(6px);
          box-shadow: 0 0 28px rgba(108,207,255,0.5), 0 0 60px rgba(108,207,255,0.2);
          padding: 10px 12px;
          font-family: var(--font-mono), monospace;
          overflow: hidden;
          z-index: 2;
        }
        .holo-monitor-title {
          display: flex; align-items: center; gap: 6px;
          font-size: 9px; color: #6ccfff; letter-spacing: 0.02em; font-weight: 600;
        }
        .holo-monitor-body {
          margin-top: 9px; font-size: 8.5px; color: #cfd2dc; line-height: 1.55;
        }
.holo-beams {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          z-index: 1;
          opacity: 0.6;
        }
        .holo-beams line { animation: beamFlow 3s linear infinite; }
        .holo-beams .beam-l1 { animation-delay: 0s; }
        .holo-beams .beam-l2 { animation-delay: 0.5s; }
        .holo-beams .beam-l3 { animation-delay: 1s; }
        .holo-beams .beam-l4 { animation-delay: 1.5s; }
        @keyframes beamFlow {
          0% { stroke-dashoffset: 0; opacity: 0.3; }
          50% { opacity: 0.9; }
          100% { stroke-dashoffset: -8; opacity: 0.3; }
        }

        .holo-panel {
          background: rgba(245,224,170,0.05);
          border: 1px solid rgba(245,224,170,0.3);
          border-radius: 8px;
          backdrop-filter: blur(12px);
          font-family: var(--font-mono), monospace;
          padding: 10px 12px;
          display: flex; flex-direction: column; gap: 5px;
          animation: holoFloat 4.5s ease-in-out infinite alternate;
          z-index: 3;
        }
        .holo-panel-h {
          display: flex; align-items: center; gap: 6px;
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700;
        }
        .holo-panel-v {
          font-size: 11px; color: #ffffff; font-weight: 600;
          display: flex; align-items: center; gap: 6px;
        }
        .holo-panel-s {
          font-size: 8.5px; color: var(--color-fg-muted); opacity: 0.72; letter-spacing: 0.02em;
        }
        .holo-pulse {
          display: inline-block; width: 5px; height: 5px; border-radius: 50%;
          background: #9aff9a; box-shadow: 0 0 8px #9aff9a;
          animation: holoDotPulse 1.4s ease-in-out infinite alternate;
          flex-shrink: 0;
        }
        @keyframes holoDotPulse { 0%{opacity:.45} 100%{opacity:1} }
        @keyframes holoFloat {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .holo-panel, .holo-beams line, .holo-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
