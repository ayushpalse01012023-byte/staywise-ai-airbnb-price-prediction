import { useState, useEffect } from "react";
import DashboardHero from "../components/dashboard/DashboardHero";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardAnalytics from "../components/dashboard/DashboardAnalytics";
import { getDashboardData } from "../api/dashboardApi";

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardData();
        if (!isMounted) return;
        setDashboardData(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to fetch dashboard data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <DashboardHero />
      <DashboardStats data={dashboardData} loading={loading} error={error} />
      <DashboardAnalytics data={dashboardData} loading={loading} error={error} />
    </>
  );
}

export default DashboardPage;