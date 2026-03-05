import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendSms, renderSmsTemplate, DEFAULT_SMS_TEMPLATES } from "@/lib/twilio";

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
      "name, sms_approval_template, sms_approval_enabled, sms_rejection_template, sms_rejection_enabled"
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

    return NextResponse.json({ success: true, sent: true });
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
