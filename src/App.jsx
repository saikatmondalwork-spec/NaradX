import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Public
import LandingPage from './pages/LandingPage';
import ReportIssuePage from './pages/ReportIssuePage';
import ReportSuccessPage from './pages/ReportSuccessPage';

// Pages - Dashboard
import DashboardPage from './pages/DashboardPage';
import HotspotsPage from './pages/HotspotsPage';
import AreaIntelligencePage from './pages/AreaIntelligencePage';
import AIExplanationPage from './pages/AIExplanationPage';
import RecommendationsPage from './pages/RecommendationsPage';
import CitizenReportsPage from './pages/CitizenReportsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import DataSourcesPage from './pages/DataSourcesPage';

import ScrollToTop from './components/common/ScrollToTop';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/report/success" element={<ReportSuccessPage />} />
        </Route>

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="hotspots" element={<HotspotsPage />} />
          <Route path="areas/:id" element={<AreaIntelligencePage />} />
          <Route path="areas/:id/explain" element={<AIExplanationPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="reports" element={<CitizenReportsPage />} />
          <Route path="ai" element={<AIInsightsPage />} />
          <Route path="data" element={<DataSourcesPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
