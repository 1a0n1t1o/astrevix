"use client";

import { motion } from "framer-motion";
import { Car, Scissors, Paintbrush, Pen, Droplets } from "lucide-react";

const INDUSTRIES = [
  {
    icon: Car,
    title: "Auto Detailing",
    desc: "Your ceramic coatings deserve to be seen by thousands",
  },
  {
    icon: Paintbrush,
    title: "Nail Salons",
    desc: "Every set of nails is a potential viral post",
  },
  {
    icon: Scissors,
    title: "Barber Shops",
    desc: "Fresh fades get likes. Now they'll get you customers.",
  },
  {
    icon: Pen,
    title: "Tattoo Studios",
    desc: "Your art speaks for itself. Let customers amplify it.",
  },
  {
    icon: Droplets,
    title: "Car Washes",
    desc: "Turn every wash into word-of-mouth marketing",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function WhoItsFor() {
  return (
    <section className="bg-[#0F172A] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block rounded-full border border-slate-700 bg-slate-800/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]"
          >
            Who It&apos;s For
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl font-extrabold text-white sm:text-4xl"
          >
            Built for businesses where the work speaks for itself
          </motion.h2>
        </div>

        {/* Industry cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group rounded-2xl border border-slate-800 bg-slate-800/40 p-6 transition-all hover:border-[#2563EB]/40 hover:bg-slate-800/70"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <Icon className="h-5 w-5 text-[#3B82F6]" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">
                  {industry.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {industry.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
