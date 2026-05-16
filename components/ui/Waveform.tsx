"use client";

const BARS = 28;
const SEED = Array.from({ length: BARS }, (_, i) => 0.35 + Math.abs(Math.sin(i * 0.7)) * 0.55);

export function Waveform({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`relative flex items-end justify-start gap-[3px] h-12 mt-6 opacity-70 ${className}`}
    >
      {SEED.map((h, i) => (
        <span
          key={i}
          className="block w-[3px] rounded-full bg-gradient-to-t from-[var(--color-accent-cyan)] via-[var(--color-accent)] to-[var(--color-accent-violet)]"
          style={{
            height: `${Math.max(8, h * 100)}%`,
            animation: `wave ${1.2 + (i % 5) * 0.18}s ease-in-out ${i * 0.04}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0% { transform: scaleY(0.35); }
          100% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden] span { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
