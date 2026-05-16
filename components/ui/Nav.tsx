import Link from "next/link";
import { site } from "@/content/site";
import { HeaderSprite } from "./HeaderSprite";

const links = [
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 py-7 md:py-8 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-accent)]/15 overflow-hidden">
      <HeaderSprite />
      <Link
        href="#top"
        className="relative z-10 font-[family-name:var(--font-mono)] text-[13px] md:text-sm tracking-[0.18em] uppercase text-[var(--color-accent)] font-bold hover:opacity-80 transition-opacity"
      >
        {site.shortName}
      </Link>
      <div className="relative z-10 hidden md:flex gap-8 font-[family-name:var(--font-mono)] text-[13px] tracking-[0.18em] uppercase text-[var(--color-fg)] font-medium">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="opacity-85 hover:opacity-100 hover:text-[var(--color-accent)] transition-all"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <a
        href={site.resumePath}
        download
        className="relative z-10 font-[family-name:var(--font-mono)] text-[12px] md:text-[13px] tracking-[0.18em] uppercase px-4 py-2 border border-[var(--color-accent)] rounded-full text-[var(--color-accent)] font-semibold hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors bg-[var(--color-bg)]/80"
      >
        Resume ↓
      </a>
    </nav>
  );
}
