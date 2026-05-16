import { describe, it, expect } from "vitest";
import { buildChatMessages, buildHireMessages } from "./prompts";

describe("buildChatMessages", () => {
  it("places persona first, then retrieved context, then memory, then user", () => {
    const msgs = buildChatMessages({
      persona: "PERSONA",
      retrieved: [{ title: "T", text: "BODY", source: "faq" } as any],
      memory: [{ role: "user", content: "prev-q" }, { role: "assistant", content: "prev-a" }],
      userMessage: "hello",
    });
    expect(msgs[0].role).toBe("system");
    expect(msgs[0].content).toContain("PERSONA");
    expect(msgs[0].content).toContain("BODY");
    expect(msgs[1]).toMatchObject({ role: "user", content: "prev-q" });
    expect(msgs[2]).toMatchObject({ role: "assistant", content: "prev-a" });
    expect(msgs[3]).toMatchObject({ role: "user", content: "hello" });
  });
});

describe("buildHireMessages", () => {
  it("includes role, company, and JD in the prompt", () => {
    const msgs = buildHireMessages({
      persona: "PERSONA",
      retrieved: [],
      jd: "We need a RAG engineer",
      company: "AcmeCo",
      role: "Senior AI Engineer",
    });
    const text = JSON.stringify(msgs);
    expect(text).toContain("AcmeCo");
    expect(text).toContain("Senior AI Engineer");
    expect(text).toContain("RAG engineer");
  });
});
