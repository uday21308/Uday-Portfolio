# ATS-Friendly AI/ML Resume — Design Spec

**Date:** 2026-05-26
**Owner:** Uday Kiran Battula
**Target roles:** AI/ML Engineer, Generative AI Engineer
**Deliverable:** `resume.tex` editable in Overleaf → exports to `Uday_Kiran_Battula_AIML.pdf` (replaces the current PDF at `D:\Portfolio\public\resume\Uday_Kiran_Battula_AIML.pdf`)

---

## Goal

Build a 2-page ATS-friendly LaTeX resume targeted at AI/ML and Generative AI Engineer roles. The resume must:

1. Score 90+ on common ATS scanners (Workday, Greenhouse, Lever) by passing all hard formatting and parsing rules.
2. Front-load the keywords that dominate GenAI Engineer job descriptions in 2026.
3. Preserve and tighten the existing content (Mindcres + Spinnaker experience, headline projects, certs) — no fabricated achievements.
4. Be editable in Overleaf and rebuildable to PDF as content evolves.

## Why a new resume

The current `Uday_Kiran_Battula_AIML.pdf` is solid but:
- Has no LaTeX source — content updates require recreating from scratch.
- No Professional Summary at the top (loses ATS keyword-weight in the prime parsing zone).
- Skills section is at the bottom (ATS pass-rate research favors Skills near the top for AI/ML).
- Some acronyms (RAG, MCP, ASR/TTS) appear without first-use expansion — risks ATS keyword misses if a JD spells them out.
- A few bullets carry strong narrative but light quantification.

## Non-Goals

- Multiple role-tailored variants (DS, SE, FD). Out of scope. The user maintains those separately at `E:\place\my resumes\`.
- Cover letter, portfolio one-pager, or LinkedIn rewrite.
- Auto-tailoring per job description (no JD-aware pipeline). The single resume is broad enough for the AI/GenAI cluster.
- Page count > 2.

---

## Architecture

```
resume.tex                     ← single LaTeX source, Jake's Resume base
├── Preamble                   ← article class, geometry, fonts, ATS hygiene
│   ├── \pdfgentounicode=1     ← text-selectable PDF (Workday/Greenhouse-safe)
│   ├── enumitem               ← bullet control
│   ├── titlesec               ← section heading style
│   └── hyperref               ← clean clickable links (color-safe for print)
├── Header                     ← Name + contact line + 1-line Featured callout for live portfolio
├── \section{Summary}          ← 3 lines, keyword-dense
├── \section{Skills}           ← 5 categorized lines
├── \section{Experience}       ← Mindcres, Spinnaker (reverse-chronological)
├── \section{Projects}         ← 3 projects, each with stack + bullets
├── \section{Certifications}   ← 3 certs (Google, Boston Inst. of Analytics, Infosys)
└── \section{Education}        ← Amrita B.Tech CS, 7.57/10
```

**Template base:** Jake Gutierrez's "Jake's Resume" template, MIT-licensed (`https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs`).

Rationale: Single column, plain-text section headers, no tables or two-column blocks, no exotic fonts, no icons. It's the de-facto standard on r/EngineeringResumes and has been parser-tested against Workday, Greenhouse, Lever, and Jobscan. We deviate from the base only by adding the Summary section (the template doesn't ship one) and reordering Skills before Experience.

## Components

### 1. Preamble (ATS hygiene)

```latex
\documentclass[letterpaper,11pt]{article}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage[T1]{fontenc}
\input{glyphtounicode}
\pdfgentounicode=1
% Margins ~0.5in, single column, Latin Modern default font.
```

Rules:
- `\pdfgentounicode=1` is mandatory — without it Workday's parser produces garbled ligatures.
- `[hidelinks]` for hyperref so links don't render as colored boxes in print.
- Margins: `0.5in` left/right, `0.6in` top/bottom — Jake's defaults, parser-safe.

### 2. Header

```
Uday Kiran Battula
udaykiranbattula304@gmail.com | (+91) 9392485042 | linkedin.com/in/uday-kiran-22053b285 |
github.com/uday21308 | uday-kiran-battula.vercel.app
Featured — Live portfolio with interactive AI Twin chat, JD matcher, and MCP server.
```

Rules:
- Plain text in the body, NOT in a `\header{}` or page header — ATS parsers ignore those regions.
- No icons (no envelope, no phone icon).
- Contact line pipe-separated; wraps to two lines (5 items) so nothing crowds.
- **Featured line** sits directly under the contact block (above Summary). Single sentence, plain text, no bold/italic — keeps it ATS-clean while making the portfolio's interactive features visible to a 6-second recruiter scan.
- Portfolio URL appears twice (once in contact line, once implied in Featured line) — this is intentional and ATS-safe since both are plain text. Avoids ambiguity for parsers that strip URLs from one location but not the other.
- Email is the personal Gmail per recruiter-contact preference.

### 3. Summary (NEW)

3 lines, ~50-60 words. Keyword-dense, no fluff, written in implied-subject voice.

```
AI/ML Engineer with ~1 year building production Generative AI systems — multilingual
voice agents, Retrieval-Augmented Generation (RAG) pipelines, and Model Context Protocol
(MCP) servers. Stack: Python, FastAPI, LangChain, LiteLLM, Gemini/Claude/OpenAI, FAISS/
ChromaDB, PostgreSQL, Redis, Docker. Shipped a 93.3%-precision healthcare RAG pipeline
and a 25-state voice grievance bot serving Andhra Pradesh state government.
```

Why this works:
- Role title in first 3 words (parsers weight document head).
- Spells out RAG and MCP on first use — covers JDs that use either form.
- Lists concrete stack inline — these are ATS keyword anchors.
- Two specific accomplishments instead of generic claims.

### 4. Skills (categorized)

5 categories, each on its own line. Categories chosen to mirror common JD section headings:

```
Languages:          Python, SQL, JavaScript, Java, Kotlin
Generative AI & LLMs: Google Gemini, OpenAI GPT, Anthropic Claude, Groq, LangChain, LiteLLM,
                      Hugging Face Transformers, Retrieval-Augmented Generation (RAG),
                      Agentic AI Systems, Model Context Protocol (MCP), Prompt Engineering,
                      Function Calling, Evals
ML/DL & Vision:     PyTorch, TensorFlow, Keras, Scikit-learn, CNN, Transfer Learning,
                      DenseNet, TensorFlow Lite, NLP
Retrieval & Speech: FAISS, ChromaDB, BM25, Sentence-Transformers, Gemini Embeddings,
                      Sarvam AI (Telugu ASR/TTS), Exotel WebSocket
Backend & MLOps:    FastAPI, async/asyncpg, SQLAlchemy, Alembic, Pydantic, FastMCP,
                      PostgreSQL, Redis, Docker, Dokku, Git, GitHub Actions, Langfuse,
                      LangSmith, Pytest
```

Rules:
- Categories named with literal ATS-recognized strings.
- Acronyms expanded on first appearance, abbreviation in parens.
- Comma-separated within a category; no bullets, no two-column.
- No proficiency bars, no star ratings — parsers treat these as garbage.

### 5. Experience

Reverse-chronological. Same companies as current resume, bullets rewritten for keyword density + quantification.

**Mindcres Technologies — AI/ML Engineer | Mar 2026 – Present**

**Tense rule: present continuous (-ing) because the work is ongoing.** Bullets (4 lines, all quantified, keyword-rich):
- "Architecting" the AP Government PGRS voice + web grievance bot — 25-state conversation state machine, multilingual Telugu/English flows over Google Gemini, Sarvam AI ASR/TTS, and Exotel WebSocket telephony.
- "Building" a modular FastAPI backend (async/asyncpg) split into 4 microservices (admin, bot, IVR, verification) with provider-swap toolkit abstractions for LLM, OCR, Speech, and Audio — enabling zero-change vendor swaps.
- "Designing" YAML-driven prompt management, scoped API-key + B2B widget-key auth with Redis rate limiting, and a federated admin log viewer.
- "Refactoring" a 7,000+ line monolith while maintaining 2,300+ Pytest cases at 90%+ coverage on Dokku, PostgreSQL, and Redis with Langfuse observability.

**Spinnaker Analytics — AI Engineer Intern (US-Based, Remote) | Sep 2025 – Feb 2026**

**Tense rule: simple past because the role is complete.** Bullets (3 lines):
- "Architected" an 8-stage RAG pipeline over 69 healthcare documents (345 chunks) using sentence-transformers + FAISS — hit 93.3% retrieval precision, 76% validation rate via section re-ranking, token-overlap validation, and a 25% confidence threshold for safety-first clinical decision support.
- "Designed" the Equity Filings Agent with adapter-pattern loaders and lexicon-based scoring to automate 10-K/10-Q analysis — structured reports in seconds vs hours of manual reading, with strict grounding prompts cutting false-positive validations.
- "Built" a Model Context Protocol (MCP) server using FastMCP over STDIO transport — 3 agentic tools with SQLite persistence and Claude Desktop integration, enabling protocol-level LLM-tool invocation from natural language intent.

### 6. Projects

Three projects (healthcare RAG and MCP server stay in Experience to avoid duplication). Each project has a one-line title + tech stack inline, then 2 bullets max.

**Project 1: Code-Aware RAG Assistant for Codebase Intelligence** — *Python AST, FAISS, BM25, Reciprocal Rank Fusion, tiktoken, Groq Llama 3.1, LangSmith*
- Architected a Multi-Index RAG system with 4 specialized FAISS indexes using Python's AST module to extract functions, classes, and docstrings as atomic units, combined with a keyword-scoring query router classifying intent into 4 routes — cutting irrelevant chunk retrieval by targeting only the relevant index per query type.
- Engineered a hybrid retrieval pipeline combining FAISS semantic search, BM25, and MMR via Reciprocal Rank Fusion with a 1,500-token tiktoken budget, 3-variant query expansion, and Groq Llama 3.1 — delivering answers in 2–3 seconds across any project folder with LangSmith observability.

**Project 2: Real-Time E-Commerce Voice Bot** — *React, Web Speech API, ChromaDB, LangSmith*
- Developed a full-stack voice assistant in React + Web Speech API for 4 intents (product search, order tracking, returns, recommendations) with a classification router and explicit tool execution preventing hallucinated order IDs and product names.
- Architected a ChromaDB RAG with metadata filtering on price and category over a 500-item, 30+ category inventory; LangSmith observability tracing all LLM calls, retrievals, and tool invocations.

**Project 3: Car Damage Detection & Mobile Deployment** — *PyTorch, DenseNet-169, TensorFlow Lite, Kotlin, Android Studio*
- Trained a 6-class vehicle-damage classifier (cracks, dents, scratches, glass shatter, flat tyres, lamp breakage) on a ~400-image-per-class Kaggle dataset, fine-tuning a pretrained DenseNet-169 backbone — raising baseline CNN accuracy from 82% to 95% via augmentation, hyperparameter tuning, and per-class confusion-matrix analysis.
- Exported the trained model to TensorFlow Lite and shipped it in a native Android app (Kotlin, Android Studio) for on-device offline inference, enabling field damage assessment without server round-trips.

Project bullets use implied-subject simple past ("Architected", "Developed", "Trained") because every project is shipped/complete. Same quantification rule applies.

### 7. Certifications

Three certs, one line each. No bullets.

- Generative AI and Agentic AI Development — Boston Institute of Analytics
- Introduction to Generative AI — Google Cloud Skills Boost
- Machine Learning with Python — Infosys Springboard

Reordered so the most JD-relevant (GenAI/Agentic) is first.

### 8. Education

One line.

- B.Tech in Computer Science, Amrita Vishwa Vidyapeetham — 7.57/10.0 — Aug 2021 – May 2025

GPA included because it's ≥7.0 on a 10-scale (~3.0+ equivalent). At the bottom because user has 1.5+ years industry experience.

---

## Content Rules

| Rule | Why |
|---|---|
| Implied-subject verbs, no "I/me/my". Tense rule: **present continuous (-ing) for Mindcres (current role)**, **simple past for Spinnaker and all Projects (complete)** | ATS expectation; reflects ongoing vs finished work honestly. |
| Acronyms expanded first use: `Retrieval-Augmented Generation (RAG)`, `Model Context Protocol (MCP)`, `Automatic Speech Recognition (ASR)` | Covers JDs that spell out the term. |
| ≥60% of bullets quantified (%, count, latency, coverage, throughput) | Recruiter expectation for technical resumes. |
| Section headers use exact ATS-recognized strings: `Summary`, `Skills`, `Experience`, `Projects`, `Certifications`, `Education` | Parsers map sections by string match. |
| Dates: `Mon YYYY – Mon YYYY` (e.g., `Mar 2026 – Present`), right-aligned via Jake's `\resumeSubheading` macro | Workday parses this format reliably. |
| No "Objective", "References available upon request", "Hobbies", "Languages spoken" (unless required), photos, GPA below 3.5/4.0 equivalent | Industry consensus 2026. |
| No tables, no two-column blocks, no headers/footers, no icons, no progress bars, no star ratings | All break parsers. |
| Bullets rendered as `•` via LaTeX `itemize` (Jake's `\resumeItem`) | ATS-safe. |
| Maximum 2 pages — must fit cleanly without overflow | Industry length norm for ~1.5 yrs experience. |

## File Locations

- LaTeX source: `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`
- Compiled PDF target: `D:\Portfolio\public\resume\Uday_Kiran_Battula_AIML.pdf` (replaces current; portfolio download link in `content/site.ts:15` does not change).
- Design doc: this file.

The `resume/` source directory is new and sits at repo root (not under `public/` so the `.tex` isn't served as a static asset). User compiles in Overleaf, downloads the PDF, drops it into `public/resume/` to replace the existing file. No build script is needed.

## Validation

After producing the `.tex`:

1. **Compile in Overleaf** → produces a 2-page PDF.
2. **Text-selectability check** → open the PDF, select all, paste into Notepad. Text must come out in top-to-bottom reading order with no garbled ligatures and no missing characters.
3. **ATS dry-run** → paste the extracted text into Jobscan or a similar tool against a sample GenAI Engineer JD (e.g., the Anthropic AI Engineer JD). Target: 90+ keyword match. Iterate on the Skills/Summary blocks if a score gap appears.
4. **Manual scan path** → 10-second skim should land on: name, role title, Mindcres + Spinnaker, top 3 keywords (RAG, MCP, LangChain), GitHub link.

## Open Risks

- **Healthcare RAG content overlap** between Experience and Projects — resolved by keeping it only in Experience.
- **Page-2 length** — if the resume undershoots page 2 (e.g., page 2 has 4 lines total), it looks padded. Mitigation: target Skills and Project bullets to land Education near the bottom of page 2. If still padded, drop to 1 page by trimming.
- **Personal Gmail vs Mindcres email** — using personal Gmail per user preference for recruiter contact.
- **GPA 7.57/10** — keep as-is since it's well above the 7.0 / 3.0 threshold and removing it would draw attention to the omission.

## Out of Scope

- Auto-tailoring per JD.
- Role-variant versions (DS, SE, FD).
- Cover letter.
- LinkedIn or portfolio profile updates.
- Build/CI integration to autocompile on commit.
