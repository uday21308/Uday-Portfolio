"use client";
import { useCallback, useRef, useState } from "react";

export type Source = { title: string; source: string; score: number };
export type Usage = { cost: number; totalTokens: number; latencyMs: number; model: string };
export type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  usage?: Usage;
};

function parseSSE(buffer: string): { events: { event: string; data: string }[]; rest: string } {
  const events: { event: string; data: string }[] = [];
  const chunks = buffer.split("\n\n");
  const rest = chunks.pop() ?? "";
  for (const c of chunks) {
    const lines = c.split("\n");
    let event = "message"; let data = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) event = line.slice(7);
      else if (line.startsWith("data: ")) data += line.slice(6);
    }
    if (data) events.push({ event, data });
  }
  return { events, rest };
}

export function useChatStream() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [pendingAssistant, setPendingAssistant] = useState<Msg | null>(null);
  const [isStreaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setStreaming(true);
    const start = performance.now();
    let assistant: Msg = { role: "assistant", content: "", sources: [], usage: undefined };
    setPendingAssistant(assistant);

    const ctl = new AbortController();
    abortRef.current = ctl;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: ctl.signal,
      });
      if (!res.ok || !res.body) {
        let detail = `http ${res.status}`;
        try {
          const body = await res.json();
          if (body?.error) detail = `${body.error} (${res.status})`;
        } catch {}
        throw new Error(detail);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += dec.decode(value, { stream: true });
        const { events, rest } = parseSSE(buffer);
        buffer = rest;
        for (const ev of events) {
          if (ev.event === "sources") {
            assistant = { ...assistant, sources: JSON.parse(ev.data) };
            setPendingAssistant({ ...assistant });
          } else if (ev.event === "token") {
            const { delta } = JSON.parse(ev.data);
            assistant = { ...assistant, content: assistant.content + delta };
            setPendingAssistant({ ...assistant });
          } else if (ev.event === "usage") {
            const u = JSON.parse(ev.data);
            assistant = { ...assistant, usage: { cost: u.cost, totalTokens: u.totalTokens, latencyMs: Math.round(performance.now() - start), model: u.model } };
            setPendingAssistant({ ...assistant });
          } else if (ev.event === "redacted") {
            const { text } = JSON.parse(ev.data);
            assistant = { ...assistant, content: text };
            setPendingAssistant({ ...assistant });
          } else if (ev.event === "error") {
            // Server-side failure mid-stream (Groq error, etc.)
            const payload = (() => { try { return JSON.parse(ev.data); } catch { return { message: ev.data }; } })();
            const msg = payload?.message ?? "stream failed";
            console.error("[useChatStream] server error event:", msg);
            assistant = { ...assistant, content: assistant.content || `Sorry — ${msg}. Try again?` };
            setPendingAssistant({ ...assistant });
          }
        }
      }
      // If we received NO tokens AND no content, surface that explicitly
      // so the UI never shows a totally blank bubble.
      if (!assistant.content) {
        assistant = { ...assistant, content: "Sorry — no response received. Check the dev server terminal for errors." };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      console.error("[useChatStream]", err);
      assistant = { ...assistant, content: assistant.content || `Sorry — ${msg}. Try again?` };
    } finally {
      setMessages((m) => [...m, assistant]);
      setPendingAssistant(null);
      setStreaming(false);
      abortRef.current = null;
    }
  }, [isStreaming]);

  return { messages, pendingAssistant, send, isStreaming };
}
