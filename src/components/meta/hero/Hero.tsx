"use client";

import Image, { getImageProps } from "next/image";
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import { PrimaryCTA } from "./shared";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// The sign is the last child in the stagger order and eases in a touch
// slower than the text items.
const signItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// Shared by the sign's float loop and the ground shadow's inverse loop so
// the two can never drift out of phase.
const FLOAT_TRANSITION: Transition = {
  duration: 5,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "mirror",
};

const SIGN_ALT =
  "Astrevix counter sign — tap or scan to post and get rewarded";
const SIGN_SIZES =
  "(min-width: 1024px) 420px, (min-width: 640px) 340px, 68vw";

export default function Hero({ onStart }: { onStart: () => void }) {
  const reduce = useReducedMotion() ?? false;

  // Pre-generated static WebPs serve nearly all traffic via <picture>; the
  // PNG stays as the fallback and keeps next/image's eager loading and
  // layout-shift protection (width/height) on the <img>.
  const { props: signImgProps } = getImageProps({
    alt: SIGN_ALT,
    src: "/images/counter-sign.png",
    width: 900,
    height: 1250,
    priority: true,
    sizes: SIGN_SIZES,
  });

  return (
    <section className="relative pt-6">
      {/* Soft radial blue halo behind the headline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#2563EB] opacity-[0.10] blur-3xl"
      />

      {/* At lg the hero breaks out of the funnel's 520px column into a
          centered two-column grid: text left, sign right. The breakout uses
          left-1/2 + -translate-x-1/2; framer only orchestrates children here
          (no animated values on this element), so it never writes transform
          and the Tailwind translate survives. */}
      <motion.div
        variants={container}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="lg:relative lg:left-1/2 lg:grid lg:w-[min(92vw,960px)] lg:-translate-x-1/2 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-x-14"
      >
        <div>
          <motion.div variants={item} className="mb-10">
            <Image
              src="/logo-text-black.png"
              alt="Astrevix"
              width={130}
              height={26}
              priority
            />
          </motion.div>

          <motion.p
            variants={item}
            className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB]"
          >
            For businesses with walk-in customers
          </motion.p>

          <motion.h1
            variants={item}
            className="text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#0A0E27] lg:text-[clamp(2.5rem,4vw,3.5rem)]"
          >
            Your customers are already on Instagram.{" "}
            <span className="text-[#2563EB]">
              Get them posting about your business.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-[540px] text-[18px] font-medium leading-relaxed text-slate-600"
          >
            Astrevix turns every visit into a social post by rewarding
            customers for tagging you. Built for salons, retail, cafés, and
            any walk-in business.
          </motion.p>

          <motion.div variants={item} className="mt-8">
            <PrimaryCTA onClick={onStart} />
          </motion.div>
        </div>

        {/* Real product photo — floats gently over a grounded foot shadow. */}
        <motion.div variants={signItem} className="mt-12 lg:mt-0">
          <div className="relative mx-auto w-fit">
            {/* Float loop lives on this inner wrapper so its transform never
                fights the entrance animation on the parent. */}
            <motion.div
              className="relative z-10"
              animate={
                reduce ? undefined : { y: [0, -8], rotate: [-0.4, 0.4] }
              }
              transition={FLOAT_TRANSITION}
            >
              <picture>
                <source
                  type="image/webp"
                  srcSet="/images/counter-sign-600.webp 600w, /images/counter-sign-1100.webp 1100w"
                  sizes={SIGN_SIZES}
                />
                <img
                  {...signImgProps}
                  alt={SIGN_ALT}
                  className="block h-auto w-auto max-w-[68vw] sm:max-w-[340px] lg:max-w-[420px]"
                  style={{
                    ...signImgProps.style,
                    // Static depth shadow traced on the sign's own
                    // silhouette; never animated.
                    filter: "drop-shadow(0 18px 28px rgba(30,30,60,0.18))",
                  }}
                />
              </picture>
            </motion.div>
            {/* Ground shadow anchored under the base foot, which sits at the
                lower-left of the photo (alpha-scan: foot contact centered
                near x=27%). Shrinks and fades inversely as the sign rises. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-[3.5%] left-[7%] z-0 h-[5%] w-[40%]"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(20,20,45,0.22) 0%, rgba(20,20,45,0) 65%)",
                filter: "blur(6px)",
              }}
              animate={
                reduce ? undefined : { scale: [1, 0.93], opacity: [1, 0.78] }
              }
              transition={FLOAT_TRANSITION}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
