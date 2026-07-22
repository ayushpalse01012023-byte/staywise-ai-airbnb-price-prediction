import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';

// Lazy-loaded pages (code splitting)
const LandingPage = lazy(() => import('../pages/LandingPage.jsx'));
const PredictPage = lazy(() => import('../pages/PredictPage.jsx'));
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'));
const HistoryPage = lazy(() => import('../pages/HistoryPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

// Minimal fallback for now — will be swapped for the branded Loader later
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="text-sm text-gray-400">Loading…</span>
    </div>
  );
}

function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;