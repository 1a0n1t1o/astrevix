import { getAuthenticatedBusiness } from "@/lib/get-business";
import EmailEditor from "./email-editor";
import type { Business } from "@/types/database";

export default async function EmailPage() {
  const { user, business } = await getAuthenticatedBusiness();
  if (!user || !business) return null;

  return (
    <div className="lg:-mr-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Email Templates
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize the emails your customers receive
        </p>
      </div>

      <EmailEditor business={business as Business} />
    </div>
  );
}
