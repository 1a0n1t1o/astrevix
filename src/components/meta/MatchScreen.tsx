"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { BUSINESS_MATCH_PHRASE } from "@/lib/meta/quizData";

interface MatchScreenProps {
  businessValue?: string;
  onContinue: () => void;
}

const BENEFITS = [
  "A 15-minute walkthrough of the counter stand and reward setup",
  "A mock-up of what customer posts would look like for your shop",
  "No hard pitch. We see if it's a fit.",
];

// Deterministic so there's no SSR/first-render mismatch — light, no dependency.
const CONFETTI = [
  { x: -120, color: "#2563EB", delay: 0 },
  { x: -80, color: "#60A5FA", delay: 0.05 },
  { x: -40, color: "#F59E0B", delay: 0.12 },
  { x: 0, color: "#EC4899", delay: 0.02 },
  { x: 40, color: "#2563EB", delay: 0.1 },
  { x: 80, color: "#60A5FA", delay: 0.06 },
  { x: 120, color: "#F59E0B", delay: 0.15 },
  { x: -100, color: "#0EA5E9", delay: 0.2 },
  { x: 100, color: "#EC4899", delay: 0.18 },
  { x: -20, color: "#60A5FA", delay: 0.24 },
  { x: 60, color: "#0EA5E9", delay: 0.28 },
  { x: -60, color: "#2563EB", delay: 0.22 },
];

export default function MatchScreen({
  businessValue,
  onContinue,
}: MatchScreenProps) {
  const reduce = useReducedMotion() ?? false;
  const phrase =
    (businessValue && BUSINESS_MATCH_PHRASE[businessValue]) ||
    "local businesses with walk-in customers";

  return (
    <div className="relative flex flex-1 flex-col justify-center py-8">
      {/* One-shot confetti burst, anchored above the checkmark. */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-0 w-0">
        {CONFETTI.map((piece, i) => (
          <motion.span
            key={i}
            initial={
              reduce ? { opacity: 0 } : { opacity: 1, x: 0, y: 0, rotate: 0 }
            }
            animate={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: piece.x, y: 220, rotate: 220 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 1.2, delay: piece.delay, ease: "easeOut" }
            }
            className="absolute block h-2.5 w-2.5 rounded-[2px]"
            style={{ backgroundColor: piece.color }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center">
        <motion.div
          initial={reduce ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 220, damping: 16, delay: 0.05 }
          }
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2563EB] shadow-[0_18px_44px_-12px_rgba(37,99,235,0.55)]"
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
            <motion.path
              d="M6 12.5 L10.5 17 L18 8.5"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 }
              }
            />
          </svg>
        </motion.div>

        <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[#0A0E27] sm:text-[32px]">
          Looks like we&apos;re a match!
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-slate-600">
          You&apos;re a strong fit for what we build for{" "}
          <span className="font-semibold text-[#2563EB]">{phrase}</span>.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <Check
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2563EB]"
              strokeWidth={2.75}
            />
            <span className="text-[15px] leading-snug text-slate-700">
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-8 flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] text-lg font-semibold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(37,99,235,0.65)] active:scale-[0.98]"
      >
        Book My Free Strategy Call
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
