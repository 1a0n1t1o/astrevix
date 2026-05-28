"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Scissors,
  SprayCan,
  ShoppingBag,
  Dumbbell,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const CARDS: { icon: LucideIcon; title: string; line: string }[] = [
  {
    icon: SprayCan,
    title: "Salons & Spas",
    line: "Clients post their fresh look",
  },
  {
    icon: Scissors,
    title: "Barbershops",
    line: "Clients tag their cut before they walk out",
  },
  {
    icon: UtensilsCrossed,
    title: "Cafés & Restaurants",
    line: "Customers post the latte they just ordered",
  },
  {
    icon: ShoppingBag,
    title: "Retail Shops",
    line: "Shoppers share their new fit",
  },
  {
    icon: Dumbbell,
    title: "Fitness Studios",
    line: "Members post after class",
  },
  {
    icon: Store,
    title: "Any walk-in business",
    line: "If customers walk through your door, this works",
  },
];

export default function WhoItsFor() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section>
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0A0E27]"
      >
        Built for any business with walk-in customers.
      </motion.h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(15,23,42,0.06),0_16px_32px_rgba(15,23,42,0.10)] active:scale-[0.99]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-[15px] font-bold leading-snug tracking-[-0.01em] text-[#0A0E27]">
                {card.title}
              </h3>
              <p className="mt-1.5 text-[13px] font-medium leading-snug text-slate-600">
                {card.line}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
