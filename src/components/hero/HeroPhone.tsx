"use client";

import { useEffect, useRef, useState } from "react";
import IPhoneMockup from "./IPhoneMockup";

type HeroPhoneProps = Readonly<{
  children: React.ReactNode;
  /**
   * Y-axis rotation (degrees) at scroll start. Negative tilts the phone to
   * show the right edge; positive tilts to show the left. Settles to 0
   * (flat) as the user scrolls past. Defaults to -18 desktop / -10 mobile
   * to preserve the previous hero behavior. Pass +15 in a paired layout to
   * mirror the tilt direction.
   */
  initialRotation?: number;
}>;

const DEFAULT_DESKTOP_ANGLE = -18;
const DEFAULT_MOBILE_ANGLE = -10;
// Mobile feels less nauseating when the tilt is dampened relative to desktop.
const MOBILE_DAMPEN = 10 / 18;

// Scroll-driven Y-axis tilt for the iPhone mockup. We bind directly to the
// rotator element via ref and update its transform inside requestAnimationFrame
// in response to scroll events. Framer Motion's useScroll/useTransform was the
// natural choice, but its motion-value subscription wasn't firing reliably
// against this Next 16 / Turbopack setup, so we drive the transform ourselves.
export default function HeroPhone({
  children,
  initialRotation,
}: HeroPhoneProps) {
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

  const desktopAngle = initialRotation ?? DEFAULT_DESKTOP_ANGLE;
  const mobileAngle =
    initialRotation === undefined
      ? DEFAULT_MOBILE_ANGLE
      : initialRotation * MOBILE_DAMPEN;
  const startAngle = isMobile ? mobileAngle : desktopAngle;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Skip the scroll-driven rotation on mobile: the per-frame
    // getBoundingClientRect + rotateY repaint (combined with the multi-layer
    // drop-shadow filter on the wrapper) is the main source of scroll jank on
    // phones, and the rotation effect is barely perceptible at that size.
    if (reduced || isMobile) {
      const r = rotatorRef.current;
      if (r) r.style.transform = "rotateY(0deg)";
      return;
    }

    let raf = 0;

    function paint() {
      const c = containerRef.current;
      const r = rotatorRef.current;
      if (!c || !r) return;
      const rect = c.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, 1 - rect.top / viewportH));
      const angle = startAngle * (1 - p);
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
  }, [startAngle, isMobile]);

  return (
    // Filter wrapper sits OUTSIDE the 3D context so the multi-layer
    // drop shadow gets applied to the rendered 3D output without
    // flattening the side faces. (filter on a preserve-3d element
    // captures children to a 2D buffer first, killing the 3D pass-through.)
    <div
      style={{
        filter:
          "drop-shadow(0 20px 25px rgba(15, 15, 35, 0.15)) drop-shadow(0 40px 50px rgba(15, 15, 35, 0.12)) drop-shadow(0 60px 80px rgba(15, 15, 35, 0.08))",
      }}
    >
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
            transform: `rotateY(${startAngle}deg)`,
          }}
        >
          <IPhoneMockup>{children}</IPhoneMockup>
        </div>
      </div>
    </div>
  );
}
