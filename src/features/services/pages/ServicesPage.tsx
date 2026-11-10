import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { ServiceCard } from "../../../shared/components/ServiceCard";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";

type SortKey = "featured" | "price" | "duration";

export function ServicesPage() {
  const { serviceCategories, spaServices, t } = useSiteContent();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");
  const category = searchParams.get("category") ?? "all";

  const services = useMemo(() => {
    return spaServices
      .filter((service) => category === "all" || service.categoryId === category)
      .filter((service) => service.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (sort === "price") return a.priceVnd - b.priceVnd;
        if (sort === "duration") {
          return (a.durationMinutes ?? Number.MAX_SAFE_INTEGER) -
            (b.durationMinutes ?? Number.MAX_SAFE_INTEGER);
        }
        return Number(b.isFavorite) - Number(a.isFavorite);
      });
  }, [category, query, sort, spaServices]);

  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <SectionTitle
          headingLevel="h1"
          eyebrow={t("nav.services", "Services")}
          title={t("services.title", "Massage, beauty and care menu")}
          description={t(
            "services.description",
            "Filter by category, search a treatment and book your preferred time."
          )}
        />

        <div className="mt-10 rounded-lg border border-blush bg-ivory p-4 shadow-soft">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-taupe" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("services.search", "Search service")}
                className="w-full rounded-full border border-blush bg-white px-12 py-3 outline-none focus:border-terracotta"
              />
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="rounded-full border border-blush bg-white px-5 py-3 font-semibold text-cocoa outline-none focus:border-terracotta"
            >
              <option value="featured">{t("services.sort.featured", "Featured first")}</option>
              <option value="price">{t("services.sort.price", "Sort by price")}</option>
              <option value="duration">{t("services.sort.duration", "Sort by duration")}</option>
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({})}
              className={`rounded-full px-4 py-2 text-sm font-bold ${category === "all" ? "bg-terracotta text-white" : "bg-blush text-copper"}`}
            >
              {t("common.all", "All")}
            </button>
            {serviceCategories.map((item) => (
              <button
                key={item.id}
                onClick={() => setSearchParams({ category: item.id })}
                className={`rounded-full px-4 py-2 text-sm font-bold ${category === item.id ? "bg-terracotta text-white" : "bg-blush text-copper"}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
