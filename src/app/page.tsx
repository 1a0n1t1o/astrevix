import dynamic from "next/dynamic";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const PhoneShowcase = dynamic(
  () => import("@/components/landing/PhoneShowcase")
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <PhoneShowcase />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
