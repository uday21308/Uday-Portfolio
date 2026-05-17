type Props = { cost: number; totalTokens: number; latencyMs: number; model: string };

export function CostLine({ cost, totalTokens, latencyMs, model }: Props) {
  if (cost === 0 && totalTokens === 0) return null;
  return (
    <div
      data-testid="cost-line"
      title="I show this because knowing what an AI call costs is half the job."
      className="mt-1.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-fg-muted)] opacity-60 tracking-tight"
    >
      ─ ${cost.toFixed(6)} · {totalTokens} tok · {latencyMs} ms · {model} ─
    </div>
  );
}
