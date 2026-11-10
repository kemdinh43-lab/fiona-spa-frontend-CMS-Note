import { CalendarCheck, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { WechatIcon, WhatsappIcon } from "../../../shared/components/ContactIcons";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { LocalizedLink as Link } from "../../../shared/components/LocalizedLink";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";

export function ContactPage() {
  const { brand, t } = useSiteContent();
  const workingHours = `${brand.openingHours.opens} - ${brand.openingHours.closes}`;

  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <SectionTitle
          headingLevel="h1"
          eyebrow={t("nav.contact", "Contact")}
          title={t("contact.title", "Visit Fiona Massage & Spa")}
          description={t(
            "contact.description",
            "Find our spa in An Hai ward, check daily opening hours, get directions or contact us before your visit."
          )}
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border border-blush bg-ivory p-6 shadow-soft">
            <div data-analytics-placement="contact" className="grid gap-4">
              <a href={brand.phoneHref} className="flex items-center gap-3 rounded-lg bg-blush p-4 font-bold text-cocoa">
                <Phone className="h-5 w-5 text-terracotta" />
                {brand.hotline}
              </a>
              <div className="grid grid-cols-3 gap-2">
                <a href={brand.zaloUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1 rounded-lg bg-blush px-1 py-3 text-xs font-bold text-cocoa sm:flex-row sm:gap-2 sm:text-sm">
                  <MessageCircle className="h-5 w-5 shrink-0 text-terracotta" />
                  Zalo
                </a>
                <a href={brand.whatsappUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1 rounded-lg bg-blush px-1 py-3 text-xs font-bold text-cocoa sm:flex-row sm:gap-2 sm:text-sm">
                  <WhatsappIcon className="h-5 w-5 shrink-0 text-terracotta" />
                  WhatsApp
                </a>
                <a href={brand.wechatUrl} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1 rounded-lg bg-blush px-1 py-3 text-xs font-bold text-cocoa sm:flex-row sm:gap-2 sm:text-sm">
                  <WechatIcon className="h-5 w-5 shrink-0 text-terracotta" />
                  WeChat
                </a>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a href={brand.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-blush p-4 font-bold text-cocoa">
                  <Facebook className="h-5 w-5 shrink-0 text-terracotta" />
                  Facebook
                </a>
                <a href={brand.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-blush p-4 font-bold text-cocoa">
                  <Instagram className="h-5 w-5 shrink-0 text-terracotta" />
                  Instagram
                </a>
              </div>
              <a href={`mailto:${brand.email}`} className="flex items-center gap-3 rounded-lg bg-blush p-4 font-bold text-cocoa">
                <Mail className="h-5 w-5 shrink-0 text-terracotta" />
                <span className="min-w-0 break-all">{brand.email}</span>
              </a>
              <a href={brand.mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg bg-blush p-4 font-bold text-cocoa">
                <MapPin className="h-5 w-5 text-terracotta" />
                {brand.address}
              </a>
              <p className="rounded-lg bg-blush p-4 font-bold text-cocoa">
                {t("common.openingHours", "Opening hours: {hours}", {
                  hours: workingHours
                })}
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-blush bg-ivory shadow-soft">
            <iframe
              title={t("contact.mapTitle", "Fiona Beauty and Spa map")}
              src="https://www.google.com/maps?q=16.0654914%2C108.2413622&output=embed"
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="mt-8 rounded-lg border border-blush bg-ivory p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold text-cocoa">
            {t("contact.planVisit", "Plan your visit")}
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-taupe">
            {t(
              "contact.planVisitDescription",
              "Send an appointment request before you arrive. Our team will confirm the selected service and time with you."
            )}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 font-bold text-white hover:bg-copper">
              <CalendarCheck className="h-5 w-5" />
              {t("common.bookNow", "Book Now")}
            </Link>
            <a href={brand.directionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-terracotta px-6 py-3 font-bold text-terracotta hover:bg-blush">
              <MapPin className="h-5 w-5" />
              {t("contact.getDirections", "Get directions")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
