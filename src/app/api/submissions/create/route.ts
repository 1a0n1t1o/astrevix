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

  // 1. Duplicate link check — always enforced
  try {
    const { data: existingLink } = await supabase
      .from("submissions")
      .select("id")
      .eq("business_id", business_id)
      .eq("post_url", post_url.trim())
      .maybeSingle();

    if (existingLink) {
      return NextResponse.json(
        {
          error: "This link has already been submitted.",
          code: "DUPLICATE_LINK",
        },
        { status: 409 }
      );
    }
  } catch (err) {
    console.error("Duplicate link check failed:", err);
    // Fail open — let DB unique constraint catch it if this check fails
  }

  // 2. Per-customer submission limit check
  try {
    // Fetch the business's max_rewards_per_customer setting
    const { data: business } = await supabase
      .from("businesses")
      .select("max_rewards_per_customer, name")
      .eq("id", business_id)
      .single();

    // Raw value from DB: number = enforced limit, null = unlimited
    const maxRewards = business?.max_rewards_per_customer;

    console.log("[submission-limit] business:", business_id, "max_rewards_per_customer:", maxRewards);

    // Only enforce if not unlimited (null = unlimited)
    if (maxRewards !== null && maxRewards !== undefined) {
      // Count ALL submissions for this email + business (any status)
      const { count } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("business_id", business_id)
        .eq("customer_email", customer_email.toLowerCase().trim());

      const currentCount = count ?? 0;

      console.log("[submission-limit] email:", customer_email.toLowerCase().trim(), "existing:", currentCount, "max:", maxRewards);

      if (currentCount >= maxRewards) {
        return NextResponse.json(
          {
            error: `You've already submitted content for ${business?.name || "this business"}. Thank you for your support!`,
            code: "LIMIT_REACHED",
          },
          { status: 429 }
        );
      }
    }
  } catch (err) {
    // Fail open — if the limit check fails, allow the submission
    console.error("Submission limit check failed:", err);
  }

  // 3. Insert the submission
  const { error } = await supabase.from("submissions").insert({
    business_id,
    post_url: post_url.trim(),
    detected_platform: detected_platform || null,
    customer_name: customer_name.trim(),
    customer_email: customer_email.toLowerCase().trim(),
  });

  if (error) {
    // Handle unique constraint violation (backup for duplicate link)
    if (error.code === "23505") {
      return NextResponse.json(
        {
          error: "This link has already been submitted.",
          code: "DUPLICATE_LINK",
        },
        { status: 409 }
      );
    }

    console.error("Submission insert error:", error);
    return NextResponse.json(
      { error: "Failed to create submission.", code: "INSERT_ERROR" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
