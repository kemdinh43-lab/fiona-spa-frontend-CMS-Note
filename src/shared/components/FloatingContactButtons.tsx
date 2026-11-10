import { CalendarCheck, Instagram, MapPin, Phone } from "lucide-react";
import { WechatIcon, WhatsappIcon } from "./ContactIcons";
import { useSiteContent } from "../hooks/useSiteContent";

export function FloatingContactButtons() {
  const { brand } = useSiteContent();
  const actions = [
    { label: "Phone", href: brand.phoneHref, icon: Phone },
    { label: "WhatsApp", href: brand.whatsappUrl, icon: WhatsappIcon },
    { label: "WeChat", href: brand.wechatUrl, icon: WechatIcon },
    { label: "Instagram", href: brand.instagramUrl, icon: Instagram },
    { label: "Map", href: brand.mapUrl, icon: MapPin }
  ];

  return (
    <div data-analytics-placement="floating_contact" className="fixed bottom-3 left-2 right-2 z-50 flex flex-nowrap items-center justify-center gap-1.5 rounded-full border border-blush bg-ivory/95 p-1 shadow-soft backdrop-blur sm:gap-2 sm:p-1.5 md:bottom-auto md:left-auto md:right-5 md:top-1/2 md:-translate-y-1/2 md:flex-col md:p-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.label}
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel={action.href.startsWith("http") ? "noreferrer" : undefined}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-copper transition hover:bg-terracotta hover:text-white"
            aria-label={action.label}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
      <a href="/en/booking" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-terracotta text-white transition hover:bg-copper" aria-label="Book Now">
        <CalendarCheck className="h-5 w-5" />
      </a>
    </div>
  );
}
