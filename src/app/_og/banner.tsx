import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

/**
 * Shared Open Graph / Twitter banner used by the `opengraph-image` and
 * `twitter-image` route conventions. 1200×630 is the standard social-card size
 * that Discord, Slack, iMessage, Facebook, LinkedIn, WhatsApp and X all read.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const BRAND = "#2563EB";
const INK = "#0F172A";
const MUTED = "#5B6472";
const BG = "#FEFCFA";

async function loadFonts() {
  // `new URL(..., import.meta.url)` lets Next's file tracer bundle these woff
  // files into the serverless function (a process.cwd() path would not be traced).
  const [regular, semibold, bold, extrabold] = await Promise.all([
    readFile(new URL("./fonts/inter-400.woff", import.meta.url)),
    readFile(new URL("./fonts/inter-600.woff", import.meta.url)),
    readFile(new URL("./fonts/inter-700.woff", import.meta.url)),
    readFile(new URL("./fonts/inter-800.woff", import.meta.url)),
  ]);
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Inter", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Inter", data: extrabold, weight: 800 as const, style: "normal" as const },
  ];
}

type BannerProps = {
  /** Small uppercase eyebrow above the headline. */
  eyebrow: string;
  /** Headline segments; segments flagged `accent` render in the brand blue. */
  headline: { text: string; accent?: boolean }[];
  /** Supporting line beneath the headline. */
  subline: string;
};

export async function renderBanner({ eyebrow, headline, subline }: BannerProps) {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          fontFamily: "Inter",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* soft brand accent in the corner — stacked translucent circles
            (satori renders flat backgrounds reliably; radial-gradient is buggy) */}
        <div
          style={{
            position: "absolute",
            top: -300,
            right: -220,
            width: 680,
            height: 680,
            borderRadius: "50%",
            background: "rgba(37,99,235,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "rgba(37,99,235,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -110,
            right: -30,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(37,99,235,0.10)",
          }}
        />

        {/* top row: wordmark + eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 12,
              background: BRAND,
              color: "#fff",
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            A
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: INK, letterSpacing: -0.5 }}>
            Astrevix
          </div>
          <div
            style={{
              marginLeft: 14,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(37,99,235,0.10)",
              color: BRAND,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {eyebrow}
          </div>
        </div>

        {/* headline + subline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: -2,
              color: INK,
            }}
          >
            {/* split into per-word spans with explicit gaps — satori trims
                whitespace between flex children, so spaces must be real margins */}
            {headline.flatMap((seg, si) =>
              seg.text
                .split(" ")
                .filter(Boolean)
                .map((word, wi) => (
                  <span
                    key={`${si}-${wi}`}
                    style={{ color: seg.accent ? BRAND : INK, marginRight: 18 }}
                  >
                    {word}
                  </span>
                )),
            )}
          </div>
          <div style={{ fontSize: 30, fontWeight: 400, lineHeight: 1.35, color: MUTED, maxWidth: 900 }}>
            {subline}
          </div>
        </div>

        {/* footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {["Scan", "Post", "Get rewarded"].map((step, i) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {i > 0 && <div style={{ color: "#C7CDD6", fontSize: 22 }}>→</div>}
                <div style={{ fontSize: 22, fontWeight: 600, color: INK }}>{step}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, color: BRAND }}>astrevix.com</div>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
