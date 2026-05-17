import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/rag/retriever", () => ({
  Retriever: {
    load: vi.fn().mockResolvedValue({
      // The retriever exposes chunks via a hidden field — list_projects uses it
      chunks: [
        { id: "h1", text: "Healthcare RAG content...", source: "github:Healthcare-RAG-Assistant", title: "Healthcare-RAG-Assistant", tier: "primary", type: "project", vector: [] },
        { id: "v1", text: "Voice bot content...", source: "github:Ecommerce-AI-voice-text-Assistant", title: "Voice bot", tier: "primary", type: "project", vector: [] },
        { id: "f1", text: "Fruit content...", source: "github:FruitFreshnessDetection", title: "Fruit", tier: "secondary", type: "project", vector: [] },
        { id: "x1", text: "Extra content...", source: "extra:code-aware-rag", title: "Code-Aware RAG", tier: "primary", type: "project", vector: [] },
        { id: "faq1", text: "Q: hi\nA: hello", source: "faq", title: "hi", tier: "primary", type: "faq", vector: [] },
      ],
      topK: vi.fn(() => [
        { id: "x", text: "stub answer context", source: "github:Healthcare-RAG-Assistant", title: "Healthcare-RAG-Assistant — Overview", tier: "primary", type: "project", vector: [], score: 0.9 },
      ]),
    }),
  },
}));
vi.mock("@/lib/rag/embedder-api", () => ({ embed: vi.fn().mockResolvedValue([1, 0, 0]) }));
vi.mock("@/lib/ai/groq", () => ({
  DEFAULT_MODEL: "llama-3.3-70b-versatile",
  streamChat: vi.fn(async () => "answer text"),
  chatJSON: vi.fn().mockResolvedValue({
    data: { fitScore: 7, strengths: ["a", "b", "c"], tailoredBullets: ["x", "y", "z"], coverParagraph: "p" },
    usage: { promptTokens: 50, completionTokens: 20, cost: 0.0001, model: "llama-3.3-70b-versatile" },
  }),
}));
vi.mock("node:fs/promises", () => ({ readFile: vi.fn().mockResolvedValue("PERSONA") }));

import { tools } from "./server";

describe("MCP tools", () => {
  it("ask_uday returns answer + sources", async () => {
    const out = await tools.ask_uday({ question: "what is RAG?" });
    expect(out.answer).toContain("answer");
    expect(out.sources.length).toBeGreaterThan(0);
    expect(out.sources[0]).toHaveProperty("title");
    expect(out.sources[0]).toHaveProperty("source");
  });

  it("list_projects returns deduped project list with tier+summary", async () => {
    const out = await tools.list_projects({});
    expect(Array.isArray(out.projects)).toBe(true);
    expect(out.projects.length).toBeGreaterThan(0);
    // Should NOT include FAQ entries (those aren't projects)
    const names = out.projects.map((p) => p.name);
    expect(names.some((n) => n.includes("Healthcare-RAG"))).toBe(true);
    expect(names.some((n) => n.includes("Code-Aware"))).toBe(true);
    expect(names.includes("faq")).toBe(false);
    // Each entry has shape
    expect(out.projects[0]).toHaveProperty("name");
    expect(out.projects[0]).toHaveProperty("tier");
    expect(out.projects[0]).toHaveProperty("summary");
  });

  it("match_jd returns structured analysis", async () => {
    const out = await tools.match_jd({ jd: "x".repeat(50) });
    expect(out.fitScore).toBe(7);
    expect(out.strengths).toHaveLength(3);
    expect(out.tailoredBullets).toHaveLength(3);
  });
});
