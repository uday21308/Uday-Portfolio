import { Braces, Sparkles, Brain } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import type { ComponentType } from "react";
import { credentials, type CredentialIcon, type CredentialAccent } from "@/content/credentials";
import { Reveal } from "@/components/ui/Reveal";

const ICONS: Record<CredentialIcon, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  claude: Braces,
  sparkles: Sparkles,
  google: FaGoogle,
  brain: Brain,
};

const ACCENT: Record<CredentialAccent, { color: string; bg: string; border: string; shadow: string }> = {
  cream: {
    color: "#f5e0aa",
    bg: "rgba(245,224,170,0.08)",
    border: "rgba(245,224,170,0.35)",
    shadow: "rgba(245,224,170,0.25)",
  },
  violet: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.35)",
    shadow: "rgba(167,139,250,0.25)",
  },
  cyan: {
    color: "#6ccfff",
    bg: "rgba(108,207,255,0.08)",
    border: "rgba(108,207,255,0.35)",
    shadow: "rgba(108,207,255,0.25)",
  },
  lime: {
    color: "#9aff9a",
    bg: "rgba(154,255,154,0.08)",
    border: "rgba(154,255,154,0.30)",
    shadow: "rgba(154,255,154,0.22)",
  },
};

export function Credentials() {
  return (
    <section id="certifications" className="px-6 md:px-10 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent)] opacity-80 mb-6 flex items-center gap-3">
          <span className="block w-8 h-px bg-[var(--color-accent)]/40" />
          Certifications
          <span className="block flex-1 h-px bg-[var(--color-accent)]/10" />
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {credentials.map((c, i) => {
            const Icon = ICONS[c.icon];
            const a = ACCENT[c.accent];
            return (
              <Reveal key={c.title} delay={i * 0.08} className="h-full">
                <article
                  className="group relative h-full flex flex-col p-5 rounded-xl border bg-[var(--color-bg-elevated)] overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: a.border,
                    boxShadow: `0 0 0 0 ${a.shadow}`,
                  }}
                  onMouseEnter={undefined}
                >
                  {/* corner glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-50 group-hover:opacity-90 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${a.bg} 0%, transparent 70%)`, backgroundColor: a.color, mixBlendMode: "screen", filter: "blur(40px)", opacity: 0.3 }}
                  />

                  {/* featured ribbon */}
                  {c.featured && (
                    <span
                      className="absolute top-3 right-3 font-[family-name:var(--font-mono)] text-[8.5px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: a.bg,
                        color: a.color,
                        border: `1px solid ${a.border}`,
                      }}
                    >
                      latest
                    </span>
                  )}

                  {/* icon */}
                  <div
                    className="relative flex items-center justify-center w-10 h-10 rounded-lg mb-4"
                    style={{
                      background: a.bg,
                      color: a.color,
                      border: `1px solid ${a.border}`,
                    }}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </div>

                  {/* title */}
                  <h4 className="relative font-[family-name:var(--font-display-alt)] font-extrabold text-[15px] leading-[1.15] uppercase tracking-[-0.005em] text-[var(--color-fg)] mb-2">
                    {c.title}
                  </h4>

                  {/* source */}
                  <p className="relative font-[family-name:var(--font-sans)] text-[12.5px] text-[var(--color-fg-muted)] leading-[1.45] flex-1">
                    {c.source}
                  </p>

                  {/* footer year */}
                  <div className="relative mt-3 pt-3 border-t border-[var(--color-accent)]/8 flex items-center justify-between">
                    <span
                      className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] uppercase font-semibold"
                      style={{ color: a.color }}
                    >
                      {c.meta}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[9.5px] tracking-[0.18em] uppercase text-[var(--color-fg-muted)]/50">
                      verified
                    </span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <style>{`
        #certifications article {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        #certifications article:hover {
          box-shadow: 0 12px 32px -8px rgba(0,0,0,.4), 0 0 24px -4px var(--accent-glow, rgba(245,224,170,0.25));
        }
      `}</style>
    </section>
  );
}
