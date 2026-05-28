"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Founder() {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-[600px] text-center"
    >
      <div className="mx-auto mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white">
        <span className="text-[9px] font-bold leading-tight text-slate-400">
          Founder
          <br />
          photo
        </span>
      </div>
      <p className="text-sm font-bold text-[#0A0E27]">
        Anto, Founder at Astrevix
      </p>
      <p className="mt-6 text-[17px] font-medium leading-[1.65] text-slate-700">
        I built Astrevix because I watched local businesses pay influencers
        thousands for posts their customers would make for a small reward. I
        onboard every new business myself. If it&apos;s not the right fit for
        your shop, I&apos;ll tell you on the call.
      </p>
    </motion.section>
  );
}
