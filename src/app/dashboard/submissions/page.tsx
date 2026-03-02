import { createClient } from "@/lib/supabase/server";
import SubmissionsList from "./submissions-list";
import type { Submission } from "@/types/database";

export default async function SubmissionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!business) return null;

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          Submissions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage customer content submissions
        </p>
      </div>

      <SubmissionsList
        submissions={(submissions as Submission[]) || []}
        businessId={business.id}
      />
    </div>
  );
}
