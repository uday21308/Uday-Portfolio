"use client";
import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type Props = {
  text: string;
  className?: string;
};

type Token = { text: string; italic: boolean };

const ITALIC_VARIATION: CSSProperties = {
  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
};

function parseTokens(input: string): Token[] {
  const segments: Token[] = [];
  const regex = /\*([^*]+)\*|([^*]+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(input)) !== null) {
    if (m[1] !== undefined) segments.push({ text: m[1], italic: true });
    else if (m[2] !== undefined) segments.push({ text: m[2], italic: false });
  }
  const tokens: Token[] = [];
  for (const seg of segments) {
    const parts = seg.text.split(/\s+/).filter((w) => w.length > 0);
    for (const w of parts) tokens.push({ text: w, italic: seg.italic });
  }
  return tokens;
}

function LitWord({
  token,
  progress,
  index,
  total,
}: {
  token: Token;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const start = index / total;
  const end = Math.min(start + 1 / total + 0.05, 1);
  const opacity = useTransform(progress, [start, end], [0.22, 1]);

  if (token.italic) {
    return (
      <motion.em
        className="sl-word font-[family-name:var(--font-serif)] italic font-medium text-[var(--color-accent)]"
        style={{ opacity, display: "inline-block", marginRight: "0.25em", ...ITALIC_VARIATION }}
      >
        {token.text}
      </motion.em>
    );
  }
  return (
    <motion.span
      className="sl-word"
      style={{ opacity, display: "inline-block", marginRight: "0.25em" }}
    >
      {token.text}
    </motion.span>
  );
}

export function ScrollLitParagraph({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const tokens = parseTokens(text);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  return (
    <p ref={ref} className={className}>
      {tokens.map((t, i) => (
        <LitWord key={i} token={t} progress={scrollYProgress} index={i} total={tokens.length} />
      ))}
    </p>
  );
}
