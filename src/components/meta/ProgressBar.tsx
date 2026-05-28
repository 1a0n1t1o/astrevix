"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  const reduce = useReducedMotion();

  return (
    <div className="w-full">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Question {current} of {total}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
        <motion.div
          className="h-full rounded-full bg-[#2563EB]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 110, damping: 18 }
          }
        />
      </div>
    </div>
  );
}
