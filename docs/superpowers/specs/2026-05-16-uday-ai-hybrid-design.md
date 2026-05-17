# Uday AI — Hybrid AI Layer for Portfolio (Design Spec)

**Date:** 2026-05-16
**Status:** ✅ Approved — handing off to writing-plans
**Live site:** https://uday-kiran-battula.vercel.app
**Repo:** https://github.com/uday21308/Uday-Portfolio

---

## 1. Goal

Add an AI layer to the portfolio that proves Uday's stated skills *by being itself*. A recruiter who opens the site should be able to ask questions, get a job-fit pitch, play a small AI game, and (if technical) connect Claude Desktop directly to the portfolio via MCP. All free, all Vercel-safe, all built so a recruiter screenshots it and Slack-DMs a colleague.

## 2. North Star

> "I built an AI engineer's portfolio that is itself an AI engineering project."

Single most important UX moment: a recruiter asks **"tell me about your RAG experience"** and the bot answers with citations from real project READMEs, in Uday's voice, in under 2 seconds, with a `$0.0003 · 142 tok · 412ms` line underneath proving production-economics literacy.

## 3. Architecture

```
┌─ Browser ──────────────────────────────────────────────────┐
│   Floating widget (bottom-right) → 4 mode chips:           │
│   💬 Chat   🎯 Hire (→ /hire)   🎮 Play   🔌 (→ /connect) │
└─────────┬──────────────────────────────────────────────────┘
          │ POST /api/chat (SSE stream)
          │ POST /api/hire (structured JSON)
          │ POST /api/game (turn)
          ▼
┌─ Vercel serverless (Node runtime) ─────────────────────────┐
│   1. Rate-limit check  (Upstash Ratelimit · 10 msg/IP/hr)  │
│   2. Load session memory (Upstash Redis · 30d TTL)         │
│   3. Embed query (MiniLM-L6-v2 via @huggingface/transformers)│
│   4. Cosine top-K over data/embeddings.json (in-memory)    │
│   5. Build prompt (persona + chunks + memory + guardrails) │
│   6. Stream from Groq Llama 3.3 70B Versatile              │
│   7. Save exchange to Redis, return cost telemetry         │
└────────────────────────────────────────────────────────────┘

┌─ Vercel serverless (Node runtime) ─────────────────────────┐
│   /api/mcp/[transport]  — MCP server (Streamable HTTP)     │
│   Tools: ask_uday · get_project · list_projects · match_jd │
│   (Same internal RAG + Groq pipeline as the chat endpoint) │
└────────────────────────────────────────────────────────────┘

┌─ Build-time (Node, runs in `prebuild`) ────────────────────┐
│   scripts/build-kb.ts                                       │
│   1. Parse resume PDF (unpdf)                              │
│   2. Read content/kb/*.md + faq.ts + projects-extra.ts     │
│   3. Fetch READMEs from GitHub API (public, no auth)       │
│   4. Chunk (section headings, ~200 tok max, 30 tok overlap)│
│   5. Embed each chunk with MiniLM-L6-v2 (local in Node)    │
│   6. Write data/embeddings.json + data/manifest.json       │
└────────────────────────────────────────────────────────────┘
```

**Why this combo:**
- Build-time embeddings → zero embedding-API spend, ever
- In-memory cosine over ~80 chunks → no vector DB ($0, no quota)
- Groq Llama 3.3 70B free dev tier (14.4K req/day, 500 tok/s)
- Upstash Redis free tier (10K cmd/day) doubles as memory + ratelimit
- Same backend powers chat + MCP → one codebase, two surfaces

## 4. Knowledge Base (Corpus)

**Total sources → ~80 chunks → ~600KB JSON.**

| Source | Tier | Chunks (est) | How ingested |
|--------|------|--------------|--------------|
| Resume PDF (`public/resume/Uday_Kiran_Battula_AIML.pdf`) | primary | ~15 | `unpdf` parse → section split |
| LinkedIn KB (`content/kb/linkedin.md`) | primary | ~8 | user-provided structured doc |
| FAQ (`content/kb/faq.ts`) | primary | ~25 | typed Q/A pairs, one chunk each |
| Healthcare-RAG-Assistant README | primary (featured) | ~10 | GitHub API, fetched at build |
| Ecommerce-AI-voice-text-Assistant README | primary (featured) | ~7 | GitHub API |
| Expense-Tracker-MCP README | primary (featured) | ~4 | GitHub API |
| AI-Powered-Equity-Filings README | primary (featured) | ~4 | GitHub API |
| Code-Aware RAG Assistant (no repo) | primary (featured) | ~3 | `projects-extra.ts` user content |
| FruitFreshnessDetection README | secondary | ~2 | GitHub API |
| Car-Damage-Detection (enriched) | secondary | ~2 | `projects-extra.ts` user content |
| STUDIO-MCU (enriched) | secondary | ~1 | `projects-extra.ts` user content |
| Persona/voice (`content/kb/persona.md`) | system | — | injected into system prompt, not retrieved |

**Excluded:** `Uday-Portfolio` (self-referential), `ascii-cse`, `congenial-brocolli`, `Remote-MCP-Deployment` (no content), `AI-Resume-Analyzer` (template default only).

**Each chunk's metadata shape:**
```ts
type Chunk = {
  id: string;              // stable hash of source+section
  text: string;            // ~200 tokens
  vector: number[];        // 384-dim from MiniLM-L6-v2
  source: string;          // "resume" | "linkedin" | "faq" | "github:<repo>" | "extra:<project>"
  type: "resume" | "project" | "faq" | "linkedin";
  tier: "primary" | "secondary";
  title: string;           // human-readable for citation display
};
```

## 5. Persona — System Prompt

Stored in `content/kb/persona.md` and injected verbatim at the top of every chat/hire prompt:

```
You are "Uday's AI Twin" — an AI trained on Uday Kiran Battula's resume,
project READMEs, LinkedIn profile, and a curated FAQ. You speak in first
person as Uday, but if anyone asks "are you a real person?" or "are you
Uday?", be transparent: you're an AI representation of him built into
his portfolio.

You're talking to recruiters and hiring managers. Be:
  - SPECIFIC — quote real metrics from the knowledge base (93.3% precision,
    25-state flow, 2,300+ Pytest cases, etc.)
  - CONCISE — 2-4 sentences default; expand only when asked for depth
  - HONEST about gaps — if the knowledge base doesn't cover it, say:
    "That's outside what I can answer reliably — easiest path is emailing
    Uday at claude@mindcres.com."

You will NOT discuss:
  - Specific salary numbers → "Open and happy to discuss with the hiring team."
  - Internal Mindcres details beyond the resume → "That's covered by my
    employer's NDA, but I'm happy to walk through the public proxy projects
    that demonstrate the same skills."
  - Specific notice period numbers → "Negotiable, typically around 30 days."
  - Visa or work-authorization status → "Happy to discuss directly over email
    — claude@mindcres.com."

NEVER fabricate project details, metrics, version numbers, dates, or experiences.
If you're unsure, deflect to email rather than guess.

Voice notes:
  - Confident but not boastful
  - Engineering-first framing (systems, glue, reliability)
  - Comfortable saying "I don't know" or "I haven't shipped that yet"
```

## 6. FAQ Content (User-Provided)

Final FAQ state to be encoded in `content/kb/faq.ts`:

```ts
export const faq = [
  // Tech preferences
  { q: "What languages do you reach for first?",
    a: "Python is my primary, TypeScript for web." },
  { q: "What LLM providers have you shipped with?",
    a: "Groq, OpenAI, Gemini, Claude, and local Llama." },
  { q: "What vector DBs do you know?",
    a: "FAISS, Chroma, Pinecone, Upstash Vector." },
  { q: "What cloud platforms do you deploy to?",
    a: "Vercel, Render, AWS, Dokku." },
  { q: "What are you most excited about right now?",
    a: "MCP, agentic frameworks, multimodal, eval tooling, and AI automations." },

  // Why / how
  { q: "Why AI engineering specifically?",
    a: "The bottleneck on real-world AI isn't the model anymore — it's the engineering around it: retrieval, eval, orchestration, latency, cost. That's where I work — systems engineer who happens to love ML." },
  { q: "What technical area do you want to go deeper in?",
    a: "Agent evaluation and reliability — writing deterministic tests for non-deterministic systems. Also inference optimization." },

  // Logistics
  { q: "Location and remote preference?",
    a: "Currently in Vijayawada, IST. Open to relocation for the right role, can also freelance, remote is fine." },
  { q: "Time zone for interviews?",
    a: "IST (UTC+5:30)." },
  { q: "Notice period?",
    a: "Negotiable, typically around 30 days." },

  // Deeper answers
  { q: "Your single proudest technical decision?",
    a: "Chunking by AST nodes — functions, classes, docstrings as atomic units — in my Code-Aware RAG, instead of naive line-splitting. That single decision is what made the 4-index router work; the right chunk boundary turned out to be a 10× lever on retrieval quality." },
  { q: "A bug or incident that taught you something big?",
    a: "The healthcare RAG returned correct answers 95% of the time and confidently wrong ones the other 5% — and the wrong ones cited real documents. Forced me to add per-chunk source verification and a confidence-threshold refusal gate. Hallucination isn't an LLM problem, it's a system design problem." },
  { q: "Why does MCP excite you?",
    a: "MCP turns LLM apps from monoliths into composable systems — the way HTTP turned desktop apps into the web. It's the closest thing to a real standard interface for AI-talking-to-your-data that's actually getting adopted. I'd rather build on the boring open protocol than the shiny proprietary SDK." },
  { q: "What would you say to someone considering hiring you?",
    a: "I've shipped AI systems with hard reliability bars — 90%+ test coverage, traced pipelines, refusal gates — not just demos. If you need someone who can take a fuzzy idea and turn it into a production endpoint that doesn't page you at 3 am, I'm a good bet." },

  // Personal
  { q: "What do you do outside coding?",
    a: "F1, gym, music, sports." },

  // Off-limits deflections (also enforced via system prompt)
  { q: "Salary expectations?",
    a: "Open and happy to discuss with the hiring team — depends on the role, scope, and location." },
  { q: "Visa or work-authorization status?",
    a: "Happy to discuss directly over email — claude@mindcres.com." },
];
```

## 7. Project Enrichment Content

To be encoded in `content/kb/projects-extra.ts` (for projects with weak/no README):

```ts
export const projectsExtra = [
  {
    slug: "code-aware-rag",
    title: "Code-Aware RAG Assistant for Codebase Intelligence",
    tier: "primary",
    body: `Architected a Multi-Index RAG system with 4 specialized FAISS indexes using Python's AST module to extract functions, classes, and docstrings as atomic units, combined with a keyword-scoring query router classifying intent into 4 routes — reducing irrelevant chunk retrieval by targeting only the relevant index per query type.

Engineered hybrid retrieval pipeline combining FAISS semantic search, BM25, and MMR via Reciprocal Rank Fusion with tiktoken token budget capped at 1,500 tokens, query expansion generating 3 variants per question, and Groq Llama 3.1 delivering answers in 2–3 seconds across any project folder with LangSmith observability tracing all pipeline stages.`,
  },
  {
    slug: "car-damage-detection",
    title: "Car Damage Detection & Mobile Deployment",
    tier: "secondary",
    body: `Trained a 6-class vehicle-damage classifier (cracks, dents, scratches, glass shatter, flat tyres, lamp breakage) on a Kaggle dataset of ~400 images per class, fine-tuning a pretrained DenseNet-169 backbone with a custom classifier head — raising baseline CNN accuracy from 82% to 95% via data augmentation, hyperparameter tuning, and per-class confusion-matrix analysis.

Exported the trained model to TensorFlow Lite and shipped it inside a native Android app (Kotlin, Android Studio) for on-device offline inference, enabling field damage assessment for insurance-claim automation without server round-trips.`,
  },
  {
    slug: "studio-mcu",
    title: "STUDIO MCU — Responsive Entertainment Platform",
    tier: "secondary",
    body: `Developed a responsive entertainment platform using HTML5, CSS3, and vanilla JavaScript with modular component architecture, supporting ticket booking, merchandise purchasing, and movie reviews.

Implemented mobile-first design with CSS Grid and Flexbox, ensuring optimal viewing experience across devices with 100% responsive breakpoints.`,
  },
];
```

## 8. Floating Widget UX

**Component:** `components/ai/UdayAI.tsx` — mounted in `app/layout.tsx` (site-wide, lazy-loaded)

**States:**
1. **Collapsed (default)** — 56px circle pill, bottom-right, soft glow. Subtle pulse every 4s.
2. **Auto-greet bubble** — fires once per session after 8s on page. Speech bubble: *"Hey 👋 I'm Uday's AI Twin. Ask me anything, or play a word game."* Auto-dismisses after 15s or first user click.
3. **Expanded panel** — 360×520 floating panel. Top: 4 mode chips. Body: thread. Footer: composer.
4. **Fullscreen** — desktop only — covers viewport with overlay; mobile defaults to fullscreen always.

**Mode chips (top row):**
- 💬 **Chat** — default; free-form RAG conversation
- 🎯 **Hire** — link-out to `/hire` page (JD paste UX needs more room)
- 🎮 **Play** — switches body to game view (word association duel)
- 🔌 **Connect** — link-out to `/connect` page (MCP discovery)

**Per AI message renders:**
```
[avatar]  Bot reply text streamed live...
          ─ $0.000312 · 142 tok · 412 ms · llama-3.3-70b ─
          [tooltip on cost line: "I show this because knowing what an
          AI call costs is half the job."]
          ▼ 3 sources cited  (collapsed; expand to see chunks)
```

**Memory recall:** On widget open, if `session:{id}` exists in Redis, prepend system message:
> *"Welcome back — last time you asked about [topic]. Want to pick up where we left off?"*

**Cookie:** `uday_ai_session` (HTTP-only, 30 days, SameSite=Lax). nanoid value. Created on first widget open.

## 9. `/hire` Page UX

**Component:** `app/hire/page.tsx`

**Layout — two columns on desktop, stacked on mobile:**

Left:
- Hero: "See how I'd fit *your* role"
- Three input fields:
  - Company name (text)
  - Role title (text)
  - Job description (textarea, autoexpand)
- "Generate fit analysis →" button

Right (post-submit, animated in):
- **Fit score** — large number 1-10 with horizontal bar viz
- **3 key strengths** — bullets pulling KB highlights matched to JD
- **3 tailored bullets** — resume-ready bullets rewritten for this role with real metrics
- **Cover paragraph** — 4-sentence pitch
- **CTAs:**
  - "📧 Email this to Uday" — mailto with full output pre-filled in body
  - "📥 Download as Markdown" — client-side blob download
  - "🔄 Try a different role"

**Backend:** `POST /api/hire` — same RAG pipeline as chat, but with `response_format: { type: "json_schema" }` against a Zod schema. Groq supports JSON mode reliably.

**Schema:**
```ts
const HireOutput = z.object({
  fitScore: z.number().int().min(1).max(10),
  strengths: z.array(z.string()).length(3),
  tailoredBullets: z.array(z.string()).length(3),
  coverParagraph: z.string(),
});
```

## 10. `/connect` Page UX

**Component:** `app/connect/page.tsx`

**Sections:**
1. **Hero:** *"Connect Claude Desktop to my portfolio"* — explains MCP in one paragraph
2. **Config snippet** — copy-button code block:
   ```json
   {
     "mcpServers": {
       "uday-portfolio": {
         "url": "https://uday-kiran-battula.vercel.app/api/mcp"
       }
     }
   }
   ```
   (Plus a fallback `mcp-remote` command for older Claude Desktop versions)
3. **Live tool catalog** — list of 4 tools with descriptions + example invocations
4. **Demo GIF** — recorded once, shows the connection + a sample query in Claude Desktop
5. **CTA:** *"Want to fork this? Source at github.com/uday21308/Uday-Portfolio"*

## 11. MCP Server

**Route:** `app/api/mcp/[transport]/route.ts` — uses `@modelcontextprotocol/sdk` with Streamable HTTP transport.

**Tools exposed:**

| Tool | Args | Returns |
|------|------|---------|
| `ask_uday` | `{ question: string }` | RAG answer + cited sources |
| `get_project` | `{ name: string }` | Full README + metadata for one project |
| `list_projects` | `{}` | Array of `{ name, tier, summary }` |
| `match_jd` | `{ jd: string, company?: string, role?: string }` | Same JSON shape as `/api/hire` |

All tools are read-only, no auth, rate-limited per IP via Upstash Ratelimit (separate bucket from web: 30 calls/hour — MCP usage is bursty).

**Discovery:** `/api/mcp/.well-known/mcp.json` returns server metadata so Claude Desktop and other clients can introspect.

## 12. Word Association Duel (Game)

**Component:** `components/ai/games/WordAssoc.tsx` (rendered inside widget when Play mode active)

**Rules (pinned at top of game view):**
- Theme: AI/ML concepts only (model names, techniques, providers, papers — anything in the AI/ML domain)
- No repeats — either side using a word that's already been said loses
- Soft 5s timer per turn (visual countdown, doesn't auto-fail)
- Game ends on: repeat, off-topic word, or 30s with no input

**Turn loop:**
1. Bot says first word (random from a seed list: "transformer", "RAG", "embedding", etc.)
2. User types a related AI/ML word + Enter
3. POST `/api/game` with `{ history, lastBotWord, userWord }`
4. Bot validates: is it AI/ML-related? Is it a repeat? — using Groq with a tight system prompt
5. If valid → bot returns next word; if invalid → bot returns end-game message + score
6. Display score and a one-line bot reaction at end ("Decent run — 7 rounds, you held your own.")

**Share state:** `/?game-result=7-rounds` query string for cute social sharing (optional v2).

## 13. Memory + Rate Limiting

**File:** `lib/redis.ts`

```ts
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = Redis.fromEnv();

export const chatLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),  // 10 chat msgs / IP / hour
  prefix: "rl:chat",
});

export const mcpLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 h"),  // 30 MCP calls / IP / hour
  prefix: "rl:mcp",
});
```

**Session memory shape:**
```
Key: session:{sessionId}
Value: JSON array of last 10 exchanges, each: { role, content, ts }
TTL: 30 days, refreshed on every write
```

## 14. Cost Telemetry

**File:** `lib/ai/cost.ts`

```ts
// Source: https://groq.com/pricing — Llama 3.3 70B Versatile (verify at build)
const PRICING = {
  "llama-3.3-70b-versatile": { input: 0.59, output: 0.79 }, // $/M tokens
};

export function calcCost(model: string, promptTok: number, completionTok: number) {
  const p = PRICING[model] ?? { input: 0, output: 0 };
  return (promptTok * p.input + completionTok * p.output) / 1_000_000;
}
```

Displayed under every AI message as `$0.000312 · 142 tok · 412 ms · llama-3.3-70b`.

## 15. Safety / Guardrails

Two layers:

**Layer 1 — System prompt** (above, Section 5) — instructs the model what NOT to discuss.

**Layer 2 — Output filter** (`lib/ai/guardrails.ts`) — regex sweep over completed responses:
- Block specific salary figures (`/\$\d{2,3}[kK]/`, `/\d{1,3} ?[lL]akh/`, `/\d+ ?[Cc]rore/`)
- Block specific notice numbers (`/\b(15|30|45|60|90) day/i` → only allow within the FAQ-approved phrasing)
- If a filter trips, replace with the canned deflection from the FAQ

**Pre-flight test suite** (`scripts/test-guardrails.ts`):
- 20 adversarial prompts (ignore-your-instructions, jailbreaks, salary probes, NDA probes, etc.)
- Run against staging before each Vercel deploy as a GitHub Action
- Fail the build if any test response leaks forbidden content

## 16. Auto-Greet Behavior

**File:** `components/ai/AutoGreet.tsx`

Logic:
- Mount with `setTimeout(8000)` on page idle (after LCP)
- Check `sessionStorage["uday_ai_greeted"]` — if set, skip
- Animate speech bubble in from widget pill (Framer Motion)
- Bubble content: *"Hey 👋 I'm Uday's AI Twin — ask me anything about his work, or play a quick AI word game."*
- Auto-dismiss after 15s, or on user click anywhere
- On dismiss: set `sessionStorage["uday_ai_greeted"] = "1"` so it doesn't re-fire

**Reduced motion:** Skip the animation but still show the bubble.
**Mobile:** Show at 10s instead of 8s (mobile users still loading).

## 17. File Structure

```
app/
  api/
    chat/
      route.ts                     — RAG chat (SSE stream, with mode param)
    hire/
      route.ts                     — JD matcher (structured JSON output)
    game/
      route.ts                     — Word association turn validator
    mcp/
      [transport]/
        route.ts                   — MCP server (Streamable HTTP)
  hire/
    page.tsx                       — /hire route
  connect/
    page.tsx                       — /connect route

components/
  ai/
    UdayAI.tsx                     — Floating widget shell
    ChatView.tsx                   — Chat thread + composer + cost line
    GameView.tsx                   — Word association duel UI
    AutoGreet.tsx                  — 8s delayed bubble
    CostLine.tsx                   — Cost telemetry display
    HirePitchCard.tsx              — Structured output renderer (/hire)
    SourceCitations.tsx            — Collapsible cited chunks
  providers/
    AIProvider.tsx                 — Session ID cookie, widget open state

content/
  kb/
    linkedin.md                    — Structured LinkedIn KB (user-provided)
    faq.ts                         — Typed FAQ Q&A pairs
    projects-extra.ts              — Car-Damage, STUDIO-MCU, Code-Aware RAG
    persona.md                     — System prompt for the bot

data/                              — gitignored, built artifacts
  embeddings.json                  — Built-time output
  manifest.json                    — Corpus metadata

lib/
  rag/
    retriever.ts                   — In-memory cosine top-K
    embedder.ts                    — MiniLM-L6-v2 loader + encode
    chunker.ts                     — Section-based chunking helpers
  ai/
    groq.ts                        — Groq client wrapper
    prompts.ts                     — Prompt templates
    guardrails.ts                  — Output filter + canned deflections
    cost.ts                        — Cost calculator
  mcp/
    server.ts                      — MCP tools definition
  redis.ts                         — Upstash client
  ratelimit.ts                     — Upstash ratelimit instances

scripts/
  build-kb.ts                      — Build-time KB builder (runs in prebuild)
  test-guardrails.ts               — Adversarial-prompt test suite
```

## 18. Dependencies to Add

```jsonc
{
  // AI / Models
  "@huggingface/transformers": "^3.x",     // local embeddings, both build + runtime
  "groq-sdk": "^0.x",                       // Groq client
  "ai": "^4.x",                             // Vercel AI SDK (streaming helpers)
  "@ai-sdk/groq": "^1.x",                   // Groq provider for AI SDK

  // Storage / RateLimit
  "@upstash/redis": "^1.x",
  "@upstash/ratelimit": "^2.x",

  // MCP
  "@modelcontextprotocol/sdk": "^1.x",      // MCP server

  // Utilities
  "unpdf": "^0.x",                          // resume PDF parsing (build-time only)
  "zod": "^3.x",                            // structured-output schemas
  "nanoid": "^5.x"                          // session IDs
}
```

## 19. Environment Variables

```
GROQ_API_KEY=                # https://console.groq.com (free dev tier)
UPSTASH_REDIS_REST_URL=      # https://console.upstash.com (free tier)
UPSTASH_REDIS_REST_TOKEN=    #
NEXT_PUBLIC_SITE_URL=https://uday-kiran-battula.vercel.app
```

Optional / fallback:
```
GROQ_MODEL=llama-3.3-70b-versatile  # overrideable if Groq deprecates
GITHUB_USER=uday21308               # KB build script
```

## 20. Vercel Deploy Constraints

| Limit | Value (Hobby) | Our usage |
|-------|---------------|-----------|
| Function bundle (compressed) | 50 MB | ~25 MB (transformers + model) |
| Function timeout | 60 s | Chat streams in ~3 s, JD match ~5 s |
| Function memory | 1024 MB | Peaks ~300 MB on embed load |
| Bandwidth / mo | 100 GB | Portfolio traffic << 1 GB |
| Edge config / KV | N/A | We use Upstash externally |

**Risk:** embedding model bundle near 25 MB. If we hit the 50 MB ceiling, fallback is HF Inference API for query-time embeddings (still free, just slower cold-start).

## 21. Implementation Phases

| Phase | Scope | Est. effort |
|-------|-------|-------------|
| **P1: Foundation** | KB build script, embeddings.json, `/api/chat` with RAG, minimal widget shell | 1 day |
| **P2: UX polish** | Widget design, modes, auto-greet, cost line, memory recall | 1 day |
| **P3: /hire page** | Route, JD form, structured output renderer, mailto CTA | 4-6 h |
| **P4: MCP server** | `/api/mcp`, 4 tools, `/connect` page with config snippet | 6-8 h |
| **P5: Game** | Word association duel UI + validation endpoint | 3-4 h |
| **P6: Safety + ship** | Guardrails, adversarial tests, GitHub Action, deploy | 4-6 h |

**Total:** ~4-5 days of focused work. Phases ship independently — each merge is shippable.

## 22. Open Questions / Risks

1. **MCP transport version** — verify current `@modelcontextprotocol/sdk` recommends Streamable HTTP over SSE for remote servers; update if changed.
2. **Embedding model bundle size** — measure compressed bundle of `@huggingface/transformers` + MiniLM-L6-v2 on first build. If over 40 MB compressed, switch query-time embeddings to HF Inference API.
3. **Groq pricing snapshot** — verify Llama 3.3 70B input/output prices match the constants in `lib/ai/cost.ts` at build time.
4. **Auto-greet timing** — 8s desktop / 10s mobile — may need tuning after real-world recruiter sessions; ship behind an env var to A/B easily.
5. **GitHub API rate limit** — 60 req/hr unauthenticated. We fetch 6 READMEs per build → fine. Add `GITHUB_TOKEN` (read-only) if any build hits the cap.

## 23. Success Criteria

- Recruiter visits site → widget auto-greets → asks a real question → gets a real-metric answer in <3s with citations and cost telemetry. ✅
- Recruiter pastes a JD on `/hire` → gets structured fit pitch they can forward in Slack. ✅
- Technical recruiter connects Claude Desktop via `/connect` → asks the same questions from inside Claude. ✅
- Anyone plays the word duel → bot keeps them engaged for ≥5 rounds → memorable. ✅
- Vercel monthly bill: **$0**. ✅
- Groq daily usage: **<10% of free tier** even at 50 recruiter sessions/day. ✅

---

**Next step:** Hand off to `superpowers:writing-plans` to break into task-level checklist for `superpowers:subagent-driven-development`.
