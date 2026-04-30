"use client";

import type { ReactNode } from "react";

type IPhoneMockupProps = Readonly<{
  children: ReactNode;
}>;

// Frame face — natural titanium, lighter in the middle, darker on the edges.
const FRAME_GRADIENT =
  "linear-gradient(90deg, #8a8780 0%, #b5b2a8 15%, #d4d1c6 50%, #b5b2a8 85%, #8a8780 100%)";

// Side metal edge — visible during Y-axis rotation, darker than the face.
const SIDE_EDGE_GRADIENT =
  "linear-gradient(90deg, #6a6760 0%, #8a8780 100%)";

// Side buttons — titanium tone shifted darker so they read as separate parts.
const POWER_GRADIENT =
  "linear-gradient(180deg, #a5a298 0%, #7a7770 50%, #a5a298 100%)";
const VOLUME_GRADIENT =
  "linear-gradient(180deg, #a5a298 0%, #7a7770 50%, #a5a298 100%)";
// Action button — slightly darker so it's distinguishable at a glance.
const ACTION_GRADIENT =
  "linear-gradient(180deg, #8a8780 0%, #5a5750 50%, #8a8780 100%)";

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
          transform: "translateZ(-2px)",
        }}
      />

      {/* Outer titanium frame — 8px L/R, 6px T/B (uniform thin bezels). */}
      <div
        className="relative h-full w-full"
        style={{
          padding: "6px 8px",
          borderRadius: "60px",
          background: FRAME_GRADIENT,
        }}
      >
        {/* Top specular highlight — single bright line that sells the metal look. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-30"
          style={{
            top: 0,
            height: "1px",
            borderTopLeftRadius: "60px",
            borderTopRightRadius: "60px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          }}
        />

        {/* Inner black bezel ring (1.5px). */}
        <div
          className="relative h-full w-full overflow-hidden bg-black"
          style={{
            padding: "1.5px",
            borderRadius: "53.5px",
          }}
        >
          {/* Screen surface */}
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              borderRadius: "52px",
              background:
                "linear-gradient(180deg, #EDE9FE 0%, #F3F0FF 15%, #FEFCFA 40%, #FEFCFA 100%)",
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
                background: "#000000",
                borderRadius: "17.5px",
              }}
            >
              {/* Camera dot — 8px circle, 12px from right edge, vertically centered. */}
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-full"
                style={{
                  right: "12px",
                  width: "8px",
                  height: "8px",
                  background: "#1a1a1a",
                }}
              >
                {/* Inner lens — 3px circle. */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: "3px",
                    height: "3px",
                    background: "#2a2a3a",
                  }}
                />
              </div>
            </div>

            {/* Soft glass reflection across screen */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-40"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 30%, transparent 50%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Side buttons — protrude 2px from frame edges. */}

      {/* Action Button — left, top */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-30"
        style={{
          left: "-2px",
          top: "85px",
          width: "4px",
          height: "28px",
          background: ACTION_GRADIENT,
          borderTopLeftRadius: "1.5px",
          borderBottomLeftRadius: "1.5px",
          boxShadow: "inset -1px 0 0 rgba(0,0,0,0.55)",
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
          background: VOLUME_GRADIENT,
          borderTopLeftRadius: "1.5px",
          borderBottomLeftRadius: "1.5px",
          boxShadow: "inset -1px 0 0 rgba(0,0,0,0.55)",
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
          background: VOLUME_GRADIENT,
          borderTopLeftRadius: "1.5px",
          borderBottomLeftRadius: "1.5px",
          boxShadow: "inset -1px 0 0 rgba(0,0,0,0.55)",
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
          background: POWER_GRADIENT,
          borderTopRightRadius: "1.5px",
          borderBottomRightRadius: "1.5px",
          boxShadow: "inset 1px 0 0 rgba(0,0,0,0.55)",
        }}
      />
    </div>
  );
}
