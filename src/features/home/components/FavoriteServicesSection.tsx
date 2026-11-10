import { LocalizedLink as Link } from "../../../shared/components/LocalizedLink";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { ServiceCard } from "../../../shared/components/ServiceCard";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";

export function FavoriteServicesSection() {
  const { spaServices, t } = useSiteContent();
  const favorites = spaServices.filter((service) => service.isFavorite);

  return (
    <section className="section-pad bg-ivory">
      <div className="container-page">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            align="left"
            eyebrow={t("home.favorites.eyebrow", "Most favorite service")}
            title={t("home.favorites.title", "Guest favorites with clear pricing")}
            description={t(
              "home.favorites.description",
              "Popular treatments for international travelers and local guests."
            )}
          />
          <Link to="/services" className="rounded-full border border-terracotta px-5 py-3 text-center text-sm font-bold text-terracotta hover:bg-blush">
            {t("common.exploreAll", "Explore All")}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
