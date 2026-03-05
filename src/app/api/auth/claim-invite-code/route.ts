import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// POST /api/auth/claim-invite-code — called after successful signup
export async function POST(request: Request) {
  const { code, user_id } = await request.json();

  if (!code || !user_id) {
    return NextResponse.json(
      { error: "Missing code or user_id" },
      { status: 400 }
    );
  }

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
