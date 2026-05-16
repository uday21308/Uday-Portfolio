import { withItalicAccents } from "@/components/ui/ItalicAccent";

export type DividerProps = {
  number: string;
  label: string;
  titleLine1: string;
  titleLine2: string;
};

export function Divider({ number, label, titleLine1, titleLine2 }: DividerProps) {
  return (
    <section className="relative px-6 md:px-10 py-20 md:py-28 text-center bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-bg-elevated)]">
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase opacity-55 mb-5">
        {number} / {label}
      </p>
      <h2
        className="font-[family-name:var(--font-display)] font-extrabold uppercase leading-[0.92] tracking-[-0.005em] m-0 text-5xl md:text-7xl lg:text-8xl text-[var(--color-accent)]"
      >
        {withItalicAccents(titleLine1)}
        <br />
        {withItalicAccents(titleLine2)}
      </h2>
    </section>
  );
}
