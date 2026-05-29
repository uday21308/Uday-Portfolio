# Scroll Reveals — Distinct Motion Per Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every section of the portfolio gets a distinct, bidirectional scroll-reveal so nothing repeats and the page feels alive in both scroll directions.

**Architecture:** Extend the existing `Reveal` Framer-Motion wrapper with variants (`slide-left`, `slide-right`, `lift`, `bloom`, `mask`) and replay-on-scroll. Add a new `ScrollLitParagraph` component for Apple-style word-by-word lighting tied to scroll position. Add scroll-linked progress effects (line-draw header, slow-parallax corner blurs). Each section consumes the right variant for its visual role.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · `motion/react` (Framer Motion 12) · Vitest

---

## File Structure

**Modify:**
- `components/ui/Reveal.tsx` — add `variant` + `replay` props
- `components/sections/About.tsx` — portrait → `variant="mask"`; intro paragraphs → `<ScrollLitParagraph />`
- `components/sections/Projects.tsx` — each card Reveal → `variant="lift"`
- `components/sections/ExperienceRail.tsx` — each article Reveal → `variant="slide-right"`
- `components/sections/Skills.tsx` — each card Reveal → `variant="bloom"`
- `components/sections/Credentials.tsx` — header Reveal → `variant="mask"`; cards stay `slide-left` but with stronger glow; corner blur gets parallax
- `components/sections/Contact.tsx` — each CTA Reveal → `variant="lift"`

**Create:**
- `components/ui/ScrollLitParagraph.tsx` — Apple-style scroll-linked word lighting
- `components/ui/Reveal.test.tsx` — variant prop tests
- `components/ui/ScrollLitParagraph.test.tsx` — word-splitting + render tests

---

## Task 1: Extend `Reveal` with variant + replay props (Phase 1)

**Files:**
- Modify: `components/ui/Reveal.tsx`
- Create: `components/ui/Reveal.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `components/ui/Reveal.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  it("renders children", () => {
    const { getByText } = render(<Reveal>hello</Reveal>);
    expect(getByText("hello")).toBeInTheDocument();
  });

  it("accepts all 5 variant values without error", () => {
    const variants = ["slide-left", "slide-right", "lift", "bloom", "mask"] as const;
    for (const v of variants) {
      const { unmount } = render(<Reveal variant={v}>x</Reveal>);
      unmount();
    }
  });

  it("accepts replay prop", () => {
    const { unmount } = render(<Reveal replay={false}>x</Reveal>);
    unmount();
  });

  it("accepts custom x/y/scale overrides", () => {
    const { unmount } = render(<Reveal x={-50} y={20} scale={0.8}>x</Reveal>);
    unmount();
  });
});
```

- [ ] **Step 2: Run test, verify FAIL**

Run: `npm test -- --run Reveal.test`

Expected: FAIL on variant prop (TypeScript error or runtime error).

- [ ] **Step 3: Implement variant + replay in `Reveal.tsx`**

Replace `components/ui/Reveal.tsx` with:

```tsx
"use client";
import { motion, type MotionProps, type Variants } from "motion/react";

export type RevealVariant = "slide-left" | "slide-right" | "lift" | "bloom" | "mask";

type Props = {
  children: React.ReactNode;
  delay?: number;
  /** Named motion preset. Defaults to slide-left. */
  variant?: RevealVariant;
  /** When true (default), animation replays on each scroll into view. When false, plays once. */
  replay?: boolean;
  /** Override X offset (px). Takes precedence over variant. */
  x?: number;
  /** Override Y offset (px). Takes precedence over variant. */
  y?: number;
  /** Override starting scale. Takes precedence over variant. */
  scale?: number;
  className?: string;
} & Omit<MotionProps, "children">;

const VARIANT_INITIAL: Record<RevealVariant, { x?: number; y?: number; scale?: number; clipPath?: string }> = {
  "slide-left":  { x: -40, scale: 0.94 },
  "slide-right": { x:  40, scale: 0.94 },
  "lift":        { y:  40, scale: 0.96 },
  "bloom":       { scale: 0.85 },
  "mask":        { clipPath: "inset(0 100% 0 0)" },
};

export function Reveal({
  children,
  delay = 0,
  variant = "slide-left",
  replay = true,
  x,
  y,
  scale,
  className,
  ...rest
}: Props) {
  const base = VARIANT_INITIAL[variant];
  const initial = {
    opacity: 0,
    x: x ?? base.x ?? 0,
    y: y ?? base.y ?? 0,
    scale: scale ?? base.scale ?? 1,
    ...(base.clipPath ? { clipPath: base.clipPath } : {}),
  };
  const animate = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    ...(base.clipPath ? { clipPath: "inset(0 0 0 0)" } : {}),
  };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: !replay, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run test, verify PASS**

Run: `npm test -- --run Reveal.test`

Expected: PASS (4 tests).

- [ ] **Step 5: Run full suite to verify no regressions**

Run: `npm test -- --run`

Expected: 67 + 4 = 71 tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/ui/Reveal.tsx components/ui/Reveal.test.tsx
git commit -m "feat(reveal): add variant + replay props (5 named presets, bidirectional default)"
```

---

## Task 2: Create `ScrollLitParagraph` component (Phase 2)

**Files:**
- Create: `components/ui/ScrollLitParagraph.tsx`
- Create: `components/ui/ScrollLitParagraph.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `components/ui/ScrollLitParagraph.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScrollLitParagraph } from "./ScrollLitParagraph";

describe("ScrollLitParagraph", () => {
  it("splits plain text into word spans", () => {
    const { container } = render(
      <ScrollLitParagraph text="hello world" />
    );
    const spans = container.querySelectorAll(".sl-word");
    expect(spans).toHaveLength(2);
    expect(spans[0].textContent).toBe("hello");
    expect(spans[1].textContent).toBe("world");
  });

  it("preserves italic accent markers", () => {
    const { container } = render(
      <ScrollLitParagraph text="I work at *Mindcres* now" />
    );
    const italics = container.querySelectorAll("em");
    expect(italics).toHaveLength(1);
    expect(italics[0].textContent).toBe("Mindcres");
  });

  it("renders className on paragraph", () => {
    const { container } = render(
      <ScrollLitParagraph text="x" className="custom-class" />
    );
    expect(container.querySelector("p.custom-class")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test, verify FAIL**

Run: `npm test -- --run ScrollLitParagraph.test`

Expected: FAIL (module does not exist).

- [ ] **Step 3: Implement `ScrollLitParagraph.tsx`**

Create `components/ui/ScrollLitParagraph.tsx`:

```tsx
"use client";
import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type Props = {
  text: string;
  className?: string;
};

type Token = { text: string; italic: boolean };

const ITALIC_VARIATION: CSSProperties = {
  fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
};

function parseTokens(input: string): Token[] {
  const segments: Token[] = [];
  const regex = /\*([^*]+)\*|([^*]+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(input)) !== null) {
    if (m[1] !== undefined) segments.push({ text: m[1], italic: true });
    else if (m[2] !== undefined) segments.push({ text: m[2], italic: false });
  }
  const tokens: Token[] = [];
  for (const seg of segments) {
    const parts = seg.text.split(/\s+/).filter((w) => w.length > 0);
    for (const w of parts) tokens.push({ text: w, italic: seg.italic });
  }
  return tokens;
}

function LitWord({
  token,
  progress,
  index,
  total,
}: {
  token: Token;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  // Each word lights up as progress passes its position.
  // Words start dim (0.2) and reach full opacity over a small range.
  const start = index / total;
  const end = Math.min(start + 1 / total + 0.05, 1);
  const opacity = useTransform(progress, [start, end], [0.22, 1]);

  if (token.italic) {
    return (
      <motion.em
        className="sl-word font-[family-name:var(--font-serif)] italic font-medium text-[var(--color-accent)]"
        style={{ opacity, display: "inline-block", marginRight: "0.25em", ...ITALIC_VARIATION }}
      >
        {token.text}
      </motion.em>
    );
  }
  return (
    <motion.span
      className="sl-word"
      style={{ opacity, display: "inline-block", marginRight: "0.25em" }}
    >
      {token.text}
    </motion.span>
  );
}

export function ScrollLitParagraph({ text, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const tokens = parseTokens(text);
  // Scroll progress: 0 when paragraph top is at viewport bottom, 1 when paragraph bottom is at viewport center.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  return (
    <p ref={ref} className={className}>
      {tokens.map((t, i) => (
        <LitWord key={i} token={t} progress={scrollYProgress} index={i} total={tokens.length} />
      ))}
    </p>
  );
}
```

- [ ] **Step 4: Run test, verify PASS**

Run: `npm test -- --run ScrollLitParagraph.test`

Expected: PASS (3 tests).

- [ ] **Step 5: Full suite check**

Run: `npm test -- --run`

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/ui/ScrollLitParagraph.tsx components/ui/ScrollLitParagraph.test.tsx
git commit -m "feat(reveal): add ScrollLitParagraph for Apple-style scroll-linked word lighting"
```

---

## Task 3: Apply variants to card grids (Phase 3)

**Files:**
- Modify: `components/sections/Projects.tsx`
- Modify: `components/sections/Skills.tsx`
- Modify: `components/sections/Credentials.tsx`
- Modify: `components/sections/ExperienceRail.tsx`
- Modify: `components/sections/Contact.tsx`

- [ ] **Step 1: Projects — lift variant on each card**

In `components/sections/Projects.tsx`, change each `<Reveal>` wrapping a project card:

```tsx
<Reveal key={p.title} delay={i * 0.08} variant="lift" className="h-full">
```

The footer "View all repos" Reveal stays default (slide-left).

- [ ] **Step 2: Skills — bloom variant**

In `components/sections/Skills.tsx`, change the SkillsCard wrapper:

```tsx
<Reveal key={cat.label} delay={i * 0.08} variant="bloom" className="h-full">
```

- [ ] **Step 3: Credentials cards — keep slide-left but bump glow**

In `components/sections/Credentials.tsx`, leave the cards on the default slide-left (the cards already have their own internal effects — pulse rings, glare). Header Reveal will be updated in Task 4.

- [ ] **Step 4: ExperienceRail — slide-right on each entry**

In `components/sections/ExperienceRail.tsx`, change each entry Reveal:

```tsx
<Reveal key={entry.company} delay={i * 0.1} variant="slide-right">
```

- [ ] **Step 5: Contact — lift on tagline + each CTA**

In `components/sections/Contact.tsx`, change each Reveal:

```tsx
<Reveal delay={0.2} variant="lift">
  <p>open to senior AI / ML roles ...</p>
</Reveal>

<Reveal delay={0.3} variant="lift">
  <MagneticLink href={site.resumePath} ...>Download Resume</MagneticLink>
</Reveal>
<Reveal delay={0.4} variant="lift">
  <MagneticLink href={`mailto:${site.email}`} ...>Email</MagneticLink>
</Reveal>
<Reveal delay={0.5} variant="lift">
  <MagneticLink href={site.links.linkedin} ...>LinkedIn</MagneticLink>
</Reveal>
<Reveal delay={0.6} variant="lift">
  <MagneticLink href={site.links.github} ...>GitHub</MagneticLink>
</Reveal>
```

- [ ] **Step 6: Typecheck + full test suite**

Run: `npx tsc --noEmit && npm test -- --run`

Expected: clean typecheck, all tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/sections/
git commit -m "feat(reveal): apply distinct variants per section (lift/bloom/slide-right)"
```

---

## Task 4: Mask reveals for About portrait + Credentials header (Phase 4)

**Files:**
- Modify: `components/sections/About.tsx`
- Modify: `components/sections/Credentials.tsx`

- [ ] **Step 1: About portrait — mask variant**

In `components/sections/About.tsx`, change the portrait Reveal:

```tsx
<Reveal variant="mask">
  <div className="w-[160px] h-[160px] rounded-full overflow-hidden">
    <Image ... />
  </div>
</Reveal>
```

- [ ] **Step 2: Credentials header — mask variant**

In `components/sections/Credentials.tsx`, change the header Reveal:

```tsx
<Reveal variant="mask">
  <p className="font-[family-name:var(--font-mono)] ...">
    <span className="block w-8 h-px ..." />
    Certifications
    <span className="block flex-1 h-px ..." />
  </p>
</Reveal>
```

- [ ] **Step 3: Typecheck + test**

Run: `npx tsc --noEmit && npm test -- --run`

- [ ] **Step 4: Commit**

```bash
git add components/sections/About.tsx components/sections/Credentials.tsx
git commit -m "feat(reveal): clip-path mask sweep on About portrait + Certifications header"
```

---

## Task 5: Replace About intro paragraphs with ScrollLitParagraph (Phase 4 cont.)

**Files:**
- Modify: `components/sections/About.tsx`

- [ ] **Step 1: Swap `<Reveal><p>...</p></Reveal>` for `<ScrollLitParagraph />`**

In `components/sections/About.tsx`, change the intro paragraphs loop:

```tsx
{intro.map((p, i) => (
  <ScrollLitParagraph
    key={i}
    text={p}
    className="font-[family-name:var(--font-sans)] text-base md:text-lg leading-[1.65] mb-3.5 text-[var(--color-fg-muted)] max-w-[620px]"
  />
))}
```

Import at top:

```tsx
import { ScrollLitParagraph } from "@/components/ui/ScrollLitParagraph";
```

Remove the now-unused `withItalicAccents` import only if no longer used elsewhere in the file (it IS still used elsewhere — KEEP the import).

- [ ] **Step 2: Typecheck + test**

Run: `npx tsc --noEmit && npm test -- --run`

- [ ] **Step 3: Commit**

```bash
git add components/sections/About.tsx
git commit -m "feat(reveal): About intro paragraphs use scroll-linked word lighting"
```

---

## Task 6: Parallax depth on Skills + Credentials corner blurs (Phase 5)

**Files:**
- Modify: `components/sections/SkillsCard.tsx`
- Modify: `components/sections/Credentials.tsx`

- [ ] **Step 1: SkillsCard — parallax the corner blur**

The corner blur in SkillsCard is the gradient div. Wrap or convert to a motion.div using `useScroll` + `useTransform` so the blur drifts at 0.7× scroll speed.

Replace the existing blur div with a new client-side parallax wrapper. Inside `SkillsCard.tsx`, add at top:

```tsx
import { motion, useScroll, useTransform } from "motion/react";
```

And in the component body (after the existing `useEffect`):

```tsx
const blobRef = useRef<HTMLDivElement>(null);
const { scrollYProgress: blobProgress } = useScroll({
  target: blobRef,
  offset: ["start end", "end start"],
});
const blobY = useTransform(blobProgress, [0, 1], [-30, 30]);
```

Wrap the existing blob `<div>` with the motion variant:

```tsx
<motion.div
  ref={blobRef}
  className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${accentGradient} blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500`}
  style={{ y: blobY }}
/>
```

(Replace the existing `<div>` with this `<motion.div>`.)

- [ ] **Step 2: Credentials — parallax corner glow on each cert card**

Per-card parallax in Credentials.tsx would require a client child component. Skip per-card parallax to keep Credentials.tsx as a server component. Instead, give the section a single slow-parallax accent layer at the top of the section.

In `components/sections/Credentials.tsx`, do NOT add parallax for v1 — note as future enhancement.

- [ ] **Step 3: Typecheck + test**

Run: `npx tsc --noEmit && npm test -- --run`

- [ ] **Step 4: Commit**

```bash
git add components/sections/SkillsCard.tsx
git commit -m "feat(reveal): parallax depth on Skills corner blurs (0.7x scroll speed)"
```

---

## Task 7: Final visual verification + cleanup

**Files:** none — verification only

- [ ] **Step 1: Run full typecheck + test suite**

```bash
npx tsc --noEmit && npm test -- --run
```

Expected: clean typecheck; all tests pass (at least 67 baseline + ~7 new = 74+).

- [ ] **Step 2: Visual smoke**

Start dev server and verify each section in browser:

```bash
npm run dev
```

Open http://localhost:3000 and scroll top → bottom. Verify:
- Hero — unchanged (GSAP on-load).
- About — portrait mask-sweeps in; intro paragraphs light up word-by-word as you scroll past, dim as you scroll back; philosophy quotes still kinetic.
- Projects — cards lift up from below with stagger; replay on scroll back.
- Experience — entries slide in from RIGHT; rail still fills; dots pulse.
- Skills — cards bloom (scale from center); corner blurs drift at parallax speed; marquee tags + tooltips still work.
- Credentials — header line mask-sweeps; cards slide in from left; hover triggers pulse rings + diagonal glare.
- Contact — headline still cipher + magnet; tagline + 4 CTAs lift up sequentially.

- [ ] **Step 3: Scroll back up — verify replay**

Scroll from Contact back to top. Each section's entrance animation should replay (or reverse, for scroll-linked items).

- [ ] **Step 4: No commit** (verification task only).

---

## Notes for implementer subagents

- **Cubic-bezier curves**: existing pattern uses `[0.16, 1, 0.3, 1]` (out-expo). Keep this everywhere for consistency.
- **`prefers-reduced-motion`**: `ScrollLitParagraph` doesn't explicitly check this, but `useScroll/useTransform` are inherently scroll-driven (no time-based animation) so reduced-motion is naturally respected.
- **SSR**: All Reveal variants set `initial` opacity 0; that's the SSR state. `whileInView` triggers after hydration. Acceptable; matches existing behavior.
- **`useScroll` target ref**: Must point to the SCROLLED element (the paragraph itself), not its parent.
- **Offsets in `useScroll`**: `["start 0.85", "end 0.4"]` means start animating when top of element hits 85% down the viewport, finish when bottom hits 40%. Tune if too fast/slow.
