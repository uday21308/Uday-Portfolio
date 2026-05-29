"use client";
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees on each axis. */
  maxTilt?: number;
  /** Must visually match the child's outer border radius. */
  radius?: string;
  /** Conic gradient color stops for the always-on rotating border. */
  borderGradient?: string;
  /** Seconds for one full border rotation. */
  spinSeconds?: number;
};

export function TiltCard({
  children,
  className,
  maxTilt = 6,
  radius = "0.75rem",
  borderGradient = "rgba(167,139,250,0.55) 0%, rgba(108,207,255,0.55) 33%, rgba(245,224,170,0.45) 66%, rgba(167,139,250,0.55) 100%",
  spinSeconds = 6,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--tx", `${(0.5 - py) * 2 * maxTilt}deg`);
    el.style.setProperty("--ty", `${(px - 0.5) * 2 * maxTilt}deg`);
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0deg");
    el.style.setProperty("--ty", "0deg");
  }

  const style = {
    "--uk-radius": radius,
    "--uk-spin": `${spinSeconds}s`,
    "--uk-border-grad": borderGradient,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={clsx("uk-tilt", className)}
      style={style}
    >
      <div className="uk-tilt-inner">
        <span className="uk-tilt-border" aria-hidden>
          <span className="uk-tilt-border-spin" />
        </span>
        <span className="uk-tilt-wash" aria-hidden />
        {children}
      </div>
      <style>{`
        .uk-tilt {
          position: relative;
          perspective: 900px;
          height: 100%;
        }
        .uk-tilt-inner {
          position: relative;
          height: 100%;
          transform: rotateX(var(--tx, 0deg)) rotateY(var(--ty, 0deg));
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          transform-style: preserve-3d;
          will-change: transform;
        }
        .uk-tilt:hover .uk-tilt-inner {
          transition: transform 0.08s linear;
        }
        .uk-tilt-border,
        .uk-tilt-wash {
          position: absolute;
          inset: 0;
          border-radius: var(--uk-radius);
          pointer-events: none;
        }
        .uk-tilt-border {
          padding: 1px;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          overflow: hidden;
        }
        .uk-tilt-border-spin {
          position: absolute;
          inset: -50%;
          background: conic-gradient(from 0deg, var(--uk-border-grad));
          animation: uk-tilt-spin var(--uk-spin) linear infinite;
          will-change: transform;
        }
        @keyframes uk-tilt-spin { to { transform: rotate(360deg); } }
        .uk-tilt-wash {
          background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(108,207,255,0.10), transparent 55%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .uk-tilt:hover .uk-tilt-wash { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .uk-tilt-inner { transform: none !important; transition: none !important; }
          .uk-tilt-border-spin { animation: none; }
          .uk-tilt-wash { display: none; }
        }
      `}</style>
    </div>
  );
}
