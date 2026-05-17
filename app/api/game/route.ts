import { z } from "zod";
import { chatJSON } from "@/lib/ai/groq";
import { chatLimiter, ipFromRequest } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 15;

const Body = z.object({
  history: z.array(z.string()).max(200),
  userWord: z.string().min(1).max(40),
});

const Out = z.object({
  valid: z.boolean(),
  nextWord: z.string().optional(),
  reaction: z.string().optional(),
  reason: z.string().optional(),
});

export async function POST(req: Request): Promise<Response> {
  let parsed;
  try { parsed = Body.parse(await req.json()); }
  catch { return new Response(JSON.stringify({ error: "invalid body" }), { status: 400 }); }

  const rl = await chatLimiter.limit(ipFromRequest(req));
  if (!rl.success) return new Response(JSON.stringify({ error: "rate limited" }), { status: 429 });

  const wordNorm = parsed.userWord.trim().toLowerCase();
  const seen = new Set(parsed.history.map((w) => w.trim().toLowerCase()));
  if (seen.has(wordNorm)) {
    return Response.json({ valid: false, reason: "repeat — you said that already" });
  }

  const sys = `You are judging a word-association game limited to AI/ML concepts (models, techniques, providers, papers, vector DBs, frameworks).
Rules:
  - Return JSON: { "valid": boolean, "nextWord"?: string, "reaction"?: string, "reason"?: string }
  - "valid" = is the user's word AI/ML-related AND related to the previous word in the chain?
  - If valid: pick a tightly-related next AI/ML word (1-3 words max), not yet in history. "reaction" = 1 short line.
  - If invalid: "reason" explains why (off-topic / unrelated). No "nextWord".
  - Never repeat anything in history.`;
  const user = `History (oldest first): ${JSON.stringify(parsed.history)}\nUser word: "${parsed.userWord}"`;

  const { data } = await chatJSON<unknown>([
    { role: "system", content: sys }, { role: "user", content: user },
  ]);
  const safe = Out.safeParse(data);
  if (!safe.success) {
    return Response.json({ valid: false, reason: "model returned unparseable response" });
  }
  if (safe.data.nextWord && seen.has(safe.data.nextWord.toLowerCase())) {
    return Response.json({ valid: false, reason: "model repeated a history word" });
  }
  return Response.json(safe.data);
}
