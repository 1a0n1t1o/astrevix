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
    logo_url,
    brand_color,
    reward_description,
    content_type,
    requirements,
    max_rewards_per_customer,
    email_subject,
    email_header,
    email_body,
    email_footer,
    email_brand_color,
    reward_file_url,
    reward_file_name,
    terms_conditions,
    sms_confirmation_template,
    sms_confirmation_enabled,
    sms_approval_template,
    sms_approval_enabled,
    sms_rejection_template,
    sms_rejection_enabled,
    default_coupon_expiry_days,
    auto_approve_requested,
    storefront_dark_mode,
  } = body;

  // Validate required fields only when they are provided (full save from customize page)
  if (name !== undefined && !name) {
    return NextResponse.json(
      { error: "Business name is required." },
      { status: 400 }
    );
  }
  if (reward_description !== undefined && !reward_description) {
    return NextResponse.json(
      { error: "Reward description is required." },
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

  // Validate max_rewards_per_customer
  if (max_rewards_per_customer !== undefined && max_rewards_per_customer !== null) {
    if (typeof max_rewards_per_customer !== "number" || max_rewards_per_customer < 1) {
      return NextResponse.json(
        { error: "Rewards per customer must be at least 1." },
        { status: 400 }
      );
    }
  }

  // Build update object with only the fields that were provided
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (name !== undefined) updateData.name = name;
  if (tagline !== undefined) updateData.tagline = tagline || null;
  if (logo_url !== undefined) updateData.logo_url = logo_url || null;
  if (brand_color !== undefined) updateData.brand_color = brand_color || null;
  if (reward_description !== undefined) updateData.reward_description = reward_description;
  if (content_type !== undefined) updateData.content_type = content_type || null;
  if (requirements !== undefined) updateData.requirements = requirements && requirements.length > 0 ? requirements : null;
  if (max_rewards_per_customer !== undefined) updateData.max_rewards_per_customer = max_rewards_per_customer;
  if (email_subject !== undefined) updateData.email_subject = email_subject || null;
  if (email_header !== undefined) updateData.email_header = email_header || null;
  if (email_body !== undefined) updateData.email_body = email_body || null;
  if (email_footer !== undefined) updateData.email_footer = email_footer || null;
  if (email_brand_color !== undefined) updateData.email_brand_color = email_brand_color || null;
  if (reward_file_url !== undefined) updateData.reward_file_url = reward_file_url || null;
  if (reward_file_name !== undefined) updateData.reward_file_name = reward_file_name || null;
  if (terms_conditions !== undefined) updateData.terms_conditions = terms_conditions || null;
  if (sms_confirmation_template !== undefined) updateData.sms_confirmation_template = sms_confirmation_template || null;
  if (sms_confirmation_enabled !== undefined) updateData.sms_confirmation_enabled = sms_confirmation_enabled;
  if (sms_approval_template !== undefined) updateData.sms_approval_template = sms_approval_template || null;
  if (sms_approval_enabled !== undefined) updateData.sms_approval_enabled = sms_approval_enabled;
  if (sms_rejection_template !== undefined) updateData.sms_rejection_template = sms_rejection_template || null;
  if (sms_rejection_enabled !== undefined) updateData.sms_rejection_enabled = sms_rejection_enabled;
  if (default_coupon_expiry_days !== undefined) updateData.default_coupon_expiry_days = default_coupon_expiry_days;
  if (auto_approve_requested !== undefined) updateData.auto_approve_requested = auto_approve_requested;
  if (storefront_dark_mode !== undefined) updateData.storefront_dark_mode = !!storefront_dark_mode;

  const { error } = await supabase
    .from("businesses")
    .update(updateData)
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
