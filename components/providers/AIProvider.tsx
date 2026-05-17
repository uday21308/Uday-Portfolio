"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AIMode = "chat" | "game";

type Ctx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  mode: AIMode;
  setMode: (m: AIMode) => void;
};

const AIContext = createContext<Ctx | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [mode, setMode] = useState<AIMode>("chat");
  const value = useMemo<Ctx>(() => ({
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((v) => !v),
    mode,
    setMode,
  }), [isOpen, mode]);
  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI(): Ctx {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used inside <AIProvider>");
  return ctx;
}
