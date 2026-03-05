import { supabase } from "./supabase";

export type Platform = "instagram" | "tiktok" | "youtube" | "x" | "facebook";

export interface RewardTierPublic {
  id: string;
  tier_name: string;
  platform: "instagram" | "tiktok" | "facebook" | "google";
  content_type: string;
  reward_description: string;
  reward_value: string | null;
  verification_hours: number;
  sort_order: number;
}

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
  termsConditions: string | null;
  status: "active" | "suspended";
  rewardTiers: RewardTierPublic[];
}

export const PLATFORM_INFO: Record<Platform, { label: string; icon: string; color: string }> = {
  instagram: { label: "Instagram", icon: "instagram", color: "#E4405F" },
  tiktok: { label: "TikTok", icon: "music", color: "#000000" },
  youtube: { label: "YouTube", icon: "youtube", color: "#FF0000" },
  x: { label: "X", icon: "twitter", color: "#000000" },
  facebook: { label: "Facebook", icon: "facebook", color: "#1877F2" },
};

export const PLATFORM_CONTENT_TYPES: Record<string, string[]> = {
  instagram: ["Story", "Reel", "Post"],
  tiktok: ["Video"],
  facebook: ["Post"],
  google: ["Review"],
};

export const VERIFICATION_WINDOW_OPTIONS = [
  { value: 24, label: "24 hours (1 day)" },
  { value: 48, label: "48 hours (2 days)" },
  { value: 72, label: "72 hours (3 days)" },
  { value: 96, label: "96 hours (4 days)" },
  { value: 120, label: "120 hours (5 days)" },
];

export const TIER_PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  google: "Google",
};

export const TIER_PLATFORM_EMOJIS: Record<string, string> = {
  instagram: "📸",
  tiktok: "🎬",
  facebook: "📘",
  google: "⭐",
};

export async function getBusinessBySlug(slug: string): Promise<BusinessData | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*, reward_tiers(*)")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeTiers = ((data as any).reward_tiers || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((t: any) => t.is_active)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((t: any) => ({
      id: t.id,
      tier_name: t.tier_name,
      platform: t.platform,
      content_type: t.content_type,
      reward_description: t.reward_description,
      reward_value: t.reward_value,
      verification_hours: t.verification_hours,
      sort_order: t.sort_order,
    }));

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
    termsConditions: data.terms_conditions || null,
    status: data.status || "active",
    rewardTiers: activeTiers,
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
  customerPhone: string;
  rewardTierId?: string | null;
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
        customer_phone: params.customerPhone,
        reward_tier_id: params.rewardTierId || null,
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
