import { supabase } from "./supabase";

export type Platform = "instagram" | "tiktok" | "youtube" | "x" | "facebook";

export interface BusinessData {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  tagline: string;
  brandColor: string;
  reward: string;
  contentType: string;
  requirements: string[];
  maxRewardsPerCustomer: number | null;
  status: "active" | "suspended";
}

export const PLATFORM_INFO: Record<Platform, { label: string; icon: string; color: string }> = {
  instagram: { label: "Instagram", icon: "instagram", color: "#E4405F" },
  tiktok: { label: "TikTok", icon: "music", color: "#000000" },
  youtube: { label: "YouTube", icon: "youtube", color: "#FF0000" },
  x: { label: "X", icon: "twitter", color: "#000000" },
  facebook: { label: "Facebook", icon: "facebook", color: "#1877F2" },
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
    logoUrl: data.logo_url || null,
    tagline: data.tagline || "",
    brandColor: data.brand_color || "#E8553A",
    reward: data.reward_description,
    contentType: data.content_type || "Instagram Reel or TikTok",
    requirements: data.requirements || [],
    maxRewardsPerCustomer: data.max_rewards_per_customer ?? 1,
    status: data.status || "active",
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
}): Promise<{ error: string | null; code: string | null }> {
  try {
    const res = await fetch("/api/submissions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: params.businessId,
        post_url: params.postUrl,
        detected_platform: params.detectedPlatform,
        customer_name: params.customerName,
        customer_email: params.customerEmail,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error || "Failed to submit.", code: data.code || null };
    }

    return { error: null, code: null };
  } catch {
    return { error: "Network error. Please try again.", code: "NETWORK_ERROR" };
  }
}
