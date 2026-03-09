import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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
    .from("businesses")
    .select("*", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    // Sanitize search input to prevent filter injection
    const sanitized = search.replace(/[^a-zA-Z0-9\s@.\-_]/g, "").slice(0, 100);
    if (sanitized) {
      query = query.or(`name.ilike.%${sanitized}%,slug.ilike.%${sanitized}%`);
    }
  }

  const { data: businesses, count, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch owner user data and submission counts
  const ownerIds = [
    ...new Set(
      (businesses || []).map((b) => b.owner_id).filter(Boolean) as string[]
    ),
  ];
  const businessIds = (businesses || []).map((b) => b.id) as string[];

  // Fetch owner info from auth
  const ownerMap: Record<
    string,
    { email: string; name: string; avatar_url: string | null }
  > = {};
  for (const ownerId of ownerIds) {
    const { data } = await admin.auth.admin.getUserById(ownerId);
    if (data?.user) {
      ownerMap[ownerId] = {
        email: data.user.email || "",
        name:
          `${data.user.user_metadata?.first_name || ""} ${data.user.user_metadata?.last_name || ""}`.trim() ||
          data.user.email?.split("@")[0] ||
          "Unknown",
        avatar_url:
          (data.user.user_metadata?.avatar_url as string) || null,
      };
    }
  }

  // Fetch submission counts per business
  const { data: submissions } = await admin
    .from("submissions")
    .select("business_id")
    .in(
      "business_id",
      businessIds.length > 0 ? businessIds : ["__none__"]
    );

  const countMap: Record<string, number> = {};
  (submissions || []).forEach((s) => {
    countMap[s.business_id] = (countMap[s.business_id] || 0) + 1;
  });

  const owners = (businesses || []).map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo_url: b.logo_url,
    plan: b.plan,
    status: b.status,
    created_at: b.created_at,
    owner_id: b.owner_id,
    owner_email: ownerMap[b.owner_id]?.email || "",
    owner_name: ownerMap[b.owner_id]?.name || "Unknown",
    owner_avatar: ownerMap[b.owner_id]?.avatar_url || null,
    submission_count: countMap[b.id] || 0,
    auto_approve_requested: b.auto_approve_requested || false,
  }));

  return NextResponse.json({ owners, total: count || 0, page, limit });
}
