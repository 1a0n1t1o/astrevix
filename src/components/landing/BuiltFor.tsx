"use client";

import { motion } from "framer-motion";
import { Car, Coffee, Heart, Palette, Scissors, Sparkles } from "lucide-react";

const BUSINESS_TYPES = [
  { icon: Scissors, label: "Barbershops" },
  { icon: Sparkles, label: "Nail Salons" },
  { icon: Car, label: "Auto Detailers" },
  { icon: Heart, label: "Med Spas" },
  { icon: Coffee, label: "Cafes & Restaurants" },
  { icon: Palette, label: "Tattoo Studios" },
];

export default function BuiltFor() {
  return (
    <section className="relative bg-gradient-to-b from-white via-[#FAFAFC] to-white py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED]"
        >
          Built for local businesses like yours
        </motion.p>

        <div className="mt-12 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {BUSINESS_TYPES.map((type, i) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: "easeOut",
                }}
                className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_8px_24px_-8px_rgba(124,58,237,0.18)]"
              >
                <Icon
                  className="h-6 w-6 text-gray-700 transition-colors duration-300 group-hover:text-[#7C3AED]"
                  strokeWidth={1.75}
                />
                <p className="mt-3 text-center text-sm font-semibold text-gray-900">
                  {type.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
