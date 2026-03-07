import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!["used", "active"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'used' or 'active'." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS ensures only the business owner can update their own coupon codes
  const updateData: Record<string, unknown> = { status };
  if (status === "used") {
    updateData.used_at = new Date().toISOString();
  } else {
    // Reverting to active: clear used_at
    updateData.used_at = null;
  }

  const { error } = await supabase
    .from("coupon_codes")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
