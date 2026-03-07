"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is Astrevix?",
    a: "Astrevix is a platform that helps local businesses collect authentic social media content from their customers. Customers scan a QR code, post about your business, submit their link, and receive a reward automatically.",
  },
  {
    q: "How do customers submit content?",
    a: "One tap or scan is all it takes. Customers tap your NFC stand or scan your QR code, land on your branded page, post on TikTok or Instagram, and submit their link. Reward gets sent automatically. The whole thing takes under 2 minutes — for them and for you.",
  },
  {
    q: "What kind of rewards can I offer?",
    a: "You can offer anything your business provides — discounts, free items, coupons, or digital rewards. Rewards are delivered automatically via email after you approve the submission.",
  },
  {
    q: "How does the QR code/tap work?",
    a: "When you sign up, Astrevix creates a unique branded page for your business. Your QR code and NFC tag link directly to that page. Print the QR code or place the NFC stand anywhere in your store — customers just scan or tap to get started.",
  },
  {
    q: "Can I customize the look of my page?",
    a: "Yes! You can customize your brand colors, logo, tagline, reward description, content requirements, and more. Everything matches your brand identity.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FBF9FF 30%, #F5F3FF 50%, #FBF9FF 70%, #FFFFFF 100%)",
      }}
    >
      {/* Subtle blob */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-purple-300/50 bg-white/60 px-4 py-1.5 text-sm font-medium text-purple-700 shadow-sm backdrop-blur-sm"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Frequently asked questions
          </motion.h2>
        </div>

        {/* Accordion */}
        <div className="mt-12 space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-purple-200 bg-purple-50/40"
                    : "border-purple-100/40 bg-white/70 hover:bg-white"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-all duration-300 ease-out ${
                      isOpen ? "rotate-180 text-purple-500" : "text-gray-400"
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
