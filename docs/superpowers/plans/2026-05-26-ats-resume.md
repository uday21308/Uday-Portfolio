# ATS-Friendly AI/ML Resume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` — a 2-page ATS-friendly LaTeX resume targeted at AI/ML and Generative AI Engineer roles, ready to compile in Overleaf.

**Architecture:** Single LaTeX file based on Jake Gutierrez's "Jake's Resume" template (single column, ATS-tested). Custom macros for `\resumeSubheading` (right-aligned dates), `\resumeItem` (bullets), and `\resumeSubHeadingListStart/End` (itemize wrappers). Content split into clearly labeled sections matching the spec; no external `.cls` or `.sty` files so it compiles in any Overleaf project.

**Tech Stack:** LaTeX (article class), `enumitem`, `titlesec`, `hyperref`, `fullpage`, `glyphtounicode`. No images, no fonts beyond Latin Modern (the LaTeX default).

**Reference spec:** `D:\Portfolio\docs\superpowers\specs\2026-05-26-ats-resume-design.md`

**Note on test discipline:** This deliverable is a static document, not executable code — TDD does not apply. Each task ends with a manual verification step (compiles in Overleaf, text-extraction check, ATS dry-run) instead of a unit test.

---

## File Structure

| File | Responsibility |
|---|---|
| `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` (NEW) | Single LaTeX source. All preamble, macros, and content in one file so Overleaf builds with no extra files. |
| `D:\Portfolio\resume\README.md` (NEW) | One-page note explaining how to recompile in Overleaf and how to drop the resulting PDF into `public/resume/`. |
| `D:\Portfolio\public\resume\Uday_Kiran_Battula_AIML.pdf` (REPLACE later, manually) | The compiled PDF. User produces this from Overleaf and copies in. Not part of this plan's automated output. |

The `resume/` directory sits at repo root (not under `public/` so the LaTeX source isn't served as a static asset).

---

## Task 1: Create the resume directory and README

**Files:**
- Create: `D:\Portfolio\resume\README.md`

- [ ] **Step 1: Create the resume folder**

```bash
mkdir D:\Portfolio\resume
```

Expected: empty directory created.

- [ ] **Step 2: Write the README**

`D:\Portfolio\resume\README.md`:

```markdown
# Resume LaTeX Source

LaTeX source for the AI/ML resume linked from the portfolio homepage download button.

## How to update

1. Open `Uday_Kiran_Battula_AIML.tex` in [Overleaf](https://www.overleaf.com/) (paste into a blank project, or upload).
2. Edit content. Compile (pdfLaTeX). Download the PDF.
3. Replace `public/resume/Uday_Kiran_Battula_AIML.pdf` with the new file.
4. Commit both the updated `.tex` and the new `.pdf`.

## ATS compliance

The template is Jake's Resume (single column, ATS-safe). Do not:
- Add tables, two-column blocks, headers/footers, or icons
- Use exotic fonts (stick to Latin Modern)
- Add color outside hyperlinks

After compiling, open the PDF, select all, paste into Notepad — text must come out in top-to-bottom reading order with no garbled ligatures. If it doesn't, the parser will see it the same way.

See the design spec for the full ruleset: `docs/superpowers/specs/2026-05-26-ats-resume-design.md`.
```

- [ ] **Step 3: Verify**

Run: `ls D:\Portfolio\resume\`
Expected output: `README.md`

---

## Task 2: Write the LaTeX preamble + macros

**Files:**
- Create: `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`

- [ ] **Step 1: Write the preamble block at the top of the file**

Open `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` and write the following as the entire file (content sections come in later tasks):

```latex
%-------------------------
% Resume in LaTeX
% Author: Uday Kiran Battula
% Based on Jake Gutierrez's "Jake's Resume" template (MIT License)
% https://github.com/jakegut/resume
%-------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Section heading formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable / ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
%-------------------------
\newcommand{\resumeItem}[1]{%
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{%
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{%
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\begin{document}

% (sections inserted in following tasks)

\end{document}
```

- [ ] **Step 2: Verify the file syntax**

Run: `findstr /N "documentclass" D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`
Expected: one line starting `1:\documentclass[letterpaper,11pt]{article}`

(Full compile validation happens in Task 8 once content is in place.)

---

## Task 3: Add the header block (name, contact line, Featured callout)

**Files:**
- Modify: `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` (insert right after `\begin{document}`)

- [ ] **Step 1: Insert the header block**

Place this block immediately after `\begin{document}` (replacing the `% (sections inserted in following tasks)` comment):

```latex
%----------HEADING----------
\begin{center}
    {\Huge \scshape Uday Kiran Battula} \\ \vspace{4pt}
    \small udaykiranbattula304@gmail.com $|$ (+91) 9392485042 $|$
    \href{https://linkedin.com/in/uday-kiran-22053b285}{linkedin.com/in/uday-kiran-22053b285} $|$
    \href{https://github.com/uday21308}{github.com/uday21308} $|$
    \href{https://uday-kiran-battula.vercel.app}{uday-kiran-battula.vercel.app} \\ \vspace{2pt}
    \small Featured --- Live portfolio with interactive AI Twin chat, JD matcher, and MCP server.
\end{center}
```

Rules enforced:
- Name uses `\Huge` + small caps via `\scshape`.
- Contact items pipe-separated using LaTeX math-mode `$|$` (renders crisper than text `|`).
- The 3 URLs use `\href{}` so they're clickable but rendered as plain visible text — ATS parsers see the visible text, recruiters get a clickable link.
- Featured line is plain text, single sentence, ATS-clean.

- [ ] **Step 2: Verify**

Run: `findstr /C:"Uday Kiran Battula" D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`
Expected: at least 2 lines (one in the comment header, one in `\Huge`).

---

## Task 4: Add the Summary section

**Files:**
- Modify: `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` (insert after the header block)

- [ ] **Step 1: Insert Summary**

Place after the closing `\end{center}` of the header block:

```latex
%-----------SUMMARY-----------
\section{Summary}
\small{AI/ML Engineer with ~1 year building production Generative AI systems --- multilingual voice agents, Retrieval-Augmented Generation (RAG) pipelines, and Model Context Protocol (MCP) servers. Stack: Python, FastAPI, LangChain, LiteLLM, Gemini/Claude/OpenAI, FAISS/ChromaDB, PostgreSQL, Redis, Docker. Shipped a 93.3\%-precision healthcare RAG pipeline and a 25-state voice grievance bot serving Andhra Pradesh state government.}
\vspace{-3pt}
```

Notes:
- `\%` to escape the percent sign (LaTeX comment character).
- `~` is a tilde rendered literally (LaTeX's non-breaking space rules don't affect single-tilde-before-digit context here in `\small{}`). If LaTeX renders it weird in Overleaf, swap to `$\sim$` for a math-mode tilde.

- [ ] **Step 2: Verify**

Run: `findstr /C:"\\section{Summary}" D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`
Expected: one match.

---

## Task 5: Add the Skills section

**Files:**
- Modify: `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` (insert after Summary)

- [ ] **Step 1: Insert Skills**

```latex
%-----------SKILLS-----------
\section{Skills}
\begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: Python, SQL, JavaScript, Java, Kotlin} \\
     \textbf{Generative AI \& LLMs}{: Google Gemini, OpenAI GPT, Anthropic Claude, Groq, LangChain, LiteLLM, Hugging Face Transformers, Retrieval-Augmented Generation (RAG), Agentic AI Systems, Model Context Protocol (MCP), Prompt Engineering, Function Calling, Evals} \\
     \textbf{ML/DL \& Vision}{: PyTorch, TensorFlow, Keras, Scikit-learn, CNN, Transfer Learning, DenseNet, TensorFlow Lite, NLP} \\
     \textbf{Retrieval \& Speech}{: FAISS, ChromaDB, BM25, Sentence-Transformers, Gemini Embeddings, Sarvam AI (Telugu ASR/TTS), Exotel WebSocket} \\
     \textbf{Backend \& MLOps}{: FastAPI, async/asyncpg, SQLAlchemy, Alembic, Pydantic, FastMCP, PostgreSQL, Redis, Docker, Dokku, Git, GitHub Actions, Langfuse, LangSmith, Pytest}
    }}
\end{itemize}
\vspace{-12pt}
```

Notes:
- `\&` to escape `&` in category labels.
- Five categories on five `\\`-separated lines, all inside one `\item` so they render as a tight block, not 5 bulleted items.

- [ ] **Step 2: Verify**

Run: `findstr /C:"section{Skills}" D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`
Expected: one match.

---

## Task 6: Add the Experience section

**Files:**
- Modify: `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` (insert after Skills)

- [ ] **Step 1: Insert Experience**

```latex
%-----------EXPERIENCE-----------
\section{Experience}
\resumeSubHeadingListStart

  \resumeSubheading
    {Mindcres Technologies}{Mar 2026 -- Present}
    {AI/ML Engineer}{Remote}
    \resumeItemListStart
      \resumeItem{Architecting the AP Government PGRS voice + web grievance bot --- a 25-state conversation state machine handling multilingual (Telugu/English) flows over Google Gemini, Sarvam AI ASR/TTS, and Exotel WebSocket telephony.}
      \resumeItem{Building a modular FastAPI backend (async, asyncpg) split into 4 microservices --- admin, bot, IVR, verification --- with provider-swap toolkit abstractions for LLM, OCR, Speech, and Audio, enabling zero-change vendor swaps.}
      \resumeItem{Designing YAML-driven prompt management, scoped API-key + B2B widget-key auth with Redis rate limiting, and a federated admin log viewer.}
      \resumeItem{Refactoring a 7{,}000+ line monolith while maintaining 2{,}300+ Pytest cases at 90\%+ coverage on Dokku, PostgreSQL, and Redis with Langfuse observability.}
    \resumeItemListEnd

  \resumeSubheading
    {Spinnaker Analytics (US-Based)}{Sep 2025 -- Feb 2026}
    {AI Engineer Intern}{Remote}
    \resumeItemListStart
      \resumeItem{Architected an 8-stage Retrieval-Augmented Generation (RAG) pipeline over 69 healthcare documents (345 chunks) using sentence-transformers + FAISS, hitting 93.3\% retrieval precision and 76\% validation rate with section re-ranking, token-overlap validation, and a 25\% confidence threshold for safety-first clinical decision support.}
      \resumeItem{Designed an Equity Filings Agent with adapter-pattern loaders and lexicon-based scoring to automate 10-K/10-Q analysis --- structured reports in seconds vs hours of manual reading, with strict grounding prompts cutting false-positive validations by prioritizing precision over recall.}
      \resumeItem{Built a Model Context Protocol (MCP) server using FastMCP over STDIO transport exposing 3 agentic tools with SQLite persistence and Claude Desktop integration, enabling protocol-level LLM-tool invocation from natural-language intent without hardcoded validation.}
    \resumeItemListEnd

\resumeSubHeadingListEnd
```

Notes:
- `--` renders as an en-dash (correct for date ranges).
- `7{,}000` keeps the comma in number formatting without LaTeX inserting math-mode space.
- `\%` escapes percent.
- The `Remote` strings appear in the right-italic column of `\resumeSubheading` — acceptable filler since both roles were remote.

- [ ] **Step 2: Verify**

Run: `findstr /C:"Mindcres Technologies" D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`
Expected: one match in the Experience block.

---

## Task 7: Add the Projects section

**Files:**
- Modify: `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` (insert after Experience)

- [ ] **Step 1: Insert Projects**

```latex
%-----------PROJECTS-----------
\section{Projects}
\resumeSubHeadingListStart

  \resumeProjectHeading
    {\textbf{Code-Aware RAG Assistant for Codebase Intelligence} $|$ \emph{Python AST, FAISS, BM25, Reciprocal Rank Fusion, tiktoken, Groq Llama 3.1, LangSmith}}{}
    \resumeItemListStart
      \resumeItem{Architected a Multi-Index RAG system with 4 specialized FAISS indexes using Python's AST module to extract functions, classes, and docstrings as atomic units, combined with a keyword-scoring query router classifying intent into 4 routes --- cutting irrelevant chunk retrieval by targeting only the relevant index per query type.}
      \resumeItem{Engineered a hybrid retrieval pipeline combining FAISS semantic search, BM25, and MMR via Reciprocal Rank Fusion with a 1{,}500-token tiktoken budget, 3-variant query expansion, and Groq Llama 3.1, delivering answers in 2--3 seconds across any project folder with LangSmith observability tracing every pipeline stage.}
    \resumeItemListEnd

  \resumeProjectHeading
    {\textbf{Real-Time E-Commerce Voice Bot} $|$ \emph{React, Web Speech API, ChromaDB, LangSmith}}{}
    \resumeItemListStart
      \resumeItem{Developed a full-stack voice assistant in React + Web Speech API for 4 intents (product search, order tracking, returns, recommendations) with a classification router and explicit tool execution preventing hallucinated order IDs and product names.}
      \resumeItem{Architected a ChromaDB Retrieval-Augmented Generation (RAG) layer with metadata filtering on price and category over a 500-item, 30+ category inventory; LangSmith observability tracing every LLM call, retrieval, and tool invocation for audit and quality monitoring.}
    \resumeItemListEnd

  \resumeProjectHeading
    {\textbf{Car Damage Detection \& Mobile Deployment} $|$ \emph{PyTorch, DenseNet-169, TensorFlow Lite, Kotlin, Android Studio}}{}
    \resumeItemListStart
      \resumeItem{Trained a 6-class vehicle-damage classifier (cracks, dents, scratches, glass shatter, flat tyres, lamp breakage) on a Kaggle dataset of ~400 images per class, fine-tuning a pretrained DenseNet-169 backbone with a custom classifier head --- raising baseline CNN accuracy from 82\% to 95\% via data augmentation, hyperparameter tuning, and per-class confusion-matrix analysis.}
      \resumeItem{Exported the trained model to TensorFlow Lite and shipped it inside a native Android app (Kotlin, Android Studio) for on-device offline inference, enabling field damage assessment for insurance-claim automation without server round-trips.}
    \resumeItemListEnd

\resumeSubHeadingListEnd
```

Notes:
- `\emph{...}` for stack lines (renders italic).
- `\&` escapes `&` in "Car Damage Detection \& Mobile Deployment".
- `~` again may need swap to `$\sim$` if Overleaf renders it as space.

- [ ] **Step 2: Verify**

Run: `findstr /C:"Code-Aware RAG Assistant" D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`
Expected: one match.

---

## Task 8: Add the Certifications and Education sections

**Files:**
- Modify: `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` (insert after Projects)

- [ ] **Step 1: Insert Certifications**

```latex
%-----------CERTIFICATIONS-----------
\section{Certifications}
\resumeSubHeadingListStart
  \small{\item
    \textbf{Generative AI and Agentic AI Development} --- Boston Institute of Analytics \\
    \textbf{Introduction to Generative AI} --- Google Cloud Skills Boost \\
    \textbf{Machine Learning with Python} --- Infosys Springboard
  }
\resumeSubHeadingListEnd
\vspace{-12pt}
```

- [ ] **Step 2: Insert Education**

```latex
%-----------EDUCATION-----------
\section{Education}
\resumeSubHeadingListStart
  \resumeSubheading
    {Amrita Vishwa Vidyapeetham}{Aug 2021 -- May 2025}
    {B.Tech in Computer Science --- 7.57/10.0}{}
\resumeSubHeadingListEnd
```

- [ ] **Step 3: Verify both sections present**

Run: `findstr /C:"section{Certifications}" /C:"section{Education}" D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`
Expected: two matches.

- [ ] **Step 4: Verify file ends correctly**

Run: `findstr /C:"end{document}" D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex`
Expected: one match, on the last non-empty line.

---

## Task 9: Verification (user-driven)

**Files:** none modified.

This task is for the user (not the implementer subagent) — it cannot be automated because Overleaf is browser-only.

- [ ] **Step 1: Upload to Overleaf**

Open https://www.overleaf.com/ → New Project → Blank Project → paste the contents of `D:\Portfolio\resume\Uday_Kiran_Battula_AIML.tex` into `main.tex` (or upload the file).

- [ ] **Step 2: Compile (pdfLaTeX) and check page count**

Expected: 2 pages, no compile errors. If a stray `~` rendered as a space, edit to `$\sim$` and recompile.

- [ ] **Step 3: Text-selectability check**

In Overleaf's PDF preview, click → Ctrl+A → Ctrl+C. Paste into Notepad.
Expected: text comes out in top-to-bottom reading order (Name → Contact → Featured → Summary → Skills → Experience → Projects → Certifications → Education). No garbled characters, no out-of-order blocks.

- [ ] **Step 4: ATS dry-run**

Paste the extracted text into https://www.jobscan.co/ or a similar tool against a sample GenAI Engineer job description (e.g., a posting from Anthropic, OpenAI, or a startup hiring AI engineers).
Expected: 90+ match score. If lower, identify keyword gaps and adjust the Skills or Summary blocks accordingly.

- [ ] **Step 5: Download PDF and replace existing file**

Download the PDF from Overleaf. Rename to `Uday_Kiran_Battula_AIML.pdf`. Overwrite `D:\Portfolio\public\resume\Uday_Kiran_Battula_AIML.pdf`.

Run: `dir D:\Portfolio\public\resume\Uday_Kiran_Battula_AIML.pdf`
Expected: file modification time is today (2026-05-26).

The portfolio download link in `content/site.ts:15` already points to `/resume/Uday_Kiran_Battula_AIML.pdf` — no code change needed.

- [ ] **Step 6: Final visual smoke test**

Open the new PDF in a browser/Preview app. 6-second scan should land on: name, AI/ML Engineer title (in Summary), Mindcres + Spinnaker, top 5 keywords (RAG, MCP, LangChain, FastAPI, Gemini), GitHub link, portfolio link.

---

## Self-Review Notes

**Spec coverage:** Every section in `2026-05-26-ats-resume-design.md` (Architecture, Header, Summary, Skills, Experience, Projects, Certifications, Education, Content Rules, File Locations, Validation) maps to a task above. Tasks 1–8 produce the artifact; Task 9 covers Validation.

**Placeholder scan:** No TBDs. Every code block is complete LaTeX. Verification commands are concrete `findstr` invocations on Windows (matching the user's platform).

**Type consistency:** Macro names (`\resumeItem`, `\resumeSubheading`, `\resumeProjectHeading`, `\resumeSubHeadingListStart/End`, `\resumeItemListStart/End`) are defined in Task 2 and used identically in Tasks 6–8.
