import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const VALID_PLANS = ["free", "pro"] as const;
const VALID_SUB_STATUSES = ["inactive", "active", "cancelled", "past_due"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { plan, subscription_status } = body;

  if (plan && !VALID_PLANS.includes(plan)) {
    return NextResponse.json(
      { error: `Invalid plan. Must be one of: ${VALID_PLANS.join(", ")}` },
      { status: 400 }
    );
  }

  if (subscription_status && !VALID_SUB_STATUSES.includes(subscription_status)) {
    return NextResponse.json(
      { error: `Invalid subscription status. Must be one of: ${VALID_SUB_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();

  const updateData: Record<string, string> = {};
  if (plan) updateData.plan = plan;
  if (subscription_status) {
    updateData.subscription_status = subscription_status;
    if (subscription_status === "active" && !body.subscription_activated_at) {
      updateData.subscription_activated_at = new Date().toISOString();
    }
  }

  const { error } = await admin
    .from("businesses")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
