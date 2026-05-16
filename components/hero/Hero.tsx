"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { site } from "@/content/site";
import { withItalicAccents } from "@/components/ui/ItalicAccent";
import { HoloOrb } from "@/components/ui/HoloOrb";
import { ScrollCue } from "./ScrollCue";

const NeuralField = dynamic(() => import("./NeuralField").then((m) => m.NeuralField), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.2,
      });
      gsap.from(".hero-eyebrow, .hero-tagline", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.1,
        stagger: 0.2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
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
      <HoloOrb />
      <div className="relative z-10" />
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <p className="hero-eyebrow font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent-cyan)] mb-5 opacity-90">
          {site.role} · {site.org}
        </p>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold uppercase leading-[0.92] tracking-[-0.005em] m-0 mb-4 text-6xl md:text-8xl lg:text-[92px]">
          {site.heroLines.map((line, i) => (
            <span key={i} className="hero-line block">
              {withItalicAccents(line)}
            </span>
          ))}
        </h1>
        <p className="hero-tagline font-[family-name:var(--font-sans)] text-base md:text-lg opacity-[0.78] max-w-[580px] leading-[1.5]">
          {site.tagline}
        </p>
      </div>
      <ScrollCue />
    </section>
  );
}
