"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const STATS = [
  { value: "30%+", label: "Customer participation rate" },
  { value: "Under 2 min", label: "To set up your first page" },
  { value: "100%", label: "Automated reward delivery" },
];

export default function Testimonial() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 md:py-[120px]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]"
          >
            Real results
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
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
            Used by service businesses across Orange County. From auto
            detailers to nail salons — same system, same results.
          </motion.p>
        </div>

        {/* Featured testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mx-auto mt-16 max-w-[800px] rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-purple-500/10 md:p-12"
        >
          {/* Stars */}
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-[#FBBF24] text-[#FBBF24]"
                strokeWidth={0}
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="mt-6 text-xl italic leading-relaxed text-gray-800 md:text-2xl">
            &ldquo;We were paying $400/month boosting Instagram posts and
            getting nothing. First month with Astrevix, we got 38 customer
            posts and 6 new bookings from people who saw their friends tag us.
            It just works.&rdquo;
          </blockquote>

          {/* Attribution — business only, no personal name */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-lg font-bold text-white">
              SE
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                Stellar Edge Detailing
              </p>
              <p className="text-sm text-gray-500">
                Auto Detailing • Orange County, CA
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3-stat row */}
        <div className="mx-auto mt-20 grid max-w-[800px] grid-cols-1 gap-8 sm:grid-cols-3">
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
              <p className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
