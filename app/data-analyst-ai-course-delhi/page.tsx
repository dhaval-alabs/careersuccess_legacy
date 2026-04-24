'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import StatsBar from "@/components/StatsBar";
import CourseInfoSection from "@/components/CourseInfoSection";
import ToolsMasteryStrip from "@/components/ToolsMasteryStrip";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import DACurriculumSection from "@/components/DACurriculumSection";
import DALearningModes from "@/components/DALearningModes";
import CertificationStrip from "@/components/CertificationStrip";
import CareerServices from "@/components/CareerServices";
import HowToEnrol from "@/components/HowToEnrol";
import FAQSection from "@/components/FAQSection";
import BottomCTA from "@/components/BottomCTA";
import FormOverlay from "@/components/FormOverlay";

export default function DelhiDAPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [formSource, setFormSource] = useState("lp_data_analyst_delhi");

  const openForm = (source: string) => {
    setFormSource(source);
    setFormOpen(true);
  };

  const fireConversion = (label: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': `AW-783236209/${label}`
      });
    }
  };

  const handleFormSubmit = () => {
    fireConversion('3q4MCJXktaobEPH4vPUC'); // Submit lead form
  };

  return (
    <main className="min-h-screen bg-white">
      <Header onOpenForm={() => openForm("header_cta")} />
      
      <HeroSection 
        title="Master Data Analytics + AI in Delhi"
        subtitle="Ranked #1 Data Analytics Institute. Learn SQL, Power BI, Python & GenAI from industry experts. Get NASSCOM certified with 100% placement support."
        location="Delhi NCR (Noida & Gurgaon)"
        onOpenForm={() => openForm("hero_cta")}
        ctaText="Download Brochure & Fees"
        stats={["20,000+ Grads", "9.6/10 Rating", "12+ Years"]}
      />

      <TrustBar />
      
      <StatsBar />

      <CourseInfoSection locations={['noida', 'gurgaon']} />

      <ToolsMasteryStrip />

      <WhoIsThisFor />

      <DACurriculumSection onOpenBrochure={() => openForm("curriculum_brochure")} />

      <CertificationStrip />

      <CareerServices />

      <DALearningModes onOpenDemo={() => openForm("learning_modes_demo")} />

      <HowToEnrol onOpenEligibility={(src) => openForm(src)} />

      <FAQSection category="data-analytics" />

      <BottomCTA onOpenEligibility={(src) => openForm(src)} />

      <Footer />

      {formOpen && (
        <FormOverlay 
          isOpen={formOpen} 
          onClose={() => setFormOpen(false)} 
          source={formSource}
          onSubmitSuccess={handleFormSubmit}
        />
      )}
    </main>
  );
}
