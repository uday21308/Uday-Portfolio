import { z } from "zod";
import path from "node:path";
import { Retriever } from "@/lib/rag/retriever";
import { embed } from "@/lib/rag/embedder-api";
import { streamChat } from "@/lib/ai/groq";
import { sweep } from "@/lib/ai/guardrails";
import { buildChatMessages } from "@/lib/ai/prompts";
import { loadHistory, appendExchange } from "@/lib/redis";
import { chatLimiter, ipFromRequest } from "@/lib/ratelimit";
import { SESSION_COOKIE, isValidSessionId, newSessionId } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 30;

const Body = z.object({ message: z.string().min(1).max(2000) });

let _retriever: Promise<Retriever> | null = null;
function retriever() {
  if (!_retriever) _retriever = Retriever.load();
  return _retriever;
}

let _persona: Promise<string> | null = null;
function persona() {
  if (!_persona) {
    _persona = import("node:fs/promises").then(({ readFile }) =>
      readFile(path.join(process.cwd(), "content", "kb", "persona.md"), "utf8")
    );
  }
  return _persona;
}

function sseEvent(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function readSessionId(req: Request): { id: string; isNew: boolean } {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  const candidate = match?.[1];
  if (isValidSessionId(candidate)) return { id: candidate, isNew: false };
  return { id: newSessionId(), isNew: true };
}

export async function POST(req: Request): Promise<Response> {
  let parsed;
  try { parsed = Body.parse(await req.json()); }
  catch { return new Response(JSON.stringify({ error: "invalid body" }), { status: 400 }); }

  const ip = ipFromRequest(req);
  const rl = await chatLimiter.limit(ip);
  if (!rl.success) return new Response(JSON.stringify({ error: "rate limited" }), { status: 429 });

  const { id: sessionId, isNew } = readSessionId(req);
  const [r, sys, history, queryVec] = await Promise.all([
    retriever(), persona(), loadHistory(sessionId, 10), embed(parsed.message),
  ]);
  const retrieved = r.topK(queryVec, 5);
  const messages = buildChatMessages({
    persona: sys,
    retrieved,
    memory: history.map((h) => ({ role: h.role, content: h.content })),
    userMessage: parsed.message,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let fullText = "";
        const sources = retrieved.map((c) => ({ title: c.title, source: c.source, score: c.score }));
        controller.enqueue(encoder.encode(sseEvent("sources", sources)));

        const full = await streamChat(messages, {
          onToken: (delta) => {
            fullText += delta;
            controller.enqueue(encoder.encode(sseEvent("token", { delta })));
          },
          onUsage: (usage) => {
            controller.enqueue(encoder.encode(sseEvent("usage", usage)));
          },
        });
        fullText = full || fullText;

        const swept = sweep(fullText);
        if (swept !== fullText) {
          controller.enqueue(encoder.encode(sseEvent("redacted", { text: swept })));
          fullText = swept;
        }

        await appendExchange(sessionId, { role: "user", content: parsed.message, ts: Date.now() });
        await appendExchange(sessionId, { role: "assistant", content: fullText, ts: Date.now() });

        controller.enqueue(encoder.encode(sseEvent("done", { ok: true })));
      } catch (err) {
        controller.enqueue(encoder.encode(sseEvent("error", { message: String(err) })));
      } finally {
        controller.close();
      }
    },
  });

  const headers: Record<string, string> = {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    "x-accel-buffering": "no",
  };
  if (isNew) {
    headers["set-cookie"] = `${SESSION_COOKIE}=${sessionId}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`;
  }
  return new Response(stream, { headers });
}
