import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LocalizedLink as Link } from "./LocalizedLink";
import { useSiteContent } from "../hooks/useSiteContent";
import { resolveImageResource } from "../utils/imageUrls";

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M20.5 3.5A11.86 11.86 0 0 0 12.08 0C5.5 0 .14 5.35.14 11.94c0 2.1.55 4.15 1.59 5.96L.03 24l6.24-1.64a11.9 11.9 0 0 0 5.81 1.48h.01c6.58 0 11.93-5.36 11.93-11.94 0-3.19-1.24-6.19-3.52-8.4ZM12.09 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.7.97.99-3.61-.23-.37a9.88 9.88 0 0 1-1.51-5.26C2.23 6.47 6.65 2.06 12.09 2.06c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 7c0 5.44-4.43 9.84-9.88 9.84Zm5.41-7.38c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M16.7 1c.2 1.8 1.2 3.4 2.7 4.4 1 .7 2.2 1 3.4 1v4.1a11 11 0 0 1-6.1-1.8v7.6A7.7 7.7 0 1 1 10 8.7v4.2a3.6 3.6 0 1 0 2.5 3.4V1h4.2Z" />
    </svg>
  );
}

export function Footer() {
  const { brand, imageResources, serviceCategories, t } = useSiteContent();
  const workingHours = `${brand.openingHours.opens} - ${brand.openingHours.closes}`;
  const logoUrl = resolveImageResource(imageResources, "footer.logo", 480);
  const quickLinks = [
    { key: "nav.about", label: "About Us", href: "/about" },
    { key: "nav.services", label: "Services", href: "/services" },
    { key: "nav.packages", label: "Packages", href: "/packages" },
    { key: "nav.gallery", label: "Gallery", href: "/gallery" },
    { key: "nav.blog", label: "Blog", href: "/blog" },
    { key: "nav.contact", label: "Contact", href: "/contact" }
  ];

  return (
    <footer className="bg-ivory">
      <div className="container-page grid gap-10 border-t border-blush py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link to="/" className="inline-flex" aria-label={brand.name}>
            {logoUrl ? (
              <img src={logoUrl} alt={brand.name} className="h-20 w-auto max-w-[240px] object-contain" />
            ) : (
              <span className="font-display text-2xl font-bold text-cocoa">{brand.name}</span>
            )}
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-taupe">
            {t("footer.description", "A warm beauty destination for massage, facial care, nails, shampoo, eyelash, threading and waxing.")}
          </p>
          <div className="mt-5 flex gap-3">
            <a href={brand.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-blush text-copper">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={brand.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-blush text-copper">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={brand.tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok" className="grid h-10 w-10 place-items-center rounded-full bg-blush text-copper">
              <TiktokIcon />
            </a>
            <a href={brand.whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-blush text-copper">
              <WhatsappIcon />
            </a>
            <a href={brand.zaloUrl} target="_blank" rel="noreferrer" aria-label="Zalo" className="grid h-10 w-10 place-items-center rounded-full bg-blush text-copper">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-bold text-cocoa">{t("footer.quickLinks", "Quick links")}</h2>
          <div className="grid gap-3 text-sm font-semibold text-taupe">
            {quickLinks.map((item) => (
              <Link key={item.href} to={item.href} className="hover:text-terracotta">{t(item.key, item.label)}</Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-bold text-cocoa">{t("nav.services", "Services")}</h2>
          <div className="grid gap-3 text-sm font-semibold text-taupe">
            {serviceCategories.slice(0, 6).map((item) => (
              <Link key={item.id} to={`/services?category=${item.id}`} className="hover:text-terracotta">{item.name}</Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-bold text-cocoa">{t("nav.contact", "Contact")}</h2>
          <div className="grid gap-3 text-sm leading-6 text-taupe">
            <a href={brand.phoneHref} className="flex gap-2 font-semibold hover:text-terracotta">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
              {brand.hotline}
            </a>
            <a href={brand.mapUrl} target="_blank" rel="noreferrer" className="flex gap-2 font-semibold hover:text-terracotta">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
              {brand.address}
            </a>
            <a href={`mailto:${brand.email}`} className="flex gap-2 hover:text-terracotta">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
              {brand.email}
            </a>
            <p className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
              {t("common.openingHours", "Opening hours: {hours}", { hours: workingHours })}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-blush py-5 text-center text-sm text-taupe">
        <p>{t("footer.copyright", "Copyright © 2026 Fiona Massage & Spa. All rights reserved.")}</p>
      </div>
    </footer>
  );
}
