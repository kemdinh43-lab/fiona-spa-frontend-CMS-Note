import { PackageCard } from "../../../shared/components/PackageCard";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";

export function PackagesPage() {
  const { spaPackages, t } = useSiteContent();

  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <SectionTitle
          headingLevel="h1"
          eyebrow={t("nav.packages", "Packages")}
          title={t("packages.title", "Spa packages for easy booking")}
          description={t(
            "packages.description",
            "Compare packages by duration, included treatments and sale price."
          )}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {spaPackages.map((item) => (
            <PackageCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
