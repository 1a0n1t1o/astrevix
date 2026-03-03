import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const body = await request.json();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    name,
    category,
    phone,
    address_street,
    address_city,
    address_state,
    address_zip,
    website,
    operating_hours,
  } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Business name is required." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("businesses")
    .update({
      name,
      category: category || null,
      phone: phone || null,
      address_street: address_street || null,
      address_city: address_city || null,
      address_state: address_state || null,
      address_zip: address_zip || null,
      website: website || null,
      operating_hours: operating_hours || {},
      updated_at: new Date().toISOString(),
    })
    .eq("owner_id", user.id);

  if (error) {
    console.error("Business info update error:", error);
    return NextResponse.json(
      { error: "Failed to update business information." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
