import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  void request;
  const { id: businessId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();

  // 1. Get the business to find the owner_id
  const { data: business, error: bizError } = await admin
    .from("businesses")
    .select("id, owner_id")
    .eq("id", businessId)
    .single();

  if (bizError || !business) {
    return NextResponse.json(
      { error: "Business not found" },
      { status: 404 }
    );
  }

  const ownerId = business.owner_id;

  try {
    // 2. Clear invite_codes references to this user (prevents FK constraint)
    await admin
      .from("invite_codes")
      .update({ claimed_by: null, claimed_at: null })
      .eq("claimed_by", ownerId);

    await admin
      .from("invite_codes")
      .update({ created_by: user.id }) // reassign to the admin performing the delete
      .eq("created_by", ownerId);

    // 3. Delete logo files from storage
    const { data: files } = await admin.storage
      .from("logos")
      .list(businessId);

    if (files && files.length > 0) {
      const filePaths = files.map((f) => `${businessId}/${f.name}`);
      await admin.storage.from("logos").remove(filePaths);
    }

    // 4. Hard delete the business record
    //    This cascades to: submissions, qr_scans, sms_log, rewards_sent
    const { error: deleteError } = await admin
      .from("businesses")
      .delete()
      .eq("id", businessId);

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete business: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // 5. Delete the user from Supabase Auth
    const { error: authError } = await admin.auth.admin.deleteUser(ownerId);

    if (authError) {
      console.error(
        `[admin/delete] Business deleted but auth user deletion failed for ${ownerId}:`,
        authError
      );
      return NextResponse.json(
        { error: `Business deleted but failed to remove auth user: ${authError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete account";
    console.error("[admin/delete] Unexpected error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
