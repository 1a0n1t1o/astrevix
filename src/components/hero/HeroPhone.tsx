"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import IPhoneMockup from "./IPhoneMockup";

type HeroPhoneProps = Readonly<{
  children: React.ReactNode;
}>;

export default function HeroPhone({ children }: HeroPhoneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // 'start start' -> phone top hits viewport top (scroll progress 0)
    // 'end start'   -> phone bottom hits viewport top (scroll progress 1)
    offset: ["start start", "end start"],
  });

  // Two parallel transforms; we pick the right one for the active breakpoint.
  // Hooks always run in the same order — only the assignment is conditional.
  const rotateXDesktop = useTransform(scrollYProgress, [0, 1], [-15, 0]);
  const rotateXMobile = useTransform(scrollYProgress, [0, 1], [-8, 0]);
  const rotateYDesktop = useTransform(scrollYProgress, [0, 1], [-3, 0]);
  const scaleDesktop = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const scaleMobile = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  const rotateX = isMobile ? rotateXMobile : rotateXDesktop;
  // Mobile drops rotateY entirely — sideways tilt on small screens reads as
  // motion sickness rather than depth.
  const rotateY = isMobile ? 0 : rotateYDesktop;
  const scale = isMobile ? scaleMobile : scaleDesktop;

  if (shouldReduceMotion) {
    return (
      <div ref={containerRef}>
        <IPhoneMockup>{children}</IPhoneMockup>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        perspective: isMobile ? "1200px" : "1500px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <IPhoneMockup>{children}</IPhoneMockup>
      </motion.div>
    </div>
  );
}
