"use client";

import { ArrowRight } from "lucide-react";

interface SoftOutcomeScreenProps {
  onContinue: () => void;
}

export default function SoftOutcomeScreen({
  onContinue,
}: SoftOutcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col justify-center py-8 text-center">
      <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-[#F8FAFC] sm:text-[30px]">
        No problem — whenever you&apos;re ready.
      </h2>
      <p className="mx-auto mt-4 max-w-[26rem] text-[17px] leading-relaxed text-white/70">
        If you&apos;d like to see how it works for your shop later, you can still
        grab a quick call — no commitment.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="mx-auto mt-8 flex h-[56px] w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.04] text-base font-medium text-white/90 transition-[color,background-color,transform] duration-100 hover:bg-white/[0.08] active:scale-[0.98]"
      >
        Actually, show me a time
        <ArrowRight className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  );
}
