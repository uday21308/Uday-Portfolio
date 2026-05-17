"use client";
import { useState } from "react";
import { HirePitchCard, type HirePitch } from "@/components/ai/HirePitchCard";

export default function HirePage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [data, setData] = useState<HirePitch | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null); setData(null);
    try {
      const res = await fetch("/api/hire", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ jd, company, role }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `http ${res.status}`);
      }
      setData(await res.json());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "unknown error");
    } finally { setLoading(false); }
  }

  function emailToUday() {
    if (!data) return;
    const subject = encodeURIComponent(`Fit analysis: ${role || "your role"} at ${company || "your company"}`);
    const body = encodeURIComponent(
      `Fit score: ${data.fitScore}/10\n\nStrengths:\n${data.strengths.map((s) => `• ${s}`).join("\n")}\n\nTailored bullets:\n${data.tailoredBullets.map((b) => `• ${b}`).join("\n")}\n\n${data.coverParagraph}`
    );
    window.location.href = `mailto:claude@mindcres.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="min-h-screen px-6 md:px-10 py-16 max-w-6xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] font-extrabold uppercase text-4xl md:text-5xl mb-2">
        See how I&apos;d fit <span className="italic font-[family-name:var(--font-serif)]">your</span> role
      </h1>
      <p className="text-[var(--color-fg-muted)] mb-10 max-w-xl">
        Paste a job description below — my AI Twin will return a structured fit analysis you can forward to the hiring team.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <form onSubmit={submit} className="space-y-4">
          <input
            value={company} onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="w-full bg-transparent border border-[var(--color-accent)]/20 rounded-md px-3 py-2 text-sm"
          />
          <input
            value={role} onChange={(e) => setRole(e.target.value)}
            placeholder="Role title"
            className="w-full bg-transparent border border-[var(--color-accent)]/20 rounded-md px-3 py-2 text-sm"
          />
          <textarea
            required minLength={20}
            value={jd} onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description…"
            rows={12}
            className="w-full bg-transparent border border-[var(--color-accent)]/20 rounded-md px-3 py-2 text-sm font-[family-name:var(--font-mono)] resize-y"
          />
          <button
            type="submit"
            disabled={loading || jd.length < 20}
            className="px-5 py-2 rounded-md bg-[var(--color-accent-cyan)]/20 hover:bg-[var(--color-accent-cyan)]/30 disabled:opacity-40 text-sm"
          >
            {loading ? "Analysing…" : "Generate fit analysis →"}
          </button>
          {err && <p className="text-sm text-red-400">Error: {err}</p>}
        </form>
        <div>
          {data ? (
            <HirePitchCard data={data} onEmail={emailToUday} />
          ) : (
            <div className="text-sm text-[var(--color-fg-muted)] italic">
              Your tailored analysis will appear here.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
