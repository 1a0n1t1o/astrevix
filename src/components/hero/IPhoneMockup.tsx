"use client";

import type { ReactNode } from "react";

type IPhoneMockupProps = Readonly<{
  children: ReactNode;
  /**
   * Y-axis tilt in degrees. When greater than ~30, the camera bump on the
   * back of the phone would become visible. Currently unused — see TODO below.
   */
  tiltAngle?: number;
}>;

const TITANIUM_FRAME =
  "linear-gradient(135deg, #D4D1C8 0%, #B8B5AC 25%, #C8C5BC 50%, #A8A59C 75%, #C8C5BC 100%)";

const TITANIUM_BUTTON =
  "linear-gradient(135deg, #BFBCB3 0%, #A39F96 25%, #B3B0A7 50%, #939089 75%, #B3B0A7 100%)";

const ACTION_BUTTON =
  "linear-gradient(135deg, #A8A59C 0%, #918E85 25%, #9A978E 50%, #828079 75%, #9A978E 100%)";

export default function IPhoneMockup({ children, tiltAngle = 0 }: IPhoneMockupProps) {
  // TODO: When tiltAngle > 30 on the Y-axis, render the camera bump on the
  // back of the phone (top-left corner when viewed from front). Skipped for
  // the current front-facing tilt animation that stays within ±15°.
  void tiltAngle;

  return (
    <div
      className="relative"
      style={{
        filter:
          "drop-shadow(0 30px 40px rgba(0,0,0,0.15)) drop-shadow(0 10px 20px rgba(0,0,0,0.10))",
      }}
    >
      {/* Power button — right side */}
      <div
        className="pointer-events-none absolute right-[-2px] z-30 rounded-r-[2px]"
        style={{
          top: "9.7%",
          width: "4px",
          height: "7.3%",
          background: TITANIUM_BUTTON,
          boxShadow:
            "inset 1px 0 0 rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.30)",
        }}
      />

      {/* Action button — left side, top */}
      <div
        className="pointer-events-none absolute left-[-2px] z-30 rounded-l-[2px]"
        style={{
          top: "8.5%",
          width: "4px",
          height: "3.9%",
          background: ACTION_BUTTON,
          boxShadow:
            "inset -1px 0 0 rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.30)",
        }}
      />

      {/* Volume Up — left side */}
      <div
        className="pointer-events-none absolute left-[-2px] z-30 rounded-l-[2px]"
        style={{
          top: "14.6%",
          width: "4px",
          height: "4.9%",
          background: TITANIUM_BUTTON,
          boxShadow:
            "inset -1px 0 0 rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.30)",
        }}
      />

      {/* Volume Down — left side */}
      <div
        className="pointer-events-none absolute left-[-2px] z-30 rounded-l-[2px]"
        style={{
          top: "20.7%",
          width: "4px",
          height: "4.9%",
          background: TITANIUM_BUTTON,
          boxShadow:
            "inset -1px 0 0 rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.30)",
        }}
      />

      {/* Outer titanium frame */}
      <div
        className="relative"
        style={{
          padding: "10px",
          borderRadius: "56px",
          background: TITANIUM_FRAME,
        }}
      >
        {/* Top edge highlight — simulates light catching the chamfer */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            borderRadius: "56px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 8%)",
          }}
        />
        {/* Left edge highlight */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            borderRadius: "56px",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 4%)",
          }}
        />
        {/* Bottom edge subtle shadow for grounding */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            borderRadius: "56px",
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.18) 0%, transparent 6%)",
          }}
        />

        {/* Inner black bezel ring */}
        <div
          className="relative overflow-hidden bg-black"
          style={{
            padding: "2.5px",
            borderRadius: "48px",
          }}
        >
          {/* Screen */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "9 / 19.5",
              borderRadius: "46px",
              background:
                "linear-gradient(180deg, #EDE9FE 0%, #F3F0FF 15%, #FEFCFA 40%, #FEFCFA 100%)",
            }}
          >
            {/* Screen content — slotted from caller */}
            {children}

            {/* Dynamic Island — overlays screen content */}
            <div
              className="pointer-events-none absolute left-1/2 z-50 -translate-x-1/2"
              style={{
                top: "12px",
                width: "120px",
                height: "36px",
                background: "#000000",
                borderRadius: "18px",
                boxShadow:
                  "inset 0 1px 2px rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.04)",
              }}
            >
              {/* Subtle camera lens dot */}
              <div
                className="absolute right-[10px] top-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: "7px",
                  height: "7px",
                  background:
                    "radial-gradient(circle at 30% 30%, #1e1b4b 0%, #000000 70%)",
                }}
              />
            </div>

            {/* Soft glass reflection across screen */}
            <div
              className="pointer-events-none absolute inset-0 z-40"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 30%, transparent 50%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
