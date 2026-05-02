"use client";

import { motion } from "framer-motion";

const BUSINESS_TYPES = [
  "Nail Salons",
  "Barbershops",
  "Auto Detailers",
  "Tint Shops",
  "Lash Studios",
  "Med Spas",
  "Tattoo Studios",
  "Hair Salons",
  "Wrap Shops",
];

export function SocialProofMarquee() {
  // Duplicate the array so the marquee loops seamlessly
  const items = [...BUSINESS_TYPES, ...BUSINESS_TYPES];

  return (
    <div className="mt-6 flex flex-col items-center gap-2.5">
      {/* Label */}
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
        Trusted by service-based businesses
      </p>

      {/* Marquee container — fixed width with fade edges */}
      <div
        className="relative w-full max-w-md overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <motion.div
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-6 text-sm font-medium text-gray-500"
            >
              {item}
              <span className="text-gray-300">•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
