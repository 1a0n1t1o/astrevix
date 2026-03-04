import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();

  // Total active businesses (not deleted)
  const { count: totalBusinesses } = await admin
    .from("businesses")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null);

  // Total submissions
  const { count: totalSubmissions } = await admin
    .from("submissions")
    .select("*", { count: "exact", head: true });

  // Total rewards sent
  const { count: totalRewards } = await admin
    .from("rewards_sent")
    .select("*", { count: "exact", head: true });

  // New signups this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const { count: newSignupsThisMonth } = await admin
    .from("businesses")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null)
    .gte("created_at", startOfMonth.toISOString());

  // Signups per month for last 6 months (for chart data)
  const signupsByMonth: Array<{ month: string; count: number }> = [];

  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      1
    );
    const monthLabel = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}`;

    const { count: monthCount } = await admin
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .gte("created_at", monthStart.toISOString())
      .lt("created_at", monthEnd.toISOString());

    signupsByMonth.push({ month: monthLabel, count: monthCount || 0 });
  }

  return NextResponse.json({
    total_businesses: totalBusinesses || 0,
    total_submissions: totalSubmissions || 0,
    total_rewards: totalRewards || 0,
    new_signups_this_month: newSignupsThisMonth || 0,
    signups_by_month: signupsByMonth,
  });
}
