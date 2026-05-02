import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import { BusinessTypesMarquee } from "@/components/sections/BusinessTypesMarquee";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import PhoneShowcase from "@/components/landing/PhoneShowcase";
import Features from "@/components/landing/Features";
import Testimonial from "@/components/landing/Testimonial";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <BusinessTypesMarquee />
      <Problem />
      <HowItWorks />
      <PhoneShowcase />
      <Features />
      <Testimonial />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
