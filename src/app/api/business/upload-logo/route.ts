import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the business for this owner
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("logo") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5MB." },
      { status: 400 }
    );
  }

  // Get file extension
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const filePath = `${business.id}/logo.${ext}`;

  // Convert file to buffer for reliable upload
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Use admin client to bypass storage RLS policies
  const admin = getSupabaseAdmin();

  const { error: uploadError } = await admin.storage
    .from("logos")
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "image/png",
    });

  if (uploadError) {
    console.error("Logo upload error:", uploadError);
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // Get the public URL
  const { data: urlData } = admin.storage
    .from("logos")
    .getPublicUrl(filePath);

  const logoUrl = urlData.publicUrl;

  // Update the business record (use admin to avoid RLS issues)
  const { error: updateError } = await admin
    .from("businesses")
    .update({ logo_url: logoUrl, updated_at: new Date().toISOString() })
    .eq("owner_id", user.id);

  if (updateError) {
    console.error("Business logo_url update error:", updateError);
    return NextResponse.json(
      { error: "Failed to save logo URL." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, logoUrl });
}
