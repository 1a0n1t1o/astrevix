"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "./shared";

type Tile =
  | {
      kind: "static";
      display: string;
      label: string;
      sub: string;
    }
  | {
      kind: "count";
      to: number;
      format: (n: number) => string;
      label: string;
      sub: string;
    };

const TILES: Tile[] = [
  {
    kind: "static",
    display: "0",
    label: "App downloads required",
    sub: "Works on any phone with NFC or a camera.",
  },
  {
    kind: "count",
    to: 10,
    format: (n) => `<${Math.round(n)}s`,
    label: "From tap to posted",
    sub: "The customer is in and out before their coffee cools.",
  },
  {
    kind: "count",
    to: 100,
    format: (n) => `${Math.round(n)}%`,
    label: "Of posts come from real customers",
    sub: "Each post comes from a paying customer.",
  },
];

// Mobile (single column): scale with the viewport. sm+ (3-across): the
// funnel container is a fixed 520px, so the ~144px columns need a fixed
// size that always fits — a viewport-relative size here is what caused
// "<10s" and "100%" to collide.
const NUMBER_CLASS =
  "block text-[clamp(3rem,11vw,4rem)] sm:text-[2.75rem] font-bold leading-none tracking-[-0.03em] text-[#2563EB] [font-variant-numeric:tabular-nums]";

export default function WhyItWorks() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section>
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0A0E27]"
      >
        Why it works
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.label}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {tile.kind === "static" ? (
              <span className={NUMBER_CLASS}>{tile.display}</span>
            ) : (
              <CountUp
                to={tile.to}
                format={tile.format}
                className={NUMBER_CLASS}
              />
            )}
            <p className="mt-3 text-[18px] font-bold leading-snug tracking-[-0.01em] text-[#0A0E27]">
              {tile.label}
            </p>
            <p className="mt-1.5 text-[15px] font-medium leading-relaxed text-slate-600">
              {tile.sub}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
