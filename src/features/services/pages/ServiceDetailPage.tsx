import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  LocalizedLink as Link
} from "../../../shared/components/LocalizedLink";
import { NotFoundPage } from "../../not-found/pages/NotFoundPage";
import { PriceText } from "../../../shared/components/PriceText";
import { RatingStars } from "../../../shared/components/RatingStars";
import { ServiceCard } from "../../../shared/components/ServiceCard";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import {
  applyImageFallback,
  optimizeImageUrl
} from "../../../shared/utils/imageUrls";
import { ServiceTreatmentGallery } from "../components/ServiceTreatmentGallery";

export function ServiceDetailPage() {
  const { spaServices, isLoading, t } = useSiteContent();
  const { slug } = useParams();
  const service = spaServices.find((item) => item.slug === slug);

  if (!service && isLoading) {
    return (
      <section className="section-pad min-h-[calc(100vh-5rem)] bg-cream text-center text-taupe">
        {t("services.loading", "Loading service...")}
      </section>
    );
  }
  if (!service) return <NotFoundPage />;

  const related = spaServices.filter((item) => item.categoryId === service.categoryId && item.id !== service.id).slice(0, 3);

  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <Link to="/services" className="mb-8 inline-flex items-center gap-2 font-bold text-terracotta">
          <ArrowLeft className="h-4 w-4" />
          {t("services.back", "Back to services")}
        </Link>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="overflow-hidden rounded-lg shadow-soft">
            <img
              src={optimizeImageUrl(service.imageUrl, 1600)}
              onError={({ currentTarget }) =>
                applyImageFallback(currentTarget, service.imageFallback, 1600)
              }
              alt={service.name}
              width={1200}
              height={900}
              fetchPriority="high"
              className="h-full min-h-[420px] w-full object-cover"
            />
          </div>
          <div className="rounded-lg border border-blush bg-ivory p-6 shadow-soft">
            {service.rating > 0 ? <RatingStars rating={service.rating} /> : null}
            <h1 className="mt-4 font-display text-4xl font-bold text-cocoa">{service.name}</h1>
            <p className="mt-4 text-base leading-8 text-taupe">{service.description}</p>
            {service.notes ? (
              <p className="mt-4 rounded-lg bg-blush/60 p-4 text-sm font-semibold leading-6 text-copper">
                {service.notes}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-5">
              {service.durationMinutes ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 font-bold text-copper">
                  <Clock className="h-5 w-5" />
                  {t("common.minutes", "{minutes} minutes", {
                    minutes: service.durationMinutes
                  })}
                </span>
              ) : null}
              <PriceText
                priceVnd={service.priceVnd}
                priceUsd={service.priceUsd}
                originalPriceVnd={service.originalPriceVnd}
                priceFromVnd={service.priceFromVnd}
                priceFromUsd={service.priceFromUsd}
              />
            </div>
            <Link
              to={`/booking?service=${service.id}`}
              className="mt-7 inline-flex rounded-full bg-terracotta px-7 py-4 font-bold text-white hover:bg-copper"
            >
              {t("common.bookNow", "Book Now")}
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-blush bg-ivory p-6 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              {t("services.benefits", "Benefits")}
            </h2>
            <div className="mt-5 grid gap-3">
              {service.benefits.map((item) => (
                <p key={item} className="flex items-center gap-3 font-semibold text-cocoa">
                  <CheckCircle2 className="h-5 w-5 text-sage" />
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-blush bg-ivory p-6 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              {t("services.process", "Process")}
            </h2>
            <ol className="mt-5 grid gap-3">
              {service.process.map((item, index) => (
                <li key={item} className="flex gap-3 font-semibold text-cocoa">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-terracotta text-sm text-white">{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <ServiceTreatmentGallery serviceId={service.id} serviceName={service.name} />

        {related.length ? (
          <div className="mt-14">
            <h2 className="font-display text-3xl font-bold text-cocoa">
              {t("services.related", "Related services")}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <ServiceCard key={item.id} service={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
