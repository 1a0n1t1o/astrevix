import { supabase } from "./supabase";

export type Platform = "instagram" | "tiktok" | "youtube" | "x" | "facebook";

export interface BusinessData {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
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

export async function getBusinessBySlug(slug: string): Promise<BusinessData | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    logo: data.logo_emoji || null,
    tagline: data.tagline || "",
    brandColor: data.brand_color || "#E8553A",
    reward: data.reward_description,
    contentType: data.content_type || "Instagram Reel or TikTok",
    requirements: data.requirements || [],
  };
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

export async function createSubmission(params: {
  businessId: string;
  postUrl: string;
  detectedPlatform: string | null;
  customerName: string;
  customerEmail: string;
}) {
  const { error } = await supabase.from("submissions").insert({
    business_id: params.businessId,
    post_url: params.postUrl,
    detected_platform: params.detectedPlatform,
    customer_name: params.customerName,
    customer_email: params.customerEmail,
  });

  return { error };
}
