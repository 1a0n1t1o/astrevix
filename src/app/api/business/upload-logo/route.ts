import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
      { error: "File too large. Maximum size is 2MB." },
      { status: 400 }
    );
  }

  // Get file extension
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const filePath = `${business.id}/logo.${ext}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Logo upload error:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload logo." },
      { status: 500 }
    );
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("logos")
    .getPublicUrl(filePath);

  const logoUrl = urlData.publicUrl;

  // Update the business record
  const { error: updateError } = await supabase
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
