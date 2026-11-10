import { CalendarCheck, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { useSiteContent } from "../hooks/useSiteContent";
import { resolveImageResource } from "../utils/imageUrls";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  LocalizedLink as Link,
  LocalizedNavLink as NavLink
} from "./LocalizedLink";

const navItems = [
  { key: "nav.home", label: "Home", href: "/" },
  { key: "nav.about", label: "About Us", href: "/about" },
  { key: "nav.services", label: "Services", href: "/services" },
  { key: "nav.packages", label: "Packages", href: "/packages" },
  { key: "nav.gallery", label: "Gallery", href: "/gallery" },
  { key: "nav.blog", label: "Blog", href: "/blog" },
  { key: "nav.contact", label: "Contact", href: "/contact" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { brand, imageResources, t } = useSiteContent();
  const logoUrl = resolveImageResource(imageResources, "header.logo", 360);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-bold transition ${isActive ? "text-terracotta" : "text-cocoa hover:text-terracotta"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-blush/80 bg-ivory/95 shadow-sm backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center" aria-label={brand.name} onClick={() => setOpen(false)}>
          {logoUrl ? (
            <img src={logoUrl} alt={brand.name} className="h-12 w-auto max-w-[155px] object-contain sm:h-14 sm:max-w-[180px]" />
          ) : (
            <span className="font-display text-xl font-bold text-cocoa">{brand.name}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={navLinkClass}>
              {t(item.key, item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={brand.phoneHref} className="inline-flex items-center gap-2 text-sm font-bold text-cocoa hover:text-terracotta">
            <Phone className="h-4 w-4" />
            {brand.hotline}
          </a>
          <LanguageSwitcher />
          <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-white hover:bg-copper">
            <CalendarCheck className="h-4 w-4" />
            {t("common.bookNow", "Book Now")}
          </Link>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-blush text-cocoa lg:hidden"
          aria-label={t("header.openMenu", "Open menu")}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-blush bg-ivory lg:hidden">
          <nav className="container-page grid gap-1 py-4">
            {navItems.map((item) => (
              <NavLink key={item.href} to={item.href} className={navLinkClass} onClick={() => setOpen(false)}>
                <span className="block rounded-lg px-2 py-3">{t(item.key, item.label)}</span>
              </NavLink>
            ))}
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-terracotta px-5 py-3 text-center text-sm font-bold text-white"
            >
              {t("common.bookNow", "Book Now")}
            </Link>
            <div className="mt-3">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
