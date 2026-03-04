import { getAuthenticatedBusiness } from "@/lib/get-business";
import SubmissionsList from "./submissions-list";
import type { Submission } from "@/types/database";

export default async function SubmissionsPage() {
  const { user, business, supabase } = await getAuthenticatedBusiness();
  if (!user || !business) return null;

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const hasEmailTemplate = Boolean(
    business.email_subject || business.email_header || business.email_body
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Submissions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage customer content submissions
        </p>
      </div>

      <SubmissionsList
        submissions={(submissions as Submission[]) || []}
        businessId={business.id}
        rewardDescription={business.reward_description}
        hasEmailTemplate={hasEmailTemplate}
        emailTemplateData={{
          subject: business.email_subject ?? null,
          header: business.email_header ?? null,
          body: business.email_body ?? null,
          footer: business.email_footer ?? null,
          brandColor: business.email_brand_color || business.brand_color,
          logoUrl: business.logo_url,
          rewardFileUrl: business.reward_file_url ?? null,
          rewardFileName: business.reward_file_name ?? null,
          businessName: business.name,
        }}
      />
    </div>
  );
}
