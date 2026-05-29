"use client";
import { useEffect, useRef, type AnchorHTMLAttributes, type ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  /** Pixel radius within which the cursor "pulls" the link. */
  radius?: number;
  /** How strongly the link drifts toward the cursor (0..1). */
  pull?: number;
};

/**
 * Wraps an <a> in a span that translates toward the cursor when nearby.
 * The transform lives on the wrapper so the anchor's own transitions
 * (e.g. transition-colors, hover bg) are not clobbered.
 */
export function MagneticLink({
  children,
  radius = 90,
  pull = 0.22,
  ...anchorProps
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;
    let lastE: PointerEvent | null = null;
    function process() {
      if (!el || !lastE) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = lastE.clientX - cx;
      const dy = lastE.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        const f = (radius - dist) / radius;
        el.style.transform = `translate(${dx * f * pull}px, ${dy * f * pull}px)`;
      } else if (el.style.transform) {
        el.style.transform = "";
      }
    }
    function onMove(e: PointerEvent) {
      lastE = e;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(process);
    }
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
    };
  }, [radius, pull]);

  return (
    <span
      ref={wrapRef}
      className="inline-block"
      style={{
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
      }}
    >
      <a {...anchorProps}>{children}</a>
    </span>
  );
}
