import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSiteContent } from "../hooks/useSiteContent";
import {
  replacePathLocale,
  supportedLanguages,
  urlLocaleFromLanguage
} from "../i18n/locale";
import { optimizeImageUrl, resolveImageResource } from "../utils/imageUrls";
import { englishMetadata, pageKeys, productionSiteUrl } from "../seo/metadata";

const ogLocaleByLanguage = {
  en: "en_US",
  vi: "vi_VN",
  ko: "ko_KR",
  "zh-CN": "zh_CN"
} as const;

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function upsertJsonLd(value: Record<string, unknown>) {
  let element = document.head.querySelector<HTMLScriptElement>('script[data-seo="json-ld"]');
  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.seo = "json-ld";
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(value).replace(/</gu, "\\u003c");
}

function absoluteUrl(baseUrl: string, value: string): string {
  try {
    return new URL(value, `${baseUrl}/`).toString();
  } catch {
    return `${baseUrl}/og-image.png`;
  }
}

function internationalPhone(phone: string): string {
  const digits = phone.replace(/\D/gu, "");
  if (digits.startsWith("0")) return `+84${digits.slice(1)}`;
  return phone;
}

function getSiteBaseUrl(): string {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/u, "");

  const currentOrigin = window.location.origin.replace(/\/$/u, "");
  const hostname = window.location.hostname.toLowerCase();
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  return isLocal ? currentOrigin : productionSiteUrl;
}

export function SeoManager() {
  const location = useLocation();
  const { brand, imageResources, isLoading, language, spaServices, blogPosts, t } = useSiteContent();

  const page = useMemo(() => {
    const [, ...pathSegments] = location.pathname.split("/").filter(Boolean);
    const [section = "", slug] = pathSegments;
    const service = section === "services" && slug && pathSegments.length === 2
      ? spaServices.find((item) => item.slug === slug)
      : undefined;
    const post = section === "blog" && slug && pathSegments.length === 2
      ? blogPosts.find((item) => item.slug === slug)
      : undefined;
    const knownPage = (Boolean(pageKeys[section]) || section === "") && pathSegments.length <= 1;
    const pageKey = pageKeys[section] || "notFound";

    if (service) {
      return {
        pageKey: "service",
        title: service.seoTitle || `${service.name} in Da Nang | ${brand.name}`,
        description:
          service.seoDescription ||
          `${service.shortDescription} View duration and price, then book at ${brand.name} in Da Nang.`,
        image: service.imageUrl,
        imageAlt: service.name,
        service,
        post: undefined,
        isPending: false,
        isNotFound: false
      };
    }

    if (post) {
      return {
        pageKey: "article",
        title: `${post.title} | ${brand.name}`,
        description: post.excerpt,
        image: post.imageUrl,
        imageAlt: post.title,
        service: undefined,
        post,
        isPending: false,
        isNotFound: false
      };
    }

    const fallback = englishMetadata[knownPage ? pageKey : "notFound"];
    const isPending = isLoading
      && pathSegments.length === 2
      && ((section === "services" && !service) || (section === "blog" && !post));
    return {
      pageKey,
      title: t(`seo.${pageKey}.title`, fallback.title),
      description: t(`seo.${pageKey}.description`, fallback.description),
      image: "/og-image.png",
      imageAlt: `${brand.name} in Da Nang`,
      service: undefined,
      post: undefined,
      isPending,
      isNotFound: !knownPage
    };
  }, [blogPosts, brand.name, isLoading, location.pathname, spaServices, t]);

  useEffect(() => {
    if (page.isPending) return;

    const baseUrl = getSiteBaseUrl();
    const canonicalUrl = `${baseUrl}${location.pathname}`;
    const imageUrl = absoluteUrl(baseUrl, optimizeImageUrl(page.image, 1600));
    const logoPath = resolveImageResource(imageResources, "header.logo", 480);
    const logoUrl = logoPath ? absoluteUrl(baseUrl, logoPath) : undefined;
    const indexAllLocales = import.meta.env.VITE_INDEX_ALL_LOCALES === "true";
    const shouldIndex = !page.isNotFound && (language === "en" || indexAllLocales);

    document.title = page.title;
    upsertMeta('meta[name="description"]', { name: "description", content: page.description });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: shouldIndex ? "index, follow, max-image-preview:large" : "noindex, follow"
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: page.post ? "article" : "website"
    });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: brand.name });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: ogLocaleByLanguage[language]
    });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: page.title });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: page.description
    });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    upsertMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: page.imageAlt
    });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: page.title });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: page.description
    });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
    upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });

    document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((element) => element.remove());
    if (indexAllLocales) {
      supportedLanguages.forEach((targetLanguage) => {
        const href = `${baseUrl}${replacePathLocale(location.pathname, targetLanguage)}`;
        upsertLink(`link[rel="alternate"][hreflang="${targetLanguage}"]`, {
          rel: "alternate",
          hreflang: targetLanguage,
          href
        });
      });
      upsertLink('link[rel="alternate"][hreflang="x-default"]', {
        rel: "alternate",
        hreflang: "x-default",
        href: `${baseUrl}${replacePathLocale(location.pathname, "en")}`
      });
    }

    const addressParts = brand.address.split(",").map((part) => part.trim());
    const businessId = `${baseUrl}/#business`;
    const business = {
      "@type": "DaySpa",
      "@id": businessId,
      name: brand.name,
      url: `${baseUrl}/en`,
      ...(logoUrl ? { logo: logoUrl } : {}),
      telephone: internationalPhone(brand.hotline),
      email: brand.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: addressParts[0] || brand.address,
        addressLocality: addressParts.slice(1).join(", ") || "Da Nang",
        addressCountry: "VN"
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: brand.openingHours.opens,
        closes: brand.openingHours.closes
      },
      areaServed: { "@type": "City", name: "Da Nang" },
      sameAs: [brand.facebookUrl, brand.instagramUrl, brand.tiktokUrl].filter(Boolean)
    };
    const graph: Record<string, unknown>[] = [business];

    if (location.pathname === `/${urlLocaleFromLanguage(language)}`) {
      graph.push({
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: brand.name,
        url: `${baseUrl}/en`,
        inLanguage: language,
        publisher: { "@id": businessId }
      });
    }

    if (page.service) {
      graph.push({
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        name: page.service.name,
        description: page.service.description,
        image: imageUrl,
        url: canonicalUrl,
        provider: { "@id": businessId },
        areaServed: { "@type": "City", name: "Da Nang" },
        offers: {
          "@type": "Offer",
          price: page.service.priceFromVnd || page.service.priceVnd,
          priceCurrency: "VND",
          availability: "https://schema.org/InStock",
          url: canonicalUrl
        }
      });
    }

    if (page.post) {
      graph.push({
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        headline: page.post.title,
        description: page.post.excerpt,
        image: imageUrl,
        url: canonicalUrl,
        datePublished: page.post.publishedAt,
        inLanguage: language,
        author: { "@id": businessId },
        publisher: { "@id": businessId },
        mainEntityOfPage: canonicalUrl
      });
    }

    const pathSegments = location.pathname.split("/").filter(Boolean).slice(1);
    if (pathSegments.length && !page.isNotFound) {
      const labels: Record<string, string> = {
        about: t("nav.about", "About"),
        services: t("nav.services", "Services"),
        packages: t("nav.packages", "Packages"),
        booking: t("nav.booking", "Booking"),
        contact: t("nav.contact", "Contact"),
        gallery: t("nav.gallery", "Gallery"),
        blog: t("nav.blog", "Blog")
      };
      const localePath = `/${urlLocaleFromLanguage(language)}`;
      const itemListElement: Record<string, unknown>[] = [
        { "@type": "ListItem", position: 1, name: t("nav.home", "Home"), item: `${baseUrl}${localePath}` }
      ];
      pathSegments.forEach((segment, index) => {
        const path = `${localePath}/${pathSegments.slice(0, index + 1).join("/")}`;
        itemListElement.push({
          "@type": "ListItem",
          position: index + 2,
          name: index === pathSegments.length - 1
            ? page.service?.name || page.post?.title || labels[segment] || segment
            : labels[segment] || segment,
          item: `${baseUrl}${path}`
        });
      });
      graph.push({ "@type": "BreadcrumbList", itemListElement });
    }

    upsertJsonLd({ "@context": "https://schema.org", "@graph": graph });
    document.documentElement.lang = language;
    document.documentElement.dataset.locale = urlLocaleFromLanguage(language);
  }, [brand, imageResources, language, location.pathname, page, t]);

  return null;
}
