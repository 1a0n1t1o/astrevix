"use client";

import { motion } from "framer-motion";
import {
  Car,
  Eye,
  Flower2,
  Heart,
  Palette,
  Scissors,
  Sparkles,
  Wrench,
} from "lucide-react";

const BUSINESSES = [
  { label: "Barbershops", Icon: Scissors },
  { label: "Nail Salons", Icon: Sparkles },
  { label: "Auto Detailers", Icon: Car },
  { label: "Med Spas", Icon: Heart },
  { label: "Lash Studios", Icon: Eye },
  { label: "Tattoo Studios", Icon: Palette },
  { label: "Tint Shops", Icon: Wrench },
  { label: "Hair Salons", Icon: Flower2 },
];

export function BusinessTypesMarquee() {
  // Duplicate for seamless infinite loop
  const items = [...BUSINESSES, ...BUSINESSES];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Label */}
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
          Built for service-based businesses
        </p>

        {/* Marquee with edge fade */}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <motion.div
            className="flex gap-12 whitespace-nowrap sm:gap-16"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {items.map(({ label, Icon }, i) => (
              <div
                key={`${label}-${i}`}
                className="flex shrink-0 items-center gap-3"
              >
                <Icon className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
                <span className="text-base font-medium text-gray-600">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
