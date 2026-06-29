import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5MB." },
      { status: 400 }
    );
  }

  // Validate type server-side and derive the extension from the (trusted) MIME
  // type rather than the client-supplied filename. SVG is excluded — it can
  // carry inline <script> that executes from the public storage URL.
  const AVATAR_TYPES: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const ext = AVATAR_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Invalid file type. Only PNG, JPG, WEBP, or GIF images are allowed." },
      { status: 400 }
    );
  }
  const filePath = `avatars/${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(filePath, file, { cacheControl: "3600", upsert: true });

  if (uploadError) {
    console.error("Avatar upload error:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload avatar." },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("logos").getPublicUrl(filePath);

  // Update user metadata with avatar URL
  const { error: updateError } = await supabase.auth.updateUser({
    data: { avatar_url: publicUrl },
  });

  if (updateError) {
    console.error("Avatar metadata update error:", updateError);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, avatarUrl: publicUrl });
}
