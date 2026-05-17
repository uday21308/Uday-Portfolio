"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Gamepad2, Bug, Lightbulb } from "lucide-react";
import { MascotSprite } from "./MascotSprite";
import { startTips, mascotBlurbs } from "@/content/kb/game-tips";

const GROUND_Y = 0;
const JUMP_VELOCITY = 11;
const GRAVITY = 0.55;
const INITIAL_SPEED = 3.2;
const SPEED_INCREMENT = 0.0025;
const MASCOT_X = 36;
const MASCOT_W = 28;
const MASCOT_H = 28;
const OBSTACLE_W = 44;
const OBSTACLE_H = 22;
const SPAWN_MIN = 55;
const SPAWN_MAX = 130;
const BUBBLE_FIRST_DELAY_MS = 8_000;
const BUBBLE_MIN_GAP_MS = 11_000;
const BUBBLE_MAX_GAP_MS = 15_000;
const BUBBLE_VISIBLE_MS = 6_000;

const LABELS = ["BUG", "NaN", "404", "OOM", "ERR", "CRASH", "NULL", "TLE"];
const HS_KEY = "uday-bugdodge-hs";

type Obstacle = { id: number; x: number; label: string };
type Status = "idle" | "playing" | "over";

function pickDifferent<T>(pool: T[], lastIdxRef: React.MutableRefObject<number>): T {
  if (pool.length === 0) return undefined as unknown as T;
  if (pool.length === 1) { lastIdxRef.current = 0; return pool[0]; }
  let idx = Math.floor(Math.random() * pool.length);
  while (idx === lastIdxRef.current) {
    idx = Math.floor(Math.random() * pool.length);
  }
  lastIdxRef.current = idx;
  return pool[idx];
}

export function GameView() {
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [, forceRender] = useState(0);

  const lastStartTipIdxRef = useRef(-1);
  const lastBlurbIdxRef = useRef(-1);
  const [overlayTip, setOverlayTip] = useState<string>(() => {
    const t = pickDifferent(startTips, lastStartTipIdxRef);
    return t;
  });
  const [bubble, setBubble] = useState<string | null>(null);

  const arenaRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({
    mascotY: GROUND_Y,
    mascotVy: 0,
    obstacles: [] as Obstacle[],
    speed: INITIAL_SPEED,
    frame: 0,
    nextObstacleAt: 60,
    framesSinceObstacle: 0,
    obstacleIdCounter: 0,
  });

  const reset = useCallback(() => {
    stateRef.current = {
      mascotY: GROUND_Y,
      mascotVy: 0,
      obstacles: [],
      speed: INITIAL_SPEED,
      frame: 0,
      nextObstacleAt: 60,
      framesSinceObstacle: 0,
      obstacleIdCounter: 0,
    };
    setScore(0);
  }, []);

  const start = useCallback(() => {
    reset();
    setStatus("playing");
  }, [reset]);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.mascotY <= GROUND_Y && s.mascotVy === 0) {
      s.mascotVy = JUMP_VELOCITY;
    }
  }, []);

  const handleAction = useCallback(() => {
    if (status === "idle" || status === "over") start();
    else jump();
  }, [status, start, jump]);

  // load high score
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HS_KEY);
      if (stored) setHighScore(parseInt(stored, 10) || 0);
    } catch {}
  }, []);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAction]);

  // rotate the overlay tip each time we land on idle or over
  useEffect(() => {
    if (status === "idle" || status === "over") {
      setOverlayTip(pickDifferent(startTips, lastStartTipIdxRef));
    }
  }, [status]);

  // schedule mid-game speech bubbles
  useEffect(() => {
    if (status !== "playing") {
      setBubble(null);
      return;
    }
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let nextTimer: ReturnType<typeof setTimeout> | null = null;

    const fireBubble = () => {
      setBubble(pickDifferent(mascotBlurbs, lastBlurbIdxRef));
      hideTimer = setTimeout(() => {
        setBubble(null);
        const gap = BUBBLE_MIN_GAP_MS + Math.random() * (BUBBLE_MAX_GAP_MS - BUBBLE_MIN_GAP_MS);
        nextTimer = setTimeout(fireBubble, gap);
      }, BUBBLE_VISIBLE_MS);
    };

    const firstTimer = setTimeout(fireBubble, BUBBLE_FIRST_DELAY_MS);
    return () => {
      clearTimeout(firstTimer);
      if (hideTimer) clearTimeout(hideTimer);
      if (nextTimer) clearTimeout(nextTimer);
      setBubble(null);
    };
  }, [status]);

  // game loop
  useEffect(() => {
    if (status !== "playing") return;
    const arenaWidth = arenaRef.current?.clientWidth ?? 340;

    const tick = () => {
      const s = stateRef.current;
      s.frame++;

      s.mascotY += s.mascotVy;
      s.mascotVy -= GRAVITY;
      if (s.mascotY <= GROUND_Y) {
        s.mascotY = GROUND_Y;
        s.mascotVy = 0;
      }

      s.obstacles = s.obstacles
        .map((o) => ({ ...o, x: o.x - s.speed }))
        .filter((o) => o.x > -OBSTACLE_W);

      s.framesSinceObstacle++;
      if (s.framesSinceObstacle >= s.nextObstacleAt) {
        s.obstacles.push({
          id: s.obstacleIdCounter++,
          x: arenaWidth + 10,
          label: LABELS[Math.floor(Math.random() * LABELS.length)],
        });
        s.framesSinceObstacle = 0;
        s.nextObstacleAt = SPAWN_MIN + Math.floor(Math.random() * (SPAWN_MAX - SPAWN_MIN));
      }

      const mascotLeft = MASCOT_X;
      const mascotRight = MASCOT_X + MASCOT_W;
      const mascotBottom = s.mascotY;
      const mascotTop = s.mascotY + MASCOT_H;
      for (const o of s.obstacles) {
        const obsLeft = o.x;
        const obsRight = o.x + OBSTACLE_W;
        if (
          obsLeft < mascotRight &&
          obsRight > mascotLeft &&
          0 < mascotTop &&
          OBSTACLE_H > mascotBottom
        ) {
          const finalScore = Math.floor(s.frame / 5);
          setScore(finalScore);
          setStatus("over");
          setHighScore((hs) => {
            const next = Math.max(hs, finalScore);
            try { localStorage.setItem(HS_KEY, String(next)); } catch {}
            return next;
          });
          return;
        }
      }

      s.speed += SPEED_INCREMENT;
      setScore(Math.floor(s.frame / 5));
      forceRender((t) => (t + 1) & 0xFFFF);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status]);

  const pad = (n: number) => n.toString().padStart(5, "0");
  const mascotY = stateRef.current.mascotY;
  const obstacles = stateRef.current.obstacles;
  // Bubble anchors at mascot's left edge and extends right; triangle on the
  // bottom-left points down at the mascot. Prevents clipping off arena left.
  const bubbleBottom = 28 + mascotY + MASCOT_H + 12;
  const bubbleLeft = MASCOT_X + 4;

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 text-[11px] text-[var(--color-fg-muted)] border-b border-[var(--color-accent)]/10 flex items-center justify-between">
        <span>Bug Dodger · Space or tap to jump</span>
        <span className="font-[family-name:var(--font-mono)] text-[var(--color-fg)]">
          BEST {pad(highScore)} · {pad(score)}
        </span>
      </div>

      <div
        ref={arenaRef}
        onClick={handleAction}
        role="button"
        aria-label="Game arena — tap to jump"
        tabIndex={0}
        data-lenis-prevent
        className="flex-1 relative overflow-hidden cursor-pointer select-none focus:outline-none touch-none"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-bg) 0%, color-mix(in oklab, var(--color-accent) 8%, var(--color-bg)) 100%)",
        }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute rounded-full opacity-30"
            style={{
              width: i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              left: `${(i * 73) % 100}%`,
              top: `${(i * 41) % 65}%`,
              background: i % 3 === 0 ? "var(--color-accent-cyan)" : "var(--color-accent)",
            }}
          />
        ))}

        <div
          aria-hidden
          className="absolute left-0 right-0 border-t border-[var(--color-accent)]/30"
          style={{ bottom: 28 }}
        />

        <div
          className="absolute"
          style={{ left: MASCOT_X, bottom: 28 + mascotY }}
        >
          <MascotSprite scale={1.5} />
        </div>

        {/* Mid-game speech bubble (anchors at mascot's left, extends right) */}
        {status === "playing" && bubble && (
          <div
            data-testid="mascot-bubble"
            className="absolute pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-accent-cyan)]/50 text-[11px] font-[family-name:var(--font-mono)] text-[var(--color-fg)] shadow-lg animate-bubble"
            style={{ bottom: bubbleBottom, left: bubbleLeft }}
          >
            {bubble}
            <span
              aria-hidden
              className="absolute -bottom-1 w-0 h-0"
              style={{
                left: 10,
                borderLeft: "4px solid transparent",
                borderRight: "4px solid transparent",
                borderTop: "5px solid var(--color-bg-elevated)",
              }}
            />
          </div>
        )}

        {obstacles.map((o) => (
          <div
            key={o.id}
            className="absolute font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-tight text-red-100 bg-red-600/70 border border-red-300/60 rounded shadow flex items-center justify-center"
            style={{ left: o.x, bottom: 28, width: OBSTACLE_W, height: OBSTACLE_H }}
          >
            {o.label}
          </div>
        ))}

        {status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[2px] px-6">
            <Gamepad2 size={28} strokeWidth={1.75} className="mb-1 text-[var(--color-accent-cyan)]" aria-hidden />
            <div className="text-base font-semibold">Bug Dodger</div>
            <div className="text-xs text-[var(--color-fg-muted)] mt-1 text-center leading-relaxed">
              Help the AI engineer dodge the bugs.<br />Space, click, or tap to jump.
            </div>
            <div className="text-[11px] text-[var(--color-accent-cyan)]/90 mt-3 mb-3 text-center leading-snug max-w-[260px] flex items-start gap-1.5 justify-center">
              <Lightbulb size={12} strokeWidth={2} aria-hidden className="mt-0.5 flex-shrink-0" />
              <span>{overlayTip}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); start(); }}
              className="px-4 py-1.5 rounded-md bg-[var(--color-accent-cyan)]/20 hover:bg-[var(--color-accent-cyan)]/30 text-sm"
            >
              Start →
            </button>
          </div>
        )}

        {status === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 backdrop-blur-[2px] px-6">
            <Bug size={28} strokeWidth={1.75} className="mb-1 text-red-300" aria-hidden />
            <div className="text-base font-semibold">Caught at score {score}</div>
            {score >= highScore && score > 0 && (
              <div className="text-xs text-[var(--color-accent-cyan)] mt-1">new best score!</div>
            )}
            <div className="text-xs text-[var(--color-fg-muted)] mt-1">
              BEST {pad(highScore)} · You {pad(score)}
            </div>
            <div className="text-[11px] text-[var(--color-accent-cyan)]/90 mt-3 mb-3 text-center leading-snug max-w-[260px] flex items-start gap-1.5 justify-center">
              <Lightbulb size={12} strokeWidth={2} aria-hidden className="mt-0.5 flex-shrink-0" />
              <span>{overlayTip}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); start(); }}
              className="px-4 py-1.5 rounded-md bg-[var(--color-accent-cyan)]/20 hover:bg-[var(--color-accent-cyan)]/30 text-sm"
            >
              Try again →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bubbleIn {
          0%   { opacity: 0; transform: translateY(4px) scale(0.92); }
          10%  { opacity: 1; transform: translateY(0) scale(1); }
          90%  { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-4px) scale(0.96); }
        }
        .animate-bubble { animation: bubbleIn ${BUBBLE_VISIBLE_MS}ms ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .animate-bubble { animation-duration: 0.1s; }
        }
      `}</style>
    </div>
  );
}
