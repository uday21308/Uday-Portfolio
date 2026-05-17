"use client";
import { useMemo, useState } from "react";

const SEED_WORDS = ["transformer", "embedding", "RAG", "attention", "fine-tune", "tokenizer", "agent"];

export function GameView() {
  const start = useMemo(() => SEED_WORDS[Math.floor(Math.random() * SEED_WORDS.length)], []);
  const [history, setHistory] = useState<string[]>([start]);
  const [botWord, setBotWord] = useState(start);
  const [reaction, setReaction] = useState("Your turn — say an AI/ML word related to mine.");
  const [input, setInput] = useState("");
  const [ended, setEnded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function play() {
    const w = input.trim();
    if (!w || loading || ended) return;
    setLoading(true);
    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ history, userWord: w }),
      });
      const data = await res.json();
      const newHistory = [...history, w];
      setHistory(newHistory);
      setInput("");
      if (!data.valid) {
        setEnded(`Game over (${newHistory.length - 1} rounds) — ${data.reason}`);
      } else if (data.nextWord) {
        setBotWord(data.nextWord);
        setHistory([...newHistory, data.nextWord]);
        setReaction(data.reaction ?? "your turn");
      }
    } finally { setLoading(false); }
  }

  function reset() {
    const s = SEED_WORDS[Math.floor(Math.random() * SEED_WORDS.length)];
    setHistory([s]); setBotWord(s); setReaction("New game!"); setInput(""); setEnded(null);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 text-[11px] text-[var(--color-fg-muted)] border-b border-[var(--color-accent)]/10">
        Word association · AI/ML only · no repeats
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">My word</div>
        <div
          data-testid="bot-word"
          className="text-3xl font-[family-name:var(--font-display)] font-bold text-[var(--color-accent-cyan)]"
        >
          {botWord}
        </div>
        <div className="text-sm text-[var(--color-fg-muted)] italic">{reaction}</div>
        {ended && <div className="text-sm mt-4 p-3 rounded-lg bg-[var(--color-accent)]/10">{ended}</div>}
        <div className="text-[11px] mt-4 text-[var(--color-fg-muted)]">Chain: {history.join(" → ")}</div>
      </div>
      {!ended ? (
        <form onSubmit={(e) => { e.preventDefault(); void play(); }} className="border-t border-[var(--color-accent)]/15 p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="your word…"
            disabled={loading}
            className="flex-1 bg-transparent border border-[var(--color-accent)]/20 rounded-md px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-3 py-1.5 rounded-md bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)]/30 disabled:opacity-40 text-sm"
          >
            {loading ? "…" : "Play"}
          </button>
        </form>
      ) : (
        <div className="border-t border-[var(--color-accent)]/15 p-3 text-center">
          <button onClick={reset} className="px-3 py-1.5 rounded-md bg-[var(--color-accent-cyan)]/20 hover:bg-[var(--color-accent-cyan)]/30 text-sm">
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
