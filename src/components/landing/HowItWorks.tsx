"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Palette, QrCode, Gift } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Palette,
    title: "Set Up Your Page",
    description:
      "Customize your landing page with your branding, rewards, and content requirements in minutes.",
    color: "#2563EB",
    bgColor: "rgba(37, 99, 235, 0.1)",
  },
  {
    num: "02",
    icon: QrCode,
    title: "Share Your QR Code",
    description:
      "Print it on receipts, place it on tables, or add it to your storefront. Customers scan and go.",
    color: "#7C3AED",
    bgColor: "rgba(124, 58, 237, 0.1)",
  },
  {
    num: "03",
    icon: Gift,
    title: "Collect & Reward",
    description:
      "Review submissions, approve the ones you love, and rewards are delivered automatically.",
    color: "#059669",
    bgColor: "rgba(5, 150, 105, 0.1)",
  },
];

function StepNumber({
  num,
  color,
  gradient,
  delay,
}: Readonly<{ num: string; color: string; gradient: string; delay: number }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${
        visible ? "animate-step-bounce" : "opacity-0"
      }`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${gradient})`,
      }}
    >
      {num}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #EEF2FF 25%, #E0E7FF 50%, #EEF2FF 75%, #FFFFFF 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-10 h-[350px] w-[350px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-10 right-1/4 h-[300px] w-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-indigo-300/50 bg-white/60 px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur-sm"
          >
            3 Simple Steps
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            How{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              Astrevix
            </span>{" "}
            Works
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2, ease: "easeOut" }}
                className="relative text-center"
              >
                {/* Number badge with bounce-in */}
                <StepNumber
                  num={step.num}
                  color={step.color}
                  gradient={
                    i === 0
                      ? "#3B82F6"
                      : i === 1
                      ? "#A855F7"
                      : "#10B981"
                  }
                  delay={i * 0.2}
                />

                {/* Icon */}
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: step.bgColor }}
                >
                  <Icon
                    className="h-7 w-7"
                    style={{ color: step.color }}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
