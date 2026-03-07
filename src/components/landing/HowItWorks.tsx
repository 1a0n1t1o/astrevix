"use client";

import { motion } from "framer-motion";
import { QrCode, Gift, Share2, Zap } from "lucide-react";

const STEPS = [
  {
    num: "1",
    icon: QrCode,
    title: "Customer scans your QR code",
    desc: "They tap your NFC stand or scan the QR code at your counter",
    color: "#3B82F6",
  },
  {
    num: "2",
    icon: Gift,
    title: "They pick their reward",
    desc: "Story for a discount, Reel for a freebie — you set the tiers",
    color: "#8B5CF6",
  },
  {
    num: "3",
    icon: Share2,
    title: "They post and submit",
    desc: "They create content, post it, and drop the link — takes 60 seconds",
    color: "#EC4899",
  },
  {
    num: "4",
    icon: Zap,
    title: "System handles the rest",
    desc: "Auto-verifies the post and texts them their coupon code. You don't lift a finger.",
    color: "#10B981",
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

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block rounded-full bg-[#2563EB]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2563EB]"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Four steps. Zero effort on your part.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-500"
          >
            Your customers do all the work. You just pick your rewards and watch the content roll in.
          </motion.p>
        </div>

        {/* Steps grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connecting line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-[2px] w-6 translate-x-full bg-gray-200 lg:block" />
                )}

                <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-shadow hover:shadow-lg">
                  {/* Number + Icon */}
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.num}
                    </span>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${step.color}12` }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: step.color }}
                      />
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
