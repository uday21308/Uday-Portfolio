"use client";

export function LineArtBot() {
  return (
    <div
      aria-hidden
      className="hidden md:block pointer-events-none absolute right-6 lg:right-12 bottom-24 lg:bottom-28 z-20 line-bot-wrap"
    >
      <div className="speech">click to explore my work →</div>
      <svg
        viewBox="0 0 100 140"
        width="100"
        height="140"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="bot text-[var(--color-accent)]"
      >
        {/* antenna */}
        <line x1="50" y1="2" x2="50" y2="14" />
        <circle cx="50" cy="0" r="3" fill="currentColor" stroke="none" className="antenna-tip" />
        {/* head */}
        <rect x="20" y="14" width="60" height="50" rx="10" />
        {/* eyes (blink) */}
        <rect className="blink" x="32" y="32" width="10" height="6" rx="2" fill="currentColor" stroke="none" />
        <rect className="blink" x="58" y="32" width="10" height="6" rx="2" fill="currentColor" stroke="none" />
        {/* mouth hint */}
        <line x1="42" y1="52" x2="58" y2="52" />
        {/* body */}
        <rect x="28" y="64" width="44" height="40" rx="6" />
        {/* chest dot */}
        <circle cx="50" cy="84" r="3" fill="currentColor" stroke="none" />
        {/* arms */}
        <line className="arm-wave" x1="38" y1="60" x2="20" y2="86" />
        <line x1="62" y1="60" x2="80" y2="86" />
        <circle cx="20" cy="86" r="3" fill="currentColor" stroke="none" />
        <circle cx="80" cy="86" r="3" fill="currentColor" stroke="none" />
        {/* legs */}
        <rect x="36" y="104" width="10" height="24" rx="2" />
        <rect x="54" y="104" width="10" height="24" rx="2" />
      </svg>
      <style>{`
        .line-bot-wrap { animation: linePeek 1.4s 1s cubic-bezier(0.16,1,0.3,1) backwards; }
        @keyframes linePeek {
          0% { transform: translate(60px, 50px) rotate(12deg); opacity: 0; }
          100% { transform: translate(0,0) rotate(0deg); opacity: 1; }
        }
        .bot { animation: lineFloat 4.5s ease-in-out 2.4s infinite alternate; transform-origin: center; }
        @keyframes lineFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
        .blink { animation: lineBlink 3.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes lineBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .arm-wave { transform-origin: 38px 60px; animation: lineWave 2.6s ease-in-out 2.4s infinite; }
        @keyframes lineWave {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(24deg); }
        }
        .antenna-tip { animation: lineAntenna 1.6s ease-in-out infinite alternate; transform-origin: center; transform-box: fill-box; }
        @keyframes lineAntenna {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .speech {
          position: absolute;
          right: 100%;
          margin-right: 12px;
          top: 26px;
          font-family: var(--font-mono), monospace;
          font-size: 10.5px;
          color: var(--color-accent-cyan);
          padding: 8px 12px;
          background: rgba(245, 224, 170, 0.04);
          border: 1px solid rgba(245, 224, 170, 0.25);
          border-radius: 10px;
          white-space: nowrap;
          animation: speechFloat 3.2s ease-in-out 2.6s infinite alternate;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .speech::after {
          content: "";
          position: absolute;
          right: -7px;
          top: 14px;
          width: 0;
          height: 0;
          border-left: 8px solid rgba(245, 224, 170, 0.25);
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
        }
        @keyframes speechFloat {
          0% { transform: translateY(0); opacity: 0.85; }
          100% { transform: translateY(-4px); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .line-bot-wrap, .bot, .blink, .arm-wave, .antenna-tip, .speech { animation: none !important; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
