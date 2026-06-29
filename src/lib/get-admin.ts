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
 * Admin status is stored in auth.users.raw_app_meta_data as { is_admin: true }.
 * It MUST live in app_metadata (not user_metadata): user_metadata is writable by
 * the user via supabase.auth.updateUser({ data }), so reading it here would let
 * any account self-grant admin.
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

    const isAdmin = user.app_metadata?.is_admin === true;
    return { user, isAdmin };
  }
);
