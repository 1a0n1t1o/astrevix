import { getAuthenticatedBusiness } from "@/lib/get-business";
import SettingsClient from "./settings-client";
import type { Business, UserProfile } from "@/types/database";

export default async function SettingsPage() {
  const { user, business, supabase } = await getAuthenticatedBusiness();
  if (!user || !business) return null;

  const userProfile: UserProfile = {
    first_name: (user.user_metadata?.first_name as string) || "",
    last_name: (user.user_metadata?.last_name as string) || "",
    avatar_url: (user.user_metadata?.avatar_url as string) || null,
  };

  // Fetch approved submissions count for the current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count: approvedThisMonth } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("business_id", business.id)
    .eq("status", "approved")
    .gte("created_at", startOfMonth);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--dash-text)" }}>
          Settings
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
          Manage your account, business details, and preferences
        </p>
      </div>
      <SettingsClient
        business={business as Business}
        userEmail={user.email || ""}
        userProfile={userProfile}
        approvedThisMonth={approvedThisMonth ?? 0}
      />
    </div>
  );
}
