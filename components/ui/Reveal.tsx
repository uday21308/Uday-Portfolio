"use client";
import { motion, type MotionProps } from "motion/react";

export type RevealVariant = "slide-left" | "slide-right" | "lift" | "bloom" | "mask";

type Props = {
  children: React.ReactNode;
  delay?: number;
  /** Named motion preset. Defaults to slide-left. */
  variant?: RevealVariant;
  /** When true (default), animation replays on each scroll into view. When false, plays once. */
  replay?: boolean;
  /** Override X offset (px). Takes precedence over variant. */
  x?: number;
  /** Override Y offset (px). Takes precedence over variant. */
  y?: number;
  /** Override starting scale. Takes precedence over variant. */
  scale?: number;
  className?: string;
} & Omit<MotionProps, "children">;

const VARIANT_INITIAL: Record<RevealVariant, { x?: number; y?: number; scale?: number; clipPath?: string }> = {
  "slide-left":  { x: -40, scale: 0.94 },
  "slide-right": { x:  40, scale: 0.94 },
  "lift":        { y:  40, scale: 0.96 },
  "bloom":       { scale: 0.85 },
  "mask":        { clipPath: "inset(0 100% 0 0)" },
};

export function Reveal({
  children,
  delay = 0,
  variant = "slide-left",
  replay = true,
  x,
  y,
  scale,
  className,
  ...rest
}: Props) {
  const base = VARIANT_INITIAL[variant];
  const initial = {
    opacity: 0,
    x: x ?? base.x ?? 0,
    y: y ?? base.y ?? 0,
    scale: scale ?? base.scale ?? 1,
    ...(base.clipPath ? { clipPath: base.clipPath } : {}),
  };
  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    ...(base.clipPath ? { clipPath: "inset(0 0 0 0)" } : {}),
  };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: !replay, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
