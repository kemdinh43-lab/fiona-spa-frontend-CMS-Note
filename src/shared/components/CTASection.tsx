import { CalendarCheck, Phone } from "lucide-react";
import { LocalizedLink as Link } from "./LocalizedLink";
import { useSiteContent } from "../hooks/useSiteContent";

export function CTASection() {
  const { brand, t } = useSiteContent();

  return (
    <section className="section-pad bg-cocoa text-white">
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-olive">
            {t("cta.eyebrow", "Book your spa time")}
          </p>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            {t("cta.title", "Ready to relax in Da Nang?")}
          </h2>
          <p className="mt-4 max-w-2xl text-white/75">
            {t(
              "cta.description",
              "Send your preferred service and time. Fiona Massage & Spa will contact you by phone, Zalo, email or Facebook to confirm."
            )}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 font-bold text-white hover:bg-copper">
            <CalendarCheck className="h-5 w-5" />
            {t("common.bookNow", "Book Now")}
          </Link>
          <a href={brand.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10">
            <Phone className="h-5 w-5" />
            {brand.hotline}
          </a>
        </div>
      </div>
    </section>
  );
}
