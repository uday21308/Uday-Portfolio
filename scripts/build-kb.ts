import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { extractText, getDocumentProxy } from "unpdf";
import { chunk } from "../lib/rag/chunker";
import { embed } from "../lib/rag/embedder";
import { faq } from "../content/kb/faq";
import { projectsExtra } from "../content/kb/projects-extra";

const ROOT = path.resolve(__dirname, "..");
const GITHUB_USER = process.env.GITHUB_USER ?? "uday21308";

const FEATURED_REPOS = new Set([
  "Healthcare-RAG-Assistant",
  "Ecommerce-AI-voice-text-Assistant",
  "Expense-Tracker-MCP",
  "AI-Powered-Equity-Filings-Summarization-Risk-Insight-Agent",
]);
const SECONDARY_REPOS = new Set(["FruitFreshnessDetection"]);
const INCLUDED_REPOS = new Set([...FEATURED_REPOS, ...SECONDARY_REPOS]);

type OutputChunk = {
  id: string;
  text: string;
  vector: number[];
  source: string;
  type: "resume" | "project" | "faq" | "linkedin";
  tier: "primary" | "secondary";
  title: string;
};

function hashId(...parts: string[]) {
  return createHash("sha1").update(parts.join("|")).digest("hex").slice(0, 12);
}

async function parseResume(): Promise<{ text: string; title: string }[]> {
  const buf = readFileSync(path.join(ROOT, "public", "resume", "Uday_Kiran_Battula_AIML.pdf"));
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: true });
  return chunk(text.replace(/\f/g, "\n# Page\n"));
}

async function readLinkedIn(): Promise<{ title: string; text: string }[]> {
  const md = readFileSync(path.join(ROOT, "content", "kb", "linkedin.md"), "utf8");
  return chunk(md);
}

async function fetchReadme(repo: string): Promise<string | null> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}/readme`, {
    headers: { "User-Agent": "uday-portfolio-build", Accept: "application/vnd.github.v3.raw" },
  });
  if (!res.ok) return null;
  return await res.text();
}

async function fetchAllReadmes(): Promise<{ repo: string; md: string }[]> {
  const out: { repo: string; md: string }[] = [];
  for (const repo of INCLUDED_REPOS) {
    const md = await fetchReadme(repo);
    if (md && md.length > 100) out.push({ repo, md });
    else console.warn(`[build-kb] skipping ${repo} (no usable README)`);
  }
  return out;
}

async function main() {
  console.log("[build-kb] starting...");
  const all: OutputChunk[] = [];

  console.log("[build-kb] parsing resume");
  for (const c of await parseResume()) {
    all.push({
      id: hashId("resume", c.title, c.text.slice(0, 64)),
      text: c.text, vector: await embed(c.text),
      source: "resume", type: "resume", tier: "primary",
      title: c.title || "Resume",
    });
  }

  console.log("[build-kb] reading LinkedIn KB");
  for (const c of await readLinkedIn()) {
    all.push({
      id: hashId("linkedin", c.title, c.text.slice(0, 64)),
      text: c.text, vector: await embed(c.text),
      source: "linkedin", type: "linkedin", tier: "primary",
      title: c.title,
    });
  }

  console.log("[build-kb] embedding FAQ");
  for (const f of faq) {
    const text = `Q: ${f.q}\nA: ${f.a}`;
    all.push({
      id: hashId("faq", f.q),
      text, vector: await embed(text),
      source: "faq", type: "faq", tier: "primary",
      title: f.q,
    });
  }

  console.log("[build-kb] fetching GitHub READMEs");
  const readmes = await fetchAllReadmes();
  for (const { repo, md } of readmes) {
    const tier = FEATURED_REPOS.has(repo) ? "primary" : "secondary";
    for (const c of chunk(md)) {
      all.push({
        id: hashId("github", repo, c.title, c.text.slice(0, 64)),
        text: c.text, vector: await embed(c.text),
        source: `github:${repo}`, type: "project", tier,
        title: `${repo} — ${c.title}`,
      });
    }
  }

  console.log("[build-kb] embedding extra projects");
  for (const p of projectsExtra) {
    for (const c of chunk(`# ${p.title}\n${p.body}`)) {
      all.push({
        id: hashId("extra", p.slug, c.text.slice(0, 64)),
        text: c.text, vector: await embed(c.text),
        source: `extra:${p.slug}`, type: "project", tier: p.tier,
        title: `${p.title}${c.title !== p.title ? ` — ${c.title}` : ""}`,
      });
    }
  }

  mkdirSync(path.join(ROOT, "data"), { recursive: true });
  writeFileSync(path.join(ROOT, "data", "embeddings.json"), JSON.stringify(all));
  writeFileSync(
    path.join(ROOT, "data", "manifest.json"),
    JSON.stringify({
      builtAt: new Date().toISOString(),
      chunkCount: all.length,
      sources: [...new Set(all.map((c) => c.source))],
      model: "Xenova/all-MiniLM-L6-v2",
      dim: 384,
    }, null, 2)
  );
  console.log(`[build-kb] wrote ${all.length} chunks`);
}

main().catch((err) => { console.error(err); process.exit(1); });
