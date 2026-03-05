import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(length: number = 8): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
}

// GET /api/admin/invite-codes — list all invite codes
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "all";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  // Build query
  let query = admin
    .from("invite_codes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status === "active") {
    query = query.eq("status", "active");
  } else if (status === "used") {
    query = query.eq("status", "used");
  } else if (status === "expired") {
    query = query.eq("status", "expired");
  } else if (status === "revoked") {
    query = query.eq("status", "revoked");
  }

  if (search) {
    query = query.or(
      `code.ilike.%${search}%,business_name.ilike.%${search}%,business_email.ilike.%${search}%`
    );
  }

  const { data: inviteCodes, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mark expired codes that are still "active" in DB but past their expires_at
  const now = new Date();
  const codesWithStatus = (inviteCodes || []).map((code) => {
    if (
      code.status === "active" &&
      code.expires_at &&
      new Date(code.expires_at) < now
    ) {
      return { ...code, display_status: "expired" };
    }
    return { ...code, display_status: code.status };
  });

  // Fetch tab counts for all statuses
  const { count: totalCount } = await admin
    .from("invite_codes")
    .select("*", { count: "exact", head: true });

  const { count: activeCount } = await admin
    .from("invite_codes")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: usedCount } = await admin
    .from("invite_codes")
    .select("*", { count: "exact", head: true })
    .eq("status", "used");

  const { count: expiredCount } = await admin
    .from("invite_codes")
    .select("*", { count: "exact", head: true })
    .eq("status", "expired");

  const { count: revokedCount } = await admin
    .from("invite_codes")
    .select("*", { count: "exact", head: true })
    .eq("status", "revoked");

  return NextResponse.json({
    invite_codes: codesWithStatus,
    total: count || 0,
    page,
    limit,
    counts: {
      all: totalCount || 0,
      active: activeCount || 0,
      used: usedCount || 0,
      expired: expiredCount || 0,
      revoked: revokedCount || 0,
    },
  });
}

// POST /api/admin/invite-codes — create a new invite code
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  const body = await request.json();

  const code = body.code
    ? body.code.toUpperCase().trim()
    : generateCode();

  // Check if code already exists
  const { data: existing } = await admin
    .from("invite_codes")
    .select("id")
    .eq("code", code)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "An invite code with this value already exists" },
      { status: 409 }
    );
  }

  const { data: inviteCode, error } = await admin
    .from("invite_codes")
    .insert({
      code,
      business_name: body.business_name || null,
      business_email: body.business_email || null,
      max_uses: body.max_uses || 1,
      expires_at: body.expires_at || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ invite_code: inviteCode });
}
