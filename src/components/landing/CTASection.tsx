"use client";

import { motion } from "framer-motion";

const CALENDLY_URL =
  "https://calendly.com/contact-astrevix/new-meeting";

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden px-0 py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #4F46E5 0%, #7C3AED 40%, #6D28D9 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl text-center"
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to turn your customers
          <br className="hidden sm:block" /> into content creators?
        </h2>
        <p className="mt-4 text-lg text-purple-100">
          Get started free. No credit card required.
        </p>

        <div className="mt-10">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-purple-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl animate-pulse-glow"
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
          </a>
        </div>
      </motion.div>
    </section>
  );
}
