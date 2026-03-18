import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { RouteGuard } from "@/components/guards/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ContactsPage } from "@/pages/ContactsPage";
import { CallsPage } from "@/pages/CallsPage";
import { EstimatesPage } from "@/pages/EstimatesPage";
import { OpportunitiesPage } from "@/pages/OpportunitiesPage";
import { CampaignsPage } from "@/pages/CampaignsPage";
import { TemplatesPage } from "@/pages/TemplatesPage";
import { ReactivationPage } from "@/pages/ReactivationPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { IntegrationsPage } from "@/pages/IntegrationsPage";
import { WalkthroughPage } from "@/pages/WalkthroughPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/app"
              element={
                <RouteGuard>
                  <AppShell />
                </RouteGuard>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="calls" element={<CallsPage />} />
              <Route path="estimates" element={<EstimatesPage />} />
              <Route path="opportunities" element={<OpportunitiesPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="reactivation" element={<ReactivationPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route
                path="settings"
                element={
                  <RouteGuard roles={["owner", "manager"]}>
                    <SettingsPage />
                  </RouteGuard>
                }
              />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="walkthrough" element={<WalkthroughPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
