import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildApprovedEmail(customerName: string, businessName: string, reward: string | null, comment: string | null): string {
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
    <div style="background:linear-gradient(135deg,#2563EB,#7C3AED);padding:32px 32px 28px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">Great news! 🎉</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Your post has been approved</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="margin:0 0 16px;color:#111827;font-size:15px;line-height:1.6;">
        Hi ${customerName},
      </p>
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
        Thank you for posting about <strong>${businessName}</strong>! Your submission has been reviewed and approved.
      </p>

      ${reward ? `
      <!-- Reward box -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:0 0 20px;">
        <p style="margin:0 0 4px;color:#15803d;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Your Reward</p>
        <p style="margin:0;color:#166534;font-size:17px;font-weight:600;">🎁 ${reward}</p>
      </div>
      ` : ""}

      ${comment ? `
      <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:13px;font-weight:500;">Message from ${businessName}</p>
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;font-style:italic;">"${comment}"</p>
      </div>
      ` : ""}

      <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
        We appreciate you creating amazing content. Keep it up!
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

function buildRejectedEmail(customerName: string, businessName: string, comment: string | null): string {
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
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:15px;">From ${businessName}</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="margin:0 0 16px;color:#111827;font-size:15px;line-height:1.6;">
        Hi ${customerName},
      </p>
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
        Thank you for submitting content to <strong>${businessName}</strong>. Unfortunately, your post didn't meet the requirements this time.
      </p>

      ${comment ? `
      <div style="background:#f9fafb;border-radius:12px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 4px;color:#6b7280;font-size:13px;font-weight:500;">Message from ${businessName}</p>
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;font-style:italic;">"${comment}"</p>
      </div>
      ` : ""}

      <p style="margin:0;color:#374151;font-size:15px;line-height:1.6;">
        Don't worry — we'd love to see you try again! Check the requirements and submit a new post anytime.
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
  const { status, reward_given } = await request.json();

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

  // Fetch business details
  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("id", submission.business_id)
    .single();

  const businessName = business?.name || "the business";
  const reward = reward_given || null;
  const comment = submission.review_comment || null;

  const subject =
    status === "approved"
      ? "Great news! Your post has been approved 🎉"
      : "Update on your submission";

  const html =
    status === "approved"
      ? buildApprovedEmail(submission.customer_name, businessName, reward, comment)
      : buildRejectedEmail(submission.customer_name, businessName, comment);

  try {
    const { error } = await resend.emails.send({
      from: "Astrevix <onboarding@resend.dev>",
      to: submission.customer_email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", detail: error.message },
        { status: 500 }
      );
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
