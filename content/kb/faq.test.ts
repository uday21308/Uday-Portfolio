import { describe, it, expect } from "vitest";
import { faq } from "./faq";

describe("faq", () => {
  it("has at least 15 entries", () => {
    expect(faq.length).toBeGreaterThanOrEqual(15);
  });
  it("every entry has a non-empty question and answer", () => {
    for (const item of faq) {
      expect(item.q.trim().length).toBeGreaterThan(0);
      expect(item.a.trim().length).toBeGreaterThan(0);
    }
  });
  it("covers off-limits deflections", () => {
    const qs = faq.map((f) => f.q.toLowerCase()).join("|");
    expect(qs).toContain("salary");
    expect(qs).toContain("notice");
    expect(qs).toContain("visa");
  });
});
