import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendEmail } from "@/lib/resend";
import {
  DEFAULT_EMAIL_TEMPLATES,
  DEFAULT_EMAIL_SUBJECTS,
  renderEmailTemplate,
  renderEmailSubject,
} from "@/lib/email";
import { renderConfirmationEmail } from "@/emails/render";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    customer_email,
    reward_tier_id,
  } = body;

  if (!business_id || !post_url || !customer_name || !customer_email) {
    return NextResponse.json(
      { error: "All fields are required.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const normalizedEmail = String(customer_email).trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Reject non-http(s) post links (e.g. javascript:) — post_url is rendered
  // as a clickable <a href> in the owner dashboard, so a javascript: URL would
  // execute in the authenticated owner session (stored XSS).
  let parsedPostUrl: URL;
  try {
    parsedPostUrl = new URL(String(post_url).trim());
  } catch {
    return NextResponse.json(
      { error: "Please enter a valid post link.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }
  if (parsedPostUrl.protocol !== "http:" && parsedPostUrl.protocol !== "https:") {
    return NextResponse.json(
      { error: "Post link must start with http:// or https://.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const { data: business } = await supabase
    .from("public_businesses")
    .select("id, status, name")
    .eq("id", business_id)
    .single();

  if (!business || business.status === "suspended") {
    return NextResponse.json(
      { error: "This business is not currently accepting submissions.", code: "BUSINESS_SUSPENDED" },
      { status: 403 }
    );
  }

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

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + tier.verification_hours);
    verificationDeadline = deadline.toISOString();
    verificationStatus = "pending";
  }

  // Insert the submission — the database handles enforcement:
  //   - Unique index on (business_id, post_url) blocks duplicate links
  //   - BEFORE INSERT trigger checks per-customer submission limit (by email)
  const { error } = await supabase.from("submissions").insert({
    business_id,
    post_url: post_url.trim(),
    detected_platform: detected_platform || null,
    customer_name: customer_name.trim(),
    customer_email: normalizedEmail,
    reward_tier_id: reward_tier_id || null,
    verification_deadline: verificationDeadline,
    verification_status: verificationStatus,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This link has already been submitted.", code: "DUPLICATE_LINK" },
        { status: 409 }
      );
    }

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

  // Fire-and-forget confirmation email
  try {
    const admin = getSupabaseAdmin();
    const { data: emailSettings } = await admin
      .from("businesses")
      .select(
        "email_confirmation_template, email_confirmation_enabled, email_confirmation_subject"
      )
      .eq("id", business_id)
      .single();

    if (emailSettings?.email_confirmation_enabled !== false) {
      const template =
        emailSettings?.email_confirmation_template ||
        DEFAULT_EMAIL_TEMPLATES.confirmation;
      const subjectTemplate =
        emailSettings?.email_confirmation_subject ||
        DEFAULT_EMAIL_SUBJECTS.confirmation;

      const renderedBody = renderEmailTemplate(template, {
        businessName: business.name,
        customerName: customer_name.trim(),
      });
      const subject = renderEmailSubject(subjectTemplate, {
        businessName: business.name,
        customerName: customer_name.trim(),
      });

      const { html, text } = await renderConfirmationEmail({
        businessName: business.name,
        body: renderedBody,
      });

      const result = await sendEmail({
        to: normalizedEmail,
        subject,
        html,
        text,
        fromName: business.name,
      });

      await admin.from("email_log").insert({
        business_id,
        customer_email: normalizedEmail,
        message_type: "confirmation",
        subject,
        message_body: renderedBody,
        resend_id: result.emailId || null,
        status: result.success ? "sent" : "failed",
      });
    }
  } catch (emailErr) {
    console.error("[submissions/create] Confirmation email failed:", emailErr);
  }

  return NextResponse.json({ success: true });
}
