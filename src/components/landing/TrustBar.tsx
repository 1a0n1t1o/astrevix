"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Scissors, Coffee, Dumbbell, ShoppingBag } from "lucide-react";

const BUSINESS_TYPES = [
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Scissors, label: "Salons" },
  { icon: Coffee, label: "Coffee Shops" },
  { icon: Dumbbell, label: "Gyms" },
  { icon: ShoppingBag, label: "Boutiques" },
];

export default function TrustBar() {
  return (
    <section
      className="relative py-12"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F8F7FF 50%, #FFFFFF 100%)",
        borderTop: "1px solid rgba(139,92,246,0.1)",
        borderBottom: "1px solid rgba(139,92,246,0.1)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium text-gray-500"
        >
          Helping local businesses grow through authentic content
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {BUSINESS_TYPES.map((biz, i) => {
            const Icon = biz.icon;
            return (
              <motion.div
                key={biz.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="flex items-center gap-2.5 text-gray-400"
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-sm font-medium">{biz.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
