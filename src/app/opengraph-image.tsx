import { ogContentType, ogSize, renderBanner } from "./_og/banner";

export const alt = "Astrevix — Get customers posting about your business, automatically.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderBanner({
    eyebrow: "For local businesses",
    headline: [
      { text: "Get customers " },
      { text: "posting", accent: true },
      { text: " about your business." },
    ],
    subline: "Turn real customers into content creators — without ever asking them to.",
  });
}
