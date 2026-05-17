"use client";

export type HirePitch = {
  fitScore: number;
  strengths: string[];
  tailoredBullets: string[];
  coverParagraph: string;
};

export function HirePitchCard({ data, onEmail }: { data: HirePitch; onEmail?: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">Fit score</div>
        <div className="flex items-end gap-3 mt-1">
          <div className="text-5xl font-bold text-[var(--color-accent-cyan)]">{data.fitScore}</div>
          <div className="text-sm text-[var(--color-fg-muted)] mb-1">/ 10</div>
        </div>
        <div className="mt-2 h-1.5 bg-[var(--color-bg-elevated)] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-violet)]"
            style={{ width: `${data.fitScore * 10}%` }}
          />
        </div>
      </div>
      <Section title="Key strengths">
        <ul className="space-y-1.5">
          {data.strengths.map((s, i) => (
            <li key={i} className="text-sm">• <span>{s}</span></li>
          ))}
        </ul>
      </Section>
      <Section title="Tailored bullets">
        <ul className="space-y-1.5">
          {data.tailoredBullets.map((b, i) => (
            <li key={i} className="text-sm">• <span>{b}</span></li>
          ))}
        </ul>
      </Section>
      <Section title="Cover paragraph">
        <p className="text-sm leading-relaxed">{data.coverParagraph}</p>
      </Section>
      {onEmail && (
        <button onClick={onEmail} className="w-full py-2 rounded-md bg-[var(--color-accent-cyan)]/20 hover:bg-[var(--color-accent-cyan)]/30 text-sm">
          📧 Email this to Uday
        </button>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mb-2">{title}</div>
      {children}
    </div>
  );
}
