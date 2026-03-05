"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Palette,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

/* ───── stat badges at bottom ───── */
const STATS = [
  { numValue: 98, suffix: "%", label: "Reward delivery rate", delay: 0.6 },
  { numValue: 2, suffix: " min", label: "Average setup time", delay: 0.9 },
  { numValue: 500, suffix: "+", label: "Submissions processed", delay: 1.2 },
];

/* ───── animated number counter ───── */
function AnimatedCounter({
  value,
  suffix,
  duration = 2000,
}: Readonly<{ value: number; suffix: string; duration?: number }>) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [value, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ───── animated SVG area chart ───── */
function AnimatedChart() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Chart data points (x out of 200, y out of 80)
  const points = [
    [0, 58],
    [25, 48],
    [50, 52],
    [75, 35],
    [100, 40],
    [125, 25],
    [150, 30],
    [175, 15],
    [200, 20],
  ];

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const areaPath = `${linePath} L200,80 L0,80 Z`;

  return (
    <div ref={ref} className="relative h-full w-full">
      <svg
        viewBox="0 0 200 80"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[20, 40, 60].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="200"
            y2={y}
            stroke="rgba(0,0,0,0.04)"
            strokeDasharray="3 3"
          />
        ))}
        {/* Filled area */}
        <path
          d={areaPath}
          fill="url(#chartGrad)"
          className="transition-opacity duration-1000"
          style={{ opacity: visible ? 1 : 0 }}
        />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 400,
            strokeDashoffset: visible ? 0 : 400,
            transition: "stroke-dashoffset 1.8s ease-out",
          }}
        />
        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="2"
            fill="#2563EB"
            stroke="white"
            strokeWidth="1"
            className="transition-opacity duration-500"
            style={{
              opacity: visible ? 1 : 0,
              transitionDelay: `${0.8 + i * 0.1}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ───── dashboard stat card (inside mockup) ───── */
const DASH_STATS = [
  {
    numValue: 247,
    label: "Total Submissions",
    icon: BarChart3,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    numValue: 12,
    label: "Pending Review",
    icon: Clock,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    numValue: 198,
    label: "Approved",
    icon: CheckCircle2,
    color: "#059669",
    bg: "#ECFDF5",
  },
];

/* ───── recent submissions for mockup ───── */
const RECENT = [
  { name: "Sarah M.", platform: "Instagram", status: "approved", time: "2m ago" },
  { name: "Alex T.", platform: "TikTok", status: "pending", time: "15m ago" },
  { name: "Jordan K.", platform: "Instagram", status: "approved", time: "1h ago" },
  { name: "Maria L.", platform: "TikTok", status: "approved", time: "2h ago" },
];

/* ───── sidebar nav items ───── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ClipboardList, label: "Submissions", active: false },
  { icon: MessageSquare, label: "SMS", active: false },
  { icon: Palette, label: "Customize", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function PhoneShowcase() {
  return (
    <section
      className="relative py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 30%, #F3E8FF 50%, #FAF5FF 70%, #FFFFFF 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.1) 0%, rgba(59,130,246,0.06) 40%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Two sides.{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              One platform.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600"
          >
            A beautiful submission page for your customers. A powerful dashboard
            for you.
          </motion.p>
        </div>

        {/* Customer phone + Desktop dashboard */}
        <div className="relative mt-16 flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
          {/* Customer phone */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative shrink-0"
          >
            <div
              className="w-[240px] overflow-hidden rounded-[36px] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-[8px] md:w-[260px]"
              style={{
                boxShadow:
                  "0 20px 50px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08) inset",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[36px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%)",
                }}
              />
              <div className="absolute left-1/2 top-[12px] z-20 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-black" />
              <div className="overflow-hidden rounded-[28px] bg-[#FEFCFA]">
                <div className="p-4 pt-10">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[8px] text-gray-400">
                      Powered by Astrevix
                    </div>
                  </div>
                  <div className="mt-3 flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-sm font-bold text-white">
                      B
                    </div>
                  </div>
                  <p className="mt-2 text-center text-sm font-bold text-gray-900">
                    Bella&apos;s Kitchen
                  </p>
                  <div className="mt-3 rounded-xl bg-white/80 p-3 text-center shadow-sm">
                    <p className="text-[8px] font-semibold uppercase tracking-widest text-orange-500">
                      Your Reward
                    </p>
                    <p className="mt-1 text-xs font-bold text-gray-900">
                      Free appetizer
                    </p>
                  </div>
                  <div className="mt-3 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 py-2 text-center text-[10px] font-semibold text-white">
                    Submit Your Post &rarr;
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm font-medium text-gray-500">
              Customer View
            </p>
          </motion.div>

          {/* Desktop dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative w-full max-w-[680px]"
          >
            {/* Laptop body */}
            <div
              className="overflow-hidden rounded-xl border border-gray-200/60 bg-white"
              style={{
                boxShadow:
                  "0 25px 60px -12px rgba(0,0,0,0.15), 0 12px 30px -8px rgba(0,0,0,0.08)",
              }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </div>
                {/* URL bar */}
                <div className="ml-3 flex flex-1 items-center gap-2 rounded-lg bg-white/80 px-3 py-1 text-[10px] text-gray-400 ring-1 ring-gray-200/60">
                  <svg className="h-2.5 w-2.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>astrevix.com/dashboard</span>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="flex" style={{ minHeight: "380px" }}>
                {/* Sidebar */}
                <div className="hidden w-[140px] shrink-0 border-r border-gray-100 bg-gray-50/40 p-3 sm:block">
                  {/* Logo */}
                  <div className="mb-4 flex items-center gap-2 px-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-[8px] font-bold text-white">A</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-800">Astrevix</span>
                  </div>

                  {/* Nav items */}
                  <div className="space-y-0.5">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[9px] font-medium ${
                            item.active
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          <Icon className="h-3 w-3" strokeWidth={2} />
                          <span>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* User info at bottom */}
                  <div className="mt-auto pt-4">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-2 py-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-[7px] font-bold text-white">
                        B
                      </div>
                      <div>
                        <p className="text-[8px] font-semibold text-gray-800">Bella&apos;s Kitchen</p>
                        <p className="text-[7px] text-gray-400">Owner</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 sm:p-5">
                  {/* Welcome */}
                  <p className="text-xs font-bold text-gray-900 sm:text-sm">
                    Welcome, Bella&apos;s Kitchen
                  </p>
                  <p className="text-[9px] text-gray-400 sm:text-[10px]">
                    Here&apos;s what&apos;s happening with your submissions
                  </p>

                  {/* Stat cards */}
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                    {DASH_STATS.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className="rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm sm:p-3"
                        >
                          <div className="flex items-center gap-1.5">
                            <div
                              className="flex h-5 w-5 items-center justify-center rounded-md sm:h-6 sm:w-6"
                              style={{ backgroundColor: stat.bg }}
                            >
                              <Icon
                                className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                                style={{ color: stat.color }}
                                strokeWidth={2}
                              />
                            </div>
                            <span className="text-[8px] text-gray-400 sm:text-[9px]">
                              {stat.label}
                            </span>
                          </div>
                          <p
                            className="mt-1.5 text-base font-bold sm:text-lg"
                            style={{ color: stat.color }}
                          >
                            <AnimatedCounter
                              value={stat.numValue}
                              suffix=""
                              duration={1800}
                            />
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart + Recent side by side */}
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
                    {/* Activity chart */}
                    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:col-span-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-3 w-3 text-blue-500" strokeWidth={2} />
                          <span className="text-[9px] font-semibold text-gray-700 sm:text-[10px]">
                            Activity
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[7px] font-semibold text-blue-600 sm:text-[8px]">
                            7d
                          </span>
                          <span className="rounded-md px-1.5 py-0.5 text-[7px] text-gray-400 sm:text-[8px]">
                            30d
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-gray-900 sm:text-base">
                          <AnimatedCounter value={47} suffix="" duration={1600} />
                        </span>
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-600">
                          +23%
                        </span>
                      </div>
                      <div className="mt-2 h-[90px] sm:h-[100px]">
                        <AnimatedChart />
                      </div>
                    </div>

                    {/* Recent submissions */}
                    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:col-span-2">
                      <p className="text-[9px] font-semibold text-gray-700 sm:text-[10px]">
                        Recent Submissions
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {RECENT.map((sub) => (
                          <div
                            key={sub.name}
                            className="flex items-center justify-between rounded-lg bg-gray-50/80 px-2 py-1.5"
                          >
                            <div className="flex items-center gap-1.5">
                              <div
                                className={`h-4 w-4 rounded-md flex items-center justify-center text-[6px] font-bold text-white ${
                                  sub.platform === "Instagram"
                                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                    : "bg-gray-900"
                                }`}
                              >
                                {sub.platform === "Instagram" ? "IG" : "TT"}
                              </div>
                              <div>
                                <p className="text-[8px] font-semibold text-gray-800 sm:text-[9px]">
                                  {sub.name}
                                </p>
                                <p className="text-[7px] text-gray-400">{sub.time}</p>
                              </div>
                            </div>
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[7px] font-medium ${
                                sub.status === "approved"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {sub.status === "approved" ? "Approved" : "Pending"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop base / chin */}
            <div
              className="mx-auto h-3 w-[60%] rounded-b-xl"
              style={{
                background:
                  "linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%)",
                boxShadow: "0 2px 8px -2px rgba(0,0,0,0.1)",
              }}
            />
            <div
              className="mx-auto h-1 w-[80%] rounded-b-lg"
              style={{
                background: "linear-gradient(180deg, #D1D5DB 0%, #C0C4CA 100%)",
              }}
            />

            <p className="mt-4 text-center text-sm font-medium text-gray-500">
              Owner Dashboard
            </p>
          </motion.div>
        </div>

        {/* Stat badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: stat.delay }}
              className="flex items-center gap-3 rounded-2xl border border-purple-100/60 bg-white/70 px-5 py-3 backdrop-blur-sm"
              style={{
                boxShadow: "0 4px 24px -4px rgba(124, 58, 237, 0.08)",
              }}
            >
              <span className="text-xl font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                <AnimatedCounter value={stat.numValue} suffix={stat.suffix} />
              </span>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
