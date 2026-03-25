import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import {
  sendRewardEmail,
  renderEmailTemplate,
  buildEmailHtml,
  DEFAULT_EMAIL_TEMPLATES,
} from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json();
  const { to, messageType, businessId, customerName, rewardDetails, rewardLink, couponCode, personalNote } = body;

  if (!to || !messageType || !businessId) {
    return NextResponse.json(
      { error: "Missing required fields: to, messageType, businessId" },
      { status: 400 }
    );
  }

  if (!["confirmation", "approval", "rejection"].includes(messageType)) {
    return NextResponse.json(
      { error: "Invalid messageType" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();

  // Fetch business email settings
  const { data: business } = await admin
    .from("businesses")
    .select(
      "name, brand_color, logo_url, email_subject_confirmation, email_body_confirmation, email_confirmation_enabled, email_subject_approval, email_body_approval, email_approval_enabled, email_subject_rejection, email_body_rejection, email_rejection_enabled, email_reward_link, email_reward_file_url, email_reward_file_name, email_brand_color"
    )
    .eq("id", businessId)
    .single();

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // Check if this message type is enabled
  const enabledKey = `email_${messageType}_enabled` as keyof typeof business;
  const isEnabled = business[enabledKey] !== false;

  if (!isEnabled) {
    return NextResponse.json({ skipped: true, reason: "Template disabled" });
  }

  // Get subject and body templates
  const subjectKey = `email_subject_${messageType}` as keyof typeof business;
  const bodyKey = `email_body_${messageType}` as keyof typeof business;
  const defaults = DEFAULT_EMAIL_TEMPLATES[messageType as keyof typeof DEFAULT_EMAIL_TEMPLATES];

  const subjectTemplate = (business[subjectKey] as string) || defaults.subject;
  const bodyTemplate = (business[bodyKey] as string) || defaults.body;

  const brandColor = business.email_brand_color || business.brand_color || "#E8553A";

  // Render templates with variables
  const variables = {
    businessName: business.name,
    customerName: customerName || "Customer",
    rewardDetails: rewardDetails || undefined,
    rewardLink: rewardLink || (business.email_reward_link as string) || undefined,
    personalNote: personalNote || undefined,
    couponCode: couponCode || undefined,
  };

  const renderedSubject = renderEmailTemplate(subjectTemplate, variables);
  const renderedBody = renderEmailTemplate(bodyTemplate, variables);
  const html = buildEmailHtml(renderedBody, brandColor, business.name, business.logo_url);

  // Handle attachment for approval emails
  let attachment: { filename: string; content: Buffer } | undefined;
  if (messageType === "approval" && business.email_reward_file_url) {
    try {
      const fileRes = await fetch(business.email_reward_file_url as string);
      if (fileRes.ok) {
        const buffer = Buffer.from(await fileRes.arrayBuffer());
        attachment = {
          filename: (business.email_reward_file_name as string) || "reward.pdf",
          content: buffer,
        };
      }
    } catch (fileErr) {
      console.error("[email/send] Failed to fetch reward file:", fileErr);
    }
  }

  // Send the email
  try {
    await sendRewardEmail(to, renderedSubject, html, attachment);

    // Log to email_log
    try {
      await admin.from("email_log").insert({
        business_id: businessId,
        customer_email: to,
        message_type: messageType,
        subject: renderedSubject,
        status: "sent",
      });
    } catch (logErr) {
      console.error("[email/send] Failed to log email:", logErr);
    }

    return NextResponse.json({ success: true });
  } catch (sendErr) {
    console.error("[email/send] Failed to send email:", sendErr);

    // Log failure
    try {
      await admin.from("email_log").insert({
        business_id: businessId,
        customer_email: to,
        message_type: messageType,
        subject: renderedSubject,
        status: "failed",
      });
    } catch {
      /* ignore logging failure */
    }

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
