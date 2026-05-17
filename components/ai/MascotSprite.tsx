"use client";

type Props = {
  /** Scale factor. 1 = 18px wide (matches navbar sprite). 2 = 36px. */
  scale?: number;
};

/**
 * Static pixel-art mascot used in the AI widget — same character as the
 * walking sprite in the navbar (components/ui/HeaderSprite), minus the
 * walk-across animation. Keeps the subtle blink so it feels alive.
 */
export function MascotSprite({ scale = 1 }: Props) {
  const w = 18 * scale;
  const h = 18 * scale;
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: w,
        height: h,
        position: "relative",
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "bottom center",
          width: 18,
        }}
      >
        <span className="ms-ant" />
        <div className="ms-body">
          <span className="ms-eye ms-eye-l" />
          <span className="ms-eye ms-eye-r" />
        </div>
        <div className="ms-legs">
          <span />
          <span />
        </div>
      </span>
      <style>{`
        .ms-ant {
          display: block;
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
        .ms-body {
          width: 14px;
          height: 12px;
          margin: 0 auto;
          background: var(--color-accent);
          border-radius: 2px 2px 1px 1px;
          position: relative;
          box-shadow: 1px 1px 0 0 #b8985680 inset;
        }
        .ms-eye {
          position: absolute;
          top: 3px;
          width: 3px;
          height: 3px;
          background: var(--color-bg);
          border-radius: 1px;
          animation: msBlink 4.2s ease-in-out infinite;
        }
        .ms-eye-l { left: 2px; }
        .ms-eye-r { right: 2px; }
        .ms-legs {
          display: flex;
          gap: 2px;
          justify-content: center;
          margin-top: 1px;
        }
        .ms-legs span {
          width: 3px;
          height: 4px;
          background: var(--color-accent);
          box-shadow: 0 1px 0 0 #b8985680 inset;
        }
        @keyframes msBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ms-eye { animation: none !important; }
        }
      `}</style>
    </span>
  );
}
