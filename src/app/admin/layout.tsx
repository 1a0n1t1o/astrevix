import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/get-admin";
import AdminShell from "./admin-shell";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, isAdmin } = await getAuthenticatedAdmin();

  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  return (
    <AdminShell
      userEmail={user.email || ""}
      userName={
        (user.user_metadata?.first_name as string) ||
        user.email?.split("@")[0] ||
        "Admin"
      }
    >
      {children}
    </AdminShell>
  );
}
