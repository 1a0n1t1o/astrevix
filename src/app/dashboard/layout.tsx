import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "./dashboard-shell";
import type { Business } from "@/types/database";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the business for this owner
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    redirect("/signup");
  }

  const userMetadata = {
    first_name: (user.user_metadata?.first_name as string) || "",
    last_name: (user.user_metadata?.last_name as string) || "",
    avatar_url: (user.user_metadata?.avatar_url as string) || null,
  };

  return (
    <DashboardShell
      business={business as Business}
      userEmail={user.email || ""}
      userMetadata={userMetadata}
    >
      {children}
    </DashboardShell>
  );
}
