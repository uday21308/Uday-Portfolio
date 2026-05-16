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
  positionClass: string;
  delay: number;
};

const ACCENT_STYLES: Record<PanelDef["accent"], { border: string; shadow: string; color: string }> = {
  violet: { border: "rgba(167,139,250,0.4)", shadow: "rgba(167,139,250,0.25)", color: "#a78bfa" },
  cyan: { border: "rgba(108,207,255,0.4)", shadow: "rgba(108,207,255,0.25)", color: "#6ccfff" },
  cream: { border: "rgba(245,224,170,0.4)", shadow: "rgba(245,224,170,0.22)", color: "#f5e0aa" },
  lime: { border: "rgba(154,255,154,0.35)", shadow: "rgba(154,255,154,0.20)", color: "#9aff9a" },
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
    positionClass: "top-[6%] left-[14%] w-[44%]",
    delay: 0,
  },
  {
    key: "deploy",
    Icon: Cloud,
    label: "Deploy",
    value: "→ production",
    sub: "vercel · dokku · docker",
    accent: "cyan",
    positionClass: "top-[6%] right-[4%] w-[46%]",
    delay: 0.4,
  },
  {
    key: "claude-code",
    Icon: Braces,
    label: "Claude Code",
    value: "$ build agent",
    sub: "✓ shipped in 38s",
    okSub: true,
    accent: "cream",
    positionClass: "top-[36%] right-0 w-[48%]",
    delay: 0.8,
  },
  {
    key: "agent",
    Icon: Sparkles,
    label: "Agent",
    value: "active",
    sub: "tools · memory · context",
    pulse: true,
    accent: "lime",
    positionClass: "bottom-[6%] right-[10%] w-[48%]",
    delay: 1.2,
  },
  {
    key: "mcp",
    Icon: MessageSquare,
    label: "MCP",
    value: "12 tools registered",
    sub: "stdio · fastmcp · claude",
    accent: "cyan",
    positionClass: "bottom-[6%] left-[6%] w-[48%]",
    delay: 1.6,
  },
];

export function HoloWorkstation() {
  return (
    <div
      aria-hidden
      className="holo-root hidden lg:block absolute right-[3%] xl:right-[6%] top-1/2 -translate-y-1/2 z-[5] w-[420px] xl:w-[460px] h-[420px] xl:h-[460px] pointer-events-none"
    >
      <div className="holo-scene relative w-full h-full">
        <div className="holo-desk" />

        {/* central workspace monitor */}
        <div className="holo-monitor">
          <div className="holo-monitor-title">
            <Terminal size={11} />
            <span>workspace</span>
          </div>
          <div className="holo-monitor-body">
            <span className="text-[var(--color-accent-cyan)]">~</span> agent.run()
            <br />
            <span className="opacity-70">→ thinking...</span>
            <br />
            <span className="text-[#9aff9a]">✓ response ready</span>
          </div>
          <div className="holo-scan" />
        </div>

        {/* connecting beams */}
        <div className="holo-beam beam-1" />
        <div className="holo-beam beam-2" />

        {/* floating panels */}
        {PANELS.map((p) => {
          const s = ACCENT_STYLES[p.accent];
          return (
            <div
              key={p.key}
              className={`holo-panel absolute ${p.positionClass}`}
              style={{
                borderColor: s.border,
                boxShadow: `0 0 16px ${s.shadow}`,
                animationDelay: `${p.delay}s`,
              }}
            >
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
      </div>

      <style>{`
        .holo-scene {
          transform: perspective(900px) rotateX(18deg) rotateZ(-12deg);
          transform-style: preserve-3d;
        }
        .holo-desk {
          position: absolute;
          bottom: 22%;
          left: 50%;
          transform: translateX(-50%) rotateX(70deg);
          width: 62%;
          aspect-ratio: 1;
          background:
            linear-gradient(0deg, transparent 49%, rgba(108,207,255,.22) 50%, transparent 51%),
            linear-gradient(90deg, transparent 49%, rgba(108,207,255,.22) 50%, transparent 51%),
            radial-gradient(circle at 50% 50%, rgba(108,207,255,.14) 0%, transparent 70%);
          background-size: 26px 26px, 26px 26px, 100% 100%;
          border: 1px solid rgba(108,207,255,0.4);
          box-shadow: 0 0 40px rgba(108,207,255,0.3);
        }
        .holo-monitor {
          position: absolute;
          top: 36%;
          left: 50%;
          transform: translateX(-50%);
          width: 36%;
          aspect-ratio: 16/11;
          background: linear-gradient(135deg, rgba(108,207,255,0.18) 0%, rgba(167,139,250,0.18) 100%);
          border: 1px solid rgba(108,207,255,0.6);
          border-radius: 6px;
          backdrop-filter: blur(4px);
          box-shadow: 0 0 24px rgba(108,207,255,0.45);
          padding: 9px 11px;
          font-family: var(--font-mono), monospace;
          overflow: hidden;
        }
        .holo-monitor-title {
          display: flex; align-items: center; gap: 5px;
          font-size: 8.5px; color: #6ccfff; letter-spacing: 0.02em;
        }
        .holo-monitor-body {
          margin-top: 8px; font-size: 8px; color: #cfd2dc; line-height: 1.5;
        }
        .holo-scan {
          position: absolute; left: 8px; right: 8px; height: 1px;
          background: linear-gradient(90deg, transparent, #6ccfff, transparent);
          animation: holoScan 2.5s linear infinite;
          top: 30px;
        }
        @keyframes holoScan {
          0% { top: 30px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% - 8px); opacity: 0; }
        }

        .holo-panel {
          background: rgba(245,224,170,0.06);
          border: 1px solid rgba(245,224,170,0.3);
          border-radius: 7px;
          backdrop-filter: blur(10px);
          font-family: var(--font-mono), monospace;
          padding: 9px 11px;
          display: flex; flex-direction: column; gap: 5px;
          animation: holoFloat 4.4s ease-in-out infinite alternate;
        }
        .holo-panel-h {
          display: flex; align-items: center; gap: 6px;
          font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600;
        }
        .holo-panel-v {
          font-size: 10px; color: #ffffff; font-weight: 600;
          display: flex; align-items: center; gap: 5px;
        }
        .holo-panel-s {
          font-size: 8px; color: var(--color-fg-muted); opacity: 0.75;
        }
        .holo-pulse {
          display: inline-block; width: 5px; height: 5px; border-radius: 50%;
          background: #9aff9a; box-shadow: 0 0 6px #9aff9a;
          animation: holoDotPulse 1.4s ease-in-out infinite alternate;
        }
        @keyframes holoDotPulse { 0%{opacity:.45} 100%{opacity:1} }
        @keyframes holoFloat { 0%{transform:translateY(0)} 100%{transform:translateY(-6px)} }

        .holo-beam {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(108,207,255,0.4), transparent);
          height: 1px;
          animation: holoBeam 2.2s ease-in-out infinite alternate;
        }
        @keyframes holoBeam { 0%{opacity:.25} 100%{opacity:.75} }
        .beam-1 { top: 26%; left: 32%; width: 38%; }
        .beam-2 { top: 52%; left: 28%; width: 44%; transform: rotate(-18deg); }

        @media (prefers-reduced-motion: reduce) {
          .holo-panel, .holo-scan, .holo-beam, .holo-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
