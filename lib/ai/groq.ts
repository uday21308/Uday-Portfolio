import Groq from "groq-sdk";
import { calcCost } from "./cost";

let _client: Groq | null = null;
function client() {
  if (!_client) _client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  return _client;
}

export const DEFAULT_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

/**
 * Model fallback chain. If the primary model returns 429 (rate-limited or
 * tokens-per-day exhausted), retry with the next model. The 8B model has a
 * 500K TPD limit vs 100K for 70B — gives ~5× more headroom on the free tier.
 *
 * Order = quality preference. Both models share the same persona, so a
 * fallback is transparent to the user except for the model name in the cost line.
 */
const FALLBACK_CHAIN = [
  DEFAULT_MODEL,
  "llama-3.1-8b-instant",
];

function isRateLimitError(err: unknown): boolean {
  const e = err as { status?: number; message?: string };
  if (e?.status === 429) return true;
  return /rate.?limit|tokens? per day|TPD/i.test(String(e?.message ?? ""));
}

type StreamUsage = { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };

async function streamChatOnce(
  model: string,
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  opts: { onToken?: (delta: string) => void },
): Promise<{ full: string; usage: StreamUsage | undefined }> {
  const stream = await client().chat.completions.create({
    model, messages, stream: true,
  });

  let full = "";
  let usage: StreamUsage | undefined;

  for await (const part of stream) {
    const delta = part.choices[0]?.delta?.content ?? "";
    if (delta) { full += delta; opts.onToken?.(delta); }
    if ((part as { x_groq?: { usage?: StreamUsage } }).x_groq?.usage) {
      usage = (part as { x_groq: { usage: StreamUsage } }).x_groq.usage;
    }
  }
  return { full, usage };
}

export async function streamChat(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  opts: {
    model?: string;
    onToken?: (delta: string) => void;
    onUsage?: (usage: { promptTokens: number; completionTokens: number; totalTokens: number; cost: number; model: string }) => void;
  } = {},
): Promise<string> {
  // Explicit model override = no fallback (caller asked for a specific model)
  const chain = opts.model ? [opts.model] : FALLBACK_CHAIN;
  let lastError: unknown = null;

  for (let i = 0; i < chain.length; i++) {
    const model = chain[i];
    try {
      const { full, usage } = await streamChatOnce(model, messages, { onToken: opts.onToken });
      if (usage && opts.onUsage) {
        const promptTokens = usage.prompt_tokens ?? 0;
        const completionTokens = usage.completion_tokens ?? 0;
        opts.onUsage({
          promptTokens, completionTokens,
          totalTokens: usage.total_tokens ?? promptTokens + completionTokens,
          cost: calcCost(model, promptTokens, completionTokens),
          model,
        });
      }
      return full;
    } catch (err) {
      lastError = err;
      const canFallback = i < chain.length - 1 && isRateLimitError(err);
      if (canFallback) {
        console.warn(`[groq] ${model} rate-limited, falling back to ${chain[i + 1]}`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function chatJSON<T>(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  opts: { model?: string } = {},
): Promise<{ data: T; usage: { promptTokens: number; completionTokens: number; cost: number; model: string } }> {
  const chain = opts.model ? [opts.model] : FALLBACK_CHAIN;
  let lastError: unknown = null;

  for (let i = 0; i < chain.length; i++) {
    const model = chain[i];
    try {
      const res = await client().chat.completions.create({
        model, messages,
        response_format: { type: "json_object" },
      });
      const content = res.choices[0]?.message?.content ?? "{}";
      const promptTokens = res.usage?.prompt_tokens ?? 0;
      const completionTokens = res.usage?.completion_tokens ?? 0;
      return {
        data: JSON.parse(content) as T,
        usage: {
          promptTokens, completionTokens,
          cost: calcCost(model, promptTokens, completionTokens),
          model,
        },
      };
    } catch (err) {
      lastError = err;
      const canFallback = i < chain.length - 1 && isRateLimitError(err);
      if (canFallback) {
        console.warn(`[groq] ${model} rate-limited, falling back to ${chain[i + 1]}`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
