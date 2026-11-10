import { Clock, Tag } from "lucide-react";
import { LocalizedLink as Link } from "./LocalizedLink";
import type { SpaService } from "../types/spa";
import { useSiteContent } from "../hooks/useSiteContent";
import { PriceText } from "./PriceText";
import { RatingStars } from "./RatingStars";
import { applyImageFallback, optimizeImageUrl } from "../utils/imageUrls";

interface ServiceCardProps {
  service: SpaService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useSiteContent();
  return (
    <article className="group overflow-hidden rounded-lg border border-blush bg-ivory shadow-soft">
      <Link to={`/services/${service.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={optimizeImageUrl(service.imageUrl, 800)}
            onError={({ currentTarget }) =>
              applyImageFallback(currentTarget, service.imageFallback, 800)
            }
            alt={service.name}
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {service.discountPercent ? (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-terracotta px-3 py-1 text-xs font-bold text-white">
              <Tag className="h-3.5 w-3.5" />
              {t("common.salePercent", "Sale {percent}%", {
                percent: service.discountPercent
              })}
            </span>
          ) : null}
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          {service.rating > 0 ? <RatingStars rating={service.rating} /> : <span />}
          {service.durationMinutes ? (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-taupe">
              <Clock className="h-4 w-4" />
              {service.durationMinutes}'
            </span>
          ) : (
            <span />
          )}
        </div>
        <div>
          <Link to={`/services/${service.slug}`} className="font-display text-xl font-bold text-cocoa hover:text-terracotta">
            {service.name}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-taupe">{service.shortDescription}</p>
        </div>
        <PriceText
          priceVnd={service.priceVnd}
          priceUsd={service.priceUsd}
          originalPriceVnd={service.originalPriceVnd}
          priceFromVnd={service.priceFromVnd}
          priceFromUsd={service.priceFromUsd}
          compact
        />
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/booking?service=${service.id}`}
            className="rounded-full bg-terracotta px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-copper"
          >
            {t("common.bookNow", "Book Now")}
          </Link>
          <Link
            to={`/services/${service.slug}`}
            className="rounded-full border border-terracotta px-4 py-3 text-center text-sm font-bold text-terracotta transition hover:bg-blush"
          >
            {t("common.detail", "Detail")}
          </Link>
        </div>
      </div>
    </article>
  );
}
