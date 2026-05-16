import Groq from "groq-sdk";
import { calcCost } from "./cost";

let _client: Groq | null = null;
function client() {
  if (!_client) _client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  return _client;
}

export const DEFAULT_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

export async function streamChat(messages: { role: "system" | "user" | "assistant"; content: string }[], opts: {
  model?: string;
  onToken?: (delta: string) => void;
  onUsage?: (usage: { promptTokens: number; completionTokens: number; totalTokens: number; cost: number; model: string }) => void;
} = {}): Promise<string> {
  const model = opts.model ?? DEFAULT_MODEL;
  const stream = await client().chat.completions.create({
    model, messages, stream: true,
  });

  let full = "";
  let usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | undefined;

  for await (const part of stream) {
    const delta = part.choices[0]?.delta?.content ?? "";
    if (delta) { full += delta; opts.onToken?.(delta); }
    if ((part as any).x_groq?.usage) usage = (part as any).x_groq.usage;
  }

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
}

export async function chatJSON<T>(messages: { role: "system" | "user" | "assistant"; content: string }[], opts: {
  model?: string;
} = {}): Promise<{ data: T; usage: { promptTokens: number; completionTokens: number; cost: number; model: string } }> {
  const model = opts.model ?? DEFAULT_MODEL;
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
}
