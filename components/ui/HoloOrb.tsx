"use client";
import { useEffect, useRef } from "react";

export function HoloOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: PointerEvent) {
      const orb = orbRef.current;
      const eye = eyeRef.current;
      if (!orb || !eye) return;
      const rect = orb.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.min(8, Math.hypot(dx, dy) / 40);
      const angle = Math.atan2(dy, dx);
      eye.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
    }

    function onScroll() {
      const orb = orbRef.current;
      if (!orb) return;
      const max = window.innerHeight * 0.75;
      const fade = Math.max(0, 1 - window.scrollY / max);
      orb.style.opacity = String(fade);
      orb.style.pointerEvents = fade < 0.1 ? "none" : "auto";
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={orbRef}
      aria-hidden
      className="hidden md:block absolute top-24 right-10 lg:right-16 z-20 pointer-events-none"
    >
      <div className="relative w-[110px] h-[110px] holo-wrap">
        <div className="absolute inset-0 rounded-full border border-dashed border-[var(--color-accent-cyan)]/35 holo-ring" />
        <div className="absolute inset-[10px] rounded-full holo-orb" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[34px] h-[34px] rounded-full bg-[var(--color-bg)] ring-2 ring-[var(--color-accent-cyan)]/60 overflow-hidden">
            <div
              ref={eyeRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-[var(--color-accent)]"
              style={{ boxShadow: "0 0 12px var(--color-accent)", willChange: "transform" }}
            />
          </div>
        </div>
      </div>
      <style>{`
        .holo-orb {
          background: radial-gradient(circle at 30% 30%, #fff 0%, var(--color-accent-cyan) 30%, var(--color-accent-violet) 70%, var(--color-bg) 100%);
          box-shadow: 0 0 40px rgba(108,207,255,0.55), 0 0 70px rgba(167,139,250,0.35);
          animation: holoFloat 3.6s ease-in-out infinite alternate, holoHue 9s linear infinite;
        }
        .holo-ring {
          animation: holoSpin 14s linear infinite;
        }
        @keyframes holoFloat {
          0% { transform: translateY(-6px) scale(1); }
          100% { transform: translateY(6px) scale(1.04); }
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
