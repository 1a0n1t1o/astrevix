"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
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

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function QuizScreen({
  question,
  stepNumber,
  totalSteps,
  answeredValue,
  onAnswer,
  onBack,
}: QuizScreenProps) {
  const [picked, setPicked] = useState<string | null>(answeredValue ?? null);
  const reduce = useReducedMotion() ?? false;
  const isGrid = question.layout === "grid";

  function handlePick(value: string) {
    if (picked) return; // ignore double-taps during the flash
    setPicked(value);
    // Brief tap feedback (color flash) before auto-advancing.
    window.setTimeout(() => onAnswer(value), 160);
  }

  return (
    <motion.div
      variants={containerVariants}
      initial={reduce ? false : "hidden"}
      animate="show"
      className="flex flex-1 flex-col"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between pt-5"
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="-ml-2 rounded-full p-2 text-slate-400 transition-colors hover:text-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-2">
        <ProgressBar current={stepNumber} total={totalSteps} />
      </motion.div>

      <div className="flex flex-1 flex-col justify-center py-8">
        <motion.h2
          variants={itemVariants}
          className="mb-8 text-[24px] font-semibold leading-snug tracking-tight text-[#0A0E27] sm:text-[28px]"
        >
          {question.question}
        </motion.h2>

        <div className={isGrid ? "grid grid-cols-2 gap-3" : "space-y-4"}>
          {question.options.map((option) => {
            const isSelected = picked === option.value;

            const baseClasses = isSelected
              ? "border-[#2563EB] bg-[#2563EB] text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.45)]"
              : "border-blue-200 bg-white text-[#0A0E27] hover:border-blue-300 hover:shadow-md";

            return (
              <motion.button
                key={option.value}
                variants={itemVariants}
                type="button"
                onClick={() => handlePick(option.value)}
                aria-pressed={isSelected}
                className={
                  isGrid
                    ? `flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border-2 px-3 py-4 text-center transition-all duration-150 active:scale-[0.98] ${baseClasses}`
                    : `flex min-h-[56px] w-full items-center gap-3 rounded-2xl border-2 px-5 py-3.5 text-left transition-all duration-150 active:scale-[0.98] ${baseClasses}`
                }
              >
                {isGrid ? (
                  <>
                    <span className="text-3xl leading-none">
                      {option.emoji}
                    </span>
                    <span className="text-[14px] font-semibold leading-snug">
                      {option.label}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl leading-none">
                      {option.emoji}
                    </span>
                    <span className="text-[18px] font-medium leading-snug">
                      {option.label}
                    </span>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
