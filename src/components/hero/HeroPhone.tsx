"use client";

// We import the base (client) entry rather than '/next' because '/next' is
// an async Server Component, which can't be rendered inside a 'use client'
// boundary. Since we're already lazy-loading this with ssr:false, we don't
// need the Next.js SSR variant.
import Spline from "@splinetool/react-spline";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Suspense, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";

const SPLINE_SCENE_URL =
  "https://prod.spline.design/LnvzhublXtzOAggA/scene.splinecode";

export function HeroPhone() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Visual polish on the wrapper. These always apply, regardless of whether
  // the Spline scene has its own scroll trigger wired up.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.6]);

  // If the Spline scene doesn't drive its own rotation, do it from React.
  // Tries common object names; if the scene uses a different name, the user
  // can read it from the [Spline] console log on load and we'll target it.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!splineApp) return;
    const phone =
      splineApp.findObjectByName("Phone") ||
      splineApp.findObjectByName("iPhone") ||
      splineApp.findObjectByName("iPhone 17 Pro") ||
      splineApp.findObjectByName("Group");
    if (phone) {
      // Rotate from ~-17deg (-0.3 rad) at scroll start to 0 at scroll end.
      phone.rotation.y = -0.3 * (1 - latest);
    }
  });

  function handleSplineLoad(app: Application) {
    setSplineApp(app);
    // Intentional: the user needs to know what objects exist in the scene
    // so we can target the right one for rotation if the defaults miss.
    if (typeof window !== "undefined") {
      console.log("[Spline] Scene loaded. Available objects:", app);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[600px]"
      style={{ aspectRatio: "1 / 1" }}
    >
      <motion.div style={{ scale, opacity }} className="h-full w-full">
        <Suspense fallback={<PhonePlaceholder />}>
          <Spline
            scene={SPLINE_SCENE_URL}
            onLoad={handleSplineLoad}
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>
      </motion.div>
    </div>
  );
}

function PhonePlaceholder() {
  return (
    <div
      className="h-full w-full animate-pulse bg-gradient-to-br from-gray-100 to-gray-200"
      style={{ borderRadius: "60px" }}
    />
  );
}
