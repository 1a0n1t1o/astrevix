import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// PATCH /api/admin/invite-codes/[id] — revoke an invite code
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const admin = getSupabaseAdmin();

  const { error } = await admin
    .from("invite_codes")
    .update({ status: "revoked" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/admin/invite-codes/[id] — delete an unused invite code
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const admin = getSupabaseAdmin();

  // First check if it's been used
  const { data: code, error: fetchErr } = await admin
    .from("invite_codes")
    .select("times_used")
    .eq("id", id)
    .single();

  if (fetchErr || !code) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }

  if (code.times_used > 0) {
    return NextResponse.json(
      { error: "Cannot delete a code that has been used" },
      { status: 400 }
    );
  }

  const { error } = await admin
    .from("invite_codes")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
