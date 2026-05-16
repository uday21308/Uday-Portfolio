"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStream } from "./useChatStream";
import { CostLine } from "./CostLine";
import { SourceCitations } from "./SourceCitations";

export function ChatView() {
  const { messages, pendingAssistant, send, isStreaming } = useChatStream();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, pendingAssistant]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText("");
    void send(t);
  };

  const thread = pendingAssistant ? [...messages, pendingAssistant] : messages;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {thread.length === 0 && (
          <p className="text-sm text-[var(--color-fg-muted)]">
            Hey 👋 ask me about Uday&apos;s projects, RAG work, MCP, or what kind of role he&apos;s looking for.
          </p>
        )}
        {thread.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div className={`inline-block max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug
              ${m.role === "user"
                ? "bg-[var(--color-accent)]/15 text-[var(--color-fg)]"
                : "bg-[var(--color-bg-elevated)] text-[var(--color-fg)]"}`}>
              <p className="whitespace-pre-wrap">{m.content}{m.role === "assistant" && isStreaming && i === thread.length - 1 ? <span className="animate-pulse">▍</span> : null}</p>
              {m.role === "assistant" && m.usage && (
                <CostLine cost={m.usage.cost} totalTokens={m.usage.totalTokens} latencyMs={m.usage.latencyMs} model={m.usage.model} />
              )}
              {m.role === "assistant" && m.sources && <SourceCitations sources={m.sources} />}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={onSubmit} className="border-t border-[var(--color-accent)]/15 p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask me anything about Uday's work…"
          disabled={isStreaming}
          className="flex-1 bg-transparent border border-[var(--color-accent)]/20 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-accent-cyan)]/60"
        />
        <button type="submit" disabled={isStreaming || !text.trim()} className="px-3 py-1.5 rounded-md bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 disabled:opacity-40 text-sm">
          {isStreaming ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
