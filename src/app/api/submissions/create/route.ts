import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { parsePhoneToE164 } from "@/lib/phone-utils";
import { sendSms, renderSmsTemplate, DEFAULT_SMS_TEMPLATES } from "@/lib/twilio";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Rate limiting: 5 submissions per IP per minute
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = rateLimit(`submission:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later.", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  const body = await request.json();

  const {
    business_id,
    post_url,
    detected_platform,
    customer_name,
    customer_phone,
    reward_tier_id,
  } = body;

  // Basic validation
  if (!business_id || !post_url || !customer_name || !customer_phone) {
    return NextResponse.json(
      { error: "All fields are required.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Normalize phone to E.164
  const normalizedPhone = parsePhoneToE164(customer_phone);
  if (!normalizedPhone) {
    return NextResponse.json(
      { error: "Please enter a valid US phone number.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Check if business is suspended
  const { data: business } = await supabase
    .from("businesses")
    .select("id, status, name")
    .eq("id", business_id)
    .single();

  if (!business || business.status === "suspended") {
    return NextResponse.json(
      { error: "This business is not currently accepting submissions.", code: "BUSINESS_SUSPENDED" },
      { status: 403 }
    );
  }

  // If a reward tier is specified, look it up to get verification_hours
  let verificationDeadline: string | null = null;
  let verificationStatus: string | null = null;

  if (reward_tier_id) {
    const { data: tier } = await supabase
      .from("reward_tiers")
      .select("id, verification_hours, is_active, reward_description")
      .eq("id", reward_tier_id)
      .eq("business_id", business_id)
      .single();

    if (!tier || !tier.is_active) {
      return NextResponse.json(
        { error: "Selected reward tier is not available.", code: "INVALID_TIER" },
        { status: 400 }
      );
    }

    // Calculate verification deadline: now + verification_hours
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + tier.verification_hours);
    verificationDeadline = deadline.toISOString();
    verificationStatus = "pending";
  }

  // Insert the submission — the database handles enforcement:
  //   - Unique index on (business_id, post_url) blocks duplicate links
  //   - BEFORE INSERT trigger checks per-customer submission limit (by phone)
  const { error } = await supabase.from("submissions").insert({
    business_id,
    post_url: post_url.trim(),
    detected_platform: detected_platform || null,
    customer_name: customer_name.trim(),
    customer_phone: normalizedPhone,
    reward_tier_id: reward_tier_id || null,
    verification_deadline: verificationDeadline,
    verification_status: verificationStatus,
  });

  if (error) {
    // Unique constraint violation — duplicate link
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This link has already been submitted.", code: "DUPLICATE_LINK" },
        { status: 409 }
      );
    }

    // Trigger raised LIMIT_REACHED exception
    if (error.message?.includes("LIMIT_REACHED:")) {
      const businessName = error.message.split("LIMIT_REACHED:")[1] || "this business";
      return NextResponse.json(
        {
          error: `You've already submitted content for ${businessName}. Thank you for your support!`,
          code: "LIMIT_REACHED",
        },
        { status: 429 }
      );
    }

    console.error("[submissions/create] Insert error:", error);
    return NextResponse.json(
      { error: "Failed to create submission.", code: "INSERT_ERROR" },
      { status: 500 }
    );
  }

  // Fire-and-forget confirmation SMS
  try {
    const admin = getSupabaseAdmin();
    const { data: smsSettings } = await admin
      .from("businesses")
      .select("sms_confirmation_template, sms_confirmation_enabled")
      .eq("id", business_id)
      .single();

    if (smsSettings?.sms_confirmation_enabled !== false) {
      const template =
        smsSettings?.sms_confirmation_template ||
        DEFAULT_SMS_TEMPLATES.confirmation;
      const rendered = renderSmsTemplate(template, {
        businessName: business.name,
        customerName: customer_name.trim(),
      });

      const result = await sendSms(normalizedPhone, rendered);

      await admin.from("sms_log").insert({
        business_id,
        customer_phone: normalizedPhone,
        message_type: "confirmation",
        message_body: rendered,
        twilio_sid: result.sid,
        status: result.status,
      });
    }
  } catch (smsErr) {
    // Don't block submission if SMS fails
    console.error("[submissions/create] Confirmation SMS failed:", smsErr);
  }

  return NextResponse.json({ success: true });
}
