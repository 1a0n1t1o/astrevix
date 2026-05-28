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
      <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-[#0A0E27] sm:text-[30px]">
        No problem. Whenever you&apos;re ready.
      </h2>
      <p className="mx-auto mt-4 max-w-[26rem] text-[17px] leading-relaxed text-slate-600">
        If you want to see how it works for your shop later, you can still grab
        a quick call. No commitment.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="mx-auto mt-8 flex h-[56px] w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-base font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
      >
        Actually, show me a time
        <ArrowRight className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  );
}
