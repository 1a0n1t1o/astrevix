import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateUniqueCouponCode } from "@/lib/coupon";
import {
  sendRewardEmail,
  renderEmailTemplate,
  buildEmailHtml,
  DEFAULT_EMAIL_TEMPLATES,
} from "@/lib/email";

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
  // Post-approval / rejection: coupon creation + email
  // -----------------------------------------------------------------------
  try {
    const { data: submission } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (!submission?.customer_email) {
      return NextResponse.json({ success: true });
    }

    // Fetch business settings
    const { data: business } = await supabase
      .from("businesses")
      .select(
        "name, brand_color, logo_url, email_subject_approval, email_body_approval, email_approval_enabled, email_subject_rejection, email_body_rejection, email_rejection_enabled, email_reward_link, email_reward_file_url, email_reward_file_name, email_brand_color, default_coupon_expiry_days"
      )
      .eq("id", submission.business_id)
      .single();

    const businessName = business?.name || "the business";
    const brandColor = business?.email_brand_color || business?.brand_color || "#E8553A";

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
            customer_email: submission.customer_email,
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
            customer_email: submission.customer_email,
            reward_type: reward_given || null,
          });
        } catch (logErr) {
          console.error("Failed to log reward_sent:", logErr);
        }

        // --- Send approval email ---
        const emailEnabled = business?.email_approval_enabled !== false;
        if (emailEnabled) {
          try {
            const subjectTemplate =
              business?.email_subject_approval ||
              DEFAULT_EMAIL_TEMPLATES.approval.subject;
            const bodyTemplate =
              business?.email_body_approval ||
              DEFAULT_EMAIL_TEMPLATES.approval.body;

            const variables = {
              businessName,
              customerName: submission.customer_name,
              rewardDetails: reward_given || rewardDesc || undefined,
              personalNote: review_comment || undefined,
              couponCode: couponCode || undefined,
              rewardLink: business?.email_reward_link || undefined,
            };

            const renderedSubject = renderEmailTemplate(subjectTemplate, variables);
            const renderedBody = renderEmailTemplate(bodyTemplate, variables);
            const html = buildEmailHtml(renderedBody, brandColor, businessName, business?.logo_url);

            // Handle attachment
            let attachment: { filename: string; content: Buffer } | undefined;
            if (business?.email_reward_file_url) {
              try {
                const fileRes = await fetch(business.email_reward_file_url);
                if (fileRes.ok) {
                  const buffer = Buffer.from(await fileRes.arrayBuffer());
                  attachment = {
                    filename: business.email_reward_file_name || "reward.pdf",
                    content: buffer,
                  };
                }
              } catch (fileErr) {
                console.error("Failed to fetch reward file:", fileErr);
              }
            }

            await sendRewardEmail(
              submission.customer_email,
              renderedSubject,
              html,
              attachment
            );

            // Log to email_log
            try {
              await supabase.from("email_log").insert({
                business_id: submission.business_id,
                submission_id: id,
                customer_email: submission.customer_email,
                message_type: "approval",
                subject: renderedSubject,
                status: "sent",
              });
            } catch (emailLogErr) {
              console.error("Failed to log email:", emailLogErr);
            }

            // Mark coupon as email sent
            if (couponCode) {
              try {
                await supabase
                  .from("coupon_codes")
                  .update({
                    email_sent: true,
                    email_sent_at: new Date().toISOString(),
                  })
                  .eq("submission_id", id);
              } catch (couponUpdateErr) {
                console.error(
                  "Failed to update coupon email_sent:",
                  couponUpdateErr
                );
              }
            }
          } catch (emailErr) {
            console.error("Approval email failed:", emailErr);
            // Log failed attempt
            try {
              await supabase.from("email_log").insert({
                business_id: submission.business_id,
                submission_id: id,
                customer_email: submission.customer_email,
                message_type: "approval",
                subject: "Email send failed",
                status: "failed",
              });
            } catch {
              /* ignore logging failure */
            }
          }
        }
      }
    } else if (status === "rejected") {
      // --- Send rejection email if enabled ---
      const rejectionEnabled = business?.email_rejection_enabled === true;
      if (rejectionEnabled) {
        try {
          const subjectTemplate =
            business?.email_subject_rejection ||
            DEFAULT_EMAIL_TEMPLATES.rejection.subject;
          const bodyTemplate =
            business?.email_body_rejection ||
            DEFAULT_EMAIL_TEMPLATES.rejection.body;

          const variables = {
            businessName,
            customerName: submission.customer_name,
            personalNote: review_comment || undefined,
          };

          const renderedSubject = renderEmailTemplate(subjectTemplate, variables);
          const renderedBody = renderEmailTemplate(bodyTemplate, variables);
          const html = buildEmailHtml(renderedBody, brandColor, businessName, business?.logo_url);

          await sendRewardEmail(submission.customer_email, renderedSubject, html);

          try {
            await supabase.from("email_log").insert({
              business_id: submission.business_id,
              submission_id: id,
              customer_email: submission.customer_email,
              message_type: "rejection",
              subject: renderedSubject,
              status: "sent",
            });
          } catch (emailLogErr) {
            console.error("Failed to log rejection email:", emailLogErr);
          }
        } catch (emailErr) {
          console.error("Rejection email failed:", emailErr);
          try {
            await supabase.from("email_log").insert({
              business_id: submission.business_id,
              submission_id: id,
              customer_email: submission.customer_email,
              message_type: "rejection",
              subject: "Email send failed",
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
