import {
  blogPosts,
  brand,
  galleryImages,
  reviews,
  serviceCategories,
  spaPackages,
  spaServices
} from "../../data/mockData";
import type { SiteContentResponse } from "../types/spa";

export function getFallbackSiteContent(): SiteContentResponse {
  return {
    brand,
    serviceCategories,
    spaServices: spaServices.filter((service) => service.isActive),
    spaPackages,
    reviews,
    galleryImages,
    blogPosts,
    imageResources: {},
    translations: { en: {}, vi: {}, ko: {}, "zh-CN": {} },
    serviceTranslations: {},
    source: "fallback",
    updatedAt: new Date().toISOString()
  };
}

export async function fetchSiteContent(signal?: AbortSignal, refresh = false) {
  const response = await fetch(`/api/site-content${refresh ? "?refresh=1" : ""}`, {
    headers: { Accept: "application/json" },
    signal
  });

  if (!response.ok) {
    throw new Error(`Site content request failed with ${response.status}`);
  }

  return (await response.json()) as SiteContentResponse;
}
