import { describe, it, expect } from "vitest";
import { Retriever } from "./retriever";
import type { StoredChunk } from "./retriever";

function fakeChunk(id: string, vector: number[], extra: Partial<StoredChunk> = {}): StoredChunk {
  return {
    id, text: `text-${id}`, vector, source: "test",
    type: "faq", tier: "primary", title: `title-${id}`,
    ...extra,
  };
}

describe("Retriever", () => {
  const chunks = [
    fakeChunk("a", [1, 0, 0]),
    fakeChunk("b", [0.9, 0.1, 0]),
    fakeChunk("c", [0, 1, 0], { tier: "secondary" }),
    fakeChunk("d", [0, 0, 1]),
  ];
  const r = new Retriever(chunks);

  it("returns top-K by cosine similarity", () => {
    const out = r.topK([1, 0, 0], 2);
    expect(out.map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("returns scores in descending order", () => {
    const out = r.topK([1, 0, 0], 4);
    const scores = out.map((c) => c.score);
    expect(scores).toEqual([...scores].sort((x, y) => y - x));
  });

  it("filters by tier when requested", () => {
    const out = r.topK([0, 1, 0], 4, { tier: "primary" });
    expect(out.every((c) => c.tier === "primary")).toBe(true);
  });

  it("returns empty array for K=0", () => {
    expect(r.topK([1, 0, 0], 0)).toEqual([]);
  });
});
