"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Star } from "lucide-react";

const RESULTS = [
  {
    stat: "23",
    unit: "customer posts",
    timeframe: "in the first month",
    business: "Auto Detailing Shop",
    icon: TrendingUp,
    stars: 5,
  },
  {
    stat: "2x",
    unit: "Instagram followers",
    timeframe: "in 6 weeks",
    business: "Nail Salon",
    icon: Users,
    stars: 5,
  },
  {
    stat: "80%",
    unit: "less ad spend",
    timeframe: "after 3 months",
    business: "Barber Shop",
    icon: DollarSign,
    stars: 5,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function Results() {
  return (
    <section id="results" className="bg-[#0F172A] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block rounded-full border border-slate-700 bg-slate-800/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]"
          >
            Results
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl font-extrabold text-white sm:text-4xl"
          >
            Real results from real businesses
          </motion.h2>
        </div>

        {/* Results cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {RESULTS.map((result, i) => {
            const Icon = result.icon;
            return (
              <motion.div
                key={result.business}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 text-center transition-all hover:border-[#2563EB]/30"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <Icon className="h-6 w-6 text-[#3B82F6]" />
                </div>

                <p className="mt-4 text-4xl font-extrabold text-white">
                  {result.stat}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  {result.unit}
                </p>
                <p className="text-xs text-slate-500">{result.timeframe}</p>

                {/* Stars */}
                <div className="mt-4 flex justify-center gap-0.5">
                  {Array.from({ length: result.stars }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="mt-2 text-xs font-medium text-slate-500">
                  {result.business}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
