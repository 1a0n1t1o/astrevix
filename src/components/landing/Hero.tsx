import { Camera, Gift, Star, TrendingUp, Zap } from "lucide-react";
import HeroScrollButton from "./HeroScrollButton";

const CALENDLY_URL =
  "https://calendly.com/contact-astrevix/new-meeting";

const floatingBadges = [
  {
    icon: <Camera className="h-3.5 w-3.5" />,
    label: "New post submitted!",
    accentColor: "#2563EB",
    className: "left-[2%] top-[8%] lg:left-[6%]",
    animClass: "animate-fade-left animate-fade-up-d6",
    floatDelay: "0s",
  },
  {
    icon: <Gift className="h-3.5 w-3.5" />,
    label: "Reward claimed \u00b7 2m ago",
    accentColor: "#7C3AED",
    className: "left-[-2%] top-[42%] lg:left-[2%]",
    animClass: "animate-fade-left animate-fade-up-d7",
    floatDelay: "0.5s",
  },
  {
    icon: <Star className="h-3.5 w-3.5" />,
    label: "58 pending submissions",
    accentColor: "#D97706",
    className: "left-[4%] bottom-[18%] lg:left-[8%]",
    animClass: "animate-fade-left animate-fade-up-d8",
    floatDelay: "1s",
  },
  {
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    label: "+23 posts this month",
    accentColor: "#059669",
    className: "right-[2%] top-[12%] lg:right-[6%]",
    animClass: "animate-fade-right animate-fade-up-d9",
    floatDelay: "0.3s",
  },
  {
    icon: <Zap className="h-3.5 w-3.5" />,
    label: "Setup in under 2 min",
    accentColor: "#EA580C",
    className: "right-[-2%] top-[48%] lg:right-[2%]",
    animClass: "animate-fade-right animate-fade-up-d10",
    floatDelay: "0.8s",
  },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-24 pt-36 md:pb-40 md:pt-44"
      style={{
        background:
          "linear-gradient(180deg, #EDE9FE 0%, #E0E7FF 25%, #EEE8FC 50%, #F5F3FF 75%, #FFFFFF 100%)",
      }}
    >
      {/* Background orbs — pure CSS animations, no JS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-20 top-10 h-[500px] w-[500px] rounded-full animate-orb-1"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute -right-20 top-32 h-[450px] w-[450px] rounded-full animate-orb-2"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute left-1/2 top-[55%] h-[400px] w-[400px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(219,39,119,0.3) 0%, rgba(219,39,119,0.08) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Text */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="animate-fade-up text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Turn Your Customers Into{" "}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
              Your Best Marketers
            </span>
          </h1>

          <p className="animate-fade-up-d2 mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
            Stop paying for ads. Start getting customers to sell for you.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up-d3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-2xl hover:shadow-purple-500/30 animate-pulse-glow"
            >
              Get Started Free
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
            </a>
            <HeroScrollButton />
          </div>
        </div>

        {/* Phone mockup area */}
        <div className="relative mx-auto mt-16 max-w-3xl md:mt-24">
          {/* Glowing arc behind phone */}
          <div
            className="pointer-events-none absolute bottom-[-20%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 md:h-[600px] md:w-[1000px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.5) 0%, rgba(124,58,237,0.35) 20%, rgba(59,130,246,0.2) 40%, transparent 65%)",
              filter: "blur(40px)",
              borderRadius: "50%",
            }}
          />

          {/* Phone frame */}
          <div className="animate-scale-in relative mx-auto w-[300px] md:w-[380px] animate-phone-float">
            {/* Drop shadow */}
            <div
              className="pointer-events-none absolute inset-x-8 -bottom-6 h-24 rounded-[50%]"
              style={{
                background: "radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            {/* Side buttons */}
            <div className="pointer-events-none absolute -right-[3px] top-[28%] z-10 w-[3px] rounded-r-sm md:-right-[3.5px] md:w-[3.5px]" style={{ height: "60px", background: "linear-gradient(to bottom, #2a2a2a, #1a1a1a, #2a2a2a)", boxShadow: "1px 0 2px rgba(0,0,0,0.3)" }} />
            <div className="pointer-events-none absolute -left-[3px] top-[22%] z-10 w-[3px] rounded-l-sm md:-left-[3.5px] md:w-[3.5px]" style={{ height: "36px", background: "linear-gradient(to bottom, #2a2a2a, #1a1a1a, #2a2a2a)", boxShadow: "-1px 0 2px rgba(0,0,0,0.3)" }} />
            <div className="pointer-events-none absolute -left-[3px] top-[32%] z-10 w-[3px] rounded-l-sm md:-left-[3.5px] md:w-[3.5px]" style={{ height: "36px", background: "linear-gradient(to bottom, #2a2a2a, #1a1a1a, #2a2a2a)", boxShadow: "-1px 0 2px rgba(0,0,0,0.3)" }} />
            <div className="pointer-events-none absolute -left-[3px] top-[15%] z-10 w-[3px] rounded-l-sm md:-left-[3.5px] md:w-[3.5px]" style={{ height: "20px", background: "linear-gradient(to bottom, #2a2a2a, #1a1a1a, #2a2a2a)", boxShadow: "-1px 0 2px rgba(0,0,0,0.3)" }} />

            {/* Outer phone body */}
            <div
              className="relative overflow-hidden rounded-[44px] bg-gradient-to-b from-[#2a2a2a] to-[#111111] p-[6px] md:rounded-[48px] md:p-[7px]"
              style={{
                boxShadow:
                  "0 40px 80px -12px rgba(0, 0, 0, 0.4), 0 20px 40px -8px rgba(0, 0, 0, 0.2), 0 0 0 0.5px rgba(255,255,255,0.1) inset, 0 -2px 8px rgba(0,0,0,0.3) inset",
              }}
            >
              <div className="pointer-events-none absolute inset-0 rounded-[44px] md:rounded-[48px]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.04) 100%)" }} />
              <div className="absolute left-1/2 top-[12px] z-20 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-black md:h-[24px] md:w-[100px]" />
              <div className="relative overflow-hidden rounded-[38px] md:rounded-[41px]" style={{ aspectRatio: "9/19.5", background: "linear-gradient(180deg, #EDE9FE 0%, #F3F0FF 15%, #FEFCFA 40%, #FEFCFA 100%)" }}>
                <div className="pointer-events-none absolute inset-0 z-10" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.08) 100%)" }} />
                <div className="relative z-0 p-5 pt-14 md:p-6 md:pt-16">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-500 md:text-[11px]">
                      Powered by <span className="font-semibold">Astrevix</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg md:h-14 md:w-14 md:text-xl">S</div>
                  </div>
                  <p className="mt-3 text-center text-base font-bold text-gray-900 md:text-lg">Sunrise Cafe</p>
                  <p className="mt-0.5 text-center text-[10px] text-gray-500 md:text-[11px]">The best coffee in town</p>
                  <div className="mt-4 rounded-2xl bg-white/80 p-4 text-center shadow-sm" style={{ border: "1px solid rgba(255,255,255,0.4)" }}>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-blue-600 md:text-[10px]">Your Reward</p>
                    <p className="mt-1.5 text-sm font-bold text-gray-900 md:text-base">Free coffee on us</p>
                    <p className="mt-1 text-[10px] text-gray-500 md:text-[11px]">Create an Instagram Reel</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {["Create content", "Post publicly", "Submit link", "Get rewarded"].map((step, i) => (
                      <div key={step} className="flex items-center gap-2.5 rounded-lg bg-white p-2 shadow-sm md:p-2.5">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gray-100 text-[9px] font-bold text-gray-700 md:h-6 md:w-6 md:text-[10px]">{i + 1}</div>
                        <span className="text-[10px] font-medium text-gray-800 md:text-[11px]">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 text-center text-xs font-semibold text-white md:py-3 md:text-sm">
                    Submit Your Post &rarr;
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating notification badges — CSS animated */}
          {floatingBadges.map((badge) => (
            <div
              key={badge.label}
              className={`absolute hidden md:block ${badge.className} ${badge.animClass}`}
            >
              <div
                className="animate-badge-float flex items-center gap-2.5 px-4 py-3"
                style={{
                  animationDelay: badge.floatDelay,
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.6)",
                  boxShadow: "0 8px 32px -4px rgba(0,0,0,0.1), 0 2px 8px -2px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${badge.accentColor}26`, color: badge.accentColor }}
                >
                  {badge.icon}
                </div>
                <span className="whitespace-nowrap text-[13px] font-semibold text-[#1a1a1a]">
                  {badge.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
