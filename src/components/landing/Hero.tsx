"use client";

import { motion } from "framer-motion";

const CALENDLY_URL =
  "https://calendly.com/contact-astrevix/new-meeting";

const floatingCards = [
  {
    text: "New submission received!",
    emoji: "🎬",
    className: "left-[-8%] top-[10%] lg:left-[-2%]",
    delay: 0.8,
    duration: 3.5,
    accentColor: "#2563EB",
    bgTint: "rgba(37, 99, 235, 0.06)",
  },
  {
    text: "+15 posts this week",
    emoji: "📈",
    className: "right-[-8%] top-[5%] lg:right-[-2%]",
    delay: 1.1,
    duration: 4,
    accentColor: "#7C3AED",
    bgTint: "rgba(124, 58, 237, 0.06)",
  },
  {
    text: "Reward sent!",
    emoji: "🎁",
    className: "left-[-10%] bottom-[28%] lg:left-[-6%]",
    delay: 1.4,
    duration: 3.8,
    accentColor: "#059669",
    bgTint: "rgba(5, 150, 105, 0.06)",
  },
  {
    text: "5-star review posted",
    emoji: "⭐",
    className: "right-[-10%] bottom-[35%] lg:right-[-6%]",
    delay: 1.7,
    duration: 4.2,
    accentColor: "#D97706",
    bgTint: "rgba(217, 119, 6, 0.06)",
  },
  {
    text: "98% delivery rate",
    emoji: "✅",
    className: "left-[-4%] top-[45%] lg:left-[2%]",
    delay: 2.0,
    duration: 3.6,
    accentColor: "#059669",
    bgTint: "rgba(5, 150, 105, 0.06)",
  },
  {
    text: "2 min avg setup",
    emoji: "⚡",
    className: "right-[-4%] bottom-[55%] lg:right-[2%]",
    delay: 2.3,
    duration: 4.4,
    accentColor: "#2563EB",
    bgTint: "rgba(37, 99, 235, 0.06)",
  },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-20 pt-32 md:pb-32 md:pt-40"
      style={{
        background:
          "linear-gradient(180deg, #EDE9FE 0%, #E0E7FF 25%, #EEE8FC 50%, #F5F3FF 75%, #FFFFFF 100%)",
      }}
    >
      {/* Large blurred gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        {/* Purple blob - left */}
        <div
          className="absolute -left-20 top-10 h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        {/* Blue blob - right */}
        <div
          className="absolute -right-20 top-32 h-[450px] w-[450px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        {/* Pink/magenta blob - center-right */}
        <div
          className="absolute right-1/4 top-0 h-[350px] w-[350px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(219,39,119,0.2) 0%, rgba(219,39,119,0.05) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Soft ambient wash */}
        <div
          className="absolute left-1/2 top-[60%] h-[600px] w-[800px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Text */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          >
            Turn Your Customers Into{" "}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
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
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-2xl hover:shadow-purple-500/30"
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
            </a>
            <button
              onClick={() =>
                document
                  .querySelector("#how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-8 py-4 text-base font-semibold text-gray-700 backdrop-blur-sm transition-all hover:bg-white/80 hover:shadow-lg"
            >
              See How It Works
            </button>
          </motion.div>
        </div>

        {/* Phone mockup area */}
        <div className="relative mx-auto mt-16 max-w-2xl md:mt-20">
          {/* Glowing arc behind phone */}
          <div
            className="pointer-events-none absolute bottom-[-20%] left-1/2 h-[400px] w-[700px] -translate-x-1/2 md:h-[500px] md:w-[900px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.5) 0%, rgba(124,58,237,0.35) 20%, rgba(59,130,246,0.2) 40%, transparent 65%)",
              filter: "blur(40px)",
              borderRadius: "50%",
            }}
          />

          {/* Phone frame — realistic 3D mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative mx-auto w-[280px] md:w-[320px]"
          >
            {/* Outer phone body */}
            <div
              className="relative overflow-hidden rounded-[44px] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-[10px]"
              style={{
                boxShadow:
                  "0 25px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 -2px 8px rgba(0,0,0,0.3) inset",
              }}
            >
              {/* Subtle frame shine */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[44px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)",
                }}
              />

              {/* Dynamic Island (notch) */}
              <div className="absolute left-1/2 top-[14px] z-20 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-black" />

              {/* Inner screen */}
              <div
                className="relative overflow-hidden rounded-[34px] bg-[#FEFCFA]"
                style={{ aspectRatio: "9/19.5" }}
              >
                {/* Phone content mockup */}
                <div className="p-5 pt-14">
                  {/* Powered by badge */}
                  <div className="flex justify-center">
                    <div className="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-500">
                      Powered by{" "}
                      <span className="font-semibold">Astrevix</span>
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
                  <div
                    className="mt-4 rounded-2xl bg-white/80 p-4 text-center shadow-sm"
                    style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                  >
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
                    {[
                      "Create content",
                      "Post publicly",
                      "Submit link",
                      "Get rewarded",
                    ].map((step, i) => (
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
                    ))}
                  </div>
                  {/* CTA */}
                  <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 text-center text-xs font-semibold text-white">
                    Submit Your Post &rarr;
                  </div>
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
              transition={{
                duration: 0.5,
                delay: card.delay,
                ease: "easeOut",
              }}
              className={`absolute hidden md:flex ${card.className}`}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: card.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex items-center gap-2.5 rounded-2xl border border-white/50 px-4 py-3 shadow-xl backdrop-blur-xl"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))`,
                  borderLeft: `3px solid ${card.accentColor}`,
                  boxShadow:
                    "0 8px 32px -4px rgba(0,0,0,0.1), 0 2px 8px -2px rgba(0,0,0,0.06)",
                }}
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
