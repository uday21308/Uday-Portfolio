"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, Target, Gamepad2, Plug } from "lucide-react";
import { useChatStream } from "./useChatStream";
import { CostLine } from "./CostLine";
import { SourceCitations } from "./SourceCitations";

// Starter prompts shown in the empty chat state. Each maps to a curated FAQ
// answer so first impressions are sharp and on-brand. Edit freely.
const SUGGESTIONS = [
  "What's your strongest project?",
  "Why does MCP excite you?",
  "What are you looking for in your next role?",
  "What's your single proudest technical decision?",
];

export function ChatView() {
  const { messages, pendingAssistant, send, isStreaming } = useChatStream();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingAssistant]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText("");
    void send(t);
  };

  const thread = pendingAssistant ? [...messages, pendingAssistant] : messages;
  const isEmpty = thread.length === 0;

  return (
    <div className="flex flex-col h-full">
      <div data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-3 space-y-4 overscroll-contain">
        {isEmpty && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
              Hey — I&apos;m Uday&apos;s AI twin, trained on his resume, GitHub READMEs,
              LinkedIn, and a curated FAQ. Ask me anything below.
            </p>

            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-muted)] mb-2">
                The tools above ↑
              </div>
              <ul className="space-y-1 text-[11px] text-[var(--color-fg-muted)] leading-relaxed">
                <li className="flex items-start gap-2">
                  <Target size={11} strokeWidth={2} aria-hidden className="flex-shrink-0 mt-0.5 text-[var(--color-accent-cyan)]" />
                  <span><strong className="text-[var(--color-fg)] font-medium">Hire</strong> — paste a JD, get a structured fit pitch</span>
                </li>
                <li className="flex items-start gap-2">
                  <Gamepad2 size={11} strokeWidth={2} aria-hidden className="flex-shrink-0 mt-0.5 text-[var(--color-accent-cyan)]" />
                  <span><strong className="text-[var(--color-fg)] font-medium">Play</strong> — tiny arcade interlude (Bug Dodger)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Plug size={11} strokeWidth={2} aria-hidden className="flex-shrink-0 mt-0.5 text-[var(--color-accent-cyan)]" />
                  <span><strong className="text-[var(--color-fg)] font-medium">MCP</strong> — wire this portfolio into Claude Desktop</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-muted)] mb-2">
                Or try one of these
              </div>
              <div className="flex flex-col gap-1.5">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    disabled={isStreaming}
                    className="group flex items-center gap-2 text-left text-xs px-3 py-2 rounded-md border border-[var(--color-accent)]/15 hover:border-[var(--color-accent-cyan)]/50 hover:bg-[var(--color-accent-cyan)]/5 transition-colors text-[var(--color-fg)] disabled:opacity-40 disabled:hover:border-[var(--color-accent)]/15 disabled:hover:bg-transparent"
                  >
                    <ArrowRight
                      size={11}
                      strokeWidth={2}
                      aria-hidden
                      className="flex-shrink-0 text-[var(--color-accent-cyan)] opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {thread.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div
              className={`inline-block max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug
              ${m.role === "user"
                ? "bg-[var(--color-accent)]/15 text-[var(--color-fg)]"
                : "bg-[var(--color-bg-elevated)] text-[var(--color-fg)]"}`}
            >
              <p className="whitespace-pre-wrap">
                {m.content}
                {m.role === "assistant" && isStreaming && i === thread.length - 1 ? (
                  <span className="animate-pulse">▍</span>
                ) : null}
              </p>
              {m.role === "assistant" && m.usage && (
                <CostLine
                  cost={m.usage.cost}
                  totalTokens={m.usage.totalTokens}
                  latencyMs={m.usage.latencyMs}
                  model={m.usage.model}
                />
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
        <button
          type="submit"
          disabled={isStreaming || !text.trim()}
          className="px-3 py-1.5 rounded-md bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 disabled:opacity-40 text-sm"
        >
          {isStreaming ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
