"use client";

import { useEffect, useRef, useState } from "react";
import IPhoneMockup from "./IPhoneMockup";

type HeroPhoneProps = Readonly<{
  children: React.ReactNode;
}>;

// Scroll-driven Y-axis tilt for the iPhone mockup. We bind directly to the
// rotator element via ref and update its transform inside requestAnimationFrame
// in response to scroll events. Framer Motion's useScroll/useTransform was the
// natural choice, but its motion-value subscription wasn't firing reliably
// against this Next 16 / Turbopack setup, so we drive the transform ourselves.
export default function HeroPhone({ children }: HeroPhoneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const r = rotatorRef.current;
      if (r) r.style.transform = "rotateY(0deg)";
      return;
    }

    const maxAngle = isMobile ? 10 : 18;
    let raf = 0;

    function paint() {
      const c = containerRef.current;
      const r = rotatorRef.current;
      if (!c || !r) return;
      // Drive progress from "page top" -> "phone top hits viewport top".
      // That packs the entire -18deg -> 0deg sweep into the scroll distance
      // BEFORE the phone leaves the screen, so the user actually sees the
      // rotation while looking at the phone.
      const phoneRect = c.getBoundingClientRect();
      const phoneAbsTop = phoneRect.top + window.scrollY;
      const range = phoneAbsTop;
      const p = range > 0
        ? Math.min(1, Math.max(0, window.scrollY / range))
        : 0;
      const angle = -maxAngle + p * maxAngle;
      r.style.transform = `rotateY(${angle}deg)`;
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    }

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", paint);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", paint);
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      style={{
        perspective: "1500px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={rotatorRef}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          willChange: "transform",
          transform: `rotateY(${isMobile ? -10 : -18}deg)`,
        }}
      >
        <IPhoneMockup>{children}</IPhoneMockup>
      </div>
    </div>
  );
}
