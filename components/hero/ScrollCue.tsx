export function ScrollCue() {
  return (
    <p
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 bottom-5 z-30 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase text-[var(--color-accent-cyan)] opacity-60 animate-pulse"
    >
      Scroll ↓
    </p>
  );
}
