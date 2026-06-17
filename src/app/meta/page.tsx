import type { Metadata } from "next";
import MetaFunnel from "@/components/meta/MetaFunnel";
import MetaFooter from "@/components/meta/MetaFooter";
import "./meta.css";

export const metadata: Metadata = {
  title: "Astrevix — Turn Your Customers Into Your Marketing Team",
  description:
    "They tap a sign at your counter, post about your business, and get a small reward — automatically.",
  robots: { index: false, follow: false },
};

export default function MetaPage() {
  return (
    <>
      <MetaFunnel />
      <MetaFooter />
    </>
  );
}
