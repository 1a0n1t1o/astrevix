"use client";

import { motion } from "framer-motion";
import { Car, Eye, Heart, Palette, Scissors, Sparkles } from "lucide-react";

const BUSINESS_TYPES = [
  { icon: Scissors, label: "Barbershops" },
  { icon: Sparkles, label: "Nail Salons" },
  { icon: Car, label: "Auto Detailers" },
  { icon: Heart, label: "Med Spas" },
  { icon: Eye, label: "Lash Studios" },
  { icon: Palette, label: "Tattoo Studios" },
];

export function HeroBusinessGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      className="mx-auto mt-8 w-full max-w-3xl"
    >
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
        Built for service-based businesses
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {BUSINESS_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.label}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-gray-300 hover:shadow-sm"
            >
              <Icon
                className="h-5 w-5 text-gray-600"
                strokeWidth={1.75}
              />
              <span className="text-center text-xs font-medium text-gray-700">
                {type.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
