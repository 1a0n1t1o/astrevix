import { createClient } from "@/lib/supabase/server";
import CustomizeEditor from "./customize-editor";
import type { Business } from "@/types/database";

export default async function CustomizePage() {
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
          Customize
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Edit how your landing page looks to customers
        </p>
      </div>

      <CustomizeEditor business={business as Business} />
    </div>
  );
}
