import { useEffect } from "react";
import {
  initializeAnalytics,
  trackAnalyticsEvent
} from "../analytics/ga4";

function linkChannel(url: URL): string | null {
  if (url.protocol === "tel:") return "phone";
  if (url.protocol === "mailto:") return "email";

  const hostname = url.hostname.replace(/^www\./u, "");
  if (hostname === "wa.me" || hostname.endsWith("whatsapp.com")) return "whatsapp";
  if (hostname === "u.wechat.com") return "wechat";
  if (hostname.endsWith("facebook.com")) return "facebook";
  if (hostname.endsWith("instagram.com")) return "instagram";
  if (hostname.endsWith("tiktok.com")) return "tiktok";
  if (hostname.endsWith("zalo.me")) return "zalo";
  if (hostname.endsWith("google.com") && url.pathname.startsWith("/maps")) return "map";
  return null;
}

function clickPlacement(element: Element): string {
  const declared = element.closest<HTMLElement>("[data-analytics-placement]")?.dataset.analyticsPlacement;
  if (declared) return declared;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return "content";
}

export function AnalyticsManager() {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    const trackClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      const placement = clickPlacement(anchor);
      const channel = linkChannel(url);
      if (channel) {
        trackAnalyticsEvent("contact_click", { channel, placement });
      }

      if (/\/(?:en|vi|ko|zh)\/booking\/?$/u.test(url.pathname)) {
        trackAnalyticsEvent("booking_cta_click", { placement });
      }
    };

    document.addEventListener("click", trackClick, { capture: true });
    return () => document.removeEventListener("click", trackClick, { capture: true });
  }, []);

  return null;
}
