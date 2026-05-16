# Portfolio Website — Design Spec

**Owner:** Uday Kiran Battula
**Date:** 2026-05-16
**Status:** Approved by user (brainstorm phase)

---

## 1. Purpose & Audience

A high-end personal portfolio website for **Uday Kiran Battula** (AI/ML Engineer at Mindcres Technologies, Mar 2026–present). Primary audience: technical recruiters and hiring managers evaluating senior AI engineering candidates.

**Success criteria:**
- Visually distinctive enough to be remembered (in the league of [landonorris.com](https://landonorris.com)) — not a generic dev-portfolio template.
- Reads as unmistakably "AI engineer" at a glance (WebGL neural field hero, content focused on agents/RAG/MCP/voice).
- Communicates the headline metrics and projects within the first 30–60 seconds of scrolling.
- Provides a one-click resume download and clear contact paths (email, LinkedIn, GitHub).
- Discoverable when a recruiter Googles the name (SEO via Next.js static export with proper metadata + OG image).
- Deploys to a **free** tier (Vercel) with auto HTTPS and a `*.vercel.app` subdomain; ready to swap to a custom domain later.

---

## 2. Aesthetic Direction

**Hybrid: Cinematic Dark (A) + Neural WebGL (B).**

- Full-bleed cinematic hero with a **WebGL neural-network particle field** as the live background — a literal visual metaphor for an AI engineer.
- Editorial-style sections beneath with two typographic registers: a **tall extra-condensed display sans** (Big Shoulders Stencil) for giant section dividers, and an **ornate italic display serif** (Fraunces with WONK axis) for accent words inside titles.
- Subtle film-grain overlay on dark backgrounds for cinematic depth.
- Smooth scroll (Lenis) throughout; GSAP ScrollTrigger for pinned cinematic moments on the hero and section dividers; Framer Motion for component-level reveals.

### 2.1 Color Palette

| Token | Hex | Use |
|---|---|---|
| `bg.base` | `#06080F` | Page background (deep navy-black) |
| `bg.elevated` | `#0C0D18` | Cards, elevated surfaces |
| `fg.primary` | `#F0F0F3` | Body text, primary headings (near-white) |
| `accent.warm` | `#F5E0AA` | Serif italic accents, primary CTA, section divider color (warm cream) |
| `accent.cyan` | `#6CCFFF` | WebGL neural particles, code/mono small text, link hover |
| `accent.violet` | `#A78BFA` | WebGL neural particles (secondary), gradients |

Film-grain noise is applied as an SVG filter overlay at ~13% opacity over dark surfaces.

### 2.2 Typography

| Role | Font | Weight / Variant | Source |
|---|---|---|---|
| Display (hero + section dividers) | **Big Shoulders Stencil Display** | 800 | Google Fonts |
| Italic accent (serif, inside display headings) | **Fraunces** | Italic 600, opsz 144, SOFT 100, WONK 1 | Google Fonts |
| Sub-display / body sans | **DM Sans** | 400 / 500 / Italic 400 | Google Fonts |
| Body alt (small UI text) | **Inter** | 400 / 500 | Google Fonts |
| Mono (labels, code, metadata) | **JetBrains Mono** | 400 / 600 | Google Fonts |

All fonts self-hosted via `next/font/google` for zero CLS and offline reliability. Font choices are isolated to a single config file so they can be swapped in one place post-launch.

---

## 3. Information Architecture

Single-page scroll, in order:

| # | Section | Component | Notes |
|---|---|---|---|
| 0 | **Top nav** | Sticky-on-scroll | Logo (left) + 3 links (Work · Experience · Contact) + small "Resume ↓" pill (right) |
| 1 | **Hero** | `<Hero />` | WebGL neural particle field background. Name + tagline + scroll cue. |
| 2 | **About / Manifesto** | `<About />` | 2–3 short paragraphs + LinkedIn profile photo. Italic accent words pulled out in Fraunces. Closes with the personal-philosophy line: *"AI engineering is 10% models, 90% the glue. I like writing the glue."* |
| 3 | **Section divider 01 — "Built in production"** | `<Divider />` | Giant Big Shoulders Stencil title in lime, numbered (`01 / SELECTED WORK`). |
| 4 | **Experience timeline** | `<Experience />` | Two entries: Mindcres (current) + Spinnaker Analytics. Date column + role/company + 3 bullets each with metric callouts in italic Fraunces. |
| 5 | **Section divider 02 — "Things I built"** | `<Divider />` | Numbered `02 / PROJECTS`. |
| 6 | **Featured projects** | `<Projects />` | 2-column grid. v1 ships with **5 projects** (Healthcare RAG Assistant, E-Commerce Voice Bot, Equity Filings Agent, Expense Tracker MCP, Car Damage → Mobile). Each card: year label, title, 1-sentence description, tech tags, GitHub link (4 of 5). Below the grid, a small "View all 11 repos at @uday21308 →" link. |
| 7 | **Section divider 03 — "Tools of the trade"** | `<Divider />` | Numbered `03 / STACK`. |
| 8 | **Skills constellation / grid** | `<Skills />` | 4-column grid of categorized tech: LLMs · ML/Vision · Backend · DevOps/Obs. Hover-to-reveal subtle animation. |
| 9 | **Certifications + Education** | `<Credentials />` | Compact strip (no big divider above this one — different rhythm). Small grid: Amrita degree + Google GenAI cert + Boston Inst. + Infosys ML cert. |
| 10 | **Contact CTA** | `<Contact />` | Centered Big Shoulders Stencil title with italic Fraunces accent ("Let's *build* something"). Primary CTA: "Download Resume ↓" (warm-cream, filled). Secondary: Email, LinkedIn, GitHub. |
| 11 | **Footer** | `<Footer />` | Small mono text — name, year, built-with credit. |

---

## 4. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router) + TypeScript | Server-rendered output runs free on Vercel; SEO via metadata API; image optimization; supports the dynamic OG image route |
| Styling | **Tailwind CSS v4** | Utility-first, no design-system bloat; arbitrary values for cinematic one-offs |
| 3D / WebGL | **three.js** + `@react-three/fiber` + `@react-three/drei` | Neural particle field hero; declarative R3F lets us write 3D as React |
| Motion (components) | **`motion`** (Framer Motion 12) | Scroll-triggered reveals, micro-interactions |
| Motion (cinematic) | **GSAP + ScrollTrigger** | Pinned scroll sequences on hero + section dividers — does things Framer can't |
| Smooth scroll | **`@studio-freight/lenis`** | The buttery scroll feel on reference sites; integrates with GSAP ScrollTrigger |
| Typography | **`next/font/google`** | Self-host the 5 Google Fonts; zero CLS |
| Icons / primitives | **`lucide-react`** + **Radix primitives** (only as needed) | Lean — no full UI kit |
| Content | **Plain typed TS modules** in `content/` | No CMS; experience/projects/skills as typed objects. Project GitHub links hard-coded — no runtime API calls. |
| Hosting | **Vercel** (free tier) | Native Next.js, preview deploys, auto HTTPS, CDN, custom domain ready |
| Analytics (optional v1.1) | **Vercel Web Analytics** | Free tier, no cookies, lightweight |

**Rejected alternatives:**
- *Vite + React SPA* — no SEO, recruiter Googling the name won't find it.
- *Astro + islands* — fastest possible, but the WebGL-heavy hero is more awkward to wire than in Next.js.
- *GitHub Pages instead of Vercel* — works but slower iteration, no preview deploys.

---

## 5. File Layout

```
D:\Portfolio/
├─ app/
│  ├─ layout.tsx              ← root layout, fonts, Lenis provider, metadata
│  ├─ page.tsx                ← single-page composition of all sections
│  ├─ globals.css             ← Tailwind directives, CSS variables for palette, grain SVG
│  ├─ opengraph-image.tsx     ← dynamic OG image (Next.js convention)
│  └─ robots.ts / sitemap.ts  ← SEO essentials
├─ components/
│  ├─ hero/
│  │  ├─ Hero.tsx
│  │  ├─ NeuralField.tsx      ← R3F scene: particle field + connecting lines
│  │  └─ ScrollCue.tsx
│  ├─ sections/
│  │  ├─ About.tsx
│  │  ├─ Divider.tsx          ← reused for all 5 section dividers
│  │  ├─ Experience.tsx
│  │  ├─ Projects.tsx
│  │  ├─ Skills.tsx
│  │  ├─ Credentials.tsx
│  │  └─ Contact.tsx
│  ├─ ui/
│  │  ├─ Nav.tsx
│  │  ├─ Footer.tsx
│  │  ├─ ItalicAccent.tsx     ← <em> wrapper that auto-applies Fraunces
│  │  └─ Grain.tsx            ← film-grain overlay component
│  └─ providers/
│     └─ LenisProvider.tsx    ← smooth scroll + GSAP ScrollTrigger sync
├─ content/
│  ├─ experience.ts           ← Mindcres + Spinnaker objects
│  ├─ projects.ts             ← Project[] with title, year, description, tech[], link
│  ├─ skills.ts               ← grouped tech stack
│  ├─ credentials.ts          ← certs + education
│  └─ site.ts                 ← name, tagline, social links, resume path
├─ lib/
│  └─ fonts.ts                ← next/font configuration (single swap point)
├─ public/
│  ├─ resume/Uday_Kiran_Battula_AIML.pdf
│  └─ images/profile.jpg      ← LinkedIn photo (only personal image)
├─ docs/
│  └─ superpowers/specs/
│     └─ 2026-05-16-portfolio-website-design.md  ← this file
├─ .gitignore
├─ next.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

---

## 6. Motion Language

| Element | Treatment |
|---|---|
| Page enter | Lenis takes over scroll. Hero fades + neural particles animate in (0.8s). |
| Hero text reveal | Display headline split per word, staggered translate-up + fade (GSAP SplitText if licensed, else CSS clip-path). |
| Neural particle field | Continuous gentle drift; particles connect with lines when within range; subtle parallax responding to scroll position. |
| Section dividers | GSAP-pinned: divider title slides in horizontally as its section enters viewport. |
| Experience timeline | Each row reveals on scroll (Framer Motion `whileInView` with stagger). |
| Project cards | Hover: subtle lift + accent border glow. No flashy 3D card tilt. |
| Skills grid | Cells animate in with a stagger; on hover the category title slides up to reveal extra detail. |
| GitHub heatmap | Cells animate in with a wave when entering viewport. |
| Reduced-motion | Respect `prefers-reduced-motion`: disable Lenis, GSAP timelines, and particle animation. Static fallback still looks intentional. |

---

## 7. Content Source of Truth

Content lives in typed TS modules in `content/`. Initial values are drawn from the AIML resume (`E:\place\my resumes\Roles\Uday_Kiran_Battula_AIML.pdf`):

- **Experience:** Mindcres Technologies (AI/ML Engineer, Mar 2026–present), Spinnaker Analytics (AI Engineer Intern, Sep 2025–Feb 2026). Mindcres copy uses the **safe version** — no client (AP Government) name, described as "voice grievance bot for an Indian state-government portal". Generic, non-identifying metrics are kept.
- **Projects (v1) — 5 cards:**
  1. **Healthcare RAG Assistant** — [github.com/uday21308/Healthcare-RAG-Assistant](https://github.com/uday21308/Healthcare-RAG-Assistant)
  2. **E-Commerce Voice Bot** — [github.com/uday21308/Ecommerce-AI-voice-text-Assistant](https://github.com/uday21308/Ecommerce-AI-voice-text-Assistant)
  3. **AI-Powered Equity Filings Agent** — [github.com/uday21308/AI-Powered-Equity-Filings-Summarization-Risk-Insight-Agent](https://github.com/uday21308/AI-Powered-Equity-Filings-Summarization-Risk-Insight-Agent)
  4. **Expense Tracker MCP** — [github.com/uday21308/Expense-Tracker-MCP](https://github.com/uday21308/Expense-Tracker-MCP)
  5. **Car Damage Detection → Mobile** — no public repo (Android/Kotlin app).
  Below the grid, a small "View all 11 repos at @uday21308 →" link points to the GitHub profile.
- **Skills:** five categories from the resume (LLMs / ML & Vision / Retrieval & Speech / Backend / DevOps & Testing) condensed to four for the grid.
- **Credentials:** Amrita Vishwa Vidyapeetham B.Tech + 3 certifications.
- **Contact:** udaykiranbattula304@gmail.com · linkedin.com/in/uday-kiran-22053b285 · github.com/uday21308.
- **About (personal line, ships in v1):** *"AI engineering is 10% models, 90% the glue. I like writing the glue."*

Resume PDF served from `public/resume/` (the AIML variant) with the download CTA pointing there.

---

## 8. Hosting & Deployment

- **Repo:** new GitHub repository.
- **Deploy target:** Vercel free tier, linked to the GitHub repo. Auto-deploys on push to `main`; preview deploys on PRs.
- **Domain (v1):** the auto-assigned `*.vercel.app` subdomain (preferred slug: `udaykiran` — fallback as needed). Custom domain can be added later with no code changes.
- **Env vars:** None required.
- **Build command:** `next build` (default).
- **Output:** `.next` standard build (not `output: 'export'`) so we get Next.js metadata, image optimization, and the dynamic OG image route — all within Vercel free tier limits.

---

## 9. Out of Scope (v1)

Deferred to v1.1+ to keep v1 shippable in days, not weeks:

- Blog / writing section
- "Now" / currently-building live status
- Per-project deep-dive pages (`/projects/[slug]`) — the spec is set up to add these later without restructuring
- Testimonials / recommendations
- Custom domain
- Newsletter / contact form (current CTA is `mailto:` only)
- Localization

---

## 10. Risks & Open Questions

| Risk | Mitigation |
|---|---|
| WebGL neural field can hurt LCP on low-end devices | Lazy-init the R3F scene after first paint; static fallback (CSS gradient + faux particles) for mobile / low-power. |
| Premium paid fonts (Söhne / Druk / GT Sectra / PP Editorial New) not used | Free Big Shoulders Stencil + Fraunces WONK get ~90% of the look at $0; can swap fonts in one config file post-launch if desired. |
| Sharing a `*.vercel.app` URL on a resume looks less polished than a custom domain | Acceptable for v1; custom domain is a 10-minute change later. |
| Resume PDF version drift (multiple variants in `E:\place\my resumes\`) | Source AIML variant locked as canonical for v1; update via single file in `public/resume/`. |

---

## 11. Definition of Done (v1)

- Lighthouse: Performance ≥ 90 (desktop), Accessibility ≥ 95, SEO 100.
- Every section in §3 rendered with content from `content/*.ts` modules (no Lorem Ipsum).
- Deployed to a public Vercel URL accessible from any browser.
- Resume PDF downloadable from the contact CTA.
- `prefers-reduced-motion` respected end-to-end.
- Renders correctly on mobile (≥ 360px), tablet, and desktop up to 1920px.
- OG image renders correctly when the URL is shared on LinkedIn / Twitter / WhatsApp.
