"use client";
import { useEffect, useRef, useState } from "react";

const DISMISS_KEY = "uk-orb-dismissed";

export function HoloOrb() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only sessionStorage read
      setDismissed(true);
      return;
    }

    function compute() {
      const y = window.scrollY;
      const h = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const afterHero = y > h * 0.7;
      const beforeContact = y < docH - h - 500;
      setVisible(afterHero && beforeContact);
    }

    function onMove(e: PointerEvent) {
      const wrap = wrapRef.current;
      const eye = eyeRef.current;
      if (!wrap || !eye) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.min(8, Math.hypot(dx, dy) / 35);
      const angle = Math.atan2(dy, dx);
      eye.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    }

    function onScroll() {
      if (tickRef.current !== null) return;
      tickRef.current = window.requestAnimationFrame(() => {
        tickRef.current = null;
        compute();
      });
    }

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      window.removeEventListener("pointermove", onMove);
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
      ref={wrapRef}
      aria-hidden
      className={`hidden md:block fixed right-6 bottom-6 z-40 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss assistant"
        className="block cursor-pointer p-0 border-0 bg-transparent"
      >
        <div className="relative w-[78px] h-[78px] holo-wrap">
          <div className="absolute inset-[-12px] rounded-full border border-dashed border-[var(--color-accent-cyan)]/35 holo-ring" />
          <div className="absolute inset-0 rounded-full holo-orb" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[26px] h-[26px] rounded-full bg-[var(--color-bg)] ring-2 ring-[var(--color-accent-cyan)]/70 overflow-hidden">
              <div
                ref={eyeRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-[var(--color-accent)]"
                style={{ boxShadow: "0 0 10px var(--color-accent)", willChange: "transform" }}
              />
            </div>
          </div>
        </div>
      </button>
      <style>{`
        .holo-orb {
          background: radial-gradient(circle at 30% 30%, #fff 0%, var(--color-accent-cyan) 30%, var(--color-accent-violet) 70%, var(--color-bg) 100%);
          box-shadow: 0 0 32px rgba(108,207,255,0.55), 0 0 60px rgba(167,139,250,0.32);
          animation: holoFloat 3.6s ease-in-out infinite alternate, holoHue 9s linear infinite;
        }
        .holo-ring { animation: holoSpin 14s linear infinite; }
        @keyframes holoFloat {
          0% { transform: translateY(-4px) scale(1); }
          100% { transform: translateY(4px) scale(1.04); }
        }
        @keyframes holoHue {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(35deg); }
        }
        @keyframes holoSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .holo-orb, .holo-ring { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
