import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const VALID_PLATFORMS = ["instagram", "tiktok", "facebook", "google"];

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const { data: tiers, error } = await supabase
    .from("reward_tiers")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch tiers" },
      { status: 500 }
    );
  }

  return NextResponse.json({ tiers: tiers || [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const body = await request.json();
  const {
    tier_name,
    platform,
    content_type,
    reward_description,
    reward_value,
    verification_hours,
  } = body;

  // Validation
  if (!tier_name || !platform || !content_type || !reward_description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!VALID_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  const hours = verification_hours ?? 72;
  if (hours < 24 || hours > 120) {
    return NextResponse.json(
      { error: "Verification hours must be between 24 and 120" },
      { status: 400 }
    );
  }

  // Get max sort_order for this business
  const { data: existingTiers } = await supabase
    .from("reward_tiers")
    .select("sort_order")
    .eq("business_id", business.id)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder =
    existingTiers && existingTiers.length > 0
      ? existingTiers[0].sort_order + 1
      : 0;

  const { data: newTier, error } = await supabase
    .from("reward_tiers")
    .insert({
      business_id: business.id,
      tier_name,
      platform,
      content_type,
      reward_description,
      reward_value: reward_value || null,
      verification_hours: hours,
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("[reward-tiers] Create error:", error);
    return NextResponse.json(
      { error: "Failed to create tier" },
      { status: 500 }
    );
  }

  return NextResponse.json({ tier: newTier });
}
