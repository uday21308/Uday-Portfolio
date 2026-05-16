import Link from "next/link";
import { site } from "@/content/site";

const links = [
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 py-4 bg-[var(--color-bg)]/85 backdrop-blur-md border-b border-[var(--color-accent)]/10">
      <Link
        href="#top"
        className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] uppercase text-[var(--color-accent)] font-semibold"
      >
        {site.shortName}
      </Link>
      <div className="hidden md:flex gap-6 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] uppercase opacity-75">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:opacity-100 transition-opacity">
            {l.label}
          </Link>
        ))}
      </div>
      <a
        href={site.resumePath}
        download
        className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] uppercase px-3.5 py-1.5 border border-[var(--color-accent)] rounded-full text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors"
      >
        Resume ↓
      </a>
    </nav>
  );
}
