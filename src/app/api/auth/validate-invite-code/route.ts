import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit } from "@/lib/rate-limit";

// POST /api/auth/validate-invite-code — public, rate-limited
export async function POST(request: Request) {
  // Rate limiting: 10 requests per IP per minute
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = rateLimit(ip, 10, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { code, email } = body;

  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { error: "Invite code is required" },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();
  const { data: invite, error } = await admin
    .from("invite_codes")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .single();

  if (error || !invite) {
    return NextResponse.json(
      { error: "Invalid invite code" },
      { status: 400 }
    );
  }

  // Check status
  if (invite.status === "revoked") {
    return NextResponse.json(
      { error: "Invalid invite code" },
      { status: 400 }
    );
  }

  // Check usage limits
  if (invite.status === "used" || invite.times_used >= invite.max_uses) {
    return NextResponse.json(
      { error: "This invite code has already been used" },
      { status: 400 }
    );
  }

  // Check expiration
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "This invite code has expired" },
      { status: 400 }
    );
  }

  // Check email restriction
  if (
    invite.business_email &&
    email &&
    invite.business_email.toLowerCase() !== email.toLowerCase()
  ) {
    return NextResponse.json(
      { error: "This invite code is reserved for a different email" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    valid: true,
    business_name: invite.business_name || null,
  });
}
