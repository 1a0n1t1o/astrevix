"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BatteryFull, Camera, Gift, MapPin, Star, TrendingUp, Wifi, Zap } from "lucide-react";

type FloatingBadge = {
  icon: React.ReactNode;
  label: string;
  accentColor: string;
  className: string;
  fromX: number;
  delay: number;
  floatDelay: number;
};

const floatingBadges: FloatingBadge[] = [
  {
    icon: <Camera className="h-3.5 w-3.5" />,
    label: "New post submitted!",
    accentColor: "#2563EB",
    className: "left-[2%] top-[8%] lg:left-[6%]",
    fromX: -30,
    delay: 0.6,
    floatDelay: 0,
  },
  {
    icon: <Gift className="h-3.5 w-3.5" />,
    label: "Reward claimed · 2m ago",
    accentColor: "#7C3AED",
    className: "left-[-2%] top-[42%] lg:left-[2%]",
    fromX: -30,
    delay: 0.7,
    floatDelay: 0.5,
  },
  {
    icon: <Star className="h-3.5 w-3.5" />,
    label: "58 pending submissions",
    accentColor: "#D97706",
    className: "left-[4%] bottom-[18%] lg:left-[8%]",
    fromX: -30,
    delay: 0.8,
    floatDelay: 1.0,
  },
  {
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    label: "+23 posts this month",
    accentColor: "#059669",
    className: "right-[2%] top-[12%] lg:right-[6%]",
    fromX: 30,
    delay: 0.9,
    floatDelay: 0.3,
  },
  {
    icon: <Zap className="h-3.5 w-3.5" />,
    label: "Setup in under 2 min",
    accentColor: "#EA580C",
    className: "right-[-2%] top-[48%] lg:right-[2%]",
    fromX: 30,
    delay: 1.0,
    floatDelay: 0.8,
  },
];

type SubmitState = "idle" | "submitting" | "success";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  // Tilt amount changes on small screens so the layout doesn't break.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const baseRotateY = isMobile ? -5 : -12;
  const baseRotateX = isMobile ? 2 : 4;
  const baseRotateZ = isMobile ? 0 : -1;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitState !== "idle") return;
    setSubmitState("submitting");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitState("success");
      } else {
        setSubmitState("idle");
      }
    } catch {
      setSubmitState("idle");
    }
  }

  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-24 pt-36 md:pb-40 md:pt-44"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FAFAFD 30%, #F4F1FE 65%, #EAE5FB 100%)",
      }}
    >
      {/* Single ambient radial glow behind the phone — Linear-style */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-[55%] h-[700px] w-[900px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, rgba(99,102,241,0.10) 30%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Text */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-6 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <MapPin className="h-[14px] w-[14px] text-blue-600" />
              Built in Southern California
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
          >
            Get Customers{" "}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
              Posting
            </span>{" "}
            About Your Business — Without Asking Them To
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl"
          >
            100+ real customer posts every month. They scan, post on Instagram, and get rewarded automatically. No app downloads. No follow-ups. No begging.
          </motion.p>

          {/* CTA — email capture form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mx-auto mt-10 w-full max-w-[480px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {submitState === "success" ? (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center text-base font-semibold text-purple-600 md:text-lg"
                >
                  ✓ You&apos;re in. Check your email for next steps.
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2"
                >
                  <label htmlFor="hero-email" className="sr-only">
                    Business email
                  </label>
                  <input
                    id="hero-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitState === "submitting"}
                    placeholder="Enter your business email"
                    className="flex-grow rounded-full border border-gray-200 bg-white px-6 py-4 text-base text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {submitState === "submitting"
                      ? "Submitting..."
                      : (
                        <>
                          Get Early Access
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </>
                      )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
            <p className="mt-4 text-center text-sm text-gray-500">
              Join 100+ Orange County businesses already using Astrevix
            </p>
          </motion.div>
        </div>

        {/* Phone mockup area */}
        <div className="relative mx-auto mt-16 max-w-3xl md:mt-24">
          {/* Soft ambient glow behind phone */}
          <div
            className="pointer-events-none absolute bottom-[-20%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 md:h-[600px] md:w-[1000px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.28) 0%, rgba(124,58,237,0.18) 25%, rgba(59,130,246,0.10) 50%, transparent 70%)",
              filter: "blur(40px)",
              borderRadius: "50%",
            }}
          />

          {/* 3D perspective wrapper */}
          <div
            className="relative mx-auto w-[300px] md:w-[380px]"
            style={{ perspective: isMobile ? "1200px" : "1500px" }}
          >
            {/* Phone — entrance + gentle float + subtle Z-axis oscillation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotateZ: baseRotateZ }}
              animate={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1, rotateZ: baseRotateZ }
                  : {
                      opacity: 1,
                      scale: 1,
                      y: [0, -8, 0],
                      rotateZ: isMobile
                        ? [0, 0, 0]
                        : [-1, -0.5, -1],
                    }
              }
              style={{
                rotateY: baseRotateY,
                rotateX: baseRotateX,
                transformStyle: "preserve-3d",
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.4, ease: "easeOut" },
                scale: { duration: 0.8, delay: 0.4, ease: "easeOut" },
                y: shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 5,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.6, 1],
                      delay: 1.2,
                    },
                rotateZ: shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 5,
                      repeat: Infinity,
                      ease: [0.4, 0, 0.6, 1],
                      delay: 1.2,
                    },
              }}
              className="relative"
            >
              {/* Side buttons — power (right), silent + 2 volume (left) */}
              <div
                className="pointer-events-none absolute -right-[2px] top-[28%] z-30 w-[3px] rounded-r-[2px] md:-right-[2.5px] md:w-[4px]"
                style={{
                  height: "62px",
                  background:
                    "linear-gradient(to right, #18181b 0%, #09090b 60%, #000000 100%)",
                  boxShadow:
                    "1px 0 1px rgba(0,0,0,0.4), inset 0 1px 1px rgba(0,0,0,0.5)",
                }}
              />
              <div
                className="pointer-events-none absolute -left-[2px] top-[14%] z-30 w-[3px] rounded-l-[2px] md:-left-[2.5px] md:w-[4px]"
                style={{
                  height: "20px",
                  background:
                    "linear-gradient(to left, #18181b 0%, #09090b 60%, #000000 100%)",
                  boxShadow:
                    "-1px 0 1px rgba(0,0,0,0.4), inset 0 1px 1px rgba(0,0,0,0.5)",
                }}
              />
              <div
                className="pointer-events-none absolute -left-[2px] top-[22%] z-30 w-[3px] rounded-l-[2px] md:-left-[2.5px] md:w-[4px]"
                style={{
                  height: "38px",
                  background:
                    "linear-gradient(to left, #18181b 0%, #09090b 60%, #000000 100%)",
                  boxShadow:
                    "-1px 0 1px rgba(0,0,0,0.4), inset 0 1px 1px rgba(0,0,0,0.5)",
                }}
              />
              <div
                className="pointer-events-none absolute -left-[2px] top-[32%] z-30 w-[3px] rounded-l-[2px] md:-left-[2.5px] md:w-[4px]"
                style={{
                  height: "38px",
                  background:
                    "linear-gradient(to left, #18181b 0%, #09090b 60%, #000000 100%)",
                  boxShadow:
                    "-1px 0 1px rgba(0,0,0,0.4), inset 0 1px 1px rgba(0,0,0,0.5)",
                }}
              />

              {/* Outer titanium body — multi-stop gradient + edge highlights + 3-layer shadow */}
              <div
                className="relative rounded-[2.75rem] p-[12px] md:rounded-[3rem] md:p-[14px]"
                style={{
                  background:
                    "linear-gradient(180deg, #3f3f46 0%, #27272a 35%, #18181b 65%, #000000 100%)",
                  boxShadow: [
                    "0 25px 50px -12px rgba(0,0,0,0.40)",
                    "0 60px 120px -20px rgba(0,0,0,0.25)",
                    "-15px 50px 90px -20px rgba(99,102,241,0.30)",
                    "0 0 0 0.5px rgba(255,255,255,0.18) inset",
                    "0 1px 0 rgba(255,255,255,0.20) inset",
                  ].join(", "),
                }}
              >
                {/* Left edge titanium highlight */}
                <div
                  className="pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-l-[2.75rem] md:rounded-l-[3rem]"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)",
                  }}
                />
                {/* Right edge subtle highlight */}
                <div
                  className="pointer-events-none absolute right-0 top-0 h-full w-[2px] rounded-r-[2.75rem] md:rounded-r-[3rem]"
                  style={{
                    background:
                      "linear-gradient(to left, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 55%, transparent 100%)",
                  }}
                />

                {/* Inner black bezel ring (the screen border) */}
                <div className="relative overflow-hidden rounded-[2.25rem] bg-black p-[4px] md:rounded-[2.5rem]">
                  {/* Screen */}
                  <div
                    className="relative overflow-hidden rounded-[1.85rem] md:rounded-[2.15rem]"
                    style={{
                      aspectRatio: "9/19.5",
                      background:
                        "linear-gradient(180deg, #EDE9FE 0%, #F3F0FF 15%, #FEFCFA 40%, #FEFCFA 100%)",
                    }}
                  >
                    {/* iOS Status Bar with Dynamic Island */}
                    <div className="relative z-20 h-[40px] md:h-[44px]">
                      <div className="flex h-full items-center justify-between px-6 md:px-7">
                        <span
                          className="text-[13px] font-semibold leading-none tracking-tight text-black md:text-[14px]"
                          style={{
                            fontFamily:
                              "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                          }}
                        >
                          9:41
                        </span>
                        <div className="flex items-center gap-[5px] leading-none">
                          {/* Signal bars */}
                          <div className="flex items-end gap-[2px]">
                            <div className="h-[3px] w-[3px] rounded-[1px] bg-black" />
                            <div className="h-[5px] w-[3px] rounded-[1px] bg-black" />
                            <div className="h-[7px] w-[3px] rounded-[1px] bg-black" />
                            <div className="h-[9px] w-[3px] rounded-[1px] bg-black" />
                          </div>
                          <Wifi
                            size={14}
                            strokeWidth={2.5}
                            className="text-black"
                          />
                          <BatteryFull
                            size={18}
                            strokeWidth={1.8}
                            className="text-black"
                          />
                        </div>
                      </div>

                      {/* Dynamic Island — pill, centered over status bar */}
                      <div
                        className="absolute left-1/2 top-1/2 z-30 h-[26px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[30px] md:w-[120px]"
                        style={{
                          background: "#000000",
                          boxShadow:
                            "0 0 0 0.5px rgba(255,255,255,0.04), inset 0 1px 1px rgba(0,0,0,0.4)",
                        }}
                      >
                        {/* Top inner highlight */}
                        <div
                          className="pointer-events-none absolute inset-x-3 top-0 h-[2px] rounded-full"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(63,63,70,0.7), transparent)",
                          }}
                        />
                        {/* Camera lens dot */}
                        <div
                          className="absolute right-[8px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full md:h-[6px] md:w-[6px]"
                          style={{
                            background:
                              "radial-gradient(circle at 30% 30%, #1e1b4b 0%, #000000 70%)",
                          }}
                        />
                      </div>
                    </div>

                    {/* App content — preserved exactly */}
                    <div className="relative z-0 px-5 pb-5 pt-2 md:px-6 md:pb-6 md:pt-3">
                      {/* Powered by badge */}
                      <div className="flex justify-center">
                        <div className="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-500 md:text-[11px]">
                          Powered by{" "}
                          <span className="font-semibold">Astrevix</span>
                        </div>
                      </div>
                      {/* Business icon */}
                      <div className="mt-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg md:h-14 md:w-14 md:text-xl">
                          P
                        </div>
                      </div>
                      {/* Name */}
                      <p className="mt-3 text-center text-base font-bold text-gray-900 md:text-lg">
                        Prestige Auto Detailing
                      </p>
                      <p className="mt-0.5 text-center text-[10px] text-gray-500 md:text-[11px]">
                        OC&apos;s #1 mobile detail
                      </p>
                      {/* Reward card */}
                      <div
                        className="mt-4 rounded-2xl bg-white/80 p-4 text-center shadow-sm"
                        style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                      >
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-blue-600 md:text-[10px]">
                          Your Reward
                        </p>
                        <p className="mt-1.5 text-sm font-bold text-gray-900 md:text-base">
                          $25 OFF your next detail
                        </p>
                        <p className="mt-1 text-[10px] text-gray-500 md:text-[11px]">
                          Post your car on Instagram
                        </p>
                      </div>
                      {/* Steps mini */}
                      <div className="mt-4 space-y-2">
                        {[
                          "Create content",
                          "Post publicly",
                          "Submit link",
                          "Get rewarded",
                        ].map((step, i) => (
                          <div
                            key={step}
                            className="flex items-center gap-2.5 rounded-lg bg-white p-2 shadow-sm md:p-2.5"
                          >
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gray-100 text-[9px] font-bold text-gray-700 md:h-6 md:w-6 md:text-[10px]">
                              {i + 1}
                            </div>
                            <span className="text-[10px] font-medium text-gray-800 md:text-[11px]">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* CTA */}
                      <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 text-center text-xs font-semibold text-white md:py-3 md:text-sm">
                        Submit Your Post &rarr;
                      </div>
                    </div>

                    {/* Glass reflection — above content, below status bar/island */}
                    <div
                      className="pointer-events-none absolute inset-0 z-10"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating notification badges — sit outside the perspective wrapper so they aren't tilted */}
          {floatingBadges.map((badge) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, x: badge.fromX }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: badge.delay,
                ease: "easeOut",
              }}
              className={`absolute hidden md:block ${badge.className}`}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: badge.floatDelay,
                }}
                className="flex items-center gap-2.5 px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.6)",
                  boxShadow:
                    "0 8px 32px -4px rgba(0,0,0,0.1), 0 2px 8px -2px rgba(0,0,0,0.06)",
                }}
              >
                {/* Icon in colored square */}
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${badge.accentColor}26`,
                    color: badge.accentColor,
                  }}
                >
                  {badge.icon}
                </div>
                <span className="whitespace-nowrap text-[13px] font-semibold text-[#1a1a1a]">
                  {badge.label}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
