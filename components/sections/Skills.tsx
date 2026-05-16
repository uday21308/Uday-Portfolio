import { Sparkles, Brain, Server, Cloud } from "lucide-react";
import { skills } from "@/content/skills";
import { Reveal } from "@/components/ui/Reveal";

const ICONS = [Sparkles, Brain, Server, Cloud];
const ACCENTS = [
  "from-[var(--color-accent)]/30 to-transparent",
  "from-[var(--color-accent-cyan)]/30 to-transparent",
  "from-[var(--color-accent-violet)]/30 to-transparent",
  "from-[var(--color-accent)]/25 to-transparent",
];

export function Skills() {
  return (
    <section id="skills" className="px-6 md:px-10 py-20 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto auto-rows-fr">
        {skills.map((cat, i) => {
          const Icon = ICONS[i % ICONS.length];
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <Reveal key={cat.label} delay={i * 0.08} className="h-full">
              <div
                className={`group relative h-full p-6 rounded-2xl border border-[var(--color-accent)]/12 bg-[var(--color-bg-elevated)] overflow-hidden transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:-translate-y-0.5`}
              >
                <div
                  className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500`}
                />
                <div className="relative flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)]">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <h4 className="font-[family-name:var(--font-display-alt)] font-extrabold text-lg uppercase tracking-[-0.005em] text-[var(--color-fg)] m-0">
                    {cat.label}
                  </h4>
                </div>
                <div className="relative flex flex-wrap gap-1.5">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.04em] px-2.5 py-1 rounded-md border border-[var(--color-accent)]/15 bg-[var(--color-bg)]/40 text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
