import { describe, it, expect } from "vitest";
import { chunk } from "./chunker";

describe("chunker", () => {
  it("splits on h1/h2/h3 markdown headings", () => {
    const md = `# A\nalpha\n## B\nbeta\n### C\ngamma`;
    const out = chunk(md);
    expect(out.map((c) => c.title)).toEqual(["A", "B", "C"]);
  });

  it("splits on # DOCUMENT markers", () => {
    const md = `# DOCUMENT 1: HELLO\nhi\n# DOCUMENT 2: WORLD\nbye`;
    const out = chunk(md);
    expect(out).toHaveLength(2);
    expect(out[0].title).toBe("HELLO");
    expect(out[1].title).toBe("WORLD");
  });

  it("preserves body text within a section", () => {
    const md = `# Section\nfirst line\nsecond line`;
    const out = chunk(md);
    expect(out[0].text).toContain("first line");
    expect(out[0].text).toContain("second line");
  });

  it("splits long sections into overlapping windows", () => {
    const longBody = Array.from({ length: 400 }, (_, i) => `word${i}`).join(" ");
    const md = `# Long\n${longBody}`;
    const out = chunk(md, { maxWords: 200, overlapWords: 30 });
    expect(out.length).toBeGreaterThan(1);
    // overlap check: last 30 words of out[0] should appear at start of out[1]
    const tail = out[0].text.split(/\s+/).slice(-30).join(" ");
    expect(out[1].text.startsWith(tail)).toBe(true);
  });

  it("drops empty sections", () => {
    const md = `# Empty\n\n# Real\nbody`;
    const out = chunk(md);
    expect(out.map((c) => c.title)).toEqual(["Real"]);
  });
});
