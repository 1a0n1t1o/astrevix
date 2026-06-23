"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
} from "framer-motion";

const FAQS = [
  {
    q: "What is Astrevix?",
    a: "Astrevix helps local businesses collect customer posts. Customers scan a QR code, post on Instagram or TikTok, submit the link, and get a reward.",
  },
  {
    q: "How much does it cost?",
    a: "Astrevix is a flat monthly subscription, with an optional add-on if you want us to include the tablet. We set the exact price with you on a short call, based on the size of your business, and you start with a free trial so you see real customer posts before you pay. No contracts, cancel anytime.",
  },
  {
    q: "How do customers submit content?",
    a: "Customers tap your NFC stand or scan your QR code, land on your branded page, post on TikTok or Instagram, and submit their link. We send the reward. Takes about 2 minutes.",
  },
  {
    q: "What kind of rewards can I offer?",
    a: "Anything you sell: discounts, free items, coupons, digital rewards. We email it after you approve the submission.",
  },
  {
    q: "How is this different from running ads or boosting posts?",
    a: "Ads tell people you're great. Customer posts show it. Astrevix lets your customers introduce you to their friends, the way a referral closes faster than a cold call.",
  },
  {
    q: "How does the QR code/tap work?",
    a: "We give you a branded page. Your QR code and NFC tag link to that page. Print the QR or place the NFC stand anywhere in your store. Customers scan or tap to start.",
  },
  {
    q: "Can I customize the look of my page?",
    a: "Yes. Customize colors, logo, tagline, reward description, content requirements, and photos.",
  },
  {
    q: "Will my customers actually do this?",
    a: "You're already giving them what they came for: a haircut, a manicure, a clean car. Add a clear bonus for a 30-second post (10% off, free upgrade, BOGO), and most say yes.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative py-14 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 50%, #FFFFFF 100%)",
      }}
    >
      {/* Subtle blob */}
      <div className="gpu-layer pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center">
          <span className="reveal reveal-up-sm mobile-no-blur inline-flex items-center rounded-full border border-blue-200 bg-white/60 px-4 py-1.5 text-sm font-medium text-[#2563EB] shadow-sm backdrop-blur-sm">
            FAQ
          </span>
          <h2 className="reveal reveal-up-sm reveal-d1 mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion */}
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <div className="mt-12 space-y-3">
              {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`reveal reveal-up-sm reveal-d${Math.min(i + 1, 5)}`}
              >
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    isOpen
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-gray-200/60 bg-white/70 hover:bg-white"
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
                        isOpen ? "rotate-180 text-[#2563EB]" : "text-gray-400"
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600">
                          {faq.a}
                        </p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
            </div>
          </MotionConfig>
        </LazyMotion>
      </div>
    </section>
  );
}
