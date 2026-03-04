import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Business } from "@/types/database";

interface AuthResult {
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null;
  business: Business | null;
  supabase: SupabaseClient;
}

/**
 * Cached per-request helper that fetches the authenticated user and their business.
 * React's `cache()` deduplicates calls within the same server request,
 * so the layout and child page share a single auth + business fetch.
 */
export const getAuthenticatedBusiness = cache(async (): Promise<AuthResult> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, business: null, supabase };
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  return { user, business: business as Business | null, supabase };
});
