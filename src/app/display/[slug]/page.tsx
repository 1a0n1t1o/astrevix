import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/data";
import { DisplayKiosk } from "./display-kiosk";

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  // Build the reward text from tiers or fallback
  let rewardText = business.reward || "A REWARD";
  if (business.rewardTiers.length > 0) {
    // Use the first tier's reward description as the headline reward
    rewardText = business.rewardTiers[0].reward_description;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://astrevix.com";
  const submitUrl = `${baseUrl}/b/${business.slug}`;

  return (
    <DisplayKiosk
      businessName={business.name}
      rewardText={rewardText}
      submitUrl={submitUrl}
    />
  );
}
