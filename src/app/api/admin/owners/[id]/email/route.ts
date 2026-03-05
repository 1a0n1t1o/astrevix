import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { subject, body } = await request.json();

  if (!subject || !body) {
    return NextResponse.json(
      { error: "Subject and body are required" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();

  // Fetch the business to get owner_id
  const { data: business, error: bizError } = await admin
    .from("businesses")
    .select("owner_id, name")
    .eq("id", id)
    .single();

  if (bizError || !business) {
    return NextResponse.json(
      { error: "Business not found" },
      { status: 404 }
    );
  }

  // Fetch owner email via admin auth
  const { data: ownerData } = await admin.auth.admin.getUserById(
    business.owner_id
  );

  if (!ownerData?.user?.email) {
    return NextResponse.json(
      { error: "Owner email not found" },
      { status: 404 }
    );
  }

  const fromAddress = process.env.RESEND_API_KEY
    ? "Astrevix <contact@astrevix.com>"
    : "Astrevix <onboarding@resend.dev>";

  // Sanitize user input to prevent XSS in HTML emails
  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const safeSubject = escapeHtml(subject);
  const safeBody = escapeHtml(body);

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-bottom: 2px solid #eee; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="margin: 0; color: #111;">Astrevix</h2>
        </div>
        <h3 style="color: #111;">${safeSubject}</h3>
        <div style="white-space: pre-wrap;">${safeBody}</div>
        <div style="border-top: 2px solid #eee; padding-top: 16px; margin-top: 32px; font-size: 12px; color: #888;">
          This email was sent by the Astrevix team.
        </div>
      </body>
    </html>
  `.trim();

  try {
    const { error: sendError } = await getResend().emails.send({
      from: fromAddress,
      to: ownerData.user.email,
      subject,
      html: htmlBody,
    });

    if (sendError) {
      return NextResponse.json(
        { error: sendError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
