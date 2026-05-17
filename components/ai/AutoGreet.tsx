"use client";
import { useEffect, useState } from "react";
import { useAI } from "@/components/providers/AIProvider";

const STORAGE_KEY = "uday_ai_greeted";

export function AutoGreet({ delayMs = 8000, autoDismissMs = 15_000 }: { delayMs?: number; autoDismissMs?: number }) {
  const { open } = useAI();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => dismiss(), autoDismissMs);
    return () => clearTimeout(t);
  }, [show, autoDismissMs]);

  function dismiss() {
    setShow(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }

  if (!show) return null;

  return (
    <div
      role="status"
      className="fixed bottom-24 right-5 z-40 max-w-[260px] px-4 py-3 rounded-2xl bg-[var(--color-bg)]/95 border border-[var(--color-accent-cyan)]/40 backdrop-blur-md shadow-xl text-sm"
    >
      <p className="mb-2">
        Hey — I'm Uday's AI Twin. Ask me anything about his work, paste a JD for a tailored fit pitch, or play a quick arcade game.
      </p>
      <div className="flex gap-2">
        <button onClick={() => { dismiss(); open(); }} className="flex-1 text-xs px-2 py-1 rounded-md bg-[var(--color-accent-cyan)]/20 hover:bg-[var(--color-accent-cyan)]/30">
          Let's go →
        </button>
        <button onClick={dismiss} className="text-xs px-2 py-1 opacity-60 hover:opacity-100">
          Maybe later
        </button>
      </div>
    </div>
  );
}
