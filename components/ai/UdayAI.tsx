"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useAI } from "@/components/providers/AIProvider";
import { ChatView } from "./ChatView";
import { GameView } from "./GameView";

export function UdayAI() {
  const { isOpen, open, close, mode, setMode } = useAI();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!isOpen) {
    return (
      <button
        type="button"
        aria-label="Open Uday AI"
        onClick={open}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 backdrop-blur-md shadow-lg hover:scale-105 transition-transform"
      >
        <span aria-hidden className="block text-xl">🤖</span>
      </button>
    );
  }

  return (
    <div role="dialog" aria-label="Uday AI" className="fixed inset-x-3 bottom-3 z-50 md:inset-auto md:bottom-5 md:right-5 md:w-[380px] md:h-[560px] flex flex-col bg-[var(--color-bg)]/95 backdrop-blur-xl border border-[var(--color-accent)]/30 rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-accent)]/15">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>🤖</span> Uday AI Twin
        </div>
        <button onClick={close} aria-label="Close" className="text-sm opacity-60 hover:opacity-100">✕</button>
      </div>
      <div className="flex gap-1 px-3 py-2 border-b border-[var(--color-accent)]/10">
        <ModeChip active={mode === "chat"} onClick={() => setMode("chat")}>💬 Chat</ModeChip>
        <Link href="/hire" className="flex-1">
          <ModeChip>🎯 Hire</ModeChip>
        </Link>
        <ModeChip active={mode === "game"} onClick={() => setMode("game")}>🎮 Play</ModeChip>
        <Link href="/connect" className="flex-1">
          <ModeChip>🔌 Connect</ModeChip>
        </Link>
      </div>
      <div className="flex-1 min-h-0">
        {mode === "chat" ? <ChatView /> : <GameView />}
      </div>
    </div>
  );
}

function ModeChip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 text-[11px] px-2 py-1 rounded-md border transition-colors
        ${active
          ? "border-[var(--color-accent-cyan)]/60 bg-[var(--color-accent-cyan)]/10 text-[var(--color-fg)]"
          : "border-[var(--color-accent)]/15 text-[var(--color-fg-muted)] hover:border-[var(--color-accent)]/40"}`}
    >
      {children}
    </button>
  );
}
