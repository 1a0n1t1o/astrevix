import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { parsePhoneToE164 } from "@/lib/phone-utils";
import { sendSms, renderSmsTemplate, DEFAULT_SMS_TEMPLATES } from "@/lib/twilio";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    business_id,
    post_url,
    detected_platform,
    customer_name,
    customer_phone,
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
    .select("id, status, name, sms_confirmation_template, sms_confirmation_enabled")
    .eq("id", business_id)
    .single();

  if (!business || business.status === "suspended") {
    return NextResponse.json(
      { error: "This business is not currently accepting submissions.", code: "BUSINESS_SUSPENDED" },
      { status: 403 }
    );
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
  if (business.sms_confirmation_enabled !== false) {
    try {
      const template =
        business.sms_confirmation_template ||
        DEFAULT_SMS_TEMPLATES.confirmation;
      const rendered = renderSmsTemplate(template, {
        businessName: business.name,
        customerName: customer_name.trim(),
      });

      const result = await sendSms(normalizedPhone, rendered);

      // Log to sms_log using admin client
      await getSupabaseAdmin().from("sms_log").insert({
        business_id,
        customer_phone: normalizedPhone,
        message_type: "confirmation",
        message_body: rendered,
        twilio_sid: result.sid,
        status: result.status,
      });
    } catch (smsErr) {
      // Don't block submission if SMS fails
      console.error("[submissions/create] Confirmation SMS failed:", smsErr);
    }
  }

  return NextResponse.json({ success: true });
}
