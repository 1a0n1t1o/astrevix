"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import IPhoneMockup from "./IPhoneMockup";

type HeroPhoneProps = Readonly<{
  children: React.ReactNode;
  /**
   * Y-axis rotation (degrees) at scroll start on desktop. Negative tilts the
   * phone to show the right edge; positive tilts to show the left. Settles
   * to 0 (flat) as the user scrolls past. Mobile uses subtle vertical
   * parallax instead of rotation. `prefers-reduced-motion` skips both.
   */
  initialRotation?: number;
}>;

const DEFAULT_DESKTOP_ANGLE = -18;
// Maximum upward drift on mobile parallax, in px. Tuned to match the user's
// 40–60px brief — large enough to perceive, small enough to feel subtle.
const MOBILE_PARALLAX_RANGE = 50;

// Scroll-driven motion for the iPhone mockup.
//
// Desktop: Y-axis rotation. Initial angle is applied via CSS custom
// properties + media queries (`.hero-phone-rotator` in globals.css)
// so SSR matches the device viewport with no hydration flash.
// Mobile: subtle vertical parallax — phone translates up to ~50px upward
// across the element's visible scroll range. No rotation (imperceptible
// at phone size and not worth the per-frame transform on small GPUs).
// `prefers-reduced-motion`: skip both, phone stays flat and stationary.
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
    if (reduced) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    let raf = 0;

    function paint() {
      const c = containerRef.current;
      const r = rotatorRef.current;
      if (!c || !r) return;
      const rect = c.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, 1 - rect.top / viewportH));

      if (isMobile) {
        // Translate-only on mobile — GPU-cheap, no rotation.
        r.style.setProperty(
          "--phone-translate-y",
          `${p * -MOBILE_PARALLAX_RANGE}px`,
        );
      } else {
        // Desktop: scroll-driven Y rotation.
        const angle = desktopAngle * (1 - p);
        r.style.setProperty("--phone-angle", `${angle}deg`);
      }
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
    //
    // Two-layer shadow: tight contact shadow + softer ambient. Tuned to
    // make the phone read as a physical object on a surface, not a sticker.
    <div
      style={{
        filter:
          "drop-shadow(0 10px 20px rgba(15, 15, 35, 0.10)) drop-shadow(0 30px 60px rgba(15, 15, 35, 0.18))",
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
                "translateY(var(--phone-translate-y, 0px)) rotateY(var(--phone-angle, var(--phone-desktop-angle)))",
            } as CSSProperties
          }
        >
          <IPhoneMockup>{children}</IPhoneMockup>
        </div>
      </div>
    </div>
  );
}
