import { skills } from "@/content/skills";
import { Reveal } from "@/components/ui/Reveal";

export function Skills() {
  return (
    <section id="skills" className="px-6 md:px-10 py-20 md:py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-5xl mx-auto">
        {skills.map((cat, i) => (
          <Reveal key={cat.label} delay={i * 0.06}>
            <div
              className="p-5 border border-[var(--color-accent)]/10 rounded-[10px] bg-[var(--color-accent)]/[0.015]"
            >
              <h5 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase text-[var(--color-accent-cyan)] opacity-85 mb-3 m-0">
                {cat.label}
              </h5>
              <p className="font-[family-name:var(--font-sans)] text-[13px] leading-[1.75] text-[var(--color-fg)] m-0">
                {cat.items.join(" · ")}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
