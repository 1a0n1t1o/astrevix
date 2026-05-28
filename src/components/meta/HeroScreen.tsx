"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  QrCode,
  Camera,
  BadgePercent,
  Scissors,
  SprayCan,
  Coffee,
  ShoppingBag,
  UtensilsCrossed,
  Dumbbell,
  ArrowRight,
} from "lucide-react";

interface HeroScreenProps {
  onStart: () => void;
}

const STEPS = [
  { icon: QrCode, text: "Customer taps the stand or scans the QR" },
  { icon: Camera, text: "They post about your business" },
  { icon: BadgePercent, text: "They get the discount you set." },
];

const CATEGORIES = [
  { icon: SprayCan, label: "Salon" },
  { icon: Scissors, label: "Barbershop" },
  { icon: Coffee, label: "Café" },
  { icon: ShoppingBag, label: "Retail Shop" },
  { icon: UtensilsCrossed, label: "Restaurant" },
  { icon: Dumbbell, label: "Fitness Studio" },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroScreen({ onStart }: HeroScreenProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={containerVariants}
      initial={reduce ? false : "hidden"}
      animate="show"
      className="flex flex-col pb-28 pt-5"
    >
      {/* Logo — dark wordmark for the light theme. */}
      <motion.div variants={itemVariants} className="mb-8">
        <Image
          src="/logo-text-black.png"
          alt="Astrevix"
          width={130}
          height={26}
          priority
        />
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-[28px] font-semibold leading-[1.12] tracking-tight text-[#0A0E27] sm:text-[34px]"
      >
        Turn Your Customers Into Your Marketing Team.
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mt-4 text-[18px] leading-relaxed text-slate-600"
      >
        They tap a sign at your counter, post about your business, and get a
        small reward.
      </motion.p>

      {/* Sign + phone, side by side, with a dashed arrow between them. */}
      <motion.div
        variants={itemVariants}
        className="mt-8 flex items-center gap-2"
      >
        <SignPlaceholder />
        <TapArrow reduce={reduce} />
        <PhoneStoryMock reduce={reduce} />
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="mt-6 text-[13px] leading-relaxed text-slate-500"
      >
        Built for businesses with walk-in customers: retail shops, salons,
        cafés, studios, and more.
      </motion.p>

      <motion.div variants={itemVariants} className="mt-7">
        <PrimaryCTA onClick={onStart} />
      </motion.div>

      {/* ===== Below the fold (scrollable, not required to proceed) ===== */}
      <div className="mt-16">
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-400">
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-snug text-slate-700">
                    {step.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_6px_18px_-10px_rgba(15,23,42,0.08)]"
                >
                  <Icon
                    className="h-6 w-6 text-[#2563EB]"
                    strokeWidth={1.75}
                  />
                  <span className="text-center text-[11px] font-semibold leading-tight text-slate-600">
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-[13px] font-medium text-slate-500">
            Built for any business with walk-in customers.
          </p>
        </div>

        <div className="mt-10">
          <PrimaryCTA onClick={onStart} />
        </div>
      </div>
    </motion.div>
  );
}

function PrimaryCTA({ onClick }: { onClick: () => void }) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className="flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] text-lg font-semibold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(37,99,235,0.65)] active:scale-[0.98]"
      >
        See If We&apos;re A Match
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </button>
      <p className="mt-2.5 text-center text-sm text-slate-500">
        Takes 30 seconds.
      </p>
    </div>
  );
}

// Rendered by MetaFunnel at the <main> level (NOT inside the keyed screen
// wrapper) so `fixed` stays relative to the viewport. Shown on the hero only.
export function StickyStartBar({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-5 py-3 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-[520px]">
        <button
          type="button"
          onClick={onStart}
          className="flex h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] text-base font-semibold text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(37,99,235,0.65)] active:scale-[0.98]"
        >
          Start in 30 seconds
          <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// 5×7 portrait placeholder. Swap the whole component for a single <Image /> when
// the counter-sign photo is ready, e.g.:
//   <Image src="/meta-counter-sign.jpg" alt="Counter sign" width={500} height={700}
//     className="aspect-[5/7] w-[42%] rounded-2xl object-cover" />
function SignPlaceholder() {
  return (
    <div className="relative flex aspect-[5/7] w-[42%] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-3 text-center shadow-sm">
      <span className="text-[11px] font-medium leading-snug text-slate-500">
        Counter sign photo — coming soon
      </span>
      <span className="absolute bottom-2 rounded-full bg-[#2563EB] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-[0_4px_10px_-2px_rgba(37,99,235,0.45)]">
        TAP
      </span>
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
      className="aspect-[9/18] w-[42%] flex-shrink-0 overflow-hidden rounded-[1.4rem] border-[3px] border-slate-900 bg-black p-2 shadow-[0_18px_44px_-12px_rgba(15,23,42,0.35)]"
    >
      {/* Story top row: ring avatar + tag pill */}
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
          transition={
            reduce
              ? undefined
              : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
          }
          className="rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px]"
        >
          <div className="h-6 w-6 rounded-full border-2 border-black bg-white/90" />
        </motion.div>
        <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[8px] font-semibold text-white">
          @yoursalon
        </span>
      </div>
      {/* Story content placeholder */}
      <div className="mt-2 h-[60%] rounded-lg bg-gradient-to-br from-[#2563EB]/45 via-white/10 to-[#ee2a7b]/35" />
      <div className="mt-2 flex items-center gap-1">
        <div className="h-2 flex-1 rounded-full bg-white/15" />
        <Camera className="h-3 w-3 text-white/40" />
      </div>
    </motion.div>
  );
}
