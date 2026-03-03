import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./settings-client";
import type { Business, UserProfile } from "@/types/database";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!business) return null;

  const userProfile: UserProfile = {
    first_name: (user.user_metadata?.first_name as string) || "",
    last_name: (user.user_metadata?.last_name as string) || "",
    avatar_url: (user.user_metadata?.avatar_url as string) || null,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account, business details, and preferences
        </p>
      </div>
      <SettingsClient
        business={business as Business}
        userEmail={user.email || ""}
        userProfile={userProfile}
      />
    </div>
  );
}
