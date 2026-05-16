import { GitFork, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { withItalicAccents } from "@/components/ui/ItalicAccent";

export function Projects() {
  return (
    <section id="projects" className="px-6 md:px-10 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {projects.map((p) => (
            <article
              key={p.title}
              className="flex flex-col border border-[var(--color-accent)]/12 rounded-xl p-6 bg-[var(--color-accent)]/[0.02] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40"
            >
              <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase text-[var(--color-accent-cyan)] opacity-70">
                {p.year}
              </p>
              <h4 className="font-[family-name:var(--font-display-alt)] font-extrabold text-2xl uppercase tracking-[-0.005em] my-2.5">
                {p.title}
              </h4>
              <p className="font-[family-name:var(--font-sans)] text-[13.5px] leading-[1.55] text-[var(--color-fg-muted)] mb-3 flex-1">
                {withItalicAccents(p.description)}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="font-[family-name:var(--font-mono)] text-[10px] px-2.5 py-1 border border-[var(--color-accent)]/18 rounded-full text-[var(--color-accent)] opacity-90"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent)] hover:opacity-80 transition-opacity"
                >
                  <GitFork size={12} /> View on GitHub <ArrowUpRight size={12} />
                </a>
              ) : (
                <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-muted)]/60">
                  Android · private
                </span>
              )}
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11.5px] tracking-[0.18em] uppercase text-[var(--color-accent-cyan)] hover:text-[var(--color-accent)] transition-colors"
          >
            View all {site.totalRepoCount} repos at @{site.githubUsername} <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
