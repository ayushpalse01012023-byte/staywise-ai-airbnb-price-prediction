import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import WorkflowSection from "../components/landing/WorkflowSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import DashboardPreviewSection from "../components/landing/DashboardPreviewSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import TechStackSection from "../components/landing/TechStackSection";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <WorkflowSection />
      <FeaturesSection />
      <DashboardPreviewSection />
      <TestimonialsSection />
      <TechStackSection />
    </>
  );
}

export default LandingPage;