import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="px-6 md:px-10 py-6 text-center border-t border-[var(--color-accent)]/10">
      <p className="font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.14em] uppercase text-[var(--color-fg-muted)]/70">
        {site.name} · {new Date().getFullYear()} · Built with Next.js + R3F
      </p>
    </footer>
  );
}
