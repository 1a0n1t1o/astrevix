"use client";

import { useState } from "react";
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
    q: "How is this different from running ads or boosting posts?",
    a: "Ads tell people you're great. Customer posts SHOW it. People trust friends 8x more than they trust ads (Nielsen 2024). Astrevix isn't anti-ads — it's the layer ads can't replicate. You're not interrupting strangers. You're letting your real customers introduce you to their friends. Same reason a referral closes faster than a cold call.",
  },
  {
    q: "How does the QR code/tap work?",
    a: "When you sign up, Astrevix creates a unique branded page for your business. Your QR code and NFC tag link directly to that page. Print the QR code or place the NFC stand anywhere in your store — customers just scan or tap to get started.",
  },
  {
    q: "Can I customize the look of my page?",
    a: "Yes! You can customize your brand colors, logo, tagline, reward description, content requirements, and more. Everything matches your brand identity.",
  },
  {
    q: "Will my customers actually do this?",
    a: "This is the #1 question every business owner asks. The honest answer: yes, when the reward is right. You're already giving them what they came for — a haircut, a manicure, a clean car. Adding a clear bonus (10% off next visit, free upgrade, BOGO) for a 30-second post is one of the highest-converting offers in local business. Our shops average 30%+ customer participation. Some hit 50%+ with strong rewards.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative py-20 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FBF9FF 30%, #F5F3FF 50%, #FBF9FF 70%, #FFFFFF 100%)",
      }}
    >
      {/* Subtle blob */}
      <div className="gpu-layer pointer-events-none absolute inset-0">
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
          <span className="reveal reveal-up-sm mobile-no-blur inline-flex items-center rounded-full border border-purple-300/50 bg-white/60 px-4 py-1.5 text-sm font-medium text-purple-700 shadow-sm backdrop-blur-sm">
            FAQ
          </span>
          <h2 className="reveal reveal-up-sm reveal-d1 mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="mt-12 space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`reveal reveal-up-sm reveal-d${Math.min(i + 1, 5)} overflow-hidden rounded-2xl border transition-colors ${
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
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
