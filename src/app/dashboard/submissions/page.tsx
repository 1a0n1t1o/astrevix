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

  const hasSmsTemplate = Boolean(
    business.sms_approval_template || business.sms_confirmation_template
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
        hasSmsTemplate={hasSmsTemplate}
        smsTemplateData={{
          approvalTemplate: business.sms_approval_template ?? null,
          rejectionTemplate: business.sms_rejection_template ?? null,
          businessName: business.name,
          rewardDescription: business.reward_description,
        }}
      />
    </div>
  );
}
