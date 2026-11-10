import { Badge, Eye, Flower2, Footprints, Paintbrush, Scissors, Sparkles, Waves } from "lucide-react";
import { LocalizedLink as Link } from "../../../shared/components/LocalizedLink";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import { formatVnd } from "../../../shared/utils/formatCurrency";

const iconMap = {
  flower: Flower2,
  sparkles: Sparkles,
  footprints: Footprints,
  paintbrush: Paintbrush,
  waves: Waves,
  scissors: Scissors,
  eye: Eye,
  badge: Badge
};

export function ServiceCategoriesSection() {
  const { serviceCategories, spaServices, t } = useSiteContent();

  return (
    <section className="section-pad bg-cream" id="service-categories">
      <div className="container-page">
        <SectionTitle
          eyebrow={t("home.categories.eyebrow", "Our services")}
          title={t("home.categories.title", "Beauty and relaxation in one place")}
          description={t(
            "home.categories.description",
            "Choose a focused service or combine treatments into a relaxing spa journey."
          )}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCategories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Sparkles;
            const categoryPrices = spaServices
              .filter((service) => service.categoryId === category.id)
              .map((service) => service.priceFromVnd ?? service.priceVnd);
            const firstPrice = categoryPrices.length ? Math.min(...categoryPrices) : undefined;
            return (
              <Link
                key={category.id}
                to={`/services?category=${category.id}`}
                className="group rounded-lg border border-blush bg-ivory p-5 shadow-soft transition hover:-translate-y-1 hover:border-terracotta"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-blush text-terracotta">
                    <Icon className="h-6 w-6" />
                  </span>
                  {firstPrice ? (
                    <span className="text-sm font-bold text-copper">
                      {t("common.fromPrice", "From {price}", {
                        price: formatVnd(firstPrice)
                      })}
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display text-xl font-bold text-cocoa group-hover:text-terracotta">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-taupe">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
