import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateUniqueCouponCode } from "@/lib/coupon";
import {
  sendSms,
  renderSmsTemplate,
  DEFAULT_SMS_TEMPLATES,
} from "@/lib/twilio";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, reward_given, review_comment } = await request.json();

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'approved' or 'rejected'." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS ensures only the business owner can update their submissions
  const { error } = await supabase
    .from("submissions")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reward_given: reward_given || null,
      review_comment: review_comment || null,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }

  // -----------------------------------------------------------------------
  // Post-approval / rejection: coupon creation + SMS
  // All inline so we have the authenticated Supabase client (RLS works).
  // Previously this was a fire-and-forget fetch to /notify which silently
  // failed because cookies were not forwarded.
  // -----------------------------------------------------------------------
  try {
    const { data: submission } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (!submission?.customer_phone) {
      return NextResponse.json({ success: true });
    }

    // Fetch business settings
    const { data: business } = await supabase
      .from("businesses")
      .select(
        "name, sms_approval_template, sms_approval_enabled, sms_rejection_template, sms_rejection_enabled, default_coupon_expiry_days"
      )
      .eq("id", submission.business_id)
      .single();

    const businessName = business?.name || "the business";

    if (status === "approved") {
      // Idempotency: skip if reward already logged for this submission
      const { data: existingReward } = await supabase
        .from("rewards_sent")
        .select("id")
        .eq("submission_id", id)
        .maybeSingle();

      if (!existingReward) {
        // --- Determine reward description ---
        let rewardDesc = reward_given || "Reward";
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

        // --- Create coupon code ---
        let couponCode: string | null = null;
        try {
          couponCode = await generateUniqueCouponCode(supabase);

          const expiryDays = business?.default_coupon_expiry_days ?? 30;
          let expiresAt: string | null = null;
          if (expiryDays > 0) {
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + expiryDays);
            expiresAt = expiry.toISOString();
          }

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
          console.error("Failed to create coupon:", couponErr);
          couponCode = null;
        }

        // --- Log to rewards_sent ---
        try {
          await supabase.from("rewards_sent").insert({
            business_id: submission.business_id,
            submission_id: id,
            customer_phone: submission.customer_phone,
            reward_type: reward_given || null,
          });
        } catch (logErr) {
          console.error("Failed to log reward_sent:", logErr);
        }

        // --- Send approval SMS ---
        const smsEnabled = business?.sms_approval_enabled !== false;
        if (smsEnabled) {
          try {
            const template =
              business?.sms_approval_template ||
              DEFAULT_SMS_TEMPLATES.approval;
            const rendered = renderSmsTemplate(template, {
              businessName,
              customerName: submission.customer_name,
              rewardDetails: reward_given || undefined,
              personalNote: review_comment || undefined,
              couponCode: couponCode || undefined,
            });

            const result = await sendSms(
              submission.customer_phone,
              rendered
            );

            // Log to sms_log
            try {
              await supabase.from("sms_log").insert({
                business_id: submission.business_id,
                submission_id: id,
                customer_phone: submission.customer_phone,
                message_type: "approval",
                message_body: rendered,
                twilio_sid: result.sid,
                status: result.status,
              });
            } catch (smsLogErr) {
              console.error("Failed to log SMS:", smsLogErr);
            }

            // Mark coupon as SMS sent
            if (couponCode) {
              try {
                await supabase
                  .from("coupon_codes")
                  .update({
                    sms_sent: true,
                    sms_sent_at: new Date().toISOString(),
                  })
                  .eq("submission_id", id);
              } catch (couponUpdateErr) {
                console.error(
                  "Failed to update coupon sms_sent:",
                  couponUpdateErr
                );
              }
            }
          } catch (smsErr) {
            console.error("Approval SMS failed:", smsErr);
            // Log failed attempt
            try {
              await supabase.from("sms_log").insert({
                business_id: submission.business_id,
                submission_id: id,
                customer_phone: submission.customer_phone,
                message_type: "approval",
                message_body: "SMS send failed",
                status: "failed",
              });
            } catch {
              /* ignore logging failure */
            }
          }
        }
      }
    } else if (status === "rejected") {
      // --- Send rejection SMS if enabled ---
      const rejectionEnabled = business?.sms_rejection_enabled === true;
      if (rejectionEnabled) {
        try {
          const template =
            business?.sms_rejection_template ||
            DEFAULT_SMS_TEMPLATES.rejection;
          const rendered = renderSmsTemplate(template, {
            businessName,
            customerName: submission.customer_name,
            personalNote: review_comment || undefined,
          });

          const result = await sendSms(submission.customer_phone, rendered);

          try {
            await supabase.from("sms_log").insert({
              business_id: submission.business_id,
              submission_id: id,
              customer_phone: submission.customer_phone,
              message_type: "rejection",
              message_body: rendered,
              twilio_sid: result.sid,
              status: result.status,
            });
          } catch (smsLogErr) {
            console.error("Failed to log rejection SMS:", smsLogErr);
          }
        } catch (smsErr) {
          console.error("Rejection SMS failed:", smsErr);
          try {
            await supabase.from("sms_log").insert({
              business_id: submission.business_id,
              submission_id: id,
              customer_phone: submission.customer_phone,
              message_type: "rejection",
              message_body: "SMS send failed",
              status: "failed",
            });
          } catch {
            /* ignore logging failure */
          }
        }
      }
    }
  } catch (postErr) {
    // Post-approval tasks are best-effort; submission status is already saved
    console.error("Post-approval task error:", postErr);
  }

  return NextResponse.json({ success: true });
}
