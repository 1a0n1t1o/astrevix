"use client";

import { useRef, useEffect, useState } from "react";
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
  { value: "98%", label: "Reward delivery rate", delay: 0.6 },
  { value: "2 min", label: "Average setup time", delay: 0.9 },
  { value: "500+", label: "Submissions processed", delay: 1.2 },
];

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

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`)
    .join(" ");
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
        <path
          d={areaPath}
          fill="url(#chartGrad)"
          className="transition-opacity duration-1000"
          style={{ opacity: visible ? 1 : 0 }}
        />
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

/* ───── dashboard stat cards ───── */
const DASH_STATS = [
  {
    value: "247",
    label: "Total Submissions",
    icon: BarChart3,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    value: "12",
    label: "Pending Review",
    icon: Clock,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    value: "198",
    label: "Approved",
    icon: CheckCircle2,
    color: "#059669",
    bg: "#ECFDF5",
  },
];

/* ───── recent submissions ───── */
const RECENT = [
  {
    name: "Sarah M.",
    platform: "Instagram",
    status: "approved",
    time: "2m ago",
  },
  {
    name: "Alex T.",
    platform: "TikTok",
    status: "pending",
    time: "15m ago",
  },
  {
    name: "Jordan K.",
    platform: "Instagram",
    status: "approved",
    time: "1h ago",
  },
  {
    name: "Maria L.",
    platform: "TikTok",
    status: "approved",
    time: "2h ago",
  },
];

/* ───── sidebar nav items ───── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ClipboardList, label: "Submissions", active: false },
  { icon: MessageSquare, label: "SMS", active: false },
  { icon: Palette, label: "Customize", active: false },
  { icon: Settings, label: "Settings", active: false },
];

/* ───── customer page steps ───── */
const PHONE_STEPS = [
  { num: "1", label: "Create your content" },
  { num: "2", label: "Post it publicly" },
  { num: "3", label: "Submit your link" },
  { num: "4", label: "Get rewarded" },
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
          {/* ─── Customer phone ─── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative shrink-0"
          >
            <div
              className="w-[260px] overflow-hidden rounded-[40px] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-[7px] md:w-[280px]"
              style={{
                boxShadow:
                  "0 25px 60px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08) inset",
              }}
            >
              {/* Frame shine */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[40px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%)",
                }}
              />
              {/* Dynamic Island */}
              <div className="absolute left-1/2 top-[10px] z-20 h-[20px] w-[80px] -translate-x-1/2 rounded-full bg-black" />

              {/* Screen */}
              <div className="overflow-hidden rounded-[33px] bg-[#FEFCFA]">
                <div className="p-4 pt-12">
                  {/* Powered by badge */}
                  <div className="flex justify-center">
                    <div
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.04)",
                        fontSize: "8px",
                        color: "#8B8B9B",
                      }}
                    >
                      Powered by{" "}
                      <span
                        className="font-semibold"
                        style={{ color: "#6B6B7B" }}
                      >
                        Astrevix
                      </span>
                    </div>
                  </div>

                  {/* Business logo */}
                  <div className="mt-3 flex justify-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-sm font-bold text-white shadow-md">
                      B
                    </div>
                  </div>

                  {/* Business name + tagline */}
                  <p className="mt-2 text-center text-sm font-bold text-gray-900">
                    Bella&apos;s Kitchen
                  </p>
                  <p className="mt-0.5 text-center text-[9px] text-gray-500">
                    The best food in town
                  </p>

                  {/* Reward card — glassmorphic with brand glow */}
                  <div className="relative mt-4">
                    <div
                      className="absolute inset-0 rounded-[16px] opacity-20 blur-lg"
                      style={{ backgroundColor: "#EA580C" }}
                    />
                    <div
                      className="relative overflow-hidden rounded-[16px] px-4 py-5 text-center"
                      style={{
                        background: "rgba(255,255,255,0.6)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        boxShadow:
                          "0 6px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.5)",
                      }}
                    >
                      <p
                        className="text-[8px] font-semibold uppercase tracking-widest"
                        style={{ color: "#EA580C" }}
                      >
                        Your Reward
                      </p>
                      <p className="mt-1.5 text-base font-bold text-gray-900">
                        Free appetizer
                      </p>
                      <p className="mt-1 text-[9px] text-gray-500">
                        Create an Instagram Reel or TikTok
                      </p>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-gray-900">
                      How it works
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {PHONE_STEPS.map((step) => (
                        <div
                          key={step.num}
                          className="flex items-center gap-2.5 rounded-xl bg-white p-2 shadow-sm"
                        >
                          <div
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-bold text-gray-700"
                            style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                          >
                            {step.num}
                          </div>
                          <span className="text-[9px] font-medium text-gray-800">
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA button */}
                  <div
                    className="mt-4 rounded-xl py-2.5 text-center text-[10px] font-semibold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #EA580C, #DC2626)",
                      boxShadow: "0 4px 12px rgba(234,88,12,0.3)",
                    }}
                  >
                    Submit Your Post &rarr;
                  </div>

                  {/* Footer note */}
                  <p className="mt-2 text-center text-[7px] text-gray-400">
                    Rewards issued after review. Usually within 24 hours.
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm font-medium text-gray-500">
              Customer View
            </p>
          </motion.div>

          {/* ─── Desktop dashboard mockup ─── */}
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
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="ml-3 flex flex-1 items-center gap-2 rounded-lg bg-white/80 px-3 py-1 text-[10px] text-gray-400 ring-1 ring-gray-200/60">
                  <svg
                    className="h-2.5 w-2.5 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>astrevix.com/dashboard</span>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="flex" style={{ minHeight: "380px" }}>
                {/* Sidebar */}
                <div className="hidden w-[140px] shrink-0 border-r border-gray-100 bg-gray-50/40 p-3 sm:block">
                  <div className="mb-4 flex items-center gap-2 px-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-[8px] font-bold text-white">
                        A
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-800">
                      Astrevix
                    </span>
                  </div>
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
                  <div className="mt-auto pt-4">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-2 py-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-[7px] font-bold text-white">
                        B
                      </div>
                      <div>
                        <p className="text-[8px] font-semibold text-gray-800">
                          Bella&apos;s Kitchen
                        </p>
                        <p className="text-[7px] text-gray-400">Owner</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 sm:p-5">
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
                            {stat.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart + Recent side by side */}
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-5">
                    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:col-span-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp
                            className="h-3 w-3 text-blue-500"
                            strokeWidth={2}
                          />
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
                          47
                        </span>
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-600">
                          +23%
                        </span>
                      </div>
                      <div className="mt-2 h-[90px] sm:h-[100px]">
                        <AnimatedChart />
                      </div>
                    </div>

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
                                className={`flex h-4 w-4 items-center justify-center rounded-md text-[6px] font-bold text-white ${
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
                                <p className="text-[7px] text-gray-400">
                                  {sub.time}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[7px] font-medium ${
                                sub.status === "approved"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {sub.status === "approved"
                                ? "Approved"
                                : "Pending"}
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
                background:
                  "linear-gradient(180deg, #D1D5DB 0%, #C0C4CA 100%)",
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
                {stat.value}
              </span>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
