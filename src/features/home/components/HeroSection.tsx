import { CalendarCheck, MapPin, Phone, Sparkles } from "lucide-react";
import { LocalizedLink as Link } from "../../../shared/components/LocalizedLink";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import { resolveImageResource } from "../../../shared/utils/imageUrls";

export function HeroSection() {
  const { brand, imageResources, t } = useSiteContent();
  const heroImageUrl = resolveImageResource(imageResources, "home.hero", 1600);

  return (
    <section className="overflow-hidden bg-ivory">
      <div className="container-page grid min-h-[calc(100vh-5rem)] gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-bold text-copper">
            <Sparkles className="h-4 w-4" />
            {t("home.hero.eyebrow", "Spa, massage and beauty care in Da Nang")}
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight text-cocoa md:text-6xl">
            {t("home.hero.title", "Fiona Massage & Spa")}
          </h1>
          <p className="mt-5 text-xl font-semibold text-copper">{brand.slogan}</p>
          <p className="mt-5 max-w-xl text-base leading-8 text-taupe">
            {t(
              "home.hero.description",
              "Enjoy massage, facial care, nails, shampoo, threading, eyelash and waxing services in a warm and relaxing space."
            )}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-4 font-bold text-white hover:bg-copper">
              <CalendarCheck className="h-5 w-5" />
              {t("common.bookNow", "Book Now")}
            </Link>
            <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-full border border-terracotta px-7 py-4 font-bold text-terracotta hover:bg-blush">
              {t("common.viewServices", "View Services")}
            </Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm font-bold text-cocoa sm:grid-cols-2">
            <a href={brand.phoneHref} className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-terracotta" />
              {brand.hotline}
            </a>
            <a href={brand.mapUrl} className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-terracotta" />
              {brand.address}
            </a>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="h-[360px] overflow-hidden rounded-lg bg-blush shadow-soft sm:h-[560px]">
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt={t(
                  "home.hero.imageAlt",
                  "Relaxing massage room at Fiona Beauty and Spa"
                )}
                width={1600}
                height={1200}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
