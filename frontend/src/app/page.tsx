import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ImpactStats } from "@/components/ImpactStats";
import { WhySatpura } from "@/components/WhySatpura";
import { Ecosystem } from "@/components/Ecosystem";
import { FarmerSection } from "@/components/FarmerSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Traceability } from "@/components/Traceability";
import { Sustainability } from "@/components/Sustainability";
import { ImpactDashboard } from "@/components/ImpactDashboard";
import { FarmerStories } from "@/components/FarmerStories";
import { Testimonials } from "@/components/Testimonials";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-forest-950 text-cream-100 relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <ImpactStats />
      <WhySatpura />
      <Ecosystem />
      <FarmerSection />
      <ProductShowcase />
      <Traceability />
      <Sustainability />
      <ImpactDashboard />
      <FarmerStories />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
