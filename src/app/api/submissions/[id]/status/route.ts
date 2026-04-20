import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateUniqueCouponCode } from "@/lib/coupon";
import { sendEmail } from "@/lib/resend";
import {
  DEFAULT_EMAIL_TEMPLATES,
  DEFAULT_EMAIL_SUBJECTS,
  renderEmailTemplate,
  renderEmailSubject,
} from "@/lib/email";
import {
  renderApprovalEmail,
  renderRejectionEmail,
} from "@/emails/render";

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

    const { data: business } = await supabase
      .from("businesses")
      .select(
        "name, email_approval_template, email_approval_enabled, email_approval_subject, email_rejection_template, email_rejection_enabled, email_rejection_subject, default_coupon_expiry_days"
      )
      .eq("id", submission.business_id)
      .single();

    const businessName = business?.name || "the business";

    if (status === "approved") {
      const { data: existingReward } = await supabase
        .from("rewards_sent")
        .select("id")
        .eq("submission_id", id)
        .maybeSingle();

      if (!existingReward) {
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

        const enabled = business?.email_approval_enabled !== false;
        if (enabled) {
          try {
            const template =
              business?.email_approval_template ||
              DEFAULT_EMAIL_TEMPLATES.approval;
            const subjectTemplate =
              business?.email_approval_subject ||
              DEFAULT_EMAIL_SUBJECTS.approval;

            const body = renderEmailTemplate(template, {
              businessName,
              customerName: submission.customer_name,
              rewardDetails: rewardDesc,
              personalNote: review_comment || undefined,
              couponCode: couponCode || undefined,
            });
            const subject = renderEmailSubject(subjectTemplate, {
              businessName,
              customerName: submission.customer_name,
            });

            const { html, text } = await renderApprovalEmail({
              businessName,
              body,
              couponCode,
              rewardLink: null,
            });

            const result = await sendEmail({
              to: submission.customer_email,
              subject,
              html,
              text,
              fromName: businessName,
            });

            try {
              await supabase.from("email_log").insert({
                business_id: submission.business_id,
                submission_id: id,
                customer_email: submission.customer_email,
                message_type: "approval",
                subject,
                message_body: body,
                resend_id: result.emailId || null,
                status: result.success ? "sent" : "failed",
              });
            } catch (logErr) {
              console.error("Failed to log email:", logErr);
            }

            if (result.success && couponCode) {
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
          }
        }
      }
    } else if (status === "rejected") {
      const rejectionEnabled = business?.email_rejection_enabled === true;
      if (rejectionEnabled) {
        try {
          const template =
            business?.email_rejection_template ||
            DEFAULT_EMAIL_TEMPLATES.rejection;
          const subjectTemplate =
            business?.email_rejection_subject ||
            DEFAULT_EMAIL_SUBJECTS.rejection;

          const body = renderEmailTemplate(template, {
            businessName,
            customerName: submission.customer_name,
            personalNote: review_comment || undefined,
          });
          const subject = renderEmailSubject(subjectTemplate, {
            businessName,
            customerName: submission.customer_name,
          });

          const { html, text } = await renderRejectionEmail({
            businessName,
            body,
          });

          const result = await sendEmail({
            to: submission.customer_email,
            subject,
            html,
            text,
            fromName: businessName,
          });

          try {
            await supabase.from("email_log").insert({
              business_id: submission.business_id,
              submission_id: id,
              customer_email: submission.customer_email,
              message_type: "rejection",
              subject,
              message_body: body,
              resend_id: result.emailId || null,
              status: result.success ? "sent" : "failed",
            });
          } catch (logErr) {
            console.error("Failed to log rejection email:", logErr);
          }
        } catch (emailErr) {
          console.error("Rejection email failed:", emailErr);
        }
      }
    }
  } catch (postErr) {
    console.error("Post-approval task error:", postErr);
  }

  return NextResponse.json({ success: true });
}
