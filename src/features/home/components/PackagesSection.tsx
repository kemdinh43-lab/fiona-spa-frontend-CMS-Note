import { PackageCard } from "../../../shared/components/PackageCard";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";

export function PackagesSection() {
  const { spaPackages, t } = useSiteContent();

  return (
    <section className="section-pad bg-blush/60">
      <div className="container-page">
        <SectionTitle
          eyebrow={t("nav.packages", "Packages")}
          title={t("home.packages.title", "Relaxing combos for more value")}
          description={t(
            "home.packages.description",
            "Simple packages inspired by how spa guests usually book: body, face, hair and nails together."
          )}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {spaPackages
            .filter((item) => item.isFeatured)
            .map((item) => <PackageCard key={item.id} item={item} />)
          }
        </div>
      </div>
    </section>
  );
}
