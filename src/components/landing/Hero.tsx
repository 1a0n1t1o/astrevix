"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const floatingCards = [
  {
    text: "New submission received!",
    emoji: "🎬",
    className: "left-[2%] top-[18%] lg:left-[8%]",
    delay: 0.8,
    duration: 3.5,
  },
  {
    text: "+15 posts this week",
    emoji: "📈",
    className: "right-[2%] top-[12%] lg:right-[8%]",
    delay: 1.1,
    duration: 4,
  },
  {
    text: "Reward sent!",
    emoji: "🎁",
    className: "left-[4%] bottom-[22%] lg:left-[12%]",
    delay: 1.4,
    duration: 3.8,
  },
  {
    text: "5-star review posted",
    emoji: "⭐",
    className: "right-[4%] bottom-[28%] lg:right-[10%]",
    delay: 1.7,
    duration: 4.2,
  },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-20 pt-32 md:pb-32 md:pt-40"
    >
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(37,99,235,0.15) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -left-40 top-60 h-[400px] w-[400px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Text */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              For restaurants, salons, gyms & more
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          >
            Turn Your Customers Into{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              Your Best Marketers
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl"
          >
            Collect authentic social media content from your customers with QR
            codes. Reward them automatically. Grow your business with real social
            proof.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:shadow-2xl hover:shadow-blue-500/30"
            >
              Get Started Free
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
            </Link>
            <button
              onClick={() =>
                document
                  .querySelector("#how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/60 px-8 py-4 text-base font-semibold text-gray-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg"
            >
              See How It Works
            </button>
          </motion.div>
        </div>

        {/* Phone mockup area */}
        <div className="relative mx-auto mt-16 max-w-lg md:mt-20">
          {/* Glow behind phone */}
          <div
            className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[500px] md:w-[500px]"
            style={{
              background:
                "radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(37,99,235,0.1) 40%, transparent 70%)",
            }}
          />

          {/* Phone frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative mx-auto w-[280px] md:w-[320px]"
          >
            <div
              className="overflow-hidden rounded-[40px] border border-gray-200 bg-[#FEFCFA] shadow-2xl"
              style={{ aspectRatio: "9/19.5" }}
            >
              {/* Phone content mockup */}
              <div className="p-5 pt-12">
                {/* Powered by badge */}
                <div className="flex justify-center">
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-500">
                    Powered by <span className="font-semibold">Astrevix</span>
                  </div>
                </div>
                {/* Business icon */}
                <div className="mt-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                    S
                  </div>
                </div>
                {/* Name */}
                <p className="mt-3 text-center text-base font-bold text-gray-900">
                  Sunrise Cafe
                </p>
                <p className="mt-0.5 text-center text-[10px] text-gray-500">
                  The best coffee in town
                </p>
                {/* Reward card */}
                <div className="mt-4 rounded-2xl bg-white/80 p-4 text-center shadow-sm" style={{ border: "1px solid rgba(255,255,255,0.4)" }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-blue-600">
                    Your Reward
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-gray-900">
                    Free coffee on us
                  </p>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Create an Instagram Reel
                  </p>
                </div>
                {/* Steps mini */}
                <div className="mt-4 space-y-2">
                  {["Create content", "Post publicly", "Submit link", "Get rewarded"].map(
                    (step, i) => (
                      <div
                        key={step}
                        className="flex items-center gap-2.5 rounded-lg bg-white p-2 shadow-sm"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gray-100 text-[9px] font-bold text-gray-700">
                          {i + 1}
                        </div>
                        <span className="text-[10px] font-medium text-gray-800">
                          {step}
                        </span>
                      </div>
                    )
                  )}
                </div>
                {/* CTA */}
                <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 text-center text-xs font-semibold text-white">
                  Submit Your Post &rarr;
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating notification cards */}
          {floatingCards.map((card) => (
            <motion.div
              key={card.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: card.delay, ease: "easeOut" }}
              className={`absolute hidden md:flex ${card.className}`}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: card.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex items-center gap-2.5 rounded-2xl border border-white/40 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-xl"
              >
                <span className="text-lg">{card.emoji}</span>
                <span className="whitespace-nowrap text-sm font-medium text-gray-800">
                  {card.text}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
