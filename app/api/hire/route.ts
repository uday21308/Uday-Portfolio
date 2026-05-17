import { z } from "zod";
import path from "node:path";
import { Retriever } from "@/lib/rag/retriever";
import { embed } from "@/lib/rag/embedder";
import { chatJSON } from "@/lib/ai/groq";
import { sweep } from "@/lib/ai/guardrails";
import { buildHireMessages } from "@/lib/ai/prompts";
import { hireLimiter, ipFromRequest } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const Body = z.object({
  jd: z.string().min(20).max(8000),
  company: z.string().max(120).optional(),
  role: z.string().max(120).optional(),
});

const Out = z.object({
  fitScore: z.number().int().min(1).max(10),
  strengths: z.array(z.string()).length(3),
  tailoredBullets: z.array(z.string()).length(3),
  coverParagraph: z.string(),
});

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

export async function POST(req: Request): Promise<Response> {
  let parsed;
  try { parsed = Body.parse(await req.json()); }
  catch { return new Response(JSON.stringify({ error: "invalid body" }), { status: 400 }); }

  const rl = await hireLimiter.limit(ipFromRequest(req));
  if (!rl.success) return new Response(JSON.stringify({ error: "rate limited" }), { status: 429 });

  const [r, sys, q] = await Promise.all([retriever(), persona(), embed(parsed.jd)]);
  const retrieved = r.topK(q, 8);
  const messages = buildHireMessages({ persona: sys, retrieved, jd: parsed.jd, company: parsed.company, role: parsed.role });
  const { data, usage } = await chatJSON<unknown>(messages);
  const safe = Out.safeParse(data);
  if (!safe.success) {
    return new Response(JSON.stringify({ error: "model returned invalid shape" }), { status: 502 });
  }
  return Response.json({
    ...safe.data,
    strengths: safe.data.strengths.map(sweep),
    tailoredBullets: safe.data.tailoredBullets.map(sweep),
    coverParagraph: sweep(safe.data.coverParagraph),
    usage,
  });
}
