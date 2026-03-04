import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  void request;
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();

  // Fetch business
  const { data: business, error: bizError } = await admin
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (bizError || !business) {
    return NextResponse.json(
      { error: "Business not found" },
      { status: 404 }
    );
  }

  // Fetch owner info from auth
  let owner: {
    email: string;
    name: string;
    avatar_url: string | null;
  } = { email: "", name: "Unknown", avatar_url: null };

  if (business.owner_id) {
    const { data } = await admin.auth.admin.getUserById(business.owner_id);
    if (data?.user) {
      owner = {
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

  // Fetch submission counts by status
  const { count: totalSubmissions } = await admin
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("business_id", id);

  const { count: pendingCount } = await admin
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("business_id", id)
    .eq("status", "pending");

  const { count: approvedCount } = await admin
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("business_id", id)
    .eq("status", "approved");

  const { count: rejectedCount } = await admin
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("business_id", id)
    .eq("status", "rejected");

  // Fetch rewards sent count
  const { count: rewardsSent } = await admin
    .from("rewards_sent")
    .select("*", { count: "exact", head: true })
    .eq("business_id", id);

  // Fetch recent 20 submissions
  const { data: recentSubmissions } = await admin
    .from("submissions")
    .select("*")
    .eq("business_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const total = totalSubmissions || 0;
  const approved = approvedCount || 0;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return NextResponse.json({
    business,
    owner,
    stats: {
      total_submissions: total,
      pending: pendingCount || 0,
      approved,
      rejected: rejectedCount || 0,
      approval_rate: approvalRate,
      rewards_sent: rewardsSent || 0,
    },
    recent_submissions: recentSubmissions || [],
  });
}
