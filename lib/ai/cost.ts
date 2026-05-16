export const PRICING: Record<string, { input: number; output: number }> = {
  "llama-3.3-70b-versatile": { input: 0.59, output: 0.79 },
  "llama-3.1-8b-instant": { input: 0.05, output: 0.08 },
};

export function calcCost(model: string, promptTokens: number, completionTokens: number): number {
  const p = PRICING[model];
  if (!p) return 0;
  return (promptTokens * p.input + completionTokens * p.output) / 1_000_000;
}
