import { CheckCircle2, Clock } from "lucide-react";
import { LocalizedLink as Link } from "./LocalizedLink";
import { useSiteContent } from "../hooks/useSiteContent";
import type { SpaPackage } from "../types/spa";
import { formatVnd } from "../utils/formatCurrency";
import { applyImageFallback, optimizeImageUrl } from "../utils/imageUrls";

interface PackageCardProps {
  item: SpaPackage;
}

export function PackageCard({ item }: PackageCardProps) {
  const { spaServices, t } = useSiteContent();
  const included =
    item.includedItems?.length
      ? item.includedItems
      : item.serviceIds
          .map((serviceId) => spaServices.find((service) => service.id === serviceId)?.name)
          .filter((name): name is string => Boolean(name));

  return (
    <article className="overflow-hidden rounded-lg border border-blush bg-ivory shadow-soft">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={optimizeImageUrl(item.imageUrl, 800)}
          onError={({ currentTarget }) =>
            applyImageFallback(currentTarget, item.imageFallback, 800)
          }
          alt={item.name}
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-5 p-6">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-blush px-3 py-1 text-xs font-bold uppercase text-copper">
            <Clock className="h-3.5 w-3.5" />
            {t("common.minutes", "{minutes} minutes", {
              minutes: item.durationMinutes
            })}
          </p>
          <h3 className="font-display text-2xl font-bold text-cocoa">{item.name}</h3>
          <p className="mt-2 text-sm leading-6 text-taupe">{item.description}</p>
          {item.notes ? (
            <p className="mt-3 rounded-lg bg-blush/60 p-3 text-xs font-semibold leading-5 text-copper">
              {item.notes}
            </p>
          ) : null}
        </div>
        <ul className="space-y-2">
          {included.map((name) => (
            <li key={name} className="flex items-center gap-2 text-sm font-medium text-cocoa">
              <CheckCircle2 className="h-4 w-4 text-sage" />
              {name}
            </li>
          ))}
        </ul>
        <div>
          <p className="text-sm font-semibold text-taupe line-through">{formatVnd(item.originalPriceVnd)}</p>
          <p className="text-2xl font-bold text-terracotta">{formatVnd(item.salePriceVnd)}</p>
        </div>
        <Link
          to={`/booking?package=${item.id}`}
          className="block rounded-full bg-terracotta px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-copper"
        >
          {t("common.bookPackage", "Book Package")}
        </Link>
      </div>
    </article>
  );
}
