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
    email_confirmation_template,
    email_confirmation_enabled,
    email_confirmation_subject,
    email_approval_template,
    email_approval_enabled,
    email_approval_subject,
    email_rejection_template,
    email_rejection_enabled,
    email_rejection_subject,
    default_coupon_expiry_days,
    auto_approve_requested,
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

  // Validate max_rewards_per_customer
  if (max_rewards_per_customer !== undefined && max_rewards_per_customer !== null) {
    if (typeof max_rewards_per_customer !== "number" || max_rewards_per_customer < 1) {
      return NextResponse.json(
        { error: "Rewards per customer must be at least 1." },
        { status: 400 }
      );
    }
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      name,
      tagline: tagline || null,
      logo_url: logo_url || null,
      brand_color: brand_color || null,
      reward_description,
      content_type: content_type || null,
      requirements: requirements && requirements.length > 0 ? requirements : null,
      ...(max_rewards_per_customer !== undefined && { max_rewards_per_customer }),
      ...(email_subject !== undefined && { email_subject: email_subject || null }),
      ...(email_header !== undefined && { email_header: email_header || null }),
      ...(email_body !== undefined && { email_body: email_body || null }),
      ...(email_footer !== undefined && { email_footer: email_footer || null }),
      ...(email_brand_color !== undefined && { email_brand_color: email_brand_color || null }),
      ...(reward_file_url !== undefined && { reward_file_url: reward_file_url || null }),
      ...(reward_file_name !== undefined && { reward_file_name: reward_file_name || null }),
      ...(terms_conditions !== undefined && { terms_conditions: terms_conditions || null }),
      ...(email_confirmation_template !== undefined && { email_confirmation_template: email_confirmation_template || null }),
      ...(email_confirmation_enabled !== undefined && { email_confirmation_enabled }),
      ...(email_confirmation_subject !== undefined && { email_confirmation_subject: email_confirmation_subject || null }),
      ...(email_approval_template !== undefined && { email_approval_template: email_approval_template || null }),
      ...(email_approval_enabled !== undefined && { email_approval_enabled }),
      ...(email_approval_subject !== undefined && { email_approval_subject: email_approval_subject || null }),
      ...(email_rejection_template !== undefined && { email_rejection_template: email_rejection_template || null }),
      ...(email_rejection_enabled !== undefined && { email_rejection_enabled }),
      ...(email_rejection_subject !== undefined && { email_rejection_subject: email_rejection_subject || null }),
      ...(default_coupon_expiry_days !== undefined && { default_coupon_expiry_days }),
      ...(auto_approve_requested !== undefined && { auto_approve_requested }),
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
