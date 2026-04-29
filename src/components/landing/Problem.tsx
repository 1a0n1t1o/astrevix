"use client";

import { motion } from "framer-motion";
import { ArrowDown, Check } from "lucide-react";

const FADED_AVATARS = ["A", "M", "J"] as const;

const TAGGED_AVATARS = [
  { initial: "A", classes: "bg-gradient-to-br from-blue-500 to-blue-600" },
  { initial: "M", classes: "bg-gradient-to-br from-[#7C3AED] to-[#A855F7]" },
  { initial: "J", classes: "bg-gradient-to-br from-pink-500 to-rose-500" },
] as const;

export default function Problem() {
  return (
    <section className="bg-[#FAFAFA] py-[100px] md:py-[120px]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Left column — 60% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
              The truth about local marketing
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Your customers love you. They just don&apos;t post about you.
            </h2>
            <div className="mt-6 max-w-2xl space-y-5 text-base leading-relaxed text-gray-600 md:text-lg">
              <p>
                They tip well. They come back. They tell their friends. But
                they never tag you on Instagram.
              </p>
              <p>
                And the few who do? They post stories that disappear in 24
                hours. They forget to tag your handle. The post fades into the
                void.
              </p>
              <p>
                Meanwhile, the shop down the street is getting tagged 50+ times
                a month. They didn&apos;t get lucky. They built a system.
              </p>
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-900 md:text-xl">
              That system is Astrevix.
            </p>
          </motion.div>

          {/* Right column — 40% */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="flex items-center justify-center lg:col-span-2"
          >
            <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              {/* Faded — without Astrevix */}
              <div className="text-center">
                <div className="flex items-start justify-center gap-3 sm:gap-5">
                  {FADED_AVATARS.map((initial) => (
                    <div
                      key={initial}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="rounded-full bg-gray-200 p-[2px]">
                        <div className="rounded-full bg-white p-[2px]">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-xs font-semibold text-gray-400">
                            {initial}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">
                        No tag
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Today&apos;s customers
                </p>
              </div>

              {/* Arrow connector */}
              <div className="my-6 flex justify-center">
                <ArrowDown
                  className="h-5 w-5 text-gray-300"
                  strokeWidth={2}
                />
              </div>

              {/* Vibrant — with Astrevix */}
              <div className="text-center">
                <div className="flex items-start justify-center gap-3 sm:gap-5">
                  {TAGGED_AVATARS.map((avatar) => (
                    <div
                      key={avatar.initial}
                      className="flex flex-col items-center"
                    >
                      <div className="relative">
                        <div className="rounded-full bg-gradient-to-tr from-[#2563EB] via-[#7C3AED] to-[#A855F7] p-[2px]">
                          <div className="rounded-full bg-white p-[2px]">
                            <div
                              className={`flex h-14 w-14 items-center justify-center rounded-full text-xs font-semibold text-white ${avatar.classes}`}
                            >
                              {avatar.initial}
                            </div>
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 ring-2 ring-white">
                          <Check
                            className="h-3 w-3 text-white"
                            strokeWidth={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7C3AED]">
                  With Astrevix
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
