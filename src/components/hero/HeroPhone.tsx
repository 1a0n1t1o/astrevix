"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import IPhoneMockup from "./IPhoneMockup";

type HeroPhoneProps = Readonly<{
  children: React.ReactNode;
  /**
   * Y-axis rotation (degrees) at scroll start on desktop. Negative tilts the
   * phone to show the right edge; positive tilts to show the left. Settles to
   * 0 (flat) as the user scrolls past. Mobile and `prefers-reduced-motion`
   * always render flat (0deg) — see `.hero-phone-rotator` rules in
   * globals.css.
   */
  initialRotation?: number;
}>;

const DEFAULT_DESKTOP_ANGLE = -18;

// Scroll-driven Y-axis tilt for the iPhone mockup.
//
// Initial angle is applied via CSS custom properties + media queries
// (`.hero-phone-rotator` in globals.css). This way SSR renders an angle
// that already matches the device — no hydration flash from desktop tilt
// to mobile tilt. JS only runs scroll-driven rotation on desktop without
// `prefers-reduced-motion`; mobile and reduced-motion stay flat.
export default function HeroPhone({
  children,
  initialRotation,
}: HeroPhoneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);

  const desktopAngle = initialRotation ?? DEFAULT_DESKTOP_ANGLE;

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    // Mobile + reduced-motion: CSS already keeps `--phone-angle` at 0deg.
    // Skip listeners — the rotation effect is barely perceptible at phone
    // sizes and the per-frame getBoundingClientRect is the main source of
    // scroll jank on phones.
    if (reduced || isMobile) return;

    let raf = 0;

    function paint() {
      const c = containerRef.current;
      const r = rotatorRef.current;
      if (!c || !r) return;
      const rect = c.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, 1 - rect.top / viewportH));
      const angle = desktopAngle * (1 - p);
      r.style.setProperty("--phone-angle", `${angle}deg`);
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
  }, [desktopAngle]);

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
          className="hero-phone-rotator"
          style={
            {
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              willChange: "transform",
              "--phone-desktop-angle": `${desktopAngle}deg`,
              transform:
                "rotateY(var(--phone-angle, var(--phone-desktop-angle)))",
            } as CSSProperties
          }
        >
          <IPhoneMockup>{children}</IPhoneMockup>
        </div>
      </div>
    </div>
  );
}
