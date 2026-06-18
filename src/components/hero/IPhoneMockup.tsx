"use client";

import type { ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

type IPhoneMockupProps = Readonly<{
  children: ReactNode;
}>;

// Frame face — black titanium: near-black at the edges with a cool graphite
// sheen catching light through the middle. The dark band gives the phone the
// contrast it needs to lift off the light hero background instead of reading flat.
const FRAME_GRADIENT =
  "linear-gradient(90deg, #141416 0%, #2a2a2d 13%, #404044 37%, #4c4c51 50%, #404044 63%, #2a2a2d 87%, #141416 100%)";

// Top-light radial highlight overlay — suggests an off-camera light source.
const FRAME_LIGHT_OVERLAY =
  "radial-gradient(ellipse 70% 35% at 50% -5%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 25%, transparent 60%)";

// Bottom shadow gradient — grounds the frame and suggests body curvature.
const FRAME_BOTTOM_SHADOW =
  "linear-gradient(0deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.05) 12%, transparent 22%)";

// Side faces of the phone (the dark titanium band visible during rotation).
// Lighter at the edge that meets the front face, near-black deeper in.
const SIDE_LEFT_GRADIENT =
  "linear-gradient(90deg, #0e0e10 0%, #232326 50%, #34343a 100%)";
const SIDE_RIGHT_GRADIENT =
  "linear-gradient(90deg, #34343a 0%, #232326 50%, #0e0e10 100%)";

// Side buttons sit on the side face, so they're slightly lighter than the band.
const SIDE_BUTTON_GRADIENT =
  "linear-gradient(180deg, #3a3a3e 0%, #1c1c20 50%, #3a3a3e 100%)";
const SIDE_BUTTON_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.45)";

export default function IPhoneMockup({ children }: IPhoneMockupProps) {
  return (
    <div
      className="relative"
      style={{
        width: "100%",
        aspectRatio: "9 / 19.5",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Soft elliptical ground reflection — sits below the phone, in 2D plane. */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: "-20px",
          left: "10%",
          right: "10%",
          height: "40px",
          background:
            "radial-gradient(ellipse at center, rgba(20, 20, 40, 0.25) 0%, transparent 70%)",
          filter: "blur(15px)",
          zIndex: -1,
        }}
      />

      {/* LEFT SIDE FACE — perpendicular to the front face, visible during -Y tilt.
          Clipped to the straight middle of the phone (top:60px / height -120px)
          so it doesn't poke out past the front face's 60px rounded corners. */}
      <div
        aria-hidden
        className="pointer-events-none absolute overflow-hidden"
        style={{
          left: 0,
          top: "60px",
          width: "12px",
          height: "calc(100% - 120px)",
          background: SIDE_LEFT_GRADIENT,
          transform: "rotateY(-90deg) translateX(-6px)",
          transformOrigin: "left center",
          borderRadius: "2px",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.35)",
        }}
      >
        {/* Buttons positions are relative to the side face top (which is 60px
            from phone top), so subtract 60 from the original phone-top offsets. */}
        {/* Action button (phone y=85) */}
        <div
          style={{
            position: "absolute",
            top: "25px",
            left: 0,
            width: "12px",
            height: "28px",
            background: SIDE_BUTTON_GRADIENT,
            boxShadow: SIDE_BUTTON_SHADOW,
          }}
        />
        {/* Volume Up (phone y=130) */}
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: 0,
            width: "12px",
            height: "38px",
            background: SIDE_BUTTON_GRADIENT,
            boxShadow: SIDE_BUTTON_SHADOW,
          }}
        />
        {/* Volume Down (phone y=178) */}
        <div
          style={{
            position: "absolute",
            top: "118px",
            left: 0,
            width: "12px",
            height: "38px",
            background: SIDE_BUTTON_GRADIENT,
            boxShadow: SIDE_BUTTON_SHADOW,
          }}
        />
      </div>

      {/* RIGHT SIDE FACE — clipped to the straight middle just like the left. */}
      <div
        aria-hidden
        className="pointer-events-none absolute overflow-hidden"
        style={{
          right: 0,
          top: "60px",
          width: "12px",
          height: "calc(100% - 120px)",
          background: SIDE_RIGHT_GRADIENT,
          transform: "rotateY(90deg) translateX(6px)",
          transformOrigin: "right center",
          borderRadius: "2px",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.35)",
        }}
      >
        {/* Power button (phone y=95) */}
        <div
          style={{
            position: "absolute",
            top: "35px",
            left: 0,
            width: "12px",
            height: "65px",
            background: SIDE_BUTTON_GRADIENT,
            boxShadow: SIDE_BUTTON_SHADOW,
          }}
        />
      </div>

      {/* FRONT FACE — pushed forward in 3D space so the side faces sit beneath it. */}
      <div
        className="absolute inset-0"
        style={{
          transform: "translateZ(6px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Outer titanium frame — 8px L/R, 6px T/B (uniform thin bezels). */}
        <div
          className="relative h-full w-full"
          style={{
            padding: "6px 8px",
            borderRadius: "60px",
            background: FRAME_GRADIENT,
            boxShadow:
              "0 0 0 0.5px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.22), inset 0 0 0 0.5px rgba(255,255,255,0.30), inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -1.5px 0 rgba(0,0,0,0.30), inset 1px 0 0 rgba(255,255,255,0.18), inset -1px 0 0 rgba(0,0,0,0.22)",
          }}
        >
          {/* Top radial highlight — main light-source reflection on metal. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              borderRadius: "60px",
              background: FRAME_LIGHT_OVERLAY,
              mixBlendMode: "screen",
              transform: "translateX(calc(var(--phone-tilt, 0) * 14px))",
              willChange: "transform",
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
                  "linear-gradient(180deg, #EEF1F6 0%, #F7F9FB 14%, #FEFCFA 38%, #FEFCFA 100%)",
                boxShadow:
                  "inset 0 0 0 0.5px rgba(0,0,0,0.10), inset 0 1px 2px rgba(0,0,0,0.06)",
              }}
            >
              {children}

              {/* iOS-style status bar — time + signal/Wi-Fi/battery flanking
                  the Dynamic Island. The biggest single cue that this is a
                  live phone screen. Aligned to the same vertical band as the
                  island so the glyphs sit level with it. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 z-50 flex items-center justify-between px-[9%] text-[#1a1a1a]"
                style={{ top: "2.5%", height: "3.8%" }}
              >
                <span className="text-[11px] font-semibold leading-none tracking-tight">
                  9:41
                </span>
                <div className="flex items-center gap-[4px]">
                  <Signal className="h-[12px] w-[12px]" strokeWidth={2.5} />
                  <Wifi className="h-[12px] w-[12px]" strokeWidth={2.5} />
                  <BatteryFull className="h-[15px] w-[15px]" strokeWidth={2} />
                </div>
              </div>

              {/* Dynamic Island — sized as a percentage of the phone so it
                  scales correctly at any phone width (was previously fixed at
                  124x35px, which read as oversized on the smaller customer
                  phone). 28% width / 3.8% height matches iPhone 17 Pro
                  proportions reasonably closely. */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 z-50 -translate-x-1/2"
                style={{
                  top: "2.5%",
                  width: "28%",
                  height: "3.8%",
                  background:
                    "radial-gradient(ellipse at 50% 30%, #1a1a1a 0%, #000000 70%)",
                  borderRadius: "9999px",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -1px 2px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(0,0,0,0.4)",
                }}
              >
                {/* Camera dot — sized relative to the pill so it scales too. */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    right: "8%",
                    width: "8%",
                    aspectRatio: "1 / 1",
                    background:
                      "radial-gradient(circle at 35% 30%, #2a2a3a 0%, #0a0a1a 60%, #000000 100%)",
                    boxShadow:
                      "inset 0 0 1px rgba(255,255,255,0.08), 0 0 0 0.5px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Inner lens — ~37% of the camera dot. */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: "37%",
                      aspectRatio: "1 / 1",
                      background:
                        "radial-gradient(circle at 30% 30%, #4a4a6a 0%, #1a1a2a 80%)",
                    }}
                  />
                </div>
              </div>

              {/* Glass reflection — one clean diagonal sheen from the
                  upper-left key light. Sits above the screen UI (z-40) but
                  below the floating badges, and is click-through. Static, no
                  animated sheen. Replaces the old stacked white veils that
                  hazed the UI, so the content underneath now reads crisp. */}
              {/* Moving specular streak — a sharp diagonal glance of light
                  that slides across the glass as the phone turns (driven by
                  --phone-tilt). The clearest "real glass" cue under rotation. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-40"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.10) 47%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0.10) 53%, transparent 62%)",
                  borderRadius: "52px",
                  transform: "translateX(calc(var(--phone-tilt, 0) * 52px))",
                  willChange: "transform",
                  mixBlendMode: "screen",
                }}
              />

              {/* Broad diagonal sheen — soft key-light wash, shifts subtly. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-40"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 16%, rgba(255,255,255,0) 38%)",
                  borderRadius: "52px",
                  transform: "translateX(calc(var(--phone-tilt, 0) * 20px))",
                  willChange: "transform",
                }}
              />

              {/* Glass catch-light — small bright specular hot-spot in the
                  top-left corner, where a window edge catches the glass. */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-40"
                style={{
                  width: "48%",
                  height: "30%",
                  background:
                    "radial-gradient(ellipse at top left, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.16) 34%, transparent 68%)",
                  borderTopLeftRadius: "52px",
                  transform: "translateX(calc(var(--phone-tilt, 0) * 10px))",
                  willChange: "transform",
                }}
              />

              {/* Glass — subtle inset shadow at the screen's inner edge for
                  curvature, plus a 1px top inner light line. Only touches the
                  perimeter, so the UI stays sharp. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-40"
                style={{
                  borderRadius: "52px",
                  boxShadow:
                    "inset 0 0 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
