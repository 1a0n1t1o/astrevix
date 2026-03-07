"use client";

import { motion } from "framer-motion";

const CALENDLY_URL = "https://calendly.com/contact-astrevix/new-meeting";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/8 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-[#2563EB]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Left — copy */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[56px]"
            >
              Your Customers Already Love Your Work.{" "}
              <span className="text-[#3B82F6]">
                Now They&apos;ll Post About It.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl"
            >
              Customers tap, post, and tag your business on Instagram and
              TikTok&nbsp;&mdash; and get rewarded automatically. You get free
              content, more reach, and more bookings. Zero&nbsp;effort.
            </motion.p>

            {/* Social proof line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              <div className="flex -space-x-1">
                {[
                  { bg: "#3B82F6", letter: "A" },
                  { bg: "#EC4899", letter: "N" },
                  { bg: "#F59E0B", letter: "B" },
                ].map((dot, i) => (
                  <div
                    key={i}
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0F172A] text-[10px] font-bold text-white"
                    style={{ backgroundColor: dot.bg }}
                  >
                    {dot.letter}
                  </div>
                ))}
              </div>
              <span className="text-sm text-slate-500">
                Join detailers, nail salons, and barber shops already using
                Astrevix
              </span>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="mt-8"
            >
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#3B82F6] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                See It In Action
                <svg
                  className="h-5 w-5"
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
            </motion.div>
          </div>

          {/* Right — Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative flex-shrink-0"
          >
            {/* Blue glow behind phone */}
            <div className="absolute inset-0 -m-8 rounded-[60px] bg-[#2563EB]/15 blur-[60px]" />

            {/* Phone frame */}
            <div className="animate-phone-float relative w-[280px] sm:w-[300px]">
              <div className="relative overflow-hidden rounded-[44px] border-[6px] border-slate-700 bg-[#1E293B] shadow-2xl shadow-black/50">
                {/* Dynamic Island */}
                <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2">
                  <div className="h-[28px] w-[100px] rounded-full bg-black" />
                </div>

                {/* Screen content */}
                <div className="px-5 pb-6 pt-12">
                  {/* Powered by badge */}
                  <div className="flex justify-center">
                    <span className="rounded-full bg-slate-700/50 px-2.5 py-0.5 text-[9px] text-slate-400">
                      Powered by{" "}
                      <span className="font-medium text-slate-300">
                        Astrevix
                      </span>
                    </span>
                  </div>

                  {/* Business icon */}
                  <div className="mt-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB] text-lg font-bold text-white shadow-md shadow-blue-500/30">
                      ED
                    </div>
                  </div>

                  {/* Business name */}
                  <div className="mt-2 text-center">
                    <p className="text-sm font-bold text-white">
                      Elite Auto Detail
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Premium Detailing, Premium Results
                    </p>
                  </div>

                  {/* Choose Your Reward */}
                  <p className="mt-4 text-center text-[9px] font-semibold uppercase tracking-widest text-[#3B82F6]">
                    Choose Your Reward
                  </p>

                  {/* Tier 1 — Story */}
                  <div
                    className="mt-2 rounded-xl border border-slate-600/50 bg-slate-700/30 p-3"
                    style={{ borderLeft: "3px solid #3B82F6" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/15">
                        <svg
                          className="h-4 w-4 text-[#3B82F6]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                          Instagram Story
                        </p>
                        <p className="text-[11px] font-bold text-white">
                          20% off your next detail
                        </p>
                      </div>
                      <svg
                        className="h-3.5 w-3.5 shrink-0 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Tier 2 — Reel */}
                  <div
                    className="mt-1.5 rounded-xl border border-slate-600/50 bg-slate-700/30 p-3"
                    style={{ borderLeft: "3px solid #3B82F6" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/15">
                        <svg
                          className="h-4 w-4 text-[#3B82F6]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m15.75 10.5 4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                          Instagram Reel
                        </p>
                        <p className="text-[11px] font-bold text-white">
                          Your next detail is FREE
                        </p>
                      </div>
                      <svg
                        className="h-3.5 w-3.5 shrink-0 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="mt-4 rounded-xl bg-[#2563EB] py-2.5 text-center text-[11px] font-semibold text-white shadow-md shadow-blue-500/30">
                    Submit Your Post &rarr;
                  </div>
                </div>
              </div>

              {/* Side buttons */}
              <div className="absolute -left-[8px] top-[100px] h-8 w-[3px] rounded-l bg-slate-600" />
              <div className="absolute -left-[8px] top-[140px] h-12 w-[3px] rounded-l bg-slate-600" />
              <div className="absolute -left-[8px] top-[170px] h-12 w-[3px] rounded-l bg-slate-600" />
              <div className="absolute -right-[8px] top-[130px] h-14 w-[3px] rounded-r bg-slate-600" />
            </div>

            {/* Floating badge — left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="absolute -left-20 top-[28%] hidden rounded-xl border border-slate-700 bg-[#1E293B] px-3 py-2 shadow-lg lg:block"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]/15">
                  <svg
                    className="h-3.5 w-3.5 text-[#3B82F6]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-300">
                  +23 posts this month
                </span>
              </div>
            </motion.div>

            {/* Floating badge — right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="absolute -right-20 bottom-[28%] hidden rounded-xl border border-slate-700 bg-[#1E293B] px-3 py-2 shadow-lg lg:block"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15">
                  <svg
                    className="h-3.5 w-3.5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-300">
                  Setup in under 2 min
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
