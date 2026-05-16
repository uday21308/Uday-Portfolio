"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
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
