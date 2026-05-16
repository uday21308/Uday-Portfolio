"use client";

export function HeaderSprite() {
  return (
    <div
      aria-hidden
      className="hidden md:block absolute inset-x-0 bottom-0 h-full pointer-events-none overflow-hidden"
    >
      <div className="sprite-wrap">
        <div className="sprite-track">
          <div className="sprite">
            <span className="ant" />
            <div className="body">
              <span className="eye eye-l" />
              <span className="eye eye-r" />
            </div>
            <div className="legs">
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .sprite-wrap {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 2px;
          height: 22px;
          z-index: 0;
        }
        .sprite-track {
          position: absolute;
          left: 0;
          bottom: 0;
          animation: spriteRun 45s linear infinite;
          will-change: transform;
        }
        @keyframes spriteRun {
          0%   { transform: translateX(8px) scaleX(1); }
          48%  { transform: translateX(calc(100vw - 26px)) scaleX(1); }
          50%  { transform: translateX(calc(100vw - 26px)) scaleX(-1); }
          98%  { transform: translateX(8px) scaleX(-1); }
          100% { transform: translateX(8px) scaleX(1); }
        }
        .sprite {
          position: relative;
          width: 18px;
          image-rendering: pixelated;
        }
        .sprite .ant {
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 4px;
          background: var(--color-accent-cyan);
          border-radius: 0 0 1px 1px;
          box-shadow: 0 0 4px var(--color-accent-cyan);
        }
        .sprite .body {
          width: 14px;
          height: 12px;
          margin: 0 auto;
          background: var(--color-accent);
          border-radius: 2px 2px 1px 1px;
          position: relative;
          box-shadow: 1px 1px 0 0 #b8985680 inset;
        }
        .sprite .eye {
          position: absolute;
          top: 3px;
          width: 3px;
          height: 3px;
          background: var(--color-bg);
          border-radius: 1px;
          animation: spriteBlink 4.2s ease-in-out infinite;
        }
        .sprite .eye-l { left: 2px; }
        .sprite .eye-r { right: 2px; }
        @keyframes spriteBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .sprite .legs {
          display: flex;
          gap: 2px;
          justify-content: center;
          margin-top: 1px;
        }
        .sprite .legs span {
          width: 3px;
          height: 4px;
          background: var(--color-accent);
          box-shadow: 0 1px 0 0 #b8985680 inset;
          animation: spriteStep 0.35s steps(2) infinite alternate;
        }
        .sprite .legs span:nth-child(2) { animation-delay: 0.17s; }
        @keyframes spriteStep {
          0% { transform: translateY(0); }
          100% { transform: translateY(-1.5px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sprite-track, .sprite .legs span, .sprite .eye { animation: none !important; }
          .sprite-track { transform: translateX(8px) !important; }
        }
      `}</style>
    </div>
  );
}
