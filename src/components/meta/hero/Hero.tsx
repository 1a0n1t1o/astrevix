"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { PrimaryCTA } from "./shared";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero({ onStart }: { onStart: () => void }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <section className="relative pt-6">
      {/* Soft radial blue halo behind the headline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#2563EB] opacity-[0.10] blur-3xl"
      />

      <motion.div
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <motion.div variants={item} className="mb-10">
          <Image
            src="/logo-text-black.png"
            alt="Astrevix"
            width={130}
            height={26}
            priority
          />
        </motion.div>

        <motion.p
          variants={item}
          className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB]"
        >
          For businesses with walk-in customers
        </motion.p>

        <motion.h1
          variants={item}
          className="text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#0A0E27]"
        >
          Your customers are already on Instagram.{" "}
          <span className="text-[#2563EB]">
            Get them posting about your business.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-[540px] text-[18px] font-medium leading-relaxed text-slate-600"
        >
          Astrevix turns every visit into a social post by rewarding customers
          for tagging you. Built for salons, retail, cafés, and any walk-in
          business.
        </motion.p>

        <motion.div variants={item} className="mt-8">
          <PrimaryCTA onClick={onStart} glow />
        </motion.div>

        {/* Visual card — sign + arrow + phone, framed in a soft white card. */}
        <motion.div
          variants={item}
          className="mt-12 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]"
        >
          <div className="flex items-center gap-2">
            <SignPlaceholder />
            <TapArrow reduce={reduce} />
            <PhoneStoryMock reduce={reduce} />
          </div>
          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Sign preview — illustration only
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SignPlaceholder() {
  // Deterministic 4×4 QR-style pattern so SSR + first-render match.
  const QR_DOTS = [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0];
  return (
    <div className="relative flex aspect-[5/7] w-[42%] flex-col items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-2.5 shadow-sm">
      <span className="absolute right-1.5 top-1.5 text-[7px] font-bold uppercase tracking-[0.1em] text-slate-300">
        preview
      </span>
      <div className="mt-2 flex items-center gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
        <div className="h-[1.5px] w-5 rounded-full bg-slate-300" />
      </div>
      <div className="grid h-11 w-11 grid-cols-4 gap-px rounded border border-slate-300 bg-white p-1">
        {QR_DOTS.map((v, i) => (
          <div
            key={i}
            className={v === 1 ? "bg-slate-700" : "bg-transparent"}
          />
        ))}
      </div>
      <div className="rounded-full bg-[#2563EB] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_3px_8px_-2px_rgba(37,99,235,0.5)]">
        Tap or scan
      </div>
    </div>
  );
}

function TapArrow({ reduce }: { reduce: boolean }) {
  return (
    <motion.svg
      initial={reduce ? false : { opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewBox="0 0 40 24"
      fill="none"
      className="h-6 w-8 flex-shrink-0 text-[#2563EB]"
      aria-hidden="true"
    >
      <path
        d="M2 12 H30"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      <path
        d="M28 5 L36 12 L28 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function PhoneStoryMock({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -3, 0] }}
      transition={
        reduce
          ? undefined
          : { repeat: Infinity, duration: 3, ease: "easeInOut" }
      }
      className="relative aspect-[9/18] w-[42%] flex-shrink-0 overflow-hidden rounded-[1.4rem] border-[3px] border-slate-900 bg-black shadow-[0_18px_44px_-12px_rgba(15,23,42,0.35)]"
    >
      {/* IG-story gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" />

      {/* Progress segments */}
      <div className="absolute left-1.5 right-1.5 top-1.5 flex gap-0.5">
        <div className="h-[1.5px] flex-1 rounded-full bg-white/80" />
        <div className="h-[1.5px] flex-1 rounded-full bg-white/30" />
        <div className="h-[1.5px] flex-1 rounded-full bg-white/30" />
      </div>

      {/* Story header — avatar with story ring + @yourshop pill */}
      <div className="absolute left-1.5 right-1.5 top-3.5 flex items-center gap-1.5">
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
          transition={
            reduce
              ? undefined
              : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
          }
          className="rounded-full bg-white p-[1.5px]"
        >
          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[#ee2a7b] to-[#6228d7]" />
        </motion.div>
        <span className="text-[8px] font-bold text-white drop-shadow-sm">
          @yourshop
        </span>
      </div>

      {/* Center overlay text */}
      <div className="absolute inset-0 flex items-center justify-center px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          fresh cut ✨
        </span>
      </div>

      {/* Swipe-up affordance at the bottom */}
      <div className="absolute bottom-2 left-1.5 right-1.5 flex flex-col items-center gap-0.5">
        <div className="h-[6px] w-[6px] rotate-45 border-l-2 border-t-2 border-white/80" />
        <span className="text-[6px] font-bold uppercase tracking-[0.2em] text-white/80">
          more
        </span>
      </div>
    </motion.div>
  );
}
