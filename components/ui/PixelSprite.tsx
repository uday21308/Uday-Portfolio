"use client";
import { useEffect, useRef, useState } from "react";

const DISMISS_KEY = "uk-sprite-dismissed";

export function PixelSprite() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only sessionStorage read; useSyncExternalStore is overkill here
      setDismissed(true);
      return;
    }

    function compute() {
      const y = window.scrollY;
      const h = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      // hide during hero (first viewport) and during last 600px (contact)
      const afterHero = y > h * 0.7;
      const beforeContact = y < docH - h - 600;
      setVisible(afterHero && beforeContact);
    }
    compute();
    function onScroll() {
      if (tickRef.current !== null) return;
      tickRef.current = window.requestAnimationFrame(() => {
        tickRef.current = null;
        compute();
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (tickRef.current !== null) window.cancelAnimationFrame(tickRef.current);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div
      aria-hidden
      className={`hidden md:block pointer-events-none fixed left-0 right-0 bottom-6 z-40 h-[60px] overflow-hidden transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss mascot"
        className="pointer-events-auto absolute left-0 bottom-0 sprite-walk"
        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
      >
        <div className="sprite">
          <div className="ant" />
          <div className="body">
            <div className="eye eye-l" />
            <div className="eye eye-r" />
            <div className="mouth" />
          </div>
          <div className="legs">
            <span />
            <span />
          </div>
        </div>
      </button>
      <style>{`
        .sprite-walk {
          animation: spriteWalk 22s linear infinite;
          will-change: transform;
        }
        @keyframes spriteWalk {
          0%   { transform: translateX(20px); }
          45%  { transform: translateX(calc(100vw - 100px)); }
          50%  { transform: translateX(calc(100vw - 100px)) scaleX(-1); }
          95%  { transform: translateX(20px) scaleX(-1); }
          100% { transform: translateX(20px); }
        }
        .sprite {
          position: relative;
          width: 56px;
          image-rendering: pixelated;
        }
        .ant {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 10px;
          background: var(--color-accent-cyan);
          border-radius: 0 0 2px 2px;
          box-shadow: 0 0 8px var(--color-accent-cyan);
        }
        .body {
          width: 44px;
          height: 38px;
          margin: 0 auto;
          background: var(--color-accent);
          border-radius: 6px 6px 4px 4px;
          position: relative;
          box-shadow: 4px 4px 0 0 #b8985680 inset;
        }
        .eye {
          position: absolute;
          top: 11px;
          width: 8px;
          height: 8px;
          background: var(--color-bg);
          border-radius: 1px;
          animation: blink 5s ease-in-out infinite;
        }
        .eye-l { left: 8px; }
        .eye-r { right: 8px; }
        @keyframes blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .mouth {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 3px;
          background: var(--color-bg);
          border-radius: 0 0 4px 4px;
        }
        .legs {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-top: 2px;
        }
        .legs span {
          width: 8px;
          height: 10px;
          background: var(--color-accent);
          box-shadow: 0 4px 0 0 #b8985680 inset;
          animation: step 0.45s steps(2) infinite alternate;
        }
        .legs span:nth-child(2) { animation-delay: 0.22s; }
        @keyframes step {
          0% { transform: translateY(0); }
          100% { transform: translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sprite-walk, .legs span, .eye { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
