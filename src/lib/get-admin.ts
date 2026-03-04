import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

interface AdminAuthResult {
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  } | null;
  isAdmin: boolean;
}

/**
 * Cached per-request helper that checks if the authenticated user is an admin.
 * Uses React cache() for deduplication within the same server request.
 *
 * Admin status is stored in auth.users.raw_user_meta_data as { is_admin: true }.
 */
export const getAuthenticatedAdmin = cache(
  async (): Promise<AdminAuthResult> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, isAdmin: false };
    }

    const isAdmin = user.user_metadata?.is_admin === true;
    return { user, isAdmin };
  }
);
