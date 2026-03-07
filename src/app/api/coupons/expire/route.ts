import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get business for this user
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const now = new Date().toISOString();

  // Update all active coupons that have passed their expires_at
  const { data, error } = await supabase
    .from("coupon_codes")
    .update({ status: "expired" })
    .eq("business_id", business.id)
    .eq("status", "active")
    .not("expires_at", "is", null)
    .lt("expires_at", now)
    .select("id");

  if (error) {
    return NextResponse.json(
      { error: "Failed to expire coupons" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, expired: data?.length || 0 });
}
