import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface BusinessEmailFields {
  name: string;
  email_subject: string | null;
  email_header: string | null;
  email_body: string | null;
  email_footer: string | null;
  email_brand_color: string | null;
  brand_color: string | null;
  logo_url: string | null;
  reward_file_url: string | null;
  reward_file_name: string | null;
}

function buildApprovedEmail(
  customerName: string,
  business: BusinessEmailFields,
  reward: string | null,
  personalNote: string | null
): string {
  const brandColor =
    business.email_brand_color || business.brand_color || "#2563EB";
  const headerText = escapeHtml(
    business.email_header || "Thank you for your post!"
  );
  const bodyText = escapeHtml(
    business.email_body ||
      `Thank you for posting about ${business.name}! Your submission has been reviewed and approved.`
  );
  const footerText = escapeHtml(
    business.email_footer ||
      `Thanks for being a valued customer of ${business.name}`
  );
  const safeName = escapeHtml(customerName);
  const safeBusinessName = escapeHtml(business.name);
  const safeReward = reward ? escapeHtml(reward) : null;
  const safeNote = personalNote ? escapeHtml(personalNote) : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
    <!-- Header -->
    <div style="background:${brandColor};padding:32px 32px 28px;">
      ${
        business.logo_url
          ? `<img src="${business.logo_url}" alt="${safeBusinessName}" style="width:48px;height:48px;border-radius:12px;margin-bottom:12px;object-fit:cover;" />`
          : ""
      }
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">${headerText}</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Your post has been approved</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="margin:0 0 16px;color:#111827;font-size:15px;line-height:1.6;">
        Hi ${safeName},
      </p>
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
        ${bodyText}
      </p>

      ${
        safeReward
          ? `
      <!-- Reward box -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="margin:0 0 4px;color:#15803d;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Your Reward</p>
        <p style="margin:0;color:#166534;font-size:17px;font-weight:600;">${safeReward}</p>
      </div>
      `
          : ""
      }

      ${
        safeNote
          ? `
      <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:13px;font-weight:500;">Personal note from ${safeBusinessName}</p>
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;font-style:italic;">&ldquo;${safeNote}&rdquo;</p>
      </div>
      `
          : ""
      }

      ${
        business.reward_file_url && business.reward_file_name
          ? `
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:14px 16px;margin:0 0 20px;">
        <p style="margin:0;color:#1e40af;font-size:14px;">&#128206; Reward file attached: ${escapeHtml(business.reward_file_name)}</p>
      </div>
      `
          : ""
      }

      <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
        We appreciate you creating amazing content. Keep it up!
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #f3f4f6;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#6b7280;font-size:13px;">${footerText}</p>
      <p style="margin:8px 0 0;color:#9ca3af;font-size:12px;">Sent via Astrevix</p>
    </div>
  </div>
</body>
</html>`.trim();
}

function buildRejectedEmail(
  customerName: string,
  businessName: string,
  personalNote: string | null
): string {
  const safeName = escapeHtml(customerName);
  const safeBusinessName = escapeHtml(businessName);
  const safeNote = personalNote ? escapeHtml(personalNote) : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
    <!-- Header -->
    <div style="background:#374151;padding:32px 32px 28px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">Update on your submission</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:15px;">From ${safeBusinessName}</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="margin:0 0 16px;color:#111827;font-size:15px;line-height:1.6;">
        Hi ${safeName},
      </p>
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
        Thank you for submitting content to <strong>${safeBusinessName}</strong>. Unfortunately, your post didn&rsquo;t meet the requirements this time.
      </p>

      ${
        safeNote
          ? `
      <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:13px;font-weight:500;">Message from ${safeBusinessName}</p>
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;font-style:italic;">&ldquo;${safeNote}&rdquo;</p>
      </div>
      `
          : ""
      }

      <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
        Don&rsquo;t worry &mdash; we&rsquo;d love to see you try again! Check the requirements and submit a new post anytime.
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #f3f4f6;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">Sent via Astrevix</p>
    </div>
  </div>
</body>
</html>`.trim();
}

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

  // Fetch full business record (for email template fields)
  const { data: business } = await supabase
    .from("businesses")
    .select(
      "name, brand_color, logo_url, email_subject, email_header, email_body, email_footer, email_brand_color, reward_file_url, reward_file_name"
    )
    .eq("id", submission.business_id)
    .single();

  const businessName = business?.name || "the business";
  const reward = reward_given || null;
  const personalNote = review_comment || null;

  // Check if reward was already sent for this submission (idempotency)
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

  // Build subject and HTML from template or defaults
  const subject =
    status === "approved"
      ? business?.email_subject ||
        "Great news! Your post has been approved \uD83C\uDF89"
      : "Update on your submission";

  const html =
    status === "approved"
      ? buildApprovedEmail(
          submission.customer_name,
          business as BusinessEmailFields,
          reward,
          personalNote
        )
      : buildRejectedEmail(
          submission.customer_name,
          businessName,
          personalNote
        );

  try {
    // Build attachments array for Resend
    const attachments: Array<{ filename: string; path: string }> = [];

    if (
      status === "approved" &&
      business?.reward_file_url &&
      business?.reward_file_name
    ) {
      attachments.push({
        filename: business.reward_file_name,
        path: business.reward_file_url,
      });
    }

    const { error } = await resend.emails.send({
      from: "Astrevix <onboarding@resend.dev>",
      to: submission.customer_email,
      subject,
      html,
      ...(attachments.length > 0 && { attachments }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", detail: error.message },
        { status: 500 }
      );
    }

    // Log the reward in rewards_sent table for limit tracking
    if (status === "approved") {
      try {
        await supabase.from("rewards_sent").insert({
          business_id: submission.business_id,
          submission_id: id,
          customer_email: submission.customer_email.toLowerCase().trim(),
          reward_type: reward,
        });
      } catch (logErr) {
        // Log but don't fail — email was already sent
        console.error("Failed to log reward_sent:", logErr);
      }
    }

    return NextResponse.json({ success: true, sent: true });
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
