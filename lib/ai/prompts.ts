import type { ScoredChunk } from "@/lib/rag/retriever";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

function formatContext(retrieved: { title: string; text: string; source: string }[]): string {
  if (retrieved.length === 0) return "(no retrieved context)";
  return retrieved
    .map((c, i) => `[#${i + 1}] (source: ${c.source} · ${c.title})\n${c.text}`)
    .join("\n\n---\n\n");
}

export function buildChatMessages(args: {
  persona: string;
  retrieved: Pick<ScoredChunk, "title" | "text" | "source">[];
  memory: ChatMessage[];
  userMessage: string;
}): ChatMessage[] {
  const system: ChatMessage = {
    role: "system",
    content: `${args.persona}\n\nRELEVANT CONTEXT (cite by [#N] when used):\n${formatContext(args.retrieved)}`,
  };
  return [system, ...args.memory, { role: "user", content: args.userMessage }];
}

export function buildHireMessages(args: {
  persona: string;
  retrieved: Pick<ScoredChunk, "title" | "text" | "source">[];
  jd: string;
  company?: string;
  role?: string;
}): ChatMessage[] {
  const system: ChatMessage = {
    role: "system",
    content: `${args.persona}\n\nYou are generating a structured fit analysis. Respond ONLY with JSON matching the requested schema. Cite real metrics from the context.\n\nCONTEXT:\n${formatContext(args.retrieved)}`,
  };
  const user: ChatMessage = {
    role: "user",
    content: `Company: ${args.company ?? "(unspecified)"}\nRole: ${args.role ?? "(unspecified)"}\n\nJob description:\n${args.jd}\n\nReturn JSON: { fitScore (1-10), strengths (3), tailoredBullets (3), coverParagraph (string) }`,
  };
  return [system, user];
}
