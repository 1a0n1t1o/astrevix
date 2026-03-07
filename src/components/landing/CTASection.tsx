"use client";

import { motion } from "framer-motion";

const CALENDLY_URL = "https://calendly.com/contact-astrevix/new-meeting";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-20 md:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl"
        >
          Ready to turn every customer into free marketing?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-lg text-slate-400"
        >
          Book a free setup call. We&apos;ll build your page for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#3B82F6] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
          >
            Book Your Free Demo
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
    </section>
  );
}
