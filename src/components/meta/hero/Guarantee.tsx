"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { PrimaryCTA } from "./shared";

const GUARANTEES = [
  "No contract. Cancel anytime.",
  "Free 3-week trial. See real posts before you pay.",
  "I walk you through setup myself.",
];

export default function Guarantee({ onStart }: { onStart: () => void }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-hidden rounded-3xl border border-slate-200 border-t-[3px] border-t-[#2563EB] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] sm:p-8">
        <ul className="space-y-4">
          {GUARANTEES.map((g, i) => (
            <motion.li
              key={g}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Check
                  className="h-3.5 w-3.5 text-[#2563EB]"
                  strokeWidth={3}
                />
              </span>
              <span className="text-[16px] font-medium leading-snug text-slate-700">
                {g}
              </span>
            </motion.li>
          ))}
        </ul>
        {/* The button lands after the list finishes checking off. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          <PrimaryCTA onClick={onStart} />
        </motion.div>
      </div>
    </motion.section>
  );
}
