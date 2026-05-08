import { Camera, Gift, Star, TrendingUp, Zap } from "lucide-react";
import HeroPhone from "@/components/hero/HeroPhone";
import { QualifyButton } from "@/components/qualify/QualifyButton";

type FloatingBadge = {
  icon: React.ReactNode;
  label: string;
  accentColor: string;
  className: string;
  fromRight?: boolean;
  /** ms */
  enterDelay: number;
  /** ms — offset within the 3s bobbing cycle */
  floatDelay: number;
};

const floatingBadges: FloatingBadge[] = [
  {
    icon: <Camera className="h-3.5 w-3.5" />,
    label: "New post submitted!",
    accentColor: "#2563EB",
    className: "left-[2%] top-[8%] lg:left-[6%]",
    enterDelay: 600,
    floatDelay: 0,
  },
  {
    icon: <Gift className="h-3.5 w-3.5" />,
    label: "Reward claimed · 2m ago",
    accentColor: "#7C3AED",
    className: "left-[-2%] top-[42%] lg:left-[2%]",
    enterDelay: 700,
    floatDelay: 500,
  },
  {
    icon: <Star className="h-3.5 w-3.5" />,
    label: "58 pending submissions",
    accentColor: "#D97706",
    className: "left-[4%] bottom-[18%] lg:left-[8%]",
    enterDelay: 800,
    floatDelay: 1000,
  },
  {
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    label: "+23 posts this month",
    accentColor: "#059669",
    className: "right-[2%] top-[12%] lg:right-[6%]",
    fromRight: true,
    enterDelay: 900,
    floatDelay: 300,
  },
  {
    icon: <Zap className="h-3.5 w-3.5" />,
    label: "Setup in under 2 min",
    accentColor: "#EA580C",
    className: "right-[-2%] top-[48%] lg:right-[2%]",
    fromRight: true,
    enterDelay: 1000,
    floatDelay: 800,
  },
];

const screenContent = (
  <div
    className="relative z-0 px-5 pb-5 md:px-6 md:pb-6"
    style={{ paddingTop: "72px" }}
  >
    <div className="flex justify-center">
      <div className="rounded-full bg-gray-100 px-3 py-1 text-[10px] text-gray-500 md:text-[11px]">
        Powered by <span className="font-semibold">Astrevix</span>
      </div>
    </div>
    <div className="mt-4 flex justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg md:h-14 md:w-14 md:text-xl">
        P
      </div>
    </div>
    <p className="mt-3 text-center text-base font-bold text-gray-900 md:text-lg">
      Prestige Auto Detailing
    </p>
    <p className="mt-0.5 text-center text-[10px] text-gray-500 md:text-[11px]">
      OC&apos;s #1 mobile detail
    </p>

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

    <div className="mt-4 space-y-2">
      {["Create content", "Post publicly", "Submit link", "Get rewarded"].map(
        (step, i) => (
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
        ),
      )}
    </div>

    <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-2.5 text-center text-xs font-semibold text-white md:py-3 md:text-sm">
      Submit Your Post &rarr;
    </div>
  </div>
);

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-14 pt-28 md:pb-40 md:pt-44"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FAFAFD 30%, #F4F1FE 65%, #EAE5FB 100%)",
      }}
    >
      {/* Single ambient radial glow behind the phone */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden gpu-layer">
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
        {/* Text — server-rendered with CSS fade-up animations */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="hero-fade-up text-[clamp(2.25rem,8vw,3rem)] font-bold leading-[1.05] tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Get Customers{" "}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
              Posting
            </span>{" "}
            About Your Business
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> — </span>
            Without Asking Them To
          </h1>

          <p className="hero-fade-up hero-fade-d1 mx-auto mt-6 max-w-2xl text-base text-gray-600 md:text-xl">
            Customers scan a QR code, post about you on Instagram, and get the reward you set.
          </p>

          <div className="hero-fade-up hero-fade-d2 mx-auto mt-10 flex w-full max-w-[480px] flex-col items-center">
            <QualifyButton className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-purple-500/25 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/30 sm:w-auto sm:shrink-0">
              I&apos;m Ready to Scale
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
            </QualifyButton>
          </div>
        </div>

        {/* Phone mockup area */}
        <div className="relative mx-auto mt-16 max-w-3xl md:mt-24">
          {/* Soft ambient glow behind phone */}
          <div
            className="gpu-layer pointer-events-none absolute bottom-[-20%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 md:h-[600px] md:w-[1000px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.28) 0%, rgba(124,58,237,0.18) 25%, rgba(59,130,246,0.10) 50%, transparent 70%)",
              filter: "blur(40px)",
              borderRadius: "50%",
            }}
          />

          {/* Photoreal iPhone 17 Pro with scroll-driven 3D rotation */}
          <div className="animate-phone-float relative mx-auto w-[300px] md:w-[380px]">
            <HeroPhone>{screenContent}</HeroPhone>
          </div>

          {/* Floating notification badges — desktop only */}
          {floatingBadges.map((badge) => (
            <div
              key={badge.label}
              className={`hero-badge absolute hidden md:block ${badge.fromRight ? "hero-badge-from-right" : ""} ${badge.className}`}
              style={{ animationDelay: `${badge.enterDelay}ms` }}
            >
              <div
                className="hero-badge-bob mobile-no-blur flex items-center gap-2.5 px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.6)",
                  boxShadow:
                    "0 8px 32px -4px rgba(0,0,0,0.1), 0 2px 8px -2px rgba(0,0,0,0.06)",
                  animationDelay: `${badge.floatDelay}ms`,
                }}
              >
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
