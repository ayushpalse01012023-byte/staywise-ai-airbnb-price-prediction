import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import WorkflowSection from "../components/landing/WorkflowSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import DashboardPreviewSection from "../components/landing/DashboardPreviewSection";
import Footer from "../components/common/Footer";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <WorkflowSection />
      <FeaturesSection />
      <DashboardPreviewSection />
      <Footer />
    </>
  );
}

export default LandingPage;