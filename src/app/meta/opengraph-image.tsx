import { ogContentType, ogSize, renderBanner } from "../_og/banner";

export const alt = "Astrevix — Turn your customers into your marketing team.";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  return renderBanner({
    eyebrow: "Turn customers into marketers",
    headline: [
      { text: "Turn your customers into your " },
      { text: "marketing team.", accent: true },
    ],
    subline:
      "They tap a sign at your counter, post about your business, and get a small reward — automatically.",
  });
}
