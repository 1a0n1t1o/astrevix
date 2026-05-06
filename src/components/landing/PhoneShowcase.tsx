import {
  LayoutDashboard,
  ClipboardList,
  Mail,
  Palette,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import HeroPhone from "@/components/hero/HeroPhone";
import CustomerViewScreen from "@/components/landing/CustomerViewScreen";
import AnimatedChart from "@/components/landing/AnimatedChart";

/* ───── dashboard stat cards ───── */
const DASH_STATS = [
  {
    value: "142",
    label: "Total Submissions",
    icon: BarChart3,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    value: "8",
    label: "Pending Review",
    icon: Clock,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    value: "124",
    label: "Approved",
    icon: CheckCircle2,
    color: "#059669",
    bg: "#ECFDF5",
  },
];

const DASHBOARD_BULLETS = [
  "See every submission in real time",
  "Approve in one click",
  "Track customer participation over time",
];

const PHONE_BULLETS = [
  "No app downloads required",
  "Works on every phone",
  "Your branding throughout",
];

/* ───── recent submissions ───── */
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
  { icon: Mail, label: "Email", active: false },
  { icon: Palette, label: "Customize", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function PhoneShowcase() {
  return (
    <section
      className="relative py-20 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 30%, #F3E8FF 50%, #FAF5FF 70%, #FFFFFF 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="gpu-layer pointer-events-none absolute inset-0">
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
          <p className="reveal reveal-up-sm mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
            For you and your customers
          </p>
          <h2 className="reveal reveal-up-sm reveal-d1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            One tool. Two beautiful experiences.
          </h2>
          <p className="reveal reveal-up-sm reveal-d2 mt-4 text-lg text-gray-600">
            A polished page your customers actually want to use. A clean
            dashboard that respects your time.
          </p>
        </div>

        {/* Mockups stacked: dashboard first, then customer phone */}
        <div className="mt-16 space-y-16 lg:space-y-24">
          {/* ─── Owner dashboard block ─── */}
          <div>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
              What you see
            </p>
            <div className="mt-8 flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-12">
              <div className="reveal reveal-left reveal-d2 relative w-full max-w-[680px]">
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
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-[7px] font-bold text-white">
                            J
                          </div>
                          <div>
                            <p className="text-[8px] font-semibold text-gray-800">
                              John&apos;s Mobile
                            </p>
                            <p className="text-[7px] text-gray-400">Owner</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-4 sm:p-5">
                      <p className="text-xs font-bold text-gray-900 sm:text-sm">
                        Welcome, John&apos;s Mobile Detailing
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
              </div>
              <ul className="w-full space-y-4 lg:max-w-xs">
                {DASHBOARD_BULLETS.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
                      strokeWidth={2}
                    />
                    <span className="text-base text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ─── Customer phone block ─── */}
          <div>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
              What your customers see
            </p>
            <div className="mt-8 flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-12">
              <div className="reveal reveal-left reveal-d2 relative shrink-0">
                <div className="relative w-[260px] md:w-[280px]">
                  <HeroPhone initialRotation={15}>
                    <CustomerViewScreen />
                  </HeroPhone>
                </div>
              </div>
              <ul className="w-full space-y-4 lg:max-w-xs">
                {PHONE_BULLETS.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
                      strokeWidth={2}
                    />
                    <span className="text-base text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
