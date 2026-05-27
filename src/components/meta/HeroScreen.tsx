"use client";

import Image from "next/image";
import {
  QrCode,
  Camera,
  BadgePercent,
  Scissors,
  SprayCan,
  Car,
  Hand,
  Eye,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface HeroScreenProps {
  onStart: () => void;
}

const STEPS = [
  { icon: QrCode, text: "Customer taps the stand or scans the QR" },
  { icon: Camera, text: "They post about your business" },
  { icon: BadgePercent, text: "They get the discount you set, automatically" },
];

const CATEGORIES = [
  { icon: SprayCan, label: "Salon" },
  { icon: Scissors, label: "Barbershop" },
  { icon: Car, label: "Auto Detailing" },
  { icon: Hand, label: "Nail Studio" },
  { icon: Eye, label: "Lash Studio" },
  { icon: Sparkles, label: "Med Spa" },
];

export default function HeroScreen({ onStart }: HeroScreenProps) {
  return (
    <div className="flex flex-col pb-28 pt-5">
      {/* Logo — white "A" on dark. Swap /logo-icon.png to update. */}
      <div className="mb-8">
        <Image
          src="/logo-icon.png"
          alt="Astrevix"
          width={40}
          height={40}
          priority
          className="h-9 w-9"
        />
      </div>

      <h1 className="text-[28px] font-semibold leading-[1.12] tracking-tight text-[#F8FAFC] sm:text-[34px]">
        Turn Your Customers Into Your Marketing Team.
      </h1>

      <p className="mt-4 text-[18px] leading-relaxed text-white/70">
        They tap a sign at your counter, post about your business, and get a
        small reward — automatically.
      </p>

      {/* Sign + phone, side by side, with a dashed arrow between them. */}
      <div className="mt-8 flex items-center gap-2">
        <SignPlaceholder />
        <TapArrow />
        <PhoneStoryMock />
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-white/45">
        Trusted by local service businesses across Orange County &amp; LA
        County.
      </p>

      <PrimaryCTA onClick={onStart} className="mt-7" />

      {/* ===== Below the fold (scrollable, not required to proceed) ===== */}
      <div className="mt-16">
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/15 text-[#60A5FA]">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white/40">
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-snug text-white/85">
                    {step.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-4"
                >
                  <Icon className="h-6 w-6 text-[#60A5FA]" strokeWidth={1.75} />
                  <span className="text-center text-[11px] font-medium leading-tight text-white/60">
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-[13px] font-medium text-white/45">
            Built for SoCal service businesses.
          </p>
        </div>

        <PrimaryCTA onClick={onStart} className="mt-10" />
      </div>
    </div>
  );
}

function PrimaryCTA({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onClick}
        className="flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] text-lg font-semibold text-white shadow-xl shadow-[#2563EB]/30 transition-transform duration-100 hover:shadow-[#2563EB]/40 active:scale-[0.98]"
      >
        See If We&apos;re A Match
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </button>
      <p className="mt-2.5 text-center text-sm text-white/50">
        Takes 30 seconds.
      </p>
    </div>
  );
}

// Rendered by MetaFunnel at the <main> level (NOT inside the keyed screen
// wrapper) so `fixed` stays relative to the viewport. Shown on the hero only.
export function StickyStartBar({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#0A0E27]/95 px-5 py-3 backdrop-blur-md">
      <div className="mx-auto w-full max-w-[520px]">
        <button
          type="button"
          onClick={onStart}
          className="flex h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] text-base font-semibold text-white shadow-lg shadow-[#2563EB]/30 transition-transform duration-100 active:scale-[0.98]"
        >
          Start — 30 seconds
          <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// 5×7 portrait placeholder. Swap the whole component for a single <Image /> when
// the counter-sign photo is ready, e.g.:
//   <Image src="/meta-counter-sign.jpg" alt="Counter sign" width={500} height={700}
//     className="aspect-[5/7] w-[42%] rounded-2xl object-cover" />
function SignPlaceholder() {
  return (
    <div className="relative flex aspect-[5/7] w-[42%] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/25 bg-white/[0.03] p-3 text-center">
      <span className="text-[11px] font-medium leading-snug text-white/50">
        Counter sign photo — coming soon
      </span>
      <span className="absolute bottom-2 rounded-full bg-[#2563EB] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
        TAP
      </span>
    </div>
  );
}

function TapArrow() {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      className="h-6 w-8 flex-shrink-0 text-[#60A5FA]"
      aria-hidden="true"
    >
      <path
        d="M2 12 H30"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      <path
        d="M28 5 L36 12 L28 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneStoryMock() {
  return (
    <div className="aspect-[9/18] w-[42%] flex-shrink-0 overflow-hidden rounded-[1.4rem] border-[3px] border-white/15 bg-black p-2 shadow-xl">
      {/* Story top row: ring avatar + tag pill */}
      <div className="flex items-center gap-1.5">
        <div className="rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px]">
          <div className="h-6 w-6 rounded-full border-2 border-black bg-white/90" />
        </div>
        <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[8px] font-semibold text-white">
          @yoursalon
        </span>
      </div>
      {/* Story content placeholder */}
      <div className="mt-2 h-[60%] rounded-lg bg-gradient-to-br from-[#2563EB]/40 via-white/10 to-[#ee2a7b]/30" />
      <div className="mt-2 flex items-center gap-1">
        <div className="h-2 flex-1 rounded-full bg-white/15" />
        <Camera className="h-3 w-3 text-white/40" />
      </div>
    </div>
  );
}
