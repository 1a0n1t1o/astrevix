"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { QuizQuestion } from "@/lib/meta/quizData";
import ProgressBar from "./ProgressBar";

interface QuizScreenProps {
  question: QuizQuestion;
  stepNumber: number;
  totalSteps: number;
  answeredValue?: string;
  onAnswer: (value: string) => void;
  onBack: () => void;
}

export default function QuizScreen({
  question,
  stepNumber,
  totalSteps,
  answeredValue,
  onAnswer,
  onBack,
}: QuizScreenProps) {
  const [picked, setPicked] = useState<string | null>(answeredValue ?? null);

  function handlePick(value: string) {
    if (picked) return; // ignore double-taps during the flash
    setPicked(value);
    // Brief tap feedback (color flash) before auto-advancing.
    window.setTimeout(() => onAnswer(value), 160);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between pt-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="-ml-2 rounded-full p-2 text-white/40 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2">
        <ProgressBar current={stepNumber} total={totalSteps} />
      </div>

      <div className="flex flex-1 flex-col justify-center py-8">
        <h2 className="mb-8 text-[24px] font-semibold leading-snug tracking-tight text-[#F8FAFC] sm:text-[28px]">
          {question.question}
        </h2>

        <div className="space-y-4">
          {question.options.map((option) => {
            const isSelected = picked === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handlePick(option.value)}
                aria-pressed={isSelected}
                className={`flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 border-[#2563EB] px-5 py-3.5 text-left transition-[color,background-color,transform] duration-100 active:scale-[0.98] ${
                  isSelected
                    ? "bg-[#2563EB] text-white"
                    : "bg-white/[0.03] text-[#F8FAFC]"
                }`}
              >
                <span className="text-2xl leading-none">{option.emoji}</span>
                <span className="text-[18px] font-medium leading-snug">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
