import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("reward_file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5MB." },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Accepted: PDF, PNG, JPG." },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const filePath = `${business.id}/reward.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("reward-files")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Reward file upload error:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload reward file." },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from("reward-files")
    .getPublicUrl(filePath);

  const rewardFileUrl = urlData.publicUrl;
  const rewardFileName = file.name;

  const { error: updateError } = await supabase
    .from("businesses")
    .update({
      reward_file_url: rewardFileUrl,
      reward_file_name: rewardFileName,
      updated_at: new Date().toISOString(),
    })
    .eq("owner_id", user.id);

  if (updateError) {
    console.error("Business reward_file update error:", updateError);
    return NextResponse.json(
      { error: "Failed to save reward file URL." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, rewardFileUrl, rewardFileName });
}
