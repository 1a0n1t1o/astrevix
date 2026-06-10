"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { Hand, Nfc, BadgePercent, Camera } from "lucide-react";
import { SectionTitle } from "./shared";

type IllustrationKind = "tap" | "post" | "reward";

const CARDS: {
  num: string;
  title: string;
  body: string;
  illustration: IllustrationKind;
}[] = [
  {
    num: "01",
    title: "Customer taps the stand",
    body: "They walk up to your counter, tap their phone on the NFC stand or scan the QR code. No app download. No friction.",
    illustration: "tap",
  },
  {
    num: "02",
    title: "They post about you",
    body: "Their Instagram or TikTok opens with your business pre-tagged. They post a story or reel in seconds.",
    illustration: "post",
  },
  {
    num: "03",
    title: "They get their reward",
    body: "Once they post, the discount or perk you set drops into their phone. You set the reward. You stay in control.",
    illustration: "reward",
  },
];

export default function HowItWorks() {
  const reduce = useReducedMotion() ?? false;
  const railRef = useRef<HTMLDivElement>(null);
  // Scroll-LINKED rail draw: scaleY follows scroll progress through the
  // cards. Motion values bypass React re-renders entirely — no setState
  // on scroll.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.8", "end 0.6"],
  });

  return (
    <section>
      <SectionTitle>How it works</SectionTitle>

      {/* Left gutter holds the 01→02→03 timeline rail. */}
      <div ref={railRef} className="relative pl-6">
        {/* Faint track showing the full path... */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[3px] top-0 w-[2px] rounded-full bg-[#2563EB]/15"
        />
        {/* ...and the line that draws itself as you scroll through. When
            reduced motion is on, no scaleY is bound and it renders fully
            drawn. */}
        <motion.div
          aria-hidden="true"
          style={reduce ? undefined : { scaleY: scrollYProgress }}
          className="absolute bottom-0 left-[3px] top-0 w-[2px] origin-top rounded-full bg-[#2563EB]"
        />

        <div className="space-y-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.num}
              initial={
                reduce ? false : { opacity: 0, x: i % 2 === 0 ? -24 : 24 }
              }
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                numeral={card.num}
                title={card.title}
                body={card.body}
                illustration={card.illustration}
                variant={i === 0 ? "highlight" : "plain"}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  numeral: string;
  title: string;
  body: string;
  illustration: IllustrationKind;
  variant: "highlight" | "plain";
}

function Card({ numeral, title, body, illustration, variant }: CardProps) {
  const reduce = useReducedMotion() ?? false;

  // Card 1 uses a light-blue gradient outer with a white card on top.
  // Cards 2 + 3 are plain white cards.
  const inner = (
    <div className="flex min-h-[280px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-fit text-[44px] font-bold leading-none tracking-[-0.02em] text-[#2563EB]/15"
      >
        {numeral}
      </motion.div>
      <h3 className="mt-3 text-[22px] font-bold leading-tight tracking-[-0.01em] text-[#0A0E27]">
        {title}
      </h3>
      <p className="mt-3 max-w-[480px] text-[15px] font-medium leading-relaxed text-slate-600">
        {body}
      </p>
      <div className="mt-auto flex items-center justify-center pt-6">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <Illustration kind={illustration} />
        </motion.div>
      </div>
    </div>
  );

  if (variant === "highlight") {
    return (
      <div className="rounded-[1.65rem] bg-gradient-to-br from-blue-100/80 via-blue-50 to-white p-2 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        {inner}
      </div>
    );
  }
  return inner;
}

function Illustration({ kind }: { kind: IllustrationKind }) {
  if (kind === "tap") return <TapIllustration />;
  if (kind === "post") return <PostIllustration />;
  return <RewardIllustration />;
}

// All three illustrations are static — the page's only continuous motion is
// the hero sign's float.

function TapIllustration() {
  return (
    <div className="relative flex h-28 items-center gap-4">
      <div className="flex h-24 w-16 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white shadow-sm">
        <Nfc className="h-6 w-6 text-[#2563EB]" strokeWidth={1.75} />
        <div className="h-[3px] w-8 rounded-full bg-slate-200" />
        <div className="h-[3px] w-6 rounded-full bg-slate-200" />
      </div>
      <Hand
        className="h-11 w-11 -rotate-12 text-[#2563EB]"
        strokeWidth={1.5}
      />
    </div>
  );
}

function PostIllustration() {
  return (
    <div className="relative h-28 w-16 overflow-hidden rounded-xl border-2 border-slate-900 bg-black p-1.5 shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] opacity-90" />
      <div className="relative flex items-center gap-1">
        <div className="rounded-full bg-white p-[1.5px]">
          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[#ee2a7b] to-[#6228d7]" />
        </div>
        <span className="text-[7px] font-bold text-white">@yourshop</span>
      </div>
      <div className="absolute bottom-2 left-1.5 right-1.5">
        <Camera className="h-3 w-3 text-white/80" strokeWidth={2} />
      </div>
    </div>
  );
}

function RewardIllustration() {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#60A5FA] px-5 py-3 text-white shadow-[0_12px_28px_-10px_rgba(37,99,235,0.55)]">
      <BadgePercent className="h-8 w-8" strokeWidth={2} />
      <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
        15% off
      </span>
    </div>
  );
}
