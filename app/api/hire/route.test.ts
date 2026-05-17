import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/rag/retriever", () => ({
  Retriever: { load: vi.fn().mockResolvedValue({ topK: () => [] }) },
}));
vi.mock("@/lib/rag/embedder", () => ({ embed: vi.fn().mockResolvedValue([1, 0, 0]) }));
vi.mock("@/lib/ai/groq", () => ({
  DEFAULT_MODEL: "llama-3.3-70b-versatile",
  chatJSON: vi.fn().mockResolvedValue({
    data: { fitScore: 8, strengths: ["a", "b", "c"], tailoredBullets: ["x", "y", "z"], coverParagraph: "p" },
    usage: { promptTokens: 100, completionTokens: 50, cost: 0.0001, model: "llama-3.3-70b-versatile" },
  }),
}));
vi.mock("@/lib/ratelimit", () => ({
  hireLimiter: { limit: vi.fn().mockResolvedValue({ success: true }) },
  ipFromRequest: vi.fn().mockReturnValue("127.0.0.1"),
}));
vi.mock("node:fs/promises", () => ({ readFile: vi.fn().mockResolvedValue("PERSONA") }));

import { POST } from "./route";

describe("POST /api/hire", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns structured fit analysis", async () => {
    const req = new Request("http://localhost/api/hire", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ jd: "We need a RAG engineer with production experience", company: "Acme", role: "Sr AI Engineer" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.fitScore).toBe(8);
    expect(body.strengths).toHaveLength(3);
    expect(body.tailoredBullets).toHaveLength(3);
    expect(body.usage).toBeDefined();
  });

  it("400 on empty JD", async () => {
    const req = new Request("http://localhost/api/hire", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ jd: "" }),
    });
    expect((await POST(req)).status).toBe(400);
  });

  it("429 when rate-limited", async () => {
    const { hireLimiter } = await import("@/lib/ratelimit");
    (hireLimiter.limit as any).mockResolvedValueOnce({ success: false });
    const req = new Request("http://localhost/api/hire", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ jd: "x".repeat(40) }),
    });
    expect((await POST(req)).status).toBe(429);
  });
});
