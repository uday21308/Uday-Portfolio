"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Target, Gamepad2, Plug, X } from "lucide-react";
import { useAI } from "@/components/providers/AIProvider";
import { ChatView } from "./ChatView";
import { MascotSprite } from "./MascotSprite";

export function UdayAI() {
  const { isOpen, open, close } = useAI();

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
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 backdrop-blur-md shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <MascotSprite scale={1.4} />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Uday AI"
      className="fixed inset-x-3 bottom-3 z-50 md:inset-auto md:bottom-5 md:right-5 md:w-[380px] md:h-[560px] flex flex-col bg-[var(--color-bg)]/95 backdrop-blur-xl border border-[var(--color-accent)]/30 rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-accent)]/15">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <MascotSprite />
          <span>Uday AI Twin</span>
        </div>
        <div className="flex items-center gap-0.5">
          <ToolLink href="/hire" onClick={close} title="Get a tailored fit pitch for a job description">
            <Target size={12} strokeWidth={2} aria-hidden />
            <span>Hire</span>
          </ToolLink>
          <ToolLink href="/play" onClick={close} title="Play Bug Dodger — a tiny arcade interlude">
            <Gamepad2 size={12} strokeWidth={2} aria-hidden />
            <span>Play</span>
          </ToolLink>
          <ToolLink href="/connect" onClick={close} title="Connect this portfolio to Claude Desktop via MCP">
            <Plug size={12} strokeWidth={2} aria-hidden />
            <span>MCP</span>
          </ToolLink>
          <button
            onClick={close}
            aria-label="Close"
            className="ml-0.5 p-1.5 rounded-md text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-accent)]/10 transition-colors"
          >
            <X size={14} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ChatView />
      </div>
    </div>
  );
}

function ToolLink({
  href,
  onClick,
  title,
  children,
}: {
  href: string;
  onClick?: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex items-center gap-1 px-1.5 py-1 rounded-md text-[10px] font-medium tracking-wide text-[var(--color-fg-muted)] hover:text-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan)]/10 transition-colors"
    >
      {children}
    </Link>
  );
}
