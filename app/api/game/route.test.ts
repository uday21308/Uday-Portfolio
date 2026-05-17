import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/groq", () => ({
  DEFAULT_MODEL: "llama-3.3-70b-versatile",
  chatJSON: vi.fn(),
}));
vi.mock("@/lib/ratelimit", () => ({
  chatLimiter: { limit: vi.fn().mockResolvedValue({ success: true }) },
  ipFromRequest: vi.fn().mockReturnValue("127.0.0.1"),
}));

import { POST } from "./route";
import { chatJSON } from "@/lib/ai/groq";

describe("POST /api/game", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects repeat words without calling the model", async () => {
    const req = new Request("http://localhost/api/game", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ history: ["transformer", "attention", "embedding"], userWord: "transformer" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.valid).toBe(false);
    expect(body.reason).toMatch(/repeat/i);
    expect(chatJSON).not.toHaveBeenCalled();
  });

  it("accepts valid AI-related word + returns next bot word", async () => {
    (chatJSON as any).mockResolvedValueOnce({
      data: { valid: true, nextWord: "tokenizer", reaction: "Nice." },
      usage: {},
    });
    const req = new Request("http://localhost/api/game", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ history: ["transformer"], userWord: "attention" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(body.valid).toBe(true);
    expect(body.nextWord).toBe("tokenizer");
  });
});
