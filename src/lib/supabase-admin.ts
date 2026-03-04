import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side admin client that bypasses RLS.
// Only use in API routes — never expose in client code.
// Lazy-initialized to avoid crashing at build time when env var is missing.

let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local"
      );
    }

    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _supabaseAdmin;
}
