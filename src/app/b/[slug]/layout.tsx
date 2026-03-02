import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/lib/data";

export default async function BusinessLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) notFound();

  return (
    <div
      style={{
        "--brand-color": business.brandColor,
        background: `linear-gradient(to bottom, ${business.brandColor}14 0%, #FEFCFA 45%)`,
      } as React.CSSProperties}
      className="min-h-screen"
    >
      <div className="mx-auto max-w-[480px] px-5 py-8">{children}</div>
    </div>
  );
}
