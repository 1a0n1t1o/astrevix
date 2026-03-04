"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "98%", label: "Reward delivery rate", delay: 0.6 },
  { value: "2 min", label: "Average setup time", delay: 0.9 },
  { value: "500+", label: "Submissions processed", delay: 1.2 },
];

export default function PhoneShowcase() {
  return (
    <section className="relative py-24 md:py-32">
      {/* Background blob */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(124,58,237,0.2) 40%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Two sides.{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              One platform.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600"
          >
            A beautiful submission page for your customers. A powerful dashboard
            for you.
          </motion.p>
        </div>

        {/* Two phones */}
        <div className="relative mt-16 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
          {/* Customer phone */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="w-[240px] overflow-hidden rounded-[32px] border border-gray-200 bg-[#FEFCFA] shadow-2xl md:w-[260px]">
              <div className="p-4 pt-10">
                <div className="flex justify-center">
                  <div className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[8px] text-gray-400">
                    Powered by Astrevix
                  </div>
                </div>
                <div className="mt-3 flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-sm font-bold text-white">
                    B
                  </div>
                </div>
                <p className="mt-2 text-center text-sm font-bold text-gray-900">
                  Bella&apos;s Kitchen
                </p>
                <div className="mt-3 rounded-xl bg-white/80 p-3 text-center shadow-sm">
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-orange-500">
                    Your Reward
                  </p>
                  <p className="mt-1 text-xs font-bold text-gray-900">
                    Free appetizer
                  </p>
                </div>
                <div className="mt-3 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 py-2 text-center text-[10px] font-semibold text-white">
                  Submit Your Post &rarr;
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm font-medium text-gray-500">
              Customer View
            </p>
          </motion.div>

          {/* Owner phone */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative"
          >
            <div className="w-[240px] overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-2xl md:w-[260px]">
              <div className="p-4 pt-10">
                {/* Mini dashboard */}
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500" />
                  <span className="text-xs font-semibold text-gray-900">
                    Dashboard
                  </span>
                </div>
                <p className="mt-3 text-[10px] text-gray-500">This month</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <p className="text-sm font-bold text-blue-700">24</p>
                    <p className="text-[8px] text-blue-600">Submissions</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-2">
                    <p className="text-sm font-bold text-emerald-700">18</p>
                    <p className="text-[8px] text-emerald-600">Approved</p>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-2">
                    <p className="text-sm font-bold text-yellow-700">4</p>
                    <p className="text-[8px] text-yellow-600">Pending</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-2">
                    <p className="text-sm font-bold text-purple-700">18</p>
                    <p className="text-[8px] text-purple-600">Rewards sent</p>
                  </div>
                </div>
                {/* Mini submission list */}
                <p className="mt-3 text-[10px] font-semibold text-gray-700">
                  Recent
                </p>
                {["Sarah M.", "Alex T.", "Jordan K."].map((name) => (
                  <div
                    key={name}
                    className="mt-1.5 flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-1.5"
                  >
                    <span className="text-[9px] font-medium text-gray-700">{name}</span>
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[7px] font-medium text-emerald-700">
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-center text-sm font-medium text-gray-500">
              Owner Dashboard
            </p>
          </motion.div>
        </div>

        {/* Stat badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: stat.delay }}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white/70 px-5 py-3 backdrop-blur-sm"
              style={{
                boxShadow: "0 4px 24px -4px rgba(37, 99, 235, 0.06)",
              }}
            >
              <span className="text-xl font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
