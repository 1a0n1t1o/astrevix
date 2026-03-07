"use client";

import { motion } from "framer-motion";

const STATS = [
  {
    value: "500+",
    label: "Average reach of one Instagram Reel",
    color: "#3B82F6",
  },
  {
    value: "$15-30",
    label: "Cost of a Facebook ad reaching 500 people",
    color: "#EF4444",
  },
  {
    value: "$0",
    label: "Your cost when a customer posts for a free detail",
    color: "#10B981",
  },
  {
    value: "10x",
    label: "Cheaper than ads — and more trusted because it's from a real person",
    color: "#F59E0B",
  },
];

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function ROISection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block rounded-full bg-[#2563EB]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2563EB]"
          >
            The Math
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Why This Works
          </motion.h2>
        </div>

        {/* Stats grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.value}
              custom={i}
              variants={statVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 text-center transition-shadow hover:shadow-lg"
            >
              <p
                className="text-4xl font-extrabold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center text-lg font-semibold text-gray-700"
        >
          One happy customer&apos;s post does more than a month of ads.
        </motion.p>
      </div>
    </section>
  );
}
