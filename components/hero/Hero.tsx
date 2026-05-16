"use client";
import dynamic from "next/dynamic";
import { site } from "@/content/site";
import { withItalicAccents } from "@/components/ui/ItalicAccent";
import { ScrollCue } from "./ScrollCue";

const NeuralField = dynamic(() => import("./NeuralField").then((m) => m.NeuralField), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen px-6 md:px-10 pt-16 pb-24 flex flex-col justify-between overflow-hidden"
      style={{
        background:
          "radial-gradient(900px 380px at 70% 18%, rgba(167,139,250,.20) 0%, transparent 60%), radial-gradient(700px 320px at 25% 75%, rgba(108,207,255,.20) 0%, transparent 60%), var(--color-bg)",
      }}
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        <NeuralField />
      </div>
      <div className="relative z-10" />
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent-cyan)] mb-5 opacity-90">
          {site.role} · {site.org}
        </p>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold uppercase leading-[0.92] tracking-[-0.005em] m-0 mb-4 text-6xl md:text-8xl lg:text-[92px]">
          {site.heroLines.map((line, i) => (
            <span key={i} className="block">
              {withItalicAccents(line)}
            </span>
          ))}
        </h1>
        <p className="font-[family-name:var(--font-sans)] text-base md:text-lg opacity-[0.78] max-w-[580px] leading-[1.5]">
          {site.tagline}
        </p>
      </div>
      <ScrollCue />
    </section>
  );
}
