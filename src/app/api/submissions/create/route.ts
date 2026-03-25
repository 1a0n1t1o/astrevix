import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  sendRewardEmail,
  renderEmailTemplate,
  buildEmailHtml,
  DEFAULT_EMAIL_TEMPLATES,
} from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

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

  // Basic validation
  if (!business_id || !post_url || !customer_name || !customer_email) {
    return NextResponse.json(
      { error: "All fields are required.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Validate email format
  const normalizedEmail = customer_email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Check if business is suspended
  const { data: business } = await supabase
    .from("businesses")
    .select("id, status, name, brand_color, logo_url")
    .eq("id", business_id)
    .single();

  if (!business || business.status === "suspended") {
    return NextResponse.json(
      { error: "This business is not currently accepting submissions.", code: "BUSINESS_SUSPENDED" },
      { status: 403 }
    );
  }

  // If a reward tier is specified, look it up to get verification_hours
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

    // Calculate verification deadline: now + verification_hours
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
          error: `This email has already reached the maximum submissions for ${businessName}.`,
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
      .select("email_subject_confirmation, email_body_confirmation, email_confirmation_enabled, email_brand_color")
      .eq("id", business_id)
      .single();

    if (emailSettings?.email_confirmation_enabled !== false) {
      const subject =
        emailSettings?.email_subject_confirmation ||
        DEFAULT_EMAIL_TEMPLATES.confirmation.subject;
      const bodyTemplate =
        emailSettings?.email_body_confirmation ||
        DEFAULT_EMAIL_TEMPLATES.confirmation.body;

      const variables = {
        businessName: business.name,
        customerName: customer_name.trim(),
      };

      const renderedSubject = renderEmailTemplate(subject, variables);
      const renderedBody = renderEmailTemplate(bodyTemplate, variables);
      const brandColor = emailSettings?.email_brand_color || business.brand_color || "#E8553A";
      const html = buildEmailHtml(renderedBody, brandColor, business.name, business.logo_url);

      await sendRewardEmail(normalizedEmail, renderedSubject, html);

      await admin.from("email_log").insert({
        business_id,
        customer_email: normalizedEmail,
        message_type: "confirmation",
        subject: renderedSubject,
        status: "sent",
      });
    }
  } catch (emailErr) {
    // Don't block submission if email fails
    console.error("[submissions/create] Confirmation email failed:", emailErr);
  }

  return NextResponse.json({ success: true });
}
