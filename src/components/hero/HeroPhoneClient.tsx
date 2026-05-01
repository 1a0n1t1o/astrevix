"use client";

import dynamic from "next/dynamic";

// Spline pulls in WebGL + ~500KB-1MB of runtime, so we lazy-load it.
// ssr: false is required — WebGL doesn't exist on the server, and rendering
// it server-side throws hydration mismatch errors.
const HeroPhone = dynamic(
  () => import("./HeroPhone").then((m) => ({ default: m.HeroPhone })),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto w-full max-w-[600px] animate-pulse bg-gradient-to-br from-gray-100 to-gray-200"
        style={{ aspectRatio: "1 / 1", borderRadius: "32px" }}
      />
    ),
  },
);

export default HeroPhone;
