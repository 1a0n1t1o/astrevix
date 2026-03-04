import { createClient } from "@/lib/supabase/server";
import EmailEditor from "./email-editor";
import type { Business } from "@/types/database";

export default async function EmailPage() {
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

  return (
    <div className="lg:-mr-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Email Template
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize the reward email your customers receive when approved
        </p>
      </div>

      <EmailEditor business={business as Business} />
    </div>
  );
}
