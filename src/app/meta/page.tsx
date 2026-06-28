import type { Metadata } from "next";
import MetaFunnel from "@/components/meta/MetaFunnel";
import MetaFooter from "@/components/meta/MetaFooter";
import "./meta.css";

const META_TITLE = "Astrevix — Turn Your Customers Into Your Marketing Team";
const META_DESCRIPTION =
  "They tap a sign at your counter, post about your business, and get a small reward — automatically.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: "https://astrevix.com/meta",
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

export default function MetaPage() {
  return (
    <>
      <MetaFunnel />
      <MetaFooter />
    </>
  );
}
