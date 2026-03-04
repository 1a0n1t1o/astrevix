import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    console.error("[submissions/create] SUPABASE_SERVICE_ROLE_KEY is not set!");
    return NextResponse.json(
      { error: "Server configuration error.", code: "CONFIG_ERROR" },
      { status: 500 }
    );
  }

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

  const normalizedEmail = customer_email.toLowerCase().trim();

  // 1. Duplicate link check — always enforced
  const { data: existingLink, error: dupError } = await supabase
    .from("submissions")
    .select("id")
    .eq("business_id", business_id)
    .eq("post_url", post_url.trim())
    .maybeSingle();

  if (dupError) {
    console.error("[submissions/create] Duplicate link check error:", dupError);
    // Fail open for duplicate check — DB unique constraint is the backup
  } else if (existingLink) {
    return NextResponse.json(
      { error: "This link has already been submitted.", code: "DUPLICATE_LINK" },
      { status: 409 }
    );
  }

  // 2. Per-customer submission limit check
  const { data: business, error: bizError } = await supabase
    .from("businesses")
    .select("max_rewards_per_customer, name")
    .eq("id", business_id)
    .single();

  if (bizError) {
    console.error("[submissions/create] Business fetch error:", bizError);
    return NextResponse.json(
      { error: "Could not verify submission limits.", code: "BUSINESS_FETCH_ERROR" },
      { status: 500 }
    );
  }

  // Raw value from DB: number = enforced limit, null = unlimited
  const maxRewards = business?.max_rewards_per_customer;

  console.log("[submission-limit] business:", business_id, "max_rewards_per_customer:", maxRewards);

  // Only enforce if not unlimited (null = unlimited)
  if (maxRewards !== null && maxRewards !== undefined) {
    const { count, error: countError } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("business_id", business_id)
      .ilike("customer_email", normalizedEmail);

    if (countError) {
      console.error("[submissions/create] Count query error:", countError);
      return NextResponse.json(
        { error: "Could not verify submission limits.", code: "COUNT_ERROR" },
        { status: 500 }
      );
    }

    const currentCount = count ?? 0;

    console.log("[submission-limit] email:", normalizedEmail, "existing:", currentCount, "max:", maxRewards);

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

  // 3. Insert the submission
  const { error } = await supabase.from("submissions").insert({
    business_id,
    post_url: post_url.trim(),
    detected_platform: detected_platform || null,
    customer_name: customer_name.trim(),
    customer_email: normalizedEmail,
  });

  if (error) {
    // Handle unique constraint violation (backup for duplicate link)
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "This link has already been submitted.", code: "DUPLICATE_LINK" },
        { status: 409 }
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
