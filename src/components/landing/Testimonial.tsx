"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const STATS = [
  { value: "30%+", label: "Customer participation rate" },
  { value: "<2 min", label: "To set up your first page" },
  { value: "100%", label: "Automated reward delivery" },
];

export default function Testimonial() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED]"
          >
            Real results
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl"
          >
            Built and tested by real local businesses.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mt-4 text-lg text-gray-600"
          >
            Started by working with an auto detail shop in Fullerton. Now used
            by businesses across Southern California.
          </motion.p>
        </div>

        {/* Featured testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mx-auto mt-14 max-w-[800px] rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] md:p-12"
        >
          {/* Stars */}
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-amber-400 text-amber-400"
                strokeWidth={0}
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="mt-6 text-xl italic leading-relaxed text-gray-800 md:text-2xl">
            &ldquo;I was paying $400/month boosting Instagram posts and getting
            nothing. First month with Astrevix, we got 38 customer posts and 6
            new bookings from people who saw our customers tag us. It just
            works.&rdquo;
          </blockquote>

          {/* Attribution */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
              MT
            </div>
            <div>
              <p className="font-bold text-gray-900">Mike Tawekjian</p>
              <p className="text-sm text-gray-500">
                Owner, Stellar Edge Detailing
              </p>
              <p className="text-xs text-gray-400">Fullerton, CA</p>
            </div>
          </div>
        </motion.div>

        {/* 3-stat row */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3 md:mt-20">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: 0.4 + i * 0.1,
                ease: "easeOut",
              }}
              className="text-center"
            >
              <p className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-4xl font-bold text-transparent">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-gray-600 md:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
