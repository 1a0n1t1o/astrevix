"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
 * Animates a number from 0 → `to` once the element scrolls into view.
 * Static value (renders the formatted target) when prefers-reduced-motion.
 */
export function CountUp({
  to,
  format,
  duration = 1,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion() ?? false;
  const [value, setValue] = useState(0);

  // For reduced motion, render the final value directly — no state, no rAF.
  // Avoids a synchronous setState in the effect body.
  const displayed = reduce ? to : value;

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
      {format(displayed)}
    </span>
  );
}
