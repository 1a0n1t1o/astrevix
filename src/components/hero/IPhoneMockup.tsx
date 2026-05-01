"use client";

import type { ReactNode } from "react";

type IPhoneMockupProps = Readonly<{
  children: ReactNode;
}>;

// Frame face — natural titanium, lighter in the middle, darker on the edges.
const FRAME_GRADIENT =
  "linear-gradient(90deg, #76736c 0%, #a8a59c 12%, #c8c5bc 35%, #d8d5cc 50%, #c8c5bc 65%, #a8a59c 88%, #76736c 100%)";

// Brushed metal — fine repeating vertical streaks that catch light.
const BRUSHED_METAL =
  "repeating-linear-gradient(90deg, transparent 0, transparent 1px, rgba(255,255,255,0.06) 1px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)";

// Top-light radial highlight overlay — suggests an off-camera light source.
const FRAME_LIGHT_OVERLAY =
  "radial-gradient(ellipse 70% 35% at 50% -5%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 25%, transparent 60%)";

// Bottom shadow gradient — grounds the frame and suggests body curvature.
const FRAME_BOTTOM_SHADOW =
  "linear-gradient(0deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.05) 12%, transparent 22%)";

// Side metal edge — visible during Y-axis rotation, darker than the face.
const SIDE_EDGE_GRADIENT =
  "linear-gradient(90deg, #5a5750 0%, #7a7770 50%, #908d85 100%)";

// Side button gradients — vertical so the chamfered top/bottom catches light.
const POWER_BUTTON_GRADIENT =
  "linear-gradient(180deg, #c5c2b8 0%, #a5a298 8%, #7a7770 50%, #a5a298 92%, #c5c2b8 100%)";
const VOLUME_BUTTON_GRADIENT =
  "linear-gradient(180deg, #c5c2b8 0%, #a5a298 8%, #7a7770 50%, #a5a298 92%, #c5c2b8 100%)";
// Action button — slightly darker and more saturated so it's distinguishable.
const ACTION_BUTTON_GRADIENT =
  "linear-gradient(180deg, #989590 0%, #7a7770 8%, #5a5750 50%, #7a7770 92%, #989590 100%)";

export default function IPhoneMockup({ children }: IPhoneMockupProps) {
  return (
    <div
      className="relative"
      style={{
        width: "100%",
        aspectRatio: "9 / 19.5",
        filter:
          "drop-shadow(0 25px 50px rgba(0,0,0,0.18)) drop-shadow(0 12px 24px rgba(0,0,0,0.12))",
      }}
    >
      {/* Side metal edge — sits behind the front face on the left side.
          Becomes more visible as the phone rotates -Y to show its left edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: "6px",
          background: SIDE_EDGE_GRADIENT,
          borderTopLeftRadius: "60px",
          borderBottomLeftRadius: "60px",
          transform: "translateZ(-3px)",
          boxShadow: "inset -1px 0 1px rgba(0,0,0,0.4)",
        }}
      />

      {/* Outer titanium frame — 8px L/R, 6px T/B (uniform thin bezels). */}
      <div
        className="relative h-full w-full"
        style={{
          padding: "6px 8px",
          borderRadius: "60px",
          background: FRAME_GRADIENT,
          boxShadow:
            "inset 0 0 0 0.5px rgba(255,255,255,0.30), inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -1.5px 0 rgba(0,0,0,0.30), inset 1px 0 0 rgba(255,255,255,0.18), inset -1px 0 0 rgba(0,0,0,0.22)",
        }}
      >
        {/* Brushed metal texture overlay — fine vertical streaks. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            borderRadius: "60px",
            background: BRUSHED_METAL,
            opacity: 0.7,
          }}
        />

        {/* Top radial highlight — main light-source reflection on metal. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            borderRadius: "60px",
            background: FRAME_LIGHT_OVERLAY,
            mixBlendMode: "screen",
          }}
        />

        {/* Single bright specular line along the very top edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-30"
          style={{
            top: 0,
            height: "1px",
            borderTopLeftRadius: "60px",
            borderTopRightRadius: "60px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
          }}
        />

        {/* Chamfer — thin darker line just inside the top highlight, 2px down. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-1 z-30"
          style={{
            top: "2px",
            height: "1px",
            borderRadius: "60px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.18) 50%, transparent 100%)",
          }}
        />

        {/* Bottom subtle shadow grounding. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            borderRadius: "60px",
            background: FRAME_BOTTOM_SHADOW,
          }}
        />

        {/* Inner black bezel ring (1.5px). */}
        <div
          className="relative h-full w-full overflow-hidden bg-black"
          style={{
            padding: "1.5px",
            borderRadius: "53.5px",
            boxShadow:
              "inset 0 0 1px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(0,0,0,0.5)",
          }}
        >
          {/* Screen surface — beveled glass with subtle inner shadow at perimeter. */}
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              borderRadius: "52px",
              background:
                "linear-gradient(180deg, #EDE9FE 0%, #F3F0FF 15%, #FEFCFA 40%, #FEFCFA 100%)",
              boxShadow:
                "inset 0 0 0 0.5px rgba(0,0,0,0.10), inset 0 1px 2px rgba(0,0,0,0.06)",
            }}
          >
            {children}

            {/* Dynamic Island — pill, 124 x 35, 11px from top, perfectly centered. */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 z-50 -translate-x-1/2"
              style={{
                top: "11px",
                width: "124px",
                height: "35px",
                background:
                  "radial-gradient(ellipse at 50% 30%, #1a1a1a 0%, #000000 70%)",
                borderRadius: "17.5px",
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -1px 2px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(0,0,0,0.4)",
              }}
            >
              {/* Camera dot — 8px circle, 12px from right edge, vertically centered. */}
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-full"
                style={{
                  right: "12px",
                  width: "8px",
                  height: "8px",
                  background:
                    "radial-gradient(circle at 35% 30%, #2a2a3a 0%, #0a0a1a 60%, #000000 100%)",
                  boxShadow:
                    "inset 0 0 1px rgba(255,255,255,0.08), 0 0 0 0.5px rgba(0,0,0,0.5)",
                }}
              >
                {/* Inner lens — 3px circle. */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: "3px",
                    height: "3px",
                    background:
                      "radial-gradient(circle at 30% 30%, #4a4a6a 0%, #1a1a2a 80%)",
                  }}
                />
              </div>
            </div>

            {/* Soft glass reflection — diagonal sweep across upper-left. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-40"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 25%, transparent 45%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Side buttons — protrude 2px from frame edges, with chamfered look. */}

      {/* Action Button — left, top */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-30"
        style={{
          left: "-2px",
          top: "85px",
          width: "4px",
          height: "28px",
          background: ACTION_BUTTON_GRADIENT,
          borderTopLeftRadius: "1.5px",
          borderBottomLeftRadius: "1.5px",
          boxShadow:
            "inset -1px 0 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.35)",
        }}
      />
      {/* Volume Up — left */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-30"
        style={{
          left: "-2px",
          top: "130px",
          width: "4px",
          height: "38px",
          background: VOLUME_BUTTON_GRADIENT,
          borderTopLeftRadius: "1.5px",
          borderBottomLeftRadius: "1.5px",
          boxShadow:
            "inset -1px 0 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.30)",
        }}
      />
      {/* Volume Down — left */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-30"
        style={{
          left: "-2px",
          top: "178px",
          width: "4px",
          height: "38px",
          background: VOLUME_BUTTON_GRADIENT,
          borderTopLeftRadius: "1.5px",
          borderBottomLeftRadius: "1.5px",
          boxShadow:
            "inset -1px 0 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.30)",
        }}
      />
      {/* Power — right */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-30"
        style={{
          right: "-2px",
          top: "95px",
          width: "4px",
          height: "65px",
          background: POWER_BUTTON_GRADIENT,
          borderTopRightRadius: "1.5px",
          borderBottomRightRadius: "1.5px",
          boxShadow:
            "inset 1px 0 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.30)",
        }}
      />
    </div>
  );
}
