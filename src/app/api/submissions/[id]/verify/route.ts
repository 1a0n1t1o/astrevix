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

  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "verify";

  // Fetch submission (RLS ensures owner access)
  const { data: submission } = await supabase
    .from("submissions")
    .select("id, verification_deadline, verification_status, post_url")
    .eq("id", id)
    .single();

  if (!submission) {
    return NextResponse.json(
      { error: "Submission not found" },
      { status: 404 }
    );
  }

  if (action === "fail") {
    // Mark post as failed/removed
    const { error } = await supabase
      .from("submissions")
      .update({
        verification_status: "failed",
        verified_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update submission" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, status: "failed" });
  }

  // Default action: verify
  // Check deadline has passed
  if (submission.verification_deadline) {
    const deadline = new Date(submission.verification_deadline);
    if (deadline > new Date()) {
      return NextResponse.json(
        { error: "Verification deadline has not passed yet." },
        { status: 400 }
      );
    }
  }

  const { error } = await supabase
    .from("submissions")
    .update({
      verification_status: "verified",
      verified_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to verify submission" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, status: "verified" });
}
