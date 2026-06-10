"use client";

import { getImageProps } from "next/image";
import { CheckCircle2 } from "lucide-react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "framer-motion";

const PROOF_POINTS = [
  "Ships free with your account",
  "Works with a tap or a scan — every phone",
  "Linked to your rewards page automatically",
];

const SIGN_ALT = "Astrevix counter sign with tap and QR code options";
const SIGN_SIZES = "(min-width: 1024px) 440px, (min-width: 768px) 40vw, 78vw";

const LIST_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
  },
};

export default function CounterSignSection() {
  // Pre-generated static WebPs serve nearly all traffic via <picture>; the
  // PNG stays as the fallback and keeps next/image's lazy-loading and
  // layout-shift protection (width/height) on the <img>.
  const { props: signImgProps } = getImageProps({
    alt: SIGN_ALT,
    src: "/images/counter-sign.png",
    width: 900,
    height: 1250,
    priority: false,
    sizes: SIGN_SIZES,
  });

  return (
    <section
      className="relative overflow-hidden py-14 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FBF9FF 30%, #F5F3FF 50%, #FBF9FF 70%, #FFFFFF 100%)",
      }}
    >
      <div className="relative mx-auto max-w-5xl px-6">
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <div className="grid gap-10 md:grid-cols-[45fr_55fr] md:gap-x-12 md:gap-y-8 lg:gap-x-16">
              {/* Header — desktop: top of right column, hugging the midline */}
              <div className="mx-auto max-w-2xl text-center md:col-start-2 md:row-start-1 md:mx-0 md:max-w-none md:self-end md:text-left">
                <p className="reveal reveal-up-sm mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
                  The sign on your counter
                </p>
                <h2 className="reveal reveal-up-sm reveal-d1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  This is what your customers see.
                </h2>
                <p className="reveal reveal-up-sm reveal-d2 mt-4 text-lg text-gray-600">
                  A clean acrylic sign that sits next to your register.
                  Customers tap it with their phone or scan the QR code — no
                  app, no instructions needed.
                </p>
              </div>

              {/* Sign photo — desktop: left column, spanning both text rows */}
              <m.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="md:col-start-1 md:row-start-1 md:row-span-2 md:self-center"
              >
                <div className="relative mx-auto w-fit">
                  {/* Faint lavender glow grounding the sign */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[115%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(124,58,237,0.10) 0%, rgba(59,130,246,0.05) 45%, transparent 70%)",
                    }}
                  />
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="/images/counter-sign-480.webp 480w, /images/counter-sign-900.webp 900w"
                      sizes={SIGN_SIZES}
                    />
                    <img
                      {...signImgProps}
                      alt={SIGN_ALT}
                      className="relative z-10 block h-auto w-auto max-h-[58svh] max-w-[78vw] md:max-h-[620px] md:max-w-[440px]"
                    />
                  </picture>
                  {/* Soft contact shadow under the base */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-6 w-[68%] -translate-x-1/2 translate-y-1/2 rounded-[50%]"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(15,23,42,0.20) 0%, rgba(15,23,42,0.08) 45%, transparent 72%)",
                    }}
                  />
                </div>
              </m.div>

              {/* Proof points — desktop: bottom of right column */}
              <m.ul
                variants={LIST_VARIANTS}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="mx-auto w-fit space-y-4 md:col-start-2 md:row-start-2 md:mx-0 md:self-start"
              >
                {PROOF_POINTS.map((point) => (
                  <m.li
                    key={point}
                    variants={ITEM_VARIANTS}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
                      strokeWidth={2}
                    />
                    <span className="text-base text-gray-700">{point}</span>
                  </m.li>
                ))}
              </m.ul>
            </div>
          </MotionConfig>
        </LazyMotion>
      </div>
    </section>
  );
}
