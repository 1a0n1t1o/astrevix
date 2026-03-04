import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const {
    business_id,
    post_url,
    detected_platform,
    customer_name,
    customer_email,
  } = body;

  // Basic validation
  if (!business_id || !post_url || !customer_name || !customer_email) {
    return NextResponse.json(
      { error: "All fields are required.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  // Insert the submission — the database handles enforcement:
  //   - Unique index on (business_id, post_url) blocks duplicate links
  //   - BEFORE INSERT trigger checks per-customer submission limit
  const { error } = await supabase.from("submissions").insert({
    business_id,
    post_url: post_url.trim(),
    detected_platform: detected_platform || null,
    customer_name: customer_name.trim(),
    customer_email: customer_email.toLowerCase().trim(),
  });

  if (error) {
    // Unique constraint violation — duplicate link
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This link has already been submitted.", code: "DUPLICATE_LINK" },
        { status: 409 }
      );
    }

    // Trigger raised LIMIT_REACHED exception
    if (error.message?.includes("LIMIT_REACHED:")) {
      const businessName = error.message.split("LIMIT_REACHED:")[1] || "this business";
      return NextResponse.json(
        {
          error: `You've already submitted content for ${businessName}. Thank you for your support!`,
          code: "LIMIT_REACHED",
        },
        { status: 429 }
      );
    }

    console.error("[submissions/create] Insert error:", error);
    return NextResponse.json(
      { error: "Failed to create submission.", code: "INSERT_ERROR" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
