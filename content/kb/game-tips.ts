/**
 * Tip pools surfaced in the Bug Dodger game.
 *
 * `startTips` show on the Start and Game Over overlays — recruiter has time
 * to read a full sentence between rounds.
 *
 * `mascotBlurbs` float above the mascot mid-game for ~6s each, ~11-15s apart.
 * Keep them ≤22 characters so the bubble doesn't dominate the arena.
 *
 * All content is sourced from the resume, LinkedIn KB, FAQ, or projects-extra
 * — never fabricated. Edit freely to retune voice. No emojis — the site uses
 * lucide-react icons throughout for visual consistency.
 */

export const startTips: string[] = [
  // facts
  "Healthcare RAG: 93.3% precision across WHO + NIH guidelines.",
  "25-state voice bot · 2,300+ Pytest cases at 90%+ coverage.",
  "Code-Aware RAG chunks by AST nodes — 10× lever on retrieval quality.",
  "DenseNet-169 + TFLite on-device damage classifier · 82% → 95% accuracy.",

  // portfolio map
  "Portfolio map: Experience · 4 featured projects · Skills · Credentials · Contact.",
  "5 production-grade AI projects across RAG, agents, voice, MCP, vision.",
  "Full stack: Python, TypeScript, Groq, FAISS, MCP, Upstash, Vercel.",

  // CTAs
  "Hiring? Paste your JD into the Hire tab for a structured fit pitch.",
  "Technical recruiter? Wire this site into Claude Desktop via Connect.",
  "Want specifics? Ask in Chat — backed by real RAG over Uday's resume.",
  "Resume PDF is one click away — top-right of every page.",

  // personality
  "Uday's view: AI is 10% model, 90% glue. He likes writing the glue.",
];

export const mascotBlurbs: string[] = [
  // facts (tiny)
  "8-stage RAG · 93.3%",
  "25-state voice bot",
  "2,300+ Pytest cases",
  "Groq · FAISS · MCP",
  "10× via AST chunks",
  "DenseNet 82 → 95%",
  "I write the glue",
  "ship > demo",

  // CTAs (tiny)
  "Try Hire next →",
  "Wire me to Claude →",
  "Ask anything in Chat",
  "Resume up top",
  "5 projects below",
  "Email me to talk →",
];
