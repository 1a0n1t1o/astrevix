"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What if my customers don't want to post?",
    a: "That's why we built the tier system. A quick Story takes 10 seconds and they get a discount for it. Most customers are happy to do it when there's a reward waiting.",
  },
  {
    q: "What if they delete the post after getting the reward?",
    a: "Our system has a verification window. The post has to stay up for 24 hours before the reward is sent. If it gets deleted early, you'll know.",
  },
  {
    q: "How long does setup take?",
    a: "Under 2 minutes. You tell us your business name, pick your rewards, and your page is live. We can even set it up for you on a quick call.",
  },
  {
    q: "Do I need to be tech-savvy?",
    a: "Not at all. You approve posts from your phone with one tap. That's it.",
  },
  {
    q: "What does it cost?",
    a: "Free to start. Paid plans start at $97/month for unlimited submissions and a branded NFC stand.",
  },
  {
    q: "What kind of businesses is this for?",
    a: "Any business where customers have a great experience worth sharing — detailers, salons, barber shops, restaurants, tattoo studios, car washes, and more.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block rounded-full bg-[#2563EB]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2563EB]"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl"
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
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  isOpen
                    ? "border-[#2563EB]/30 bg-white shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="pr-4 text-base font-semibold text-gray-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-gray-500">
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
