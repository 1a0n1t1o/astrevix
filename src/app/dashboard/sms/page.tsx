import { getAuthenticatedBusiness } from "@/lib/get-business";
import SmsEditor from "./sms-editor";
import type { Business } from "@/types/database";

export default async function SmsPage() {
  const { user, business } = await getAuthenticatedBusiness();
  if (!user || !business) return null;

  return (
    <div className="lg:-mr-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          SMS Templates
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize the text messages your customers receive
        </p>
      </div>

      <SmsEditor business={business as Business} />
    </div>
  );
}
