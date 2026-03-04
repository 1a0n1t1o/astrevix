"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-8 py-16 text-center shadow-2xl shadow-blue-500/20 md:px-16 md:py-20"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

        <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
          Ready to turn your customers
          <br className="hidden sm:block" /> into content creators?
        </h2>
        <p className="relative mt-4 text-lg text-blue-100">
          Get started free. No credit card required.
        </p>

        <div className="relative mt-10">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Start Free Today
            <svg
              className="h-4 w-4"
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
        </div>
      </motion.div>
    </section>
  );
}
