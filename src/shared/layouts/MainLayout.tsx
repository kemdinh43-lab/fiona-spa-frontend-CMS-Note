import { Outlet } from "react-router-dom";
import { FloatingContactButtons } from "../components/FloatingContactButtons";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { AnalyticsManager } from "../components/AnalyticsManager";
import { ScrollManager } from "../components/ScrollManager";
import { SeoManager } from "../components/SeoManager";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-cream text-cocoa">
      <ScrollManager />
      <SeoManager />
      <AnalyticsManager />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingContactButtons />
    </div>
  );
}
