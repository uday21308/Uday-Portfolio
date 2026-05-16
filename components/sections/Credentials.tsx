import { credentials } from "@/content/credentials";
import { Reveal } from "@/components/ui/Reveal";

export function Credentials() {
  return (
    <section id="certifications" className="px-6 md:px-10 py-20 md:py-24">
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent)] opacity-80 mb-4 max-w-5xl mx-auto">
        — Certifications
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {credentials.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <div
              className="p-4 border border-[var(--color-accent)]/10 rounded-[10px] font-[family-name:var(--font-sans)] text-xs text-[var(--color-fg-muted)]"
            >
              <strong className="block text-[var(--color-fg)] font-medium text-[13px] mb-1">
                {c.title}
              </strong>
              {c.source}
              <span className="block font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-accent)] opacity-70 tracking-[0.1em] uppercase mt-1.5">
                {c.meta}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
