"use client";

export function HeaderSprite() {
  return (
    <div
      aria-hidden
      className="hidden md:block absolute inset-x-0 bottom-0 h-full pointer-events-none overflow-hidden"
    >
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
      <style>{`
        .sprite-track {
          position: absolute;
          left: 0;
          bottom: 0;
          animation: spriteRun 22s ease-in-out infinite;
          will-change: transform;
          z-index: 0;
        }
        @keyframes spriteRun {
          0%   { transform: translateX(8px) scaleX(1); }
          8%   { transform: translateX(8px) scaleX(1); }                   /* peek-pause left */
          47%  { transform: translateX(calc(100vw - 36px)) scaleX(1); }
          52%  { transform: translateX(calc(100vw - 36px)) scaleX(-1); }   /* turn */
          60%  { transform: translateX(calc(100vw - 36px)) scaleX(-1); }   /* peek-pause right */
          97%  { transform: translateX(8px) scaleX(-1); }
          100% { transform: translateX(8px) scaleX(1); }                   /* turn back */
        }
        .sprite {
          position: relative;
          width: 28px;
          image-rendering: pixelated;
        }
        .sprite .ant {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 6px;
          background: var(--color-accent-cyan);
          border-radius: 0 0 1px 1px;
          box-shadow: 0 0 5px var(--color-accent-cyan);
        }
        .sprite .body {
          width: 22px;
          height: 19px;
          margin: 0 auto;
          background: var(--color-accent);
          border-radius: 3px 3px 2px 2px;
          position: relative;
          box-shadow: 2px 2px 0 0 #b8985680 inset;
        }
        .sprite .eye {
          position: absolute;
          top: 5px;
          width: 4px;
          height: 4px;
          background: var(--color-bg);
          border-radius: 1px;
          animation: spriteBlink 4.2s ease-in-out infinite;
        }
        .sprite .eye-l { left: 4px; }
        .sprite .eye-r { right: 4px; }
        @keyframes spriteBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .sprite .legs {
          display: flex;
          gap: 3px;
          justify-content: center;
          margin-top: 1px;
        }
        .sprite .legs span {
          width: 4px;
          height: 5px;
          background: var(--color-accent);
          box-shadow: 0 2px 0 0 #b8985680 inset;
          animation: spriteStep 0.35s steps(2) infinite alternate;
        }
        .sprite .legs span:nth-child(2) { animation-delay: 0.17s; }
        @keyframes spriteStep {
          0% { transform: translateY(0); }
          100% { transform: translateY(-2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sprite-track, .sprite .legs span, .sprite .eye { animation: none !important; }
          .sprite-track { transform: translateX(8px) !important; }
        }
      `}</style>
    </div>
  );
}
