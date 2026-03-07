import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import WhoItsFor from "@/components/landing/WhoItsFor";
import ROISection from "@/components/landing/ROISection";
import Results from "@/components/landing/Results";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Astrevix — Turn Your Customers Into Free Marketing",
  description:
    "Your customers already love your work. Now they'll post about it. Customers tap, post, and tag your business on Instagram and TikTok — and get rewarded automatically.",
  openGraph: {
    title: "Astrevix — Turn Your Customers Into Free Marketing",
    description:
      "Customers tap, post, and tag your business on Instagram and TikTok — and get rewarded automatically. You get free content, more reach, and more bookings.",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] font-sans">
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhoItsFor />
      <ROISection />
      <Results />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
