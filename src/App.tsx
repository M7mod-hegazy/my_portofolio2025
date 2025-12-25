import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { Seed } from "./pages/Seed";
import { LayoutWrapper } from "./components/LayoutWrapper";
import { ThemeProvider } from "./context/ThemeContext";
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminLayout } from "./components/admin/layout/AdminLayout";
import { DashboardHome } from "./components/admin/dashboard/DashboardHome";
import { HeroAdmin } from "./components/admin/hero/HeroAdmin";
import { SkillsAdmin } from "./components/admin/skills/SkillsAdmin";
import { ProjectsAdmin } from "./components/admin/projects/ProjectsAdmin";
import { JourneyAdmin } from "./components/admin/journey/JourneyAdmin";
import { ServicesAdmin } from "./components/admin/services/ServicesAdmin";
import { SettingsAdmin } from "./components/admin/settings/SettingsAdmin";
import { AboutAdmin } from "./components/admin/about/AboutAdmin";
import { CertificationsAdmin } from "./components/admin/certifications/CertificationsAdmin";
import "../src/styles/theme.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <LayoutWrapper>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="hero" element={<HeroAdmin />} />
                <Route path="skills" element={<SkillsAdmin />} />
                <Route path="projects" element={<ProjectsAdmin />} />
                <Route path="journey" element={<JourneyAdmin />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="settings" element={<SettingsAdmin />} />
                <Route path="hero" element={<HeroAdmin />} />
                <Route path="about" element={<AboutAdmin />} />
                <Route path="certifications" element={<CertificationsAdmin />} />
                {/* Add other admin sub-routes here */}
              </Route>

              {/* Legacy/Utility Routes */}
              <Route path="/seed" element={<Seed />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LayoutWrapper>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
