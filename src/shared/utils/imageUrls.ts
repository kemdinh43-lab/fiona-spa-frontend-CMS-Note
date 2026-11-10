import type { ImageResources } from "../types/spa";

export function optimizeImageUrl(
  value: string,
  width: number,
  quality = 80
): string {
  if (!value) return "";

  try {
    const url = new URL(value);
    if (!url.hostname.toLowerCase().endsWith("imagekit.io")) return value;

    const segments = url.pathname.split("/").filter(Boolean);
    if (!segments.length) return value;

    const transform = `tr:w-${Math.round(width)},q-${quality},f-auto`;
    const existingTransform = segments.findIndex((segment) => segment.startsWith("tr:"));
    if (existingTransform >= 0) {
      segments[existingTransform] = transform;
    } else {
      segments.splice(1, 0, transform);
    }

    url.pathname = `/${segments.join("/")}`;
    return url.toString();
  } catch {
    return value;
  }
}

export function applyImageFallback(
  image: HTMLImageElement,
  fallbackUrl: string | undefined,
  width: number,
  quality = 80
): void {
  if (!fallbackUrl || image.dataset.fallbackApplied === "true") return;

  image.dataset.fallbackApplied = "true";
  image.src = optimizeImageUrl(fallbackUrl, width, quality);
}

export function resolveImageResource(
  resources: ImageResources | undefined,
  key: string,
  width: number
): string {
  const resource = resources?.[key];
  return optimizeImageUrl(resource?.imageUrl || resource?.imageFallback || "", width);
}
