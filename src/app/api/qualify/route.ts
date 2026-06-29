import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import { durableRateLimit } from "@/lib/rate-limit";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const LEAD_NOTIFY_TO = process.env.QUALIFY_NOTIFY_TO ?? "contact@astrevix.com";
const LEAD_NOTIFY_FROM =
  process.env.QUALIFY_NOTIFY_FROM ?? "Astrevix Leads <contact@astrevix.com>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  // Rate limiting: 5 lead submissions per IP per minute
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = await durableRateLimit(`qualify:${ip}`, 5, 60);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const business = String(data.business ?? "");
  const challenge = String(data.challenge ?? "");
  const ads = String(data.ads ?? "");
  const name = String(data.name ?? "");
  const email = String(data.email ?? "");
  const phone = String(data.phone ?? "");

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Missing required contact fields" },
      { status: 400 },
    );
  }

  console.log("[qualify] new qualified lead:", { name, email, business });

  if (!resend) {
    return NextResponse.json({ success: true, emailed: false });
  }

  try {
    await resend.emails.send({
      from: LEAD_NOTIFY_FROM,
      to: LEAD_NOTIFY_TO,
      subject: `New qualified lead: ${name} (${business || "unspecified"})`,
      html: `
        <h2>New Qualified Lead</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <hr/>
        <p><strong>Business type:</strong> ${escapeHtml(business)}</p>
        <p><strong>Biggest challenge:</strong> ${escapeHtml(challenge)}</p>
        <p><strong>Tried paid ads:</strong> ${escapeHtml(ads)}</p>
      `,
    });

    return NextResponse.json({ success: true, emailed: true });
  } catch (error) {
    console.error("[qualify] email error:", error);
    return NextResponse.json({ success: true, emailed: false });
  }
}
