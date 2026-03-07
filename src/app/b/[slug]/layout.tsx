import { notFound } from "next/navigation";
import type { Viewport } from "next";
import { getBusinessBySlug } from "@/lib/data";

export const viewport: Viewport = {
  themeColor: "#FEFCFA",
};

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
        backgroundColor: "#FEFCFA",
      } as React.CSSProperties}
      className="min-h-dvh"
    >
      <div className="mx-auto max-w-[480px] px-5 py-8">{children}</div>
    </div>
  );
}
