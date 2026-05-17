import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { site } from "@/content/site";
import { HeaderSprite } from "./HeaderSprite";

const links = [
  { num: "01", label: "Experience", href: "/#experience" },
  { num: "02", label: "Projects", href: "/#projects" },
  { num: "03", label: "Contact", href: "/#contact" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 py-3.5 md:py-4 bg-[var(--color-bg)]/92 backdrop-blur-md border-b border-[var(--color-accent)]/15 overflow-hidden">
      <HeaderSprite />

      {/* Logo + status */}
      <Link
        href="/#top"
        className="relative z-10 group flex flex-col leading-none bg-[var(--color-bg)]/85 backdrop-blur-sm rounded-md px-2.5 py-1.5 -mx-2.5"
      >
        <span className="font-[family-name:var(--font-display-alt)] font-extrabold uppercase text-[17px] md:text-lg tracking-[-0.01em] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
          UDAY KIRAN.
        </span>
        <span className="hidden sm:flex items-center gap-2 mt-1 font-[family-name:var(--font-mono)] text-[8.5px] tracking-[0.22em] uppercase text-[var(--color-fg-muted)]/80">
          <span className="relative inline-flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-[var(--color-accent-cyan)] animate-ping opacity-60" />
            <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent-cyan)]" />
          </span>
          Open to AI / ML roles
        </span>
      </Link>

      {/* Center links — wrapped in a solid bg patch so the sprite slides behind cleanly */}
      <div className="relative z-10 hidden md:flex gap-6 lg:gap-8 bg-[var(--color-bg)]/85 backdrop-blur-sm rounded-full px-5 py-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="nav-link group relative flex items-baseline gap-1.5 transition-colors duration-200"
          >
            <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] text-[var(--color-accent-cyan)] opacity-75 group-hover:opacity-100 transition-opacity">
              {l.num}
            </span>
            <span className="font-[family-name:var(--font-display-alt)] font-bold text-[14px] md:text-[15px] uppercase tracking-[0.05em] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
              {l.label}
            </span>
            <span className="nav-underline absolute -bottom-1 left-[22px] right-0 h-px bg-[var(--color-accent)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
          </Link>
        ))}
      </div>

      {/* Resume CTA */}
      <a
        href={site.resumePath}
        download
        className="resume-pill relative z-10 group inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] md:text-[12px] tracking-[0.2em] uppercase font-semibold px-4 py-2 rounded-full border border-[var(--color-accent)]/80 text-[var(--color-accent)] bg-[var(--color-bg)]/90 hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] hover:shadow-[0_0_24px_-4px_var(--color-accent)] transition-all duration-300"
      >
        <span>Resume</span>
        <ArrowDown size={13} className="transition-transform duration-300 group-hover:translate-y-0.5" />
      </a>
    </nav>
  );
}
