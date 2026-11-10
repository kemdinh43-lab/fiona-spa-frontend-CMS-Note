import { CTASection } from "../../../shared/components/CTASection";
import { AboutPreviewSection } from "../components/AboutPreviewSection";
import { FavoriteServicesSection } from "../components/FavoriteServicesSection";
import { HeroSection } from "../components/HeroSection";
import { PackagesSection } from "../components/PackagesSection";
import { ServiceCategoriesSection } from "../components/ServiceCategoriesSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FavoriteServicesSection />
      <ServiceCategoriesSection />
      <PackagesSection />
      <AboutPreviewSection />
      <CTASection />
    </>
  );
}
