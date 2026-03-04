"use client";

import { motion } from "framer-motion";
import { QrCode, Gift, ClipboardCheck, Palette } from "lucide-react";

const FEATURES = [
  {
    icon: QrCode,
    title: "QR Code & NFC Scanning",
    description:
      "Customers scan your QR code, submit their content, and earn rewards. No app downloads needed.",
    color: "#2563EB",
    bgColor: "rgba(37, 99, 235, 0.08)",
    borderColor: "rgba(37, 99, 235, 0.15)",
  },
  {
    icon: Gift,
    title: "Custom Rewards",
    description:
      "Set up your own coupons, discounts, or freebies. Deliver them automatically via email.",
    color: "#7C3AED",
    bgColor: "rgba(124, 58, 237, 0.08)",
    borderColor: "rgba(124, 58, 237, 0.15)",
  },
  {
    icon: ClipboardCheck,
    title: "Submission Review",
    description:
      "Approve or reject content before rewards go out. Stay in full control of quality.",
    color: "#059669",
    bgColor: "rgba(5, 150, 105, 0.08)",
    borderColor: "rgba(5, 150, 105, 0.15)",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    description:
      "Your colors, your logo, your customer experience. Every page matches your brand.",
    color: "#D97706",
    bgColor: "rgba(217, 119, 6, 0.08)",
    borderColor: "rgba(217, 119, 6, 0.15)",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 translate-x-1/3 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-purple-200/60 bg-purple-50/80 px-4 py-1.5 text-sm font-medium text-purple-700"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Everything you need to grow with{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              social proof
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600"
          >
            One platform to collect, review, and reward authentic customer
            content.
          </motion.p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border bg-white/60 p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{ borderColor: feature.borderColor }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: feature.color }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
