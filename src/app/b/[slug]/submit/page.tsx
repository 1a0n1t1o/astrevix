import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/data";
import SubmitForm from "./submit-form";

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  // Block submissions for suspended businesses
  if (business.status === "suspended") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Page Unavailable</h1>
        <p className="mt-2 text-sm text-gray-500">
          This business page is currently unavailable. Please check back later.
        </p>
      </div>
    );
  }

  return <SubmitForm business={business} />;
}
