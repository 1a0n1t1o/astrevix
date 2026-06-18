"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Star } from "lucide-react";
import { REVIEWS } from "@/lib/reviews";
import { SectionTitle, VIEWPORT } from "./shared";

const TRACK: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const CARD: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// Compact, swipeable testimonial rail — keeps the funnel short while still
// showing real social proof. Cards peek past the column edge to signal scroll.
export default function Reviews() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section>
      <SectionTitle>What local owners are saying.</SectionTitle>

      <motion.div
        variants={TRACK}
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={VIEWPORT}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {REVIEWS.map((review) => (
          <motion.figure
            key={review.name}
            variants={CARD}
            className="flex w-[80%] shrink-0 snap-start flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] sm:w-[58%]"
          >
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star
                  key={s}
                  className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]"
                  strokeWidth={0}
                />
              ))}
            </div>
            <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-700">
              {`“${review.quote}”`}
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                {review.name[0]}
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#0A0E27]">
                  {review.name}
                </div>
                <div className="text-[12px] text-slate-500">{review.role}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
