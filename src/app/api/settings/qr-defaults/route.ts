import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const VALID_FALLBACKS = ["landing_page", "website_url", "custom_url"];

export async function PATCH(request: Request) {
  const body = await request.json();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { qr_default_redirect_url, qr_default_fallback, qr_default_branding } =
    body;

  if (
    qr_default_fallback &&
    !VALID_FALLBACKS.includes(qr_default_fallback)
  ) {
    return NextResponse.json(
      { error: "Invalid fallback behavior." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      qr_default_redirect_url: qr_default_redirect_url || null,
      qr_default_fallback: qr_default_fallback || "landing_page",
      qr_default_branding:
        qr_default_branding !== undefined ? qr_default_branding : true,
      updated_at: new Date().toISOString(),
    })
    .eq("owner_id", user.id);

  if (error) {
    console.error("QR defaults update error:", error);
    return NextResponse.json(
      { error: "Failed to update QR/NFC defaults." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
