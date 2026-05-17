import Link from "next/link";
import { Target, Plug, ArrowLeft } from "lucide-react";
import { GameView } from "@/components/ai/GameView";

export const metadata = {
  title: "Bug Dodger · Uday Kiran Battula",
  description: "An arcade interlude built into the portfolio. Help the AI engineer dodge the bugs.",
};

export default function PlayPage() {
  return (
    <main className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center px-4 py-6 md:py-8">
      <div className="text-center mb-5">
        <div className="text-[11px] font-[family-name:var(--font-mono)] tracking-[0.3em] text-[var(--color-accent-cyan)] uppercase mb-1.5">
          / play
        </div>
        <h1 className="font-[family-name:var(--font-display)] uppercase font-extrabold text-3xl md:text-4xl tracking-tight">
          Bug Dodger
        </h1>
        <p className="text-[var(--color-fg-muted)] mt-2 text-xs md:text-sm max-w-md mx-auto">
          A tiny arcade interlude. Press{" "}
          <kbd className="font-[family-name:var(--font-mono)] text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-accent)]/20">
            space
          </kbd>
          , click, or tap to jump.
        </p>
      </div>

      <div className="w-full max-w-[760px] h-[260px] md:h-[340px] border border-[var(--color-accent)]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[var(--color-bg)]/80 backdrop-blur-xl">
        <GameView />
      </div>

      <div className="flex items-center gap-4 mt-5 text-xs text-[var(--color-fg-muted)]">
        <Link href="/" className="flex items-center gap-1.5 hover:text-[var(--color-accent-cyan)] transition-colors">
          <ArrowLeft size={12} strokeWidth={2} aria-hidden /> Back to portfolio
        </Link>
        <span aria-hidden>·</span>
        <Link href="/hire" className="flex items-center gap-1.5 hover:text-[var(--color-accent-cyan)] transition-colors">
          <Target size={12} strokeWidth={2} aria-hidden /> Hire me
        </Link>
        <span aria-hidden>·</span>
        <Link href="/connect" className="flex items-center gap-1.5 hover:text-[var(--color-accent-cyan)] transition-colors">
          <Plug size={12} strokeWidth={2} aria-hidden /> Connect via MCP
        </Link>
      </div>
    </main>
  );
}
