export type Platform = "instagram" | "tiktok" | "youtube" | "x" | "facebook";

export interface BusinessData {
  slug: string;
  name: string;
  logo: string;
  tagline: string;
  brandColor: string;
  reward: string;
  contentType: string;
  requirements: string[];
}

export const PLATFORM_INFO: Record<Platform, { label: string; emoji: string; color: string }> = {
  instagram: { label: "Instagram", emoji: "📸", color: "#E4405F" },
  tiktok: { label: "TikTok", emoji: "🎵", color: "#000000" },
  youtube: { label: "YouTube", emoji: "▶️", color: "#FF0000" },
  x: { label: "X", emoji: "🐦", color: "#000000" },
  facebook: { label: "Facebook", emoji: "📘", color: "#1877F2" },
};

const MOCK_BUSINESS: BusinessData = {
  slug: "sunrise-cafe",
  name: "Sunrise Café",
  logo: "☀️",
  tagline: "Where every morning feels golden",
  brandColor: "#E8553A",
  reward: "$10 off your next visit",
  contentType: "Instagram Reel or TikTok",
  requirements: [
    "Tag @sunrisecafe in your post",
    "Show your food or drink",
    "Use #SunriseCafe",
    "Post must be public",
  ],
};

export function getBusinessBySlug(slug: string): BusinessData | null {
  if (slug === "sunrise-cafe") return MOCK_BUSINESS;
  return null;
}

export function detectPlatform(url: string): Platform | null {
  const lower = url.toLowerCase();
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("tiktok.com")) return "tiktok";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  if (lower.includes("x.com") || lower.includes("twitter.com")) return "x";
  if (lower.includes("facebook.com") || lower.includes("fb.com")) return "facebook";
  return null;
}
