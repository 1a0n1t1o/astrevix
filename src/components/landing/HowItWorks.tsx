"use client";

import { motion } from "framer-motion";
import { Palette, QrCode, Gift } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Palette,
    title: "Set Up Your Page",
    description:
      "Customize your landing page with your branding, rewards, and content requirements in minutes.",
    color: "#2563EB",
    bgColor: "rgba(37, 99, 235, 0.08)",
  },
  {
    num: "02",
    icon: QrCode,
    title: "Share Your QR Code",
    description:
      "Print it on receipts, place it on tables, or add it to your storefront. Customers scan and go.",
    color: "#7C3AED",
    bgColor: "rgba(124, 58, 237, 0.08)",
  },
  {
    num: "03",
    icon: Gift,
    title: "Collect & Reward",
    description:
      "Review submissions, approve the ones you love, and rewards are delivered automatically.",
    color: "#059669",
    bgColor: "rgba(5, 150, 105, 0.08)",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-gradient-to-b from-gray-50/80 to-white py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700"
          >
            3 Simple Steps
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            How{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              Astrevix
            </span>{" "}
            Works
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* Connecting line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-16 hidden md:block">
            <svg
              className="mx-auto w-full max-w-3xl"
              height="2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="16.7%"
                y1="1"
                x2="83.3%"
                y2="1"
                stroke="#E5E7EB"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Number badge */}
                <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-900 shadow-md ring-4 ring-gray-50">
                  {step.num}
                </div>

                {/* Icon */}
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: step.bgColor }}
                >
                  <Icon
                    className="h-7 w-7"
                    style={{ color: step.color }}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
