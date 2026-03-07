"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const CALENDLY_URL =
  "https://calendly.com/contact-astrevix/new-meeting";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Astrevix",
    features: [
      "Custom branded page",
      "QR code generation",
      "Up to 50 submissions/mo",
      "Email rewards",
      "Basic analytics",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For businesses ready to scale",
    features: [
      "Everything in Free",
      "Unlimited submissions",
      "Custom email templates",
      "Priority support",
      "Advanced analytics",
      "Custom domain support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 30%, #F5F3FF 60%, #FFFFFF 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 top-20 h-[350px] w-[350px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -right-32 bottom-20 h-[300px] w-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-purple-300/50 bg-white/60 px-4 py-1.5 text-sm font-medium text-purple-700 shadow-sm backdrop-blur-sm"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Simple pricing for{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              every business
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600"
          >
            Start free. Upgrade when you&apos;re ready.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 transition-all hover:-translate-y-1 hover:shadow-xl ${
                plan.popular
                  ? "border-purple-200 bg-white shadow-lg shadow-purple-500/10"
                  : "border-white/60 bg-white/70 backdrop-blur-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-700"
                  >
                    <Check
                      className={`h-4 w-4 shrink-0 ${
                        plan.popular ? "text-purple-600" : "text-gray-400"
                      }`}
                      strokeWidth={2}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30"
                    : "border border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/50"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
