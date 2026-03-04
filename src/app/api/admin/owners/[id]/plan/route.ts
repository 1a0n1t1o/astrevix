import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const VALID_PLANS = ["free", "pro"] as const;

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

  const { plan } = await request.json();

  if (!VALID_PLANS.includes(plan)) {
    return NextResponse.json(
      {
        error: `Invalid plan. Must be one of: ${VALID_PLANS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const admin = getSupabaseAdmin();

  const { error } = await admin
    .from("businesses")
    .update({ plan })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
