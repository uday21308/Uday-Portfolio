import { experience } from "@/content/experience";
import { withItalicAccents } from "@/components/ui/ItalicAccent";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  return (
    <section id="experience" className="px-6 md:px-10 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        {experience.map((entry, i) => (
          <Reveal key={entry.company} delay={i * 0.08}>
          <div
            className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-8 py-6 border-b border-[var(--color-accent)]/10"
          >
            <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-accent-cyan)] opacity-85 pt-1 whitespace-pre-line">
              {entry.dateRange.replace(" — ", "\n— ")}
            </p>
            <div>
              <h3 className="font-[family-name:var(--font-display-alt)] font-extrabold text-2xl md:text-3xl uppercase tracking-[-0.005em] m-0">
                {entry.role}
              </h3>
              <p className="font-[family-name:var(--font-sans)] text-sm text-[var(--color-accent-cyan)] mb-3 mt-1">
                {entry.company}
              </p>
              <ul className="font-[family-name:var(--font-sans)] text-sm md:text-[15px] leading-[1.6] text-[var(--color-fg-muted)] pl-5 list-disc space-y-1.5 marker:text-[var(--color-accent)]/50">
                {entry.bullets.map((b, i) => (
                  <li key={i}>{withItalicAccents(b)}</li>
                ))}
              </ul>
            </div>
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
