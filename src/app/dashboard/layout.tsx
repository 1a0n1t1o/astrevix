import { redirect } from "next/navigation";
import { getAuthenticatedBusiness } from "@/lib/get-business";
import DashboardShell from "./dashboard-shell";
import type { Business } from "@/types/database";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, business } = await getAuthenticatedBusiness();

  if (!user) {
    redirect("/login");
  }

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
