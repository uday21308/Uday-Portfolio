import { skills } from "@/content/skills";
import { Reveal } from "@/components/ui/Reveal";
import { SkillsCard, type SkillIcon } from "./SkillsCard";

const ICONS: SkillIcon[] = ["sparkles", "brain", "server", "cloud"];
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
        {skills.map((cat, i) => (
          <Reveal key={cat.label} delay={i * 0.08} variant="bloom" className="h-full">
            <SkillsCard
              label={cat.label}
              items={cat.items}
              icon={ICONS[i % ICONS.length]}
              accentGradient={ACCENTS[i % ACCENTS.length]}
              reverse={i % 2 === 1}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
