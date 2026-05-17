import { describe, it, expect } from "vitest";
import { embed, EMBED_DIM } from "./embedder";

describe("embedder", () => {
  it("returns a vector of EMBED_DIM length", { timeout: 60_000 }, async () => {
    const v = await embed("hello world");
    expect(v).toHaveLength(EMBED_DIM);
    expect(v.every((x) => typeof x === "number" && Number.isFinite(x))).toBe(true);
  });

  it("similar texts have higher cosine than dissimilar", { timeout: 60_000 }, async () => {
    const [a, b, c] = await Promise.all([
      embed("retrieval augmented generation"),
      embed("RAG pipelines for question answering"),
      embed("banana smoothie recipe"),
    ]);
    const cos = (x: number[], y: number[]) => {
      const d = x.reduce((s, v, i) => s + v * y[i], 0);
      const m = Math.sqrt(x.reduce((s, v) => s + v * v, 0)) *
                Math.sqrt(y.reduce((s, v) => s + v * v, 0));
      return d / m;
    };
    expect(cos(a, b)).toBeGreaterThan(cos(a, c));
  });
});
