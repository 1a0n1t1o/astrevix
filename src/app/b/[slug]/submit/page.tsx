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

  return <SubmitForm business={business} />;
}
