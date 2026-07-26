import DashboardHero from "../components/dashboard/DashboardHero";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardAnalytics from "../components/dashboard/DashboardAnalytics";

function DashboardPage() {
  return (
    <>
      <DashboardHero />
      <DashboardStats />
      <DashboardAnalytics />
    </>
  );
}

export default DashboardPage;