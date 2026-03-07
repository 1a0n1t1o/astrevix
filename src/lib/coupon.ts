/**
 * Coupon code generation utilities.
 * Server-only — uses Supabase for uniqueness checks.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

// Excludes confusing characters: 0, O, I, L, 1
const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

/** Generate a random 6-char alphanumeric coupon code */
export function generateCouponCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return code;
}

/** Generate a unique coupon code, retrying if collision found in DB */
export async function generateUniqueCouponCode(
  supabase: SupabaseClient,
  maxRetries = 5
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const code = generateCouponCode();
    const { data } = await supabase
      .from("coupon_codes")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (!data) {
      return code;
    }
  }
  throw new Error("Failed to generate unique coupon code after retries");
}
