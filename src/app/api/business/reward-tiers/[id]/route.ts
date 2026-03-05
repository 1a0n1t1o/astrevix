import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate verification_hours if provided
  if (body.verification_hours !== undefined) {
    if (body.verification_hours < 24 || body.verification_hours > 120) {
      return NextResponse.json(
        { error: "Verification hours must be between 24 and 120" },
        { status: 400 }
      );
    }
  }

  // Validate platform if provided
  if (body.platform !== undefined) {
    const valid = ["instagram", "tiktok", "facebook", "google"];
    if (!valid.includes(body.platform)) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }
  }

  // RLS ensures only owner can update
  const { error } = await supabase
    .from("reward_tiers")
    .update({
      ...body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[reward-tiers] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update tier" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  void request;
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS ensures only owner can delete
  const { error } = await supabase
    .from("reward_tiers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[reward-tiers] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete tier" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
