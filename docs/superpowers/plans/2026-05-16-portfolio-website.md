# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Uday Kiran Battula's high-end AI engineer portfolio site per spec `docs/superpowers/specs/2026-05-16-portfolio-website-design.md`. Free hosting on Vercel.

**Architecture:** Single-page Next.js 15 (App Router) site at route `/`. Sections compose top-down in `app/page.tsx`. Content lives in typed `content/*.ts` modules — no CMS. WebGL neural-particle hero via `@react-three/fiber`. Lenis-driven smooth scroll across the page. GSAP ScrollTrigger pins section dividers; Framer Motion handles per-component reveals. Built on Vercel free tier; auto HTTPS; preview deploys per PR.

**Tech Stack:** Next.js 15 · TypeScript · Tailwind CSS v4 · React Three Fiber + drei · `motion` (Framer Motion 12) · GSAP + ScrollTrigger · @studio-freight/lenis · next/font/google · lucide-react

**Target environment:** Windows · PowerShell · Node.js ≥ 20.

---

## File Structure (created across tasks)

```
D:\Portfolio/
├─ app/
│  ├─ layout.tsx                 (T2)  root, fonts, LenisProvider, metadata
│  ├─ page.tsx                   (T17) section composition
│  ├─ globals.css                (T2)  Tailwind + palette CSS vars
│  ├─ opengraph-image.tsx        (T19) dynamic OG image
│  ├─ robots.ts                  (T19) /robots.txt
│  └─ sitemap.ts                 (T19) /sitemap.xml
├─ components/
│  ├─ hero/
│  │  ├─ Hero.tsx                (T15) hero composition
│  │  ├─ NeuralField.tsx         (T16) R3F particle field
│  │  └─ ScrollCue.tsx           (T15) scroll-down hint
│  ├─ sections/
│  │  ├─ About.tsx               (T7)
│  │  ├─ Divider.tsx             (T6)  reused for all section dividers
│  │  ├─ Experience.tsx          (T8)
│  │  ├─ Projects.tsx            (T9)
│  │  ├─ Skills.tsx              (T10)
│  │  ├─ Credentials.tsx         (T13)
│  │  └─ Contact.tsx             (T14)
│  ├─ ui/
│  │  ├─ Nav.tsx                 (T4)
│  │  ├─ Footer.tsx              (T4)
│  │  ├─ ItalicAccent.tsx        (T4) <em> w/ Fraunces font + accent color
│  │  └─ Grain.tsx               (T4) SVG film-grain overlay
│  └─ providers/
│     └─ LenisProvider.tsx       (T5) Lenis + GSAP ScrollTrigger sync + reduced-motion
├─ content/
│  ├─ site.ts                    (T3) name, tagline, social links, resume path
│  ├─ experience.ts              (T3) Mindcres + Spinnaker
│  ├─ projects.ts                (T3) v1: Voice bot + Car damage
│  ├─ skills.ts                  (T3) 4 categories
│  └─ credentials.ts             (T3) degree + 3 certs
├─ lib/
│  ├─ fonts.ts                   (T2) next/font/google — single swap point
│  └─ cn.ts                      (T2) classnames helper
├─ public/
│  ├─ resume/Uday_Kiran_Battula_AIML.pdf  (T20)
│  └─ images/profile.jpg                  (T20)
├─ docs/superpowers/
│  ├─ specs/2026-05-16-portfolio-website-design.md   (already exists)
│  └─ plans/2026-05-16-portfolio-website.md          (this file)
├─ .gitignore                    (exists)
├─ next.config.ts                (T1)
├─ tailwind.config.ts            (T2)
├─ postcss.config.mjs            (T1)
├─ tsconfig.json                 (T1)
├─ eslint.config.mjs             (T1)
└─ package.json                  (T1)
```

---

## Conventions

- **Branch model:** Work on `main` directly (solo project). Commit after each task with a `type(scope): subject` prefix (`feat`, `chore`, `style`, `fix`, `test`, `docs`).
- **Verification checks** at end of every task:
  1. `npx tsc --noEmit` — TypeScript clean
  2. `npm run lint` — ESLint clean
  3. `npm run build` — Next.js builds without warnings
  4. Visual smoke in `npm run dev` at `http://localhost:3000` where applicable
- **TDD only where it pays:** This v1 has no testable pure data-shaping logic — all content is static typed TS. Visual components are verified in the browser + by passing `next build`. (If we later add live data fetches, that's the moment to introduce Vitest.)
- **No comments in code** unless capturing non-obvious WHY (per CLAUDE.md / system guidance).
- **Imports:** Use `@/` alias (configured by create-next-app) for everything under `app`, `components`, `content`, `lib`.

---

## Task 1: Bootstrap Next.js 15 + TypeScript + Tailwind v4

**Files:**
- Create entire scaffold under `D:\Portfolio\` via the official template.

**Why:** Single command produces a known-good baseline (App Router, TS, Tailwind v4, ESLint, `@/` alias). Skipping `create-next-app` and hand-rolling is error-prone.

- [ ] **Step 1: Confirm Node.js ≥ 20**

Run:
```powershell
node --version
```
Expected: `v20.x.x` or higher. If not, install Node 20 LTS from nodejs.org first.

- [ ] **Step 2: Initialize the Next.js app in the current directory**

Run from `D:\Portfolio`:
```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --yes
```

The `.` installs in the current directory. The interactive prompt asks "Would you like to remove existing files?" — answer **No** (we have `.gitignore`, `docs/`, `.superpowers/` that must be preserved). If it refuses to install due to non-empty directory, run the command with `--force`:
```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --yes --force
```

- [ ] **Step 3: Patch `.gitignore` to ensure `.superpowers/` and `node_modules/` are ignored**

The existing `.gitignore` already covers these; `create-next-app` may overwrite it. Verify by reading `D:\Portfolio\.gitignore` and ensure it contains:
```
.superpowers/
node_modules/
.next/
.env*.local
.vercel
```
If `create-next-app` overwrote and dropped `.superpowers/`, append the missing lines via Edit.

- [ ] **Step 4: Verify the dev server boots**

```powershell
npm run dev
```
Expected output includes `Local: http://localhost:3000`. Open the URL → see the default Next.js landing page. Stop the server with `Ctrl+C`.

- [ ] **Step 5: Initialize git and commit the scaffold**

```powershell
git init
git add .
git commit -m "chore: bootstrap next.js 15 + tailwind v4 scaffold"
```

---

## Task 2: Install runtime dependencies, fonts, palette, and global CSS

**Files:**
- Modify: `package.json` (dependencies)
- Create: `lib/fonts.ts`
- Create: `lib/cn.ts`
- Modify: `app/layout.tsx` (apply fonts + LenisProvider placeholder)
- Modify: `app/globals.css` (palette tokens, base styles)
- Modify: `tailwind.config.ts` (if present — Tailwind v4 uses CSS-first config; may not exist)

**Why:** All cross-cutting visual primitives (palette + 5 fonts) live in one place so we never duplicate them.

- [ ] **Step 1: Install runtime dependencies**

```powershell
npm install three @react-three/fiber @react-three/drei motion gsap @studio-freight/lenis lucide-react clsx tailwind-merge
```

- [ ] **Step 2: Install dev dependencies**

```powershell
npm install -D @types/three
```

- [ ] **Step 3: Create the classnames helper**

Create `D:\Portfolio\lib\cn.ts`:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Create the fonts module (single swap point)**

Create `D:\Portfolio\lib\fonts.ts`:
```typescript
import {
  Big_Shoulders_Stencil_Display,
  Big_Shoulders_Display,
  Fraunces,
  DM_Sans,
  Inter,
  JetBrains_Mono,
} from "next/font/google";

export const fontDisplay = Big_Shoulders_Stencil_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const fontDisplayAlt = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display-alt",
  display: "swap",
});

export const fontSerif = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-serif",
  display: "swap",
});

export const fontSans = DM_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const fontSansAlt = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-alt",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = [
  fontDisplay.variable,
  fontDisplayAlt.variable,
  fontSerif.variable,
  fontSans.variable,
  fontSansAlt.variable,
  fontMono.variable,
].join(" ");
```

- [ ] **Step 5: Write the global CSS (palette + base styles + grain)**

Replace the contents of `D:\Portfolio\app\globals.css` with:
```css
@import "tailwindcss";

@theme inline {
  --color-bg: #06080F;
  --color-bg-elevated: #0C0D18;
  --color-fg: #F0F0F3;
  --color-fg-muted: #CFD2DC;
  --color-accent: #F5E0AA;
  --color-accent-cyan: #6CCFFF;
  --color-accent-violet: #A78BFA;

  --font-display: var(--font-display);
  --font-display-alt: var(--font-display-alt);
  --font-serif: var(--font-serif);
  --font-sans: var(--font-sans);
  --font-sans-alt: var(--font-sans-alt);
  --font-mono: var(--font-mono);
}

html, body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  overflow-x: hidden;
}

::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}

/* respect reduced motion globally — components also honor this */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 6: Replace `app/layout.tsx` to wire fonts and base shell**

Overwrite `D:\Portfolio\app\layout.tsx`:
```tsx
import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uday Kiran Battula — AI / ML Engineer",
  description:
    "AI/ML engineer building voice agents, RAG pipelines, and MCP systems in production.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Replace `app/page.tsx` with a temporary placeholder**

Overwrite `D:\Portfolio\app\page.tsx`:
```tsx
export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-[family-name:var(--font-display)] text-6xl uppercase tracking-tight">
        Uday Kiran
        <em className="font-[family-name:var(--font-serif)] not-italic text-[var(--color-accent)] italic"> Battula.</em>
      </h1>
    </main>
  );
}
```

- [ ] **Step 8: Run the dev server and visually verify**

```powershell
npm run dev
```
Open `http://localhost:3000` → name should render in Big Shoulders Stencil (uppercase, condensed) with "Battula." in italic warm-cream Fraunces. Background should be near-black (`#06080F`). Stop server.

- [ ] **Step 9: Verify build + TS + lint**

```powershell
npx tsc --noEmit
npm run lint
npm run build
```
All three must exit 0.

- [ ] **Step 10: Commit**

```powershell
git add lib app globals.css package.json package-lock.json
git commit -m "feat: install deps, configure fonts, palette, and global styles"
```

---

## Task 3: Write all content modules

**Files:**
- Create: `content/site.ts`
- Create: `content/experience.ts`
- Create: `content/projects.ts`
- Create: `content/skills.ts`
- Create: `content/credentials.ts`

**Why:** Locking all content as typed TS up-front means every section component just reads from a typed source — no inline strings, no churn later when content changes.

- [ ] **Step 1: Create `content/site.ts`**

```typescript
export const site = {
  name: "Uday Kiran Battula",
  shortName: "Uday Kiran",
  role: "AI / ML Engineer",
  org: "Mindcres",
  tagline:
    "Voice agents, RAG pipelines, MCP tools, and the production glue that makes them all stop being demos.",
  heroLines: ["BUILDING", "*intelligent*", "SYSTEMS THAT SHIP."] as const,
  email: "udaykiranbattula304@gmail.com",
  links: {
    linkedin: "https://linkedin.com/in/uday-kiran-22053b285",
    github: "https://github.com/uday21308",
  },
  githubUsername: "uday21308",
  resumePath: "/resume/Uday_Kiran_Battula_AIML.pdf",
  profileImage: "/images/profile.jpg",
  totalRepoCount: 11,
} as const;

export type Site = typeof site;
```

- [ ] **Step 2: Create `content/experience.ts`**

```typescript
export type ExperienceEntry = {
  dateRange: string;
  role: string;
  company: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    dateRange: "MAR 2026 — NOW",
    role: "AI / ML Engineer",
    company: "Mindcres Technologies",
    bullets: [
      "Architecting *25-state* voice + web grievance bot for an Indian state-government portal · Gemini · Sarvam AI · Exotel WebSocket telephony",
      "*4 microservices* · FastAPI async · provider-swap toolkit for LLM / OCR / Speech · YAML-driven prompts · Redis rate limiting",
      "Refactoring 7,000+ line monolith into modular services · *90%+* Pytest coverage · Langfuse observability",
    ],
  },
  {
    dateRange: "SEP 2025 — FEB 2026",
    role: "AI Engineer Intern",
    company: "Spinnaker Analytics · Remote · US",
    bullets: [
      "8-stage RAG pipeline · *93.3%* retrieval precision · FAISS + sentence-transformers",
      "Equity Filings Agent · 10-K/10-Q automation · adapter-pattern loaders",
      "FastMCP server · 3 agentic tools · Claude Desktop integration",
    ],
  },
];
```

Bullets use `*text*` for italic-accent words; the `ItalicAccent` parser (Task 4) converts them.

- [ ] **Step 3: Create `content/projects.ts`**

```typescript
export type Project = {
  year: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
};

export const projects: Project[] = [
  {
    year: "2026",
    title: "Healthcare RAG Assistant",
    description:
      "8-stage RAG pipeline over 69 clinical documents (345 chunks) · sentence-transformers + FAISS · *93.3%* retrieval precision · section re-ranking + token-overlap validation + 25% confidence threshold for safety-first clinical decision support.",
    tags: ["FAISS", "sentence-transformers", "RAG", "Python"],
    link: "https://github.com/uday21308/Healthcare-RAG-Assistant",
  },
  {
    year: "2025",
    title: "E-Commerce Voice Bot",
    description:
      "Full-stack voice assistant · React + Web Speech API · 4 intents · classification router preventing hallucinated order IDs · ChromaDB RAG over 500-item / 30+ category inventory · LangSmith tracing for full audit trail.",
    tags: ["React", "ChromaDB", "RAG", "LangSmith"],
    link: "https://github.com/uday21308/Ecommerce-AI-voice-text-Assistant",
  },
  {
    year: "2026",
    title: "AI-Powered Equity Filings Agent",
    description:
      "10-K / 10-Q automation · adapter-pattern document loaders · lexicon-based scoring · strict grounding prompts to prioritize precision over recall · structured reports in seconds vs hours of manual reading.",
    tags: ["LLM", "Adapters", "Finance NLP", "Python"],
    link: "https://github.com/uday21308/AI-Powered-Equity-Filings-Summarization-Risk-Insight-Agent",
  },
  {
    year: "2026",
    title: "Expense Tracker MCP",
    description:
      "Model Context Protocol server over STDIO transport (FastMCP) · 3 agentic tools with SQLite persistence · Claude Desktop integration · protocol-level LLM-tool invocation from natural-language intent without hardcoded validation.",
    tags: ["FastMCP", "Claude", "SQLite", "MCP"],
    link: "https://github.com/uday21308/Expense-Tracker-MCP",
  },
  {
    year: "2024",
    title: "Car Damage → Mobile",
    description:
      "DenseNet-169 fine-tune · 6 damage classes (cracks, dents, scratches, glass shatter, flat tyres, lamp breakage) · *95%* accuracy from a 82% CNN baseline · exported to TFLite · native Kotlin Android app for on-device offline inference.",
    tags: ["PyTorch", "TFLite", "Kotlin", "DenseNet"],
  },
];
```

- [ ] **Step 4: Create `content/skills.ts`**

```typescript
export type SkillCategory = {
  label: string;
  items: string[];
};

export const skills: SkillCategory[] = [
  {
    label: "LLMs · GenAI",
    items: [
      "Gemini",
      "OpenAI",
      "Claude",
      "Groq",
      "LangChain",
      "LiteLLM",
      "MCP",
      "RAG",
      "Agentic systems",
    ],
  },
  {
    label: "ML · Vision",
    items: ["PyTorch", "TensorFlow", "Keras", "DenseNet", "Transfer Learning", "TFLite", "NLP"],
  },
  {
    label: "Backend · Data",
    items: [
      "FastAPI",
      "async/asyncpg",
      "PostgreSQL",
      "Redis",
      "SQLAlchemy",
      "FastMCP",
      "Pydantic",
    ],
  },
  {
    label: "DevOps · Obs",
    items: [
      "Docker",
      "Dokku",
      "GitHub Actions",
      "Langfuse",
      "LangSmith",
      "Pytest",
      "Android Studio",
    ],
  },
];
```

- [ ] **Step 5: Create `content/credentials.ts`**

```typescript
export type Credential = {
  title: string;
  source: string;
  meta: string;
};

export const credentials: Credential[] = [
  {
    title: "B.Tech in Computer Science",
    source: "Amrita Vishwa Vidyapeetham · 7.57 / 10",
    meta: "2021 — 2025",
  },
  {
    title: "Introduction to Generative AI",
    source: "Google Cloud Skills Boost",
    meta: "cert",
  },
  {
    title: "GenAI + Agentic AI Development",
    source: "Boston Institute of Analytics",
    meta: "cert",
  },
  {
    title: "Machine Learning with Python",
    source: "Infosys Springboard",
    meta: "cert",
  },
];
```

- [ ] **Step 6: TS-check and commit**

```powershell
npx tsc --noEmit
git add content
git commit -m "feat(content): add typed content modules for all sections"
```

---

## Task 4: Build UI primitives (Grain, ItalicAccent, Nav, Footer)

**Files:**
- Create: `components/ui/Grain.tsx`
- Create: `components/ui/ItalicAccent.tsx`
- Create: `components/ui/Nav.tsx`
- Create: `components/ui/Footer.tsx`

**Why:** Four small reusable pieces that every section needs. Building them now keeps section tasks short.

- [ ] **Step 1: Create `components/ui/Grain.tsx`**

```tsx
export function Grain({ opacity = 0.11 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-overlay"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
```

- [ ] **Step 2: Create `components/ui/ItalicAccent.tsx`**

This parses `*text*` markers in strings and wraps them in styled `<em>`. Used by Experience bullets, About paragraphs, Hero, Contact.

```tsx
import { Fragment } from "react";

const TOKEN = /\*([^*]+)\*/g;

export function withItalicAccents(input: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = TOKEN.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={key++}>{input.slice(lastIndex, match.index)}</Fragment>);
    }
    parts.push(
      <em
        key={key++}
        className="font-[family-name:var(--font-serif)] italic font-medium text-[var(--color-accent)]"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1' }}
      >
        {match[1]}
      </em>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < input.length) {
    parts.push(<Fragment key={key++}>{input.slice(lastIndex)}</Fragment>);
  }
  return parts;
}

export function ItalicAccent({ children }: { children: string }) {
  return <>{withItalicAccents(children)}</>;
}
```

- [ ] **Step 3: Create `components/ui/Nav.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `components/ui/Footer.tsx`**

```tsx
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
```

- [ ] **Step 5: TS-check, lint, commit**

```powershell
npx tsc --noEmit
npm run lint
git add components
git commit -m "feat(ui): add Grain, ItalicAccent, Nav, Footer primitives"
```

---

## Task 5: Build LenisProvider with GSAP sync and reduced-motion handling

**Files:**
- Create: `components/providers/LenisProvider.tsx`
- Modify: `app/layout.tsx` (wrap children)

**Why:** Smooth scroll must be installed first so all subsequent components scroll inside it. Reduced-motion bypass is wired here so individual sections don't need to repeat it.

- [ ] **Step 1: Create the provider**

Create `D:\Portfolio\components\providers\LenisProvider.tsx`:
```tsx
"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Wrap children in `app/layout.tsx`**

Edit `D:\Portfolio\app\layout.tsx` — replace the `<body>{children}</body>` line with:
```tsx
import { LenisProvider } from "@/components/providers/LenisProvider";
```
(at top, with other imports), and change the body to:
```tsx
<body>
  <LenisProvider>{children}</LenisProvider>
</body>
```

- [ ] **Step 3: Verify smooth scroll**

Add temporary spacers to `app/page.tsx` to make the page scrollable, e.g. add `<div className="h-[3000px]" />` after the `<main>`. Run `npm run dev`, scroll → should feel buttery, not native-jumpy. Remove the spacer.

- [ ] **Step 4: Verify build**

```powershell
npx tsc --noEmit
npm run build
```

- [ ] **Step 5: Commit**

```powershell
git add components/providers app/layout.tsx
git commit -m "feat: add LenisProvider with GSAP sync and reduced-motion bypass"
```

---

## Task 6: Build Divider component

**Files:**
- Create: `components/sections/Divider.tsx`

**Why:** Reused 4 times. Defines the consistent rhythm between sections.

- [ ] **Step 1: Create the component**

```tsx
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
```

The italic-accent words use the same `*text*` marker convention (e.g. `"production."` → italicized with stars: `"*production.*"`).

- [ ] **Step 2: Visual smoke-check in isolation**

Temporarily add to `app/page.tsx`:
```tsx
import { Divider } from "@/components/sections/Divider";
// inside <main>:
<Divider number="01" label="Selected Work" titleLine1="Built in" titleLine2="*production.*" />
```
Run `npm run dev`. Verify the giant stencil display + warm-cream italic accent on "production." renders correctly. Remove the temp lines.

- [ ] **Step 3: Commit**

```powershell
git add components/sections/Divider.tsx
git commit -m "feat(sections): add reusable Divider component"
```

---

## Task 7: Build About section

**Files:**
- Create: `components/sections/About.tsx`

**Why:** First content section. Establishes the section-padding rhythm used by Experience/Projects/Skills/GitHub.

- [ ] **Step 1: Create the component**

```tsx
import Image from "next/image";
import { site } from "@/content/site";
import { withItalicAccents } from "@/components/ui/ItalicAccent";

const paragraphs = [
  "AI / ML Engineer at *Mindcres*, architecting a multilingual voice grievance bot for a state-government portal — 25-state conversation flow, 4 FastAPI microservices, 2,300+ Pytest cases at 90%+ coverage.",
  "Previously at *Spinnaker Analytics*, shipped an 8-stage healthcare RAG pipeline hitting 93.3% precision, and a FastMCP server with Claude Desktop integration.",
  "I care about systems that *survive* contact with reality — not demos.",
  "*AI engineering is 10% models, 90% the glue.* I like writing the glue.",
];

export function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-20 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 md:gap-10 items-start max-w-5xl mx-auto">
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden border border-[var(--color-accent)]/20 bg-gradient-to-br from-[#1a1a2a] to-[var(--color-bg)]">
          <Image
            src={site.profileImage}
            alt={site.name}
            width={120}
            height={120}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[family-name:var(--font-sans)] text-base md:text-lg leading-[1.65] mb-3.5 text-[var(--color-fg-muted)] max-w-[620px]"
            >
              {withItalicAccents(p)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/sections/About.tsx
git commit -m "feat(sections): add About section"
```

---

## Task 8: Build Experience section

**Files:**
- Create: `components/sections/Experience.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { experience } from "@/content/experience";
import { withItalicAccents } from "@/components/ui/ItalicAccent";

export function Experience() {
  return (
    <section id="experience" className="px-6 md:px-10 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        {experience.map((entry) => (
          <div
            key={entry.company}
            className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-8 py-6 border-b border-[var(--color-accent)]/10"
          >
            <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-[var(--color-accent-cyan)] opacity-85 pt-1 whitespace-pre-line">
              {entry.dateRange.replace(" — ", "\n— ")}
            </p>
            <div>
              <h3 className="font-[family-name:var(--font-display-alt)] font-extrabold text-2xl md:text-3xl uppercase tracking-[-0.005em] m-0">
                {entry.role}
              </h3>
              <p className="font-[family-name:var(--font-sans)] text-sm text-[var(--color-accent-cyan)] mb-3 mt-1">
                {entry.company}
              </p>
              <ul className="font-[family-name:var(--font-sans)] text-sm md:text-[15px] leading-[1.6] text-[var(--color-fg-muted)] pl-5 list-disc space-y-1.5 marker:text-[var(--color-accent)]/50">
                {entry.bullets.map((b, i) => (
                  <li key={i}>{withItalicAccents(b)}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/sections/Experience.tsx
git commit -m "feat(sections): add Experience timeline"
```

---

## Task 9: Build Projects section

**Files:**
- Create: `components/sections/Projects.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Github, ArrowUpRight } from "lucide-react";
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
                  <Github size={12} /> View on GitHub <ArrowUpRight size={12} />
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
```

- [ ] **Step 2: Commit**

```powershell
git add components/sections/Projects.tsx
git commit -m "feat(sections): add Projects grid"
```

---

## Task 10: Build Skills section

**Files:**
- Create: `components/sections/Skills.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { skills } from "@/content/skills";

export function Skills() {
  return (
    <section id="skills" className="px-6 md:px-10 py-20 md:py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-5xl mx-auto">
        {skills.map((cat) => (
          <div
            key={cat.label}
            className="p-5 border border-[var(--color-accent)]/10 rounded-[10px] bg-[var(--color-accent)]/[0.015]"
          >
            <h5 className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase text-[var(--color-accent-cyan)] opacity-85 mb-3 m-0">
              {cat.label}
            </h5>
            <p className="font-[family-name:var(--font-sans)] text-[13px] leading-[1.75] text-[var(--color-fg)] m-0">
              {cat.items.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/sections/Skills.tsx
git commit -m "feat(sections): add Skills grid"
```

---

## Task 11: ~~Build `lib/github.ts`~~ — REMOVED

Originally a build-time GraphQL fetch for a contribution heatmap. Removed during the design refinement after the user clarified that their substantive activity lives on a private company GitHub account. The personal account would have made the heatmap look misleadingly sparse. Project GitHub links are now hard-coded in `content/projects.ts` (T3) and rendered as repo CTAs on each Project card (T9). No fetch, no env vars, no Vitest setup.

**Skip directly to Task 12.**

---

## Task 12: ~~Build GitHub section~~ — REMOVED

Replaced by the "View all 11 repos" CTA inside the Projects component (added in the updated T9). Per-project GitHub links also live inside each project card. **Skip directly to Task 13.**

---

## Task 13: Build Credentials section

**Files:**
- Create: `components/sections/Credentials.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { credentials } from "@/content/credentials";

export function Credentials() {
  return (
    <section id="credentials" className="px-6 md:px-10 py-20 md:py-24">
      <p className="font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.2em] uppercase text-[var(--color-accent)] opacity-70 mb-4 max-w-5xl mx-auto">
        — Credentials
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {credentials.map((c) => (
          <div
            key={c.title}
            className="p-4 border border-[var(--color-accent)]/10 rounded-[10px] font-[family-name:var(--font-sans)] text-xs text-[var(--color-fg-muted)]"
          >
            <strong className="block text-[var(--color-fg)] font-medium text-[13px] mb-1">
              {c.title}
            </strong>
            {c.source}
            <span className="block font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-accent)] opacity-70 tracking-[0.1em] uppercase mt-1.5">
              {c.meta}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/sections/Credentials.tsx
git commit -m "feat(sections): add Credentials strip"
```

---

## Task 14: Build Contact section

**Files:**
- Create: `components/sections/Contact.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Mail, Linkedin, Github, ArrowDown } from "lucide-react";
import { site } from "@/content/site";
import { withItalicAccents } from "@/components/ui/ItalicAccent";

export function Contact() {
  return (
    <section id="contact" className="px-6 md:px-10 py-24 md:py-28 text-center">
      <h2 className="font-[family-name:var(--font-display)] font-extrabold text-5xl md:text-7xl lg:text-[80px] uppercase leading-[0.95] tracking-[-0.005em] m-0 mb-3.5">
        {withItalicAccents("LET'S")}
        <br />
        {withItalicAccents("*build*")}
        <br />
        {withItalicAccents("SOMETHING.")}
      </h2>
      <p className="font-[family-name:var(--font-sans)] italic text-base md:text-lg text-[var(--color-fg-muted)] opacity-85 mb-7">
        open to senior AI / ML roles · agentic systems · voice + RAG infra
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <a
          href={site.resumePath}
          download
          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.16em] uppercase px-5 py-3 border border-[var(--color-accent)] rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:bg-transparent hover:text-[var(--color-accent)] transition-colors"
        >
          Download Resume <ArrowDown size={14} />
        </a>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.16em] uppercase px-5 py-3 border border-[var(--color-accent)]/25 rounded-full hover:border-[var(--color-accent)] transition-colors"
        >
          <Mail size={14} /> Email
        </a>
        <a
          href={site.links.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.16em] uppercase px-5 py-3 border border-[var(--color-accent)]/25 rounded-full hover:border-[var(--color-accent)] transition-colors"
        >
          <Linkedin size={14} /> LinkedIn
        </a>
        <a
          href={site.links.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.16em] uppercase px-5 py-3 border border-[var(--color-accent)]/25 rounded-full hover:border-[var(--color-accent)] transition-colors"
        >
          <Github size={14} /> GitHub
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/sections/Contact.tsx
git commit -m "feat(sections): add Contact CTA"
```

---

## Task 15: Build Hero shell (text + scroll cue, NO WebGL yet)

**Files:**
- Create: `components/hero/Hero.tsx`
- Create: `components/hero/ScrollCue.tsx`

**Why:** Ship the text composition first to confirm typography reads correctly at hero scale. WebGL is layered on top in T16 without touching this file.

- [ ] **Step 1: Create the scroll cue**

```tsx
// components/hero/ScrollCue.tsx
export function ScrollCue() {
  return (
    <p
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2 bottom-5 z-30 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase text-[var(--color-accent-cyan)] opacity-60 animate-pulse"
    >
      Scroll ↓
    </p>
  );
}
```

- [ ] **Step 2: Create the Hero**

```tsx
// components/hero/Hero.tsx
import { site } from "@/content/site";
import { withItalicAccents } from "@/components/ui/ItalicAccent";
import { ScrollCue } from "./ScrollCue";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen px-6 md:px-10 pt-16 pb-24 flex flex-col justify-between overflow-hidden"
      style={{
        background:
          "radial-gradient(900px 380px at 70% 18%, rgba(167,139,250,.20) 0%, transparent 60%), radial-gradient(700px 320px at 25% 75%, rgba(108,207,255,.20) 0%, transparent 60%), var(--color-bg)",
      }}
    >
      {/* WebGL slot — filled in T16 */}
      <div className="absolute inset-0 z-0" id="neural-slot" />
      <div className="relative z-10" />
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] uppercase text-[var(--color-accent-cyan)] mb-5 opacity-90">
          {site.role} · {site.org}
        </p>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold uppercase leading-[0.92] tracking-[-0.005em] m-0 mb-4 text-6xl md:text-8xl lg:text-[92px]">
          {site.heroLines.map((line, i) => (
            <span key={i} className="block">
              {withItalicAccents(line)}
            </span>
          ))}
        </h1>
        <p className="font-[family-name:var(--font-sans)] text-base md:text-lg opacity-78 max-w-[580px] leading-[1.5]">
          {site.tagline}
        </p>
      </div>
      <ScrollCue />
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```powershell
git add components/hero
git commit -m "feat(hero): add hero shell with text composition and scroll cue"
```

---

## Task 16: Build NeuralField (R3F particle field)

**Files:**
- Create: `components/hero/NeuralField.tsx`
- Modify: `components/hero/Hero.tsx` (mount NeuralField inside `#neural-slot`)

**Why:** Isolating the WebGL into its own component keeps the Hero markup readable and means the field can be swapped/lazy-loaded later.

- [ ] **Step 1: Create the scene**

```tsx
// components/hero/NeuralField.tsx
"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Particles({ count = 800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#6CCFFF"),
      new THREE.Color("#A78BFA"),
      new THREE.Color("#F5E0AA"),
    ];
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const c = palette[i % palette.length];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = Math.sin(t * 0.05) * 0.15;
    pointsRef.current.rotation.x = Math.cos(t * 0.04) * 0.08;
    // gentle parallax based on pointer
    pointsRef.current.position.x = state.pointer.x * 0.4;
    pointsRef.current.position.y = state.pointer.y * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function NeuralField() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.3} />
      <Particles count={800} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Mount it inside the Hero**

Edit `D:\Portfolio\components\hero\Hero.tsx` — replace the empty `<div ... id="neural-slot" />` with a dynamic import that respects reduced-motion. Add at the top:
```tsx
import dynamic from "next/dynamic";

const NeuralField = dynamic(() => import("./NeuralField").then((m) => m.NeuralField), {
  ssr: false,
  loading: () => null,
});
```
And change the slot div to:
```tsx
<div className="absolute inset-0 z-0" aria-hidden>
  <NeuralField />
</div>
```

- [ ] **Step 3: Visual check**

```powershell
npm run dev
```
Open `http://localhost:3000`. Hero should show drifting tri-color particles behind the title. Move cursor → particle field parallaxes subtly. Stop server.

- [ ] **Step 4: Build check**

```powershell
npm run build
```
Should succeed. Three.js bundle should add to the page but be lazy-loaded.

- [ ] **Step 5: Commit**

```powershell
git add components/hero
git commit -m "feat(hero): add R3F neural particle field with parallax"
```

---

## Task 17: Compose the page

**Files:**
- Modify: `app/page.tsx` (full composition)

**Why:** All section components exist; now wire them into the single-page scroll in the spec's defined order.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { Nav } from "@/components/ui/Nav";
import { Grain } from "@/components/ui/Grain";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Divider } from "@/components/sections/Divider";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Credentials } from "@/components/sections/Credentials";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <Grain />
      <Nav />
      <main>
        <Hero />
        <About />
        <Divider number="01" label="Selected Work" titleLine1="Built in" titleLine2="*production.*" />
        <Experience />
        <Divider number="02" label="Projects" titleLine1="Things" titleLine2="I *built.*" />
        <Projects />
        <Divider number="03" label="Stack" titleLine1="Tools of" titleLine2="the *trade.*" />
        <Skills />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify everything renders end-to-end**

```powershell
npm run dev
```
Open `http://localhost:3000`. Scroll through entire page. Every section must render with real content from `content/*.ts`. No console errors.

- [ ] **Step 3: Build**

```powershell
npx tsc --noEmit
npm run build
```

- [ ] **Step 4: Commit**

```powershell
git add app/page.tsx
git commit -m "feat: compose single-page scroll with all sections"
```

---

## Task 18: Scroll-reveal animations (Framer Motion `whileInView`)

**Files:**
- Create: `components/ui/Reveal.tsx`
- Modify: `components/sections/About.tsx`, `Experience.tsx`, `Projects.tsx`, `Skills.tsx`, `Credentials.tsx`, `Contact.tsx` (wrap rows/cards in `<Reveal>`)

**Why:** A single reusable `<Reveal>` keeps the reveal language consistent and lets us tune timing in one place.

- [ ] **Step 1: Create `Reveal.tsx`**

```tsx
"use client";
import { motion, type MotionProps } from "motion/react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
} & Omit<MotionProps, "children">;

export function Reveal({ children, delay = 0, y = 24, className, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Wrap each section's main block**

In `About.tsx`, wrap the inner grid in `<Reveal>`:
```tsx
import { Reveal } from "@/components/ui/Reveal";
// ...
<Reveal className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 md:gap-10 items-start max-w-5xl mx-auto">
```
(Remove the `className` from the original `<div>` since `Reveal` now carries it.)

In `Experience.tsx`, wrap each `entry` row:
```tsx
{experience.map((entry, i) => (
  <Reveal key={entry.company} delay={i * 0.08}>
    <div className="grid ...">...</div>
  </Reveal>
))}
```

In `Projects.tsx`, wrap each card in `<Reveal delay={i * 0.08}>`.

In `Skills.tsx`, wrap each `<div>` in `<Reveal delay={i * 0.06}>`.

In `Credentials.tsx`, wrap each `<div>` in `<Reveal delay={i * 0.06}>`.

In `Contact.tsx`, wrap the `<h2>` and the `<div class="flex...">` each in `<Reveal>`.

- [ ] **Step 3: Visual check + build**

```powershell
npm run dev
# scroll through, confirm each section reveals smoothly once
npm run build
```

- [ ] **Step 4: Commit**

```powershell
git add components
git commit -m "feat(motion): add scroll-reveal animations to all sections"
```

---

## Task 19: SEO — metadata, OG image, robots, sitemap

**Files:**
- Modify: `app/layout.tsx` (full metadata)
- Create: `app/opengraph-image.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`

**Why:** Recruiters Google candidates by name; SEO + a strong OG card determine whether the site shows up and whether it shares well on LinkedIn.

- [ ] **Step 1: Expand `metadata` in `app/layout.tsx`**

Replace the existing `metadata` constant with:
```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://udaykiran.vercel.app"),
  title: {
    default: "Uday Kiran Battula — AI / ML Engineer",
    template: "%s · Uday Kiran Battula",
  },
  description:
    "AI / ML engineer at Mindcres. Voice agents, RAG pipelines, MCP tools, and the production glue that makes them stop being demos.",
  keywords: [
    "AI engineer",
    "ML engineer",
    "LLM",
    "RAG",
    "MCP",
    "voice agents",
    "Uday Kiran Battula",
  ],
  authors: [{ name: "Uday Kiran Battula" }],
  openGraph: {
    type: "website",
    url: "https://udaykiran.vercel.app",
    title: "Uday Kiran Battula — AI / ML Engineer",
    description:
      "AI / ML engineer building voice agents, RAG pipelines, and MCP systems in production.",
    siteName: "Uday Kiran Battula",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uday Kiran Battula — AI / ML Engineer",
    description: "AI / ML engineer building voice agents, RAG, and MCP systems in production.",
  },
  robots: { index: true, follow: true },
};
```

Note: `metadataBase` URL is a placeholder; update it after the Vercel deploy in T22 if the actual subdomain differs.

- [ ] **Step 2: Create the dynamic OG image route**

Create `D:\Portfolio\app\opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(900px 380px at 70% 18%, rgba(167,139,250,.30) 0%, transparent 60%), radial-gradient(700px 320px at 25% 75%, rgba(108,207,255,.30) 0%, transparent 60%), #06080F",
          color: "#F0F0F3",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#6CCFFF", textTransform: "uppercase" }}>
          AI / ML Engineer · Mindcres
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.92 }}>
          <div style={{ fontSize: 140, fontWeight: 800, textTransform: "uppercase", letterSpacing: -1 }}>
            UDAY KIRAN
          </div>
          <div
            style={{
              fontSize: 140,
              fontStyle: "italic",
              color: "#F5E0AA",
              letterSpacing: -2,
            }}
          >
            Battula.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#CFD2DC", opacity: 0.85 }}>
          udaykiran.vercel.app
        </div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 3: Create `app/robots.ts`**

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://udaykiran.vercel.app/sitemap.xml",
  };
}
```

- [ ] **Step 4: Create `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://udaykiran.vercel.app", lastModified: new Date() },
  ];
}
```

- [ ] **Step 5: Build and verify**

```powershell
npm run build
```
The build output should list `/opengraph-image`, `/robots.txt`, `/sitemap.xml` as generated routes.

- [ ] **Step 6: Commit**

```powershell
git add app
git commit -m "feat(seo): add metadata, og image, robots, sitemap"
```

---

## Task 20: Place static assets (resume PDF + LinkedIn profile photo)

**Files:**
- Create: `public/resume/Uday_Kiran_Battula_AIML.pdf` (copy from `E:\place\my resumes\Roles\`)
- Create: `public/images/profile.jpg` (user must download from LinkedIn first)

**Why:** Until these exist the resume CTA returns 404 and the About `<Image>` throws.

- [ ] **Step 1: Create folders and copy resume**

```powershell
New-Item -ItemType Directory -Force -Path "D:\Portfolio\public\resume"
Copy-Item "E:\place\my resumes\Roles\Uday_Kiran_Battula_AIML.pdf" "D:\Portfolio\public\resume\Uday_Kiran_Battula_AIML.pdf"
```
Verify:
```powershell
Test-Path "D:\Portfolio\public\resume\Uday_Kiran_Battula_AIML.pdf"
```
Expected: `True`.

- [ ] **Step 2: Download LinkedIn profile photo**

The user must save their LinkedIn profile photo as a JPG at `D:\Portfolio\public\images\profile.jpg`. Right-click profile photo on LinkedIn → Save image as. Recommended size: 400x400 minimum. Create the folder first:
```powershell
New-Item -ItemType Directory -Force -Path "D:\Portfolio\public\images"
```
After the user saves the file, verify:
```powershell
Test-Path "D:\Portfolio\public\images\profile.jpg"
```
Expected: `True`. If this step is blocked on the user, use a placeholder image (any square JPG ~400x400) committed in its place, and ask the user to swap later.

- [ ] **Step 3: Verify the resume link works in dev**

```powershell
npm run dev
```
Open `http://localhost:3000`, click "Resume ↓" in nav → PDF should download. Click "Download Resume ↓" in Contact → same. Profile image should render in About.

- [ ] **Step 4: Commit**

```powershell
git add public
git commit -m "chore(assets): add resume pdf and profile photo"
```

---

## Task 21: GSAP pinned divider + hero text reveal animations

**Files:**
- Create: `components/sections/AnimatedDivider.tsx` (client-side wrapper around `Divider`)
- Modify: `app/page.tsx` (swap `Divider` → `AnimatedDivider`)
- Modify: `components/hero/Hero.tsx` (animate hero text in on mount)

**Why:** The static reveal animations from T18 cover most of the site; the dividers and hero are the cinematic moments that need GSAP-grade choreography.

- [ ] **Step 1: Create `AnimatedDivider.tsx`**

```tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Divider, type DividerProps } from "./Divider";

export function AnimatedDivider(props: DividerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const heading = ref.current!.querySelector("h2");
      if (!heading) return;
      gsap.from(heading, {
        xPercent: -8,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          end: "top 30%",
          scrub: 0.6,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref}>
      <Divider {...props} />
    </div>
  );
}
```

- [ ] **Step 2: Use it in `app/page.tsx`**

Replace each `<Divider ... />` with `<AnimatedDivider ... />`, and update the import:
```tsx
import { AnimatedDivider } from "@/components/sections/AnimatedDivider";
```
(Keep the `Divider` import if `AnimatedDivider` needs it indirectly — but since the AnimatedDivider re-exports its visual via `Divider`, only `AnimatedDivider` needs to be in `page.tsx`.)

- [ ] **Step 3: Animate hero text in on mount**

Edit `D:\Portfolio\components\hero\Hero.tsx`. Mark the component as a client component and add a mount animation. Add to the top:
```tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
```
Add inside `Hero`:
```tsx
const containerRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  if (!containerRef.current) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = gsap.context(() => {
    gsap.from(".hero-line", {
      y: 60,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.2,
    });
    gsap.from(".hero-eyebrow, .hero-tagline", {
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      delay: 0.1,
      stagger: 0.2,
    });
  }, containerRef);
  return () => ctx.revert();
}, []);
```
Add `ref={containerRef}` on the outer `<section>`. Add `className="hero-line block"` on the line spans inside the `<h1>`, `className="hero-eyebrow"` on the eyebrow `<p>`, and `className="hero-tagline"` on the tagline `<p>` (preserving existing classes by concatenating).

- [ ] **Step 4: Visual check**

```powershell
npm run dev
```
Page load → hero text stages in. Scroll → each divider's title scrubs in horizontally as it enters the viewport. Then open Windows reduced-motion (Settings → Accessibility → Visual effects → Animation effects OFF), reload → animations skipped, content static.

- [ ] **Step 5: Build**

```powershell
npm run build
```

- [ ] **Step 6: Commit**

```powershell
git add components app/page.tsx
git commit -m "feat(motion): add gsap pinned divider scrub + hero text reveal"
```

---

## Task 22: Lighthouse audit + perf / a11y / SEO fixes

**Files:**
- Likely modify: `components/hero/NeuralField.tsx` (particle count tuning if needed)
- Possibly add: `next.config.ts` (image optimization config)

**Why:** Definition of done in the spec: Lighthouse Perf ≥ 90, A11y ≥ 95, SEO 100. This task is what gets us there.

- [ ] **Step 1: Produce a production build and serve it**

```powershell
npm run build
npm run start
```
This serves at `http://localhost:3000` with production optimizations on.

- [ ] **Step 2: Open Chrome DevTools → Lighthouse → Desktop → Run**

Record current scores. Common findings and fixes:

| Finding | Fix |
|---|---|
| LCP slow because of WebGL | In `NeuralField.tsx` reduce `count={800}` to `count={500}` for mobile (`window.innerWidth < 768 ? 500 : 800`). |
| CLS from Image without dimensions | Ensure `<Image>` in About has explicit `width` / `height` (already set in T7). |
| Missing alt text | Audit `aria-hidden` on decorative SVG/grain (already set in T4). |
| Color contrast warnings on `text-[var(--color-fg-muted)]/70` | Bump muted opacity to 80–85 where flagged. |
| "Document does not have a meta description" | Already added in T19. |
| Render-blocking fonts | `next/font` already handles this. |
| Unused CSS | Tailwind v4 PurgeCSS removes unused; no manual fix needed. |

- [ ] **Step 3: Iterate until Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 90, SEO = 100**

Commit each fix as you make it with a `perf:` or `fix(a11y):` prefix.

- [ ] **Step 4: Verify reduced-motion path again**

Toggle OS reduced-motion ON → reload → no animation, no Lenis, no R3F drift. Particles still render (static), but pointer parallax inside R3F should freeze (the `useFrame` still ticks but rotations are tiny; acceptable). Optionally guard R3F render with the same reduced-motion check.

- [ ] **Step 5: Commit final pass**

```powershell
git add -A
git commit -m "perf: lighthouse pass — perf >= 90, a11y >= 95, seo = 100"
```

---

## Task 23: Deploy to Vercel

**Files:**
- (No code changes — repo + Vercel project setup only.)

**Why:** Free, public URL the user can put on their resume.

- [ ] **Step 1: Push the repo to GitHub**

Create a new repository on github.com under the user's account: `udaykiran-portfolio` (or any name). Then:
```powershell
git branch -M main
git remote add origin https://github.com/uday21308/udaykiran-portfolio.git
git push -u origin main
```
The user must own the repo before running `git remote add`. If they prefer a different name/account, substitute it.

- [ ] **Step 2: Create the Vercel project**

In a browser:
1. Go to https://vercel.com → "Add new..." → "Project".
2. Import the GitHub repo just pushed.
3. Framework preset: **Next.js** (auto-detected). Leave all other defaults.
4. **Environment variables** — none required.
5. Click **Deploy**. First deploy takes ~2 minutes.

- [ ] **Step 3: Claim the preferred subdomain**

In the Vercel project → Settings → Domains → Edit the default domain. Try `udaykiran.vercel.app`. If taken, try `udaykiran-battula.vercel.app` or `uday-kiran.vercel.app`. Confirm.

- [ ] **Step 4: Update `metadataBase` and `sitemap` to match the actual domain**

If the claimed domain differs from `udaykiran.vercel.app`, edit `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` and `app/opengraph-image.tsx`, replacing the URL. Commit + push:
```powershell
git add app
git commit -m "chore(deploy): update domain in metadata and sitemap"
git push
```

- [ ] **Step 5: Smoke-test the live site**

1. Open the live URL on desktop → scroll the full page → confirm no console errors.
2. Click Resume CTA → PDF downloads.
3. Open the URL on mobile → confirm hero is legible, neural field renders or gracefully degrades.
4. Paste the URL into LinkedIn (in a test message draft) → confirm the OG card renders with the hero composition.
5. Run a Lighthouse audit against the live URL → confirm scores match local.

- [ ] **Step 6: Final commit**

(Nothing to commit if no code changed. If `metadataBase` was updated, it's already committed in Step 4.)

---

## Self-Review Notes

| Spec section | Where covered |
|---|---|
| §1 Purpose & success criteria | T1–T23 (whole plan); free hosting in T23; SEO in T19; resume download in T14 + T20; one-page scroll in T17 |
| §2.1 Color palette | T2 Step 5 (globals.css) |
| §2.2 Typography | T2 Step 4 (lib/fonts.ts), single swap point |
| §3 IA — every row | Nav T4 · Hero T15–T16 · About T7 · Dividers T6+T21 · Experience T8 · Projects + "View all repos" T9 · Skills T10 · Credentials T13 · Contact T14 · Footer T4 · Composition T17. (T11–T12 GitHub section removed in scope refinement.) |
| §4 Tech stack | T1 (scaffold), T2 (runtime deps) |
| §5 File layout | Mirrored in the File Structure section above; each task lists exact paths |
| §6 Motion language | T18 (Framer Motion reveals), T21 (GSAP pinned + hero text), T5 (Lenis + reduced-motion), T22 (reduced-motion validation) |
| §7 Content source of truth | T3 (all content modules), T20 (resume PDF + photo) |
| §8 Hosting & deployment | T23 |
| §9 Out of scope | Honored — no per-project pages, no blog, no Now block, no testimonials |
| §10 Risks | WebGL perf tuning in T22; resume path canonicalized in T3 |
| §11 Definition of done | T22 (Lighthouse), T20 (resume working), T17 (every section rendered), T5+T18+T21 (reduced motion), T23 (live URL + OG share check) |
