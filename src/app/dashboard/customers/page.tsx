import { getAuthenticatedBusiness } from "@/lib/get-business";
import CustomersList from "./customers-list";
import type { CouponCode } from "@/types/database";

interface SubmissionInfo {
  id: string;
  post_url: string;
  detected_platform: string | null;
  verification_status: string | null;
  verified_at: string | null;
  verification_deadline: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export default async function CustomersPage() {
  const { user, business, supabase } = await getAuthenticatedBusiness();
  if (!user || !business) return null;

  // Fetch coupon codes and submissions in parallel
  const [{ data: coupons }, { data: submissions }] = await Promise.all([
    supabase
      .from("coupon_codes")
      .select("*")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("submissions")
      .select(
        "id, post_url, detected_platform, verification_status, verified_at, verification_deadline, created_at, reviewed_at"
      )
      .eq("business_id", business.id),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--dash-text)" }}>Customers</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--dash-text-secondary)" }}>
          Manage rewards and track coupon redemptions
        </p>
      </div>

      <CustomersList
        coupons={(coupons as CouponCode[]) || []}
        submissions={(submissions as SubmissionInfo[]) || []}
        businessId={business.id}
      />
    </div>
  );
}
