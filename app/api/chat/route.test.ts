import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/rag/retriever", () => ({
  Retriever: {
    load: vi.fn().mockResolvedValue({
      topK: () => [{ id: "x", text: "stub", source: "faq", title: "t", tier: "primary", type: "faq", vector: [], score: 0.9 }],
    }),
  },
}));
vi.mock("@/lib/rag/embedder", () => ({ embed: vi.fn().mockResolvedValue([1, 0, 0]) }));
vi.mock("@/lib/ai/groq", () => ({
  DEFAULT_MODEL: "llama-3.3-70b-versatile",
  streamChat: vi.fn(async (_msgs, opts) => {
    opts?.onToken?.("Hello ");
    opts?.onToken?.("Uday");
    opts?.onUsage?.({ promptTokens: 100, completionTokens: 20, totalTokens: 120, cost: 0.0001, model: "llama-3.3-70b-versatile" });
    return "Hello Uday";
  }),
}));
vi.mock("@/lib/redis", () => ({
  loadHistory: vi.fn().mockResolvedValue([]),
  appendExchange: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/ratelimit", () => ({
  chatLimiter: { limit: vi.fn().mockResolvedValue({ success: true }) },
  ipFromRequest: vi.fn().mockReturnValue("127.0.0.1"),
}));
vi.mock("node:fs/promises", async () => ({
  readFile: vi.fn().mockResolvedValue("PERSONA"),
}));

import { POST } from "./route";

describe("POST /api/chat", () => {
  beforeEach(() => vi.clearAllMocks());

  it("streams SSE chunks and a final usage event", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: "uday_ai_session=abcdefghijklmnopqrstu" },
      body: JSON.stringify({ message: "what is RAG?" }),
    });
    const res = await POST(req);
    expect(res.headers.get("content-type")).toMatch(/text\/event-stream/);
    const text = await res.text();
    expect(text).toContain("Hello");
    expect(text).toContain("Uday");
    expect(text).toContain("usage");
    expect(text).toContain("cost");
  });

  it("returns 429 when rate-limited", async () => {
    const { chatLimiter } = await import("@/lib/ratelimit");
    (chatLimiter.limit as any).mockResolvedValueOnce({ success: false });
    const req = new Request("http://localhost/api/chat", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "hi" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("returns 400 for empty messages", async () => {
    const req = new Request("http://localhost/api/chat", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
