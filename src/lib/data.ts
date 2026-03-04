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

export async function checkRewardLimit(params: {
  businessId: string;
  customerEmail: string;
  maxRewards: number | null;
}): Promise<{ allowed: boolean; count: number; limit: number | null }> {
  // Unlimited rewards
  if (params.maxRewards === null) {
    return { allowed: true, count: 0, limit: null };
  }

  try {
    const { count, error } = await supabase
      .from("rewards_sent")
      .select("*", { count: "exact", head: true })
      .eq("business_id", params.businessId)
      .eq("customer_email", params.customerEmail.toLowerCase().trim());

    if (error) {
      // Fail open: if the DB query fails, allow the submission
      console.error("Reward limit check failed:", error);
      return { allowed: true, count: 0, limit: params.maxRewards };
    }

    const currentCount = count ?? 0;
    return {
      allowed: currentCount < params.maxRewards,
      count: currentCount,
      limit: params.maxRewards,
    };
  } catch (err) {
    // Fail open on any exception
    console.error("Reward limit check exception:", err);
    return { allowed: true, count: 0, limit: params.maxRewards };
  }
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
