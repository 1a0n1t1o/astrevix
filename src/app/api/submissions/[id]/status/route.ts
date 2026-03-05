import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, reward_given, review_comment } = await request.json();

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'approved' or 'rejected'." },
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

  // RLS ensures only the business owner can update their submissions
  const { error } = await supabase
    .from("submissions")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reward_given: reward_given || null,
      review_comment: review_comment || null,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }

  // Fire-and-forget SMS notification
  try {
    const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/[^/]*$/, "") || "";
    fetch(`${origin}/api/submissions/${id}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reward_given, review_comment: review_comment || null }),
    }).catch(() => {
      // Silently fail — notification is best-effort
    });
  } catch {
    // Silently fail
  }

  return NextResponse.json({ success: true });
}
