import { getAuthenticatedBusiness } from "@/lib/get-business";
import CustomizeEditor from "./customize-editor";
import type { Business, RewardTier } from "@/types/database";

export default async function CustomizePage() {
  const { user, business, supabase } = await getAuthenticatedBusiness();
  if (!user || !business) return null;

  // Fetch reward tiers for this business
  const { data: rewardTiers } = await supabase
    .from("reward_tiers")
    .select("*")
    .eq("business_id", business.id)
    .order("sort_order", { ascending: true });

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

      <CustomizeEditor
        business={business as Business}
        rewardTiers={(rewardTiers as RewardTier[]) || []}
      />
    </div>
  );
}
