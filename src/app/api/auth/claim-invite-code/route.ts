import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit } from "@/lib/rate-limit";

// POST /api/auth/claim-invite-code — called after successful signup
export async function POST(request: Request) {
  // Rate limiting: 5 requests per IP per minute
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = rateLimit(`claim:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Authenticate the user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await request.json();

  if (!code) {
    return NextResponse.json(
      { error: "Missing code" },
      { status: 400 }
    );
  }

  // Use the authenticated user's ID instead of client-provided user_id
  const user_id = user.id;

  const admin = getSupabaseAdmin();

  // Fetch the invite code
  const { data: invite, error: fetchErr } = await admin
    .from("invite_codes")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .single();

  if (fetchErr || !invite) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }

  // Optimistic concurrency: only update if times_used hasn't changed
  const newTimesUsed = invite.times_used + 1;
  const newStatus = newTimesUsed >= invite.max_uses ? "used" : "active";

  const { data: updated, error: updateErr } = await admin
    .from("invite_codes")
    .update({
      times_used: newTimesUsed,
      status: newStatus,
      claimed_by: user_id,
      claimed_at: new Date().toISOString(),
    })
    .eq("id", invite.id)
    .eq("times_used", invite.times_used) // optimistic lock
    .select()
    .single();

  if (updateErr || !updated) {
    // Race condition — another claim happened simultaneously
    return NextResponse.json(
      { error: "Code was already claimed" },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true });
}
