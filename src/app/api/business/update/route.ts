import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const body = await request.json();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    name,
    tagline,
    logo_emoji,
    brand_color,
    reward_description,
    content_type,
    requirements,
  } = body;

  // Validate required fields
  if (!name || !reward_description) {
    return NextResponse.json(
      { error: "Business name and reward description are required." },
      { status: 400 }
    );
  }

  // Validate requirements array
  if (requirements && (!Array.isArray(requirements) || requirements.length > 6)) {
    return NextResponse.json(
      { error: "Requirements must be an array with at most 6 items." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      name,
      tagline: tagline || null,
      logo_emoji: logo_emoji || null,
      brand_color: brand_color || null,
      reward_description,
      content_type: content_type || null,
      requirements: requirements && requirements.length > 0 ? requirements : null,
      updated_at: new Date().toISOString(),
    })
    .eq("owner_id", user.id);

  if (error) {
    console.error("Business update error:", error);
    return NextResponse.json(
      { error: "Failed to update business settings." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
