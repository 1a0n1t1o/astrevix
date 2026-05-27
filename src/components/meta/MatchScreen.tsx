"use client";

import { Check, ArrowRight } from "lucide-react";
import { BUSINESS_MATCH_PHRASE } from "@/lib/meta/quizData";

interface MatchScreenProps {
  businessValue?: string;
  onContinue: () => void;
}

const BENEFITS = [
  "A 15-minute walkthrough of the counter stand and reward setup",
  "A custom example of what posts would look like for your shop",
  "No hard pitch — we just see if it's a fit",
];

// Deterministic so there's no SSR/first-render mismatch — light, no dependency.
const CONFETTI = [
  { x: -120, color: "#2563EB", delay: 0 },
  { x: -80, color: "#60A5FA", delay: 0.05 },
  { x: -40, color: "#f9ce34", delay: 0.12 },
  { x: 0, color: "#ee2a7b", delay: 0.02 },
  { x: 40, color: "#2563EB", delay: 0.1 },
  { x: 80, color: "#60A5FA", delay: 0.06 },
  { x: 120, color: "#f9ce34", delay: 0.15 },
  { x: -100, color: "#ffffff", delay: 0.2 },
  { x: 100, color: "#ee2a7b", delay: 0.18 },
  { x: -20, color: "#60A5FA", delay: 0.24 },
  { x: 60, color: "#ffffff", delay: 0.28 },
  { x: -60, color: "#2563EB", delay: 0.22 },
];

export default function MatchScreen({
  businessValue,
  onContinue,
}: MatchScreenProps) {
  const phrase =
    (businessValue && BUSINESS_MATCH_PHRASE[businessValue]) ||
    "local service businesses";

  return (
    <div className="relative flex flex-1 flex-col justify-center py-8">
      {/* Confetti burst */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-0 w-0">
        {CONFETTI.map((piece, i) => (
          <span
            key={i}
            className="meta-confetti-piece absolute block h-2.5 w-2.5 rounded-[2px]"
            style={
              {
                backgroundColor: piece.color,
                "--mx": `${piece.x}px`,
                "--delay": `${piece.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div className="meta-pop mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2563EB] shadow-xl shadow-[#2563EB]/40">
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </div>

        <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[#F8FAFC] sm:text-[32px]">
          Looks like we&apos;re a match!
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-white/70">
          Based on your answers, you&apos;re a great fit for what we build for{" "}
          <span className="font-semibold text-white">{phrase}</span>.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5"
          >
            <Check
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#60A5FA]"
              strokeWidth={2.5}
            />
            <span className="text-[15px] leading-snug text-white/85">
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-8 flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] text-lg font-semibold text-white shadow-xl shadow-[#2563EB]/30 transition-transform duration-100 active:scale-[0.98]"
      >
        Book My Free Strategy Call
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
