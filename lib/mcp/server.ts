import path from "node:path";
import { Retriever, type ScoredChunk, type StoredChunk } from "@/lib/rag/retriever";
import { embed } from "@/lib/rag/embedder-api";
import { streamChat, chatJSON } from "@/lib/ai/groq";
import { buildChatMessages, buildHireMessages } from "@/lib/ai/prompts";

let _r: Promise<Retriever> | null = null;
function retriever() { if (!_r) _r = Retriever.load(); return _r; }

let _p: Promise<string> | null = null;
function persona() {
  if (!_p) {
    _p = import("node:fs/promises").then(({ readFile }) =>
      readFile(path.join(process.cwd(), "content", "kb", "persona.md"), "utf8")
    );
  }
  return _p;
}

export const tools = {
  async ask_uday(args: { question: string }) {
    const [r, sys, q] = await Promise.all([retriever(), persona(), embed(args.question)]);
    const retrieved = r.topK(q, 5);
    const messages = buildChatMessages({
      persona: sys, retrieved, memory: [], userMessage: args.question,
    });
    const answer = await streamChat(messages);
    return {
      answer,
      sources: retrieved.map((c: ScoredChunk) => ({
        title: c.title, source: c.source, score: c.score,
      })),
    };
  },

  async list_projects(_args: Record<string, never>) {
    const r = await retriever();
    // Retriever stores chunks privately; expose via a typed accessor cast.
    const all = (r as unknown as { chunks: StoredChunk[] }).chunks;
    const projects = new Map<string, { name: string; tier: "primary" | "secondary"; summary: string }>();
    for (const c of all) {
      if (c.type !== "project") continue;
      const key = c.source.replace(/^(github|extra):/, "");
      if (!projects.has(key)) {
        projects.set(key, { name: c.title, tier: c.tier, summary: c.text.slice(0, 200) });
      }
    }
    return { projects: [...projects.values()] };
  },

  async get_project(args: { name: string }) {
    const r = await retriever();
    const all = (r as unknown as { chunks: StoredChunk[] }).chunks;
    const matches = all.filter(
      (c) => c.source === `github:${args.name}` || c.source === `extra:${args.name}`
    );
    if (matches.length === 0) return { error: `project '${args.name}' not found` };
    return {
      name: args.name,
      tier: matches[0].tier,
      content: matches.map((c) => c.text).join("\n\n"),
    };
  },

  async match_jd(args: { jd: string; company?: string; role?: string }) {
    const [r, sys, q] = await Promise.all([retriever(), persona(), embed(args.jd)]);
    const retrieved = r.topK(q, 8);
    const messages = buildHireMessages({
      persona: sys, retrieved, jd: args.jd, company: args.company, role: args.role,
    });
    const { data } = await chatJSON<{
      fitScore: number;
      strengths: string[];
      tailoredBullets: string[];
      coverParagraph: string;
    }>(messages);
    return data;
  },
};
