"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Hero from "./hero/Hero";
import HowItWorks from "./hero/HowItWorks";
import WhyItWorks from "./hero/WhyItWorks";
import WhoItsFor from "./hero/WhoItsFor";
import Reviews from "./hero/Reviews";
import Guarantee from "./hero/Guarantee";

interface HeroScreenProps {
  onStart: () => void;
}

export default function HeroScreen({ onStart }: HeroScreenProps) {
  return (
    <div className="flex flex-col pb-32">
      <Hero onStart={onStart} />
      <div className="mt-24 sm:mt-[120px]">
        <HowItWorks />
      </div>
      <div className="mt-24 sm:mt-[120px]">
        <Reviews />
      </div>
      <div className="mt-24 sm:mt-[120px]">
        <WhyItWorks />
      </div>
      <div className="mt-24 sm:mt-[120px]">
        <WhoItsFor />
      </div>
      <div className="mt-24 sm:mt-[120px]">
        <Guarantee onStart={onStart} />
      </div>
    </div>
  );
}

// Rendered by MetaFunnel at the <main> level (NOT inside the keyed screen
// wrapper) so `fixed` stays relative to the viewport. Shown on the hero only,
// and only while the hero's primary CTA (#meta-hero-cta) is fully scrolled
// out of view — the page never shows two CTAs at once. Hidden by default so
// there is no flash before the observer's first report.
export function StickyStartBar({ onStart }: { onStart: () => void }) {
  const reduce = useReducedMotion() ?? false;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("meta-hero-cta");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) =>
      setShow(!entry.isIntersecting),
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={reduce ? false : { y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-5 py-3 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-[520px]">
        <button
          type="button"
          onClick={onStart}
          className="flex h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] text-base font-bold text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(37,99,235,0.65)] active:scale-[0.98]"
        >
          Start in 30 seconds
          <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
}
