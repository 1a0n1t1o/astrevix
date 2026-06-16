"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* Shared whileInView trigger configs.
   Default: nothing animates until the element clears the bottom 30% of the
   viewport — properly in the user's eyeline, not just peeking in. */
export const VIEWPORT = {
  once: true,
  margin: "0px 0px -30% 0px",
} as const;

/* Tall elements (e.g. the how-it-works cards) trigger once a quarter of
   them is visible — a bottom-% margin would fire too late or feel dead on
   short phones. */
export const VIEWPORT_TALL = { once: true, amount: 0.25 } as const;

/* The closing Guarantee/CTA card sits near the document floor and can
   never clear a 30% bottom margin at max scroll — a softer 15% keeps it
   from staying permanently invisible. */
export const VIEWPORT_FINAL = {
  once: true,
  margin: "0px 0px -15% 0px",
} as const;

/**
 * Section h2 preceded by a short accent bar that scales in horizontally
 * (origin left) just before the title fades up. Shared by the landing
 * sections so their header rhythm stays identical.
 *
 * The in-view trigger lives on the wrapper, not the bar: an element at
 * scaleX(0) has a zero-area rect, so IntersectionObserver would never
 * report it visible and the bar would stay hidden forever.
 */
export function SectionTitle({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT}
      className="mb-10"
    >
      <motion.span
        aria-hidden="true"
        variants={{
          hidden: { opacity: 0, scaleX: 0 },
          show: {
            opacity: 1,
            scaleX: 1,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          },
        }}
        className="mb-3 block h-[3px] w-10 origin-left rounded-full bg-[#2563EB]"
      />
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 16 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] },
          },
        }}
        className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0A0E27]"
      >
        {children}
      </motion.h2>
    </motion.div>
  );
}

interface PrimaryCTAProps {
  onClick: () => void;
  label?: string;
  subText?: string;
  /** Apply the 4s soft blue glow loop. Skip when prefers-reduced-motion. */
  glow?: boolean;
}

export function PrimaryCTA({
  onClick,
  label = "See If We're A Match",
  subText = "Takes 30 seconds. No credit card.",
  glow = false,
}: PrimaryCTAProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className={`flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] px-8 text-lg font-bold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(37,99,235,0.65)] active:scale-[0.98] ${glow ? "meta-cta-glow" : ""}`}
      >
        {label}
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </button>
      {subText && (
        <p className="mt-3 text-center text-sm font-medium text-slate-500">
          {subText}
        </p>
      )}
    </div>
  );
}

interface CountUpProps {
  to: number;
  format: (n: number) => string;
  duration?: number;
  className?: string;
}

/**
 * Number that rests at its final `to` value and only animates 0 → `to` once it
 * scrolls into view (and motion is allowed).
 *
 * State is seeded with `to`, never 0, so SSR, no-JS, pre-hydration, and
 * reduced-motion all render the real number — the count-up is purely
 * progressive enhancement. There is no path that renders `format(0)` (e.g.
 * "<0s" / "0%") at rest. The 0 → `to` sweep is the intended animation, and it
 * begins exactly as the tile fades in, so its initial frame is masked.
 */
export function CountUp({
  to,
  format,
  duration = 1,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduce = useReducedMotion() ?? false;
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(to * eased);
      if (t < 1) raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
