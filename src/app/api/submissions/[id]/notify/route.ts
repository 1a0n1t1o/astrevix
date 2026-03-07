import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendSms, renderSmsTemplate, DEFAULT_SMS_TEMPLATES } from "@/lib/twilio";
import { generateUniqueCouponCode } from "@/lib/coupon";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, reward_given, review_comment } = await request.json();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch submission details
  const { data: submission } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (!submission) {
    return NextResponse.json(
      { error: "Submission not found" },
      { status: 404 }
    );
  }

  if (!submission.customer_phone) {
    return NextResponse.json(
      { error: "No phone number on submission" },
      { status: 400 }
    );
  }

  // Fetch business record with SMS template fields
  const { data: business } = await supabase
    .from("businesses")
    .select(
      "name, sms_approval_template, sms_approval_enabled, sms_rejection_template, sms_rejection_enabled, default_coupon_expiry_days"
    )
    .eq("id", submission.business_id)
    .single();

  const businessName = business?.name || "the business";
  const reward = reward_given || null;
  const personalNote = review_comment || null;

  // Check if reward SMS was already sent for this submission (idempotency)
  if (status === "approved") {
    const { data: existingReward } = await supabase
      .from("rewards_sent")
      .select("id")
      .eq("submission_id", id)
      .maybeSingle();

    if (existingReward) {
      return NextResponse.json({
        success: true,
        sent: false,
        reason: "Reward already sent for this submission",
      });
    }
  }

  // Generate coupon code for approvals
  let couponCode: string | null = null;

  if (status === "approved") {
    try {
      // Determine reward description snapshot
      let rewardDesc = reward || "Reward";
      if (submission.reward_tier_id) {
        const { data: tier } = await supabase
          .from("reward_tiers")
          .select("reward_description")
          .eq("id", submission.reward_tier_id)
          .maybeSingle();
        if (tier?.reward_description) {
          rewardDesc = tier.reward_description;
        }
      }

      // Generate unique coupon code
      couponCode = await generateUniqueCouponCode(supabase);

      // Calculate expiry
      const expiryDays = business?.default_coupon_expiry_days ?? 30;
      let expiresAt: string | null = null;
      if (expiryDays > 0) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + expiryDays);
        expiresAt = expiry.toISOString();
      }

      // Insert coupon code record
      await supabase.from("coupon_codes").insert({
        business_id: submission.business_id,
        submission_id: id,
        reward_tier_id: submission.reward_tier_id || null,
        code: couponCode,
        customer_name: submission.customer_name,
        customer_phone: submission.customer_phone,
        reward_description: rewardDesc,
        expires_at: expiresAt,
      });
    } catch (couponErr) {
      console.error("Failed to generate coupon code:", couponErr);
      // Continue without coupon — SMS will still be sent, just without a code
      couponCode = null;
    }
  }

  // Determine template and enabled status
  let template: string;
  let enabled: boolean;
  const messageType = status === "approved" ? "approval" : "rejection";

  if (status === "approved") {
    enabled = business?.sms_approval_enabled !== false;
    template =
      business?.sms_approval_template || DEFAULT_SMS_TEMPLATES.approval;
  } else {
    enabled = business?.sms_rejection_enabled === true;
    template =
      business?.sms_rejection_template || DEFAULT_SMS_TEMPLATES.rejection;
  }

  // If this message type is disabled, skip sending but still log reward
  if (!enabled) {
    if (status === "approved") {
      try {
        await supabase.from("rewards_sent").insert({
          business_id: submission.business_id,
          submission_id: id,
          customer_phone: submission.customer_phone,
          reward_type: reward,
        });
      } catch (logErr) {
        console.error("Failed to log reward_sent:", logErr);
      }
    }
    return NextResponse.json({
      success: true,
      sent: false,
      reason: `${messageType} SMS is disabled for this business`,
    });
  }

  // Render template with variables
  const rendered = renderSmsTemplate(template, {
    businessName,
    customerName: submission.customer_name,
    rewardDetails: reward || undefined,
    personalNote: personalNote || undefined,
    couponCode: couponCode || undefined,
  });

  try {
    const result = await sendSms(submission.customer_phone, rendered);

    // Log to sms_log
    try {
      await supabase.from("sms_log").insert({
        business_id: submission.business_id,
        submission_id: id,
        customer_phone: submission.customer_phone,
        message_type: messageType,
        message_body: rendered,
        twilio_sid: result.sid,
        status: result.status,
      });
    } catch (logErr) {
      console.error("Failed to log SMS:", logErr);
    }

    // Log the reward in rewards_sent table for limit tracking
    if (status === "approved") {
      try {
        await supabase.from("rewards_sent").insert({
          business_id: submission.business_id,
          submission_id: id,
          customer_phone: submission.customer_phone,
          reward_type: reward,
        });
      } catch (logErr) {
        console.error("Failed to log reward_sent:", logErr);
      }
    }

    // Mark coupon as SMS sent
    if (couponCode) {
      try {
        await supabase
          .from("coupon_codes")
          .update({ sms_sent: true, sms_sent_at: new Date().toISOString() })
          .eq("submission_id", id);
      } catch (couponUpdateErr) {
        console.error("Failed to update coupon sms_sent:", couponUpdateErr);
      }
    }

    return NextResponse.json({ success: true, sent: true, couponCode });
  } catch (err) {
    console.error("SMS send failed:", err);

    // Log failed attempt
    try {
      await supabase.from("sms_log").insert({
        business_id: submission.business_id,
        submission_id: id,
        customer_phone: submission.customer_phone,
        message_type: messageType,
        message_body: rendered,
        status: "failed",
      });
    } catch {
      // ignore logging failure
    }

    return NextResponse.json(
      { error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}
