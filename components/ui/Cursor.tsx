"use client";
import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], [data-cursor-hover], input, textarea, select, summary";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const root = rootRef.current;
    if (!dot || !ring || !root) return;

    root.style.display = "block";
    document.documentElement.classList.add("uk-cursor-on");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let rafId = 0;
    let visible = false;

    function onMove(e: PointerEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      dot!.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      if (!visible) {
        visible = true;
        dot!.style.opacity = "1";
        ring!.style.opacity = "1";
      }
    }

    function onLeave() {
      visible = false;
      dot!.style.opacity = "0";
      ring!.style.opacity = "0";
    }

    function loop() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    function onEnterInteractive() {
      root!.classList.add("hovering");
    }
    function onLeaveInteractive() {
      root!.classList.remove("hovering");
    }

    function bindInteractive(scope: ParentNode) {
      scope.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR).forEach((el) => {
        el.addEventListener("pointerenter", onEnterInteractive);
        el.addEventListener("pointerleave", onLeaveInteractive);
      });
    }
    bindInteractive(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) bindInteractive(n as ParentNode);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      observer.disconnect();
      document
        .querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR)
        .forEach((el) => {
          el.removeEventListener("pointerenter", onEnterInteractive);
          el.removeEventListener("pointerleave", onLeaveInteractive);
        });
      document.documentElement.classList.remove("uk-cursor-on");
    };
  }, []);

  return (
    <div ref={rootRef} className="uk-cursor-root" aria-hidden>
      <div ref={ringRef} className="uk-cursor-ring" />
      <div ref={dotRef} className="uk-cursor-dot" />
      <style>{`
        .uk-cursor-root {
          display: none;
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
        }
        .uk-cursor-dot,
        .uk-cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          opacity: 0;
          will-change: transform;
        }
        .uk-cursor-dot {
          width: 6px;
          height: 6px;
          background: #f5e0aa;
          border-radius: 50%;
          transition: width 0.18s ease, height 0.18s ease, background 0.2s ease, opacity 0.2s ease;
        }
        .uk-cursor-ring {
          width: 32px;
          height: 32px;
          border: 1.5px solid #f5e0aa;
          border-radius: 50%;
          transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.2s ease,
                      opacity 0.2s ease;
        }
        .uk-cursor-root.hovering .uk-cursor-ring {
          width: 56px;
          height: 56px;
          border-color: #6ccfff;
        }
        .uk-cursor-root.hovering .uk-cursor-dot {
          background: #6ccfff;
          width: 4px;
          height: 4px;
        }
        /* hide native cursor on supported devices once active */
        html.uk-cursor-on,
        html.uk-cursor-on body,
        html.uk-cursor-on a,
        html.uk-cursor-on button {
          cursor: none !important;
        }
        @media (pointer: coarse), (prefers-reduced-motion: reduce) {
          .uk-cursor-root { display: none !important; }
          html.uk-cursor-on, html.uk-cursor-on * { cursor: auto !important; }
        }
      `}</style>
    </div>
  );
}
