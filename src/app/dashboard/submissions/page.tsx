import { getAuthenticatedBusiness } from "@/lib/get-business";
import SubmissionsList from "./submissions-list";
import type { Submission, RewardTier, CouponCode } from "@/types/database";

export default async function SubmissionsPage() {
  const { user, business, supabase } = await getAuthenticatedBusiness();
  if (!user || !business) return null;

  // Fetch submissions, reward tiers, and coupon codes in parallel
  const [{ data: submissions }, { data: rewardTiers }, { data: couponCodes }] = await Promise.all([
    supabase
      .from("submissions")
      .select("*")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("reward_tiers")
      .select("*")
      .eq("business_id", business.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("coupon_codes")
      .select("*")
      .eq("business_id", business.id),
  ]);

  const hasEmailTemplate = Boolean(
    business.email_approval_template || business.email_confirmation_template
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
        rewardTiers={(rewardTiers as RewardTier[]) || []}
        couponCodes={(couponCodes as CouponCode[]) || []}
        hasEmailTemplate={hasEmailTemplate}
        emailTemplateData={{
          approvalTemplate: business.email_approval_template ?? null,
          approvalSubject: business.email_approval_subject ?? null,
          rejectionTemplate: business.email_rejection_template ?? null,
          rejectionSubject: business.email_rejection_subject ?? null,
          businessName: business.name,
          rewardDescription: business.reward_description,
        }}
      />
    </div>
  );
}
