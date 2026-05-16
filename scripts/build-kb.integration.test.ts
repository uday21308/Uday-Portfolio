import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

describe("build-kb (integration)", { timeout: 180_000 }, () => {
  it("produces embeddings.json with all expected sources", () => {
    execSync("npm run build:kb", { stdio: "inherit" });

    const root = path.resolve(__dirname, "..");
    const emb = path.join(root, "data", "embeddings.json");
    const man = path.join(root, "data", "manifest.json");
    expect(existsSync(emb)).toBe(true);
    expect(existsSync(man)).toBe(true);

    const chunks = JSON.parse(readFileSync(emb, "utf8"));
    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBeGreaterThan(40);

    const sources = new Set(chunks.map((c: any) => c.source));
    expect(sources.has("resume")).toBe(true);
    expect(sources.has("linkedin")).toBe(true);
    expect(sources.has("faq")).toBe(true);
    expect([...sources].some((s) => String(s).startsWith("github:"))).toBe(true);
    expect([...sources].some((s) => String(s).startsWith("extra:"))).toBe(true);

    for (const c of chunks) {
      expect(c.vector).toHaveLength(384);
      expect(typeof c.text).toBe("string");
      expect(typeof c.title).toBe("string");
    }
  });
});
