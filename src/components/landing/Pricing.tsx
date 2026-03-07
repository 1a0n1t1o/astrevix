"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/contact-astrevix/new-meeting";

const FEATURES = [
  "Unlimited submissions",
  "Branded NFC stand included",
  "Custom branded page",
  "Tiered reward system",
  "Automated coupon delivery",
  "SMS notifications",
  "Submission verification",
  "Dashboard analytics",
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block rounded-full bg-[#2563EB]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2563EB]"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-lg text-gray-500"
          >
            Free to start. Scale when you&apos;re ready.
          </motion.p>
        </div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto mt-12 max-w-md overflow-hidden rounded-2xl border-2 border-[#2563EB]/20 bg-white shadow-xl shadow-blue-500/5"
        >
          <div className="bg-[#2563EB] px-8 py-6 text-center text-white">
            <p className="text-sm font-medium uppercase tracking-wider opacity-80">
              Growth Plan
            </p>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-extrabold">$97</span>
              <span className="text-lg opacity-70">/month</span>
            </div>
          </div>

          <div className="px-8 py-8">
            <ul className="space-y-3">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <Check className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#3B82F6] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              Book a Demo
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>

            <p className="mt-4 text-center text-xs text-gray-400">
              Free trial available &middot; No credit card required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
