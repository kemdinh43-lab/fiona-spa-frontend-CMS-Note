import type { GalleryImage } from "../types/spa";

const missingOrder = Number.MAX_SAFE_INTEGER;

export function hasTreatmentGalleryConfiguration(images: GalleryImage[]): boolean {
  return images.some((image) => image.useInTreatmentGallery !== undefined);
}

export function selectGeneralGalleryImages(images: GalleryImage[]): GalleryImage[] {
  return images
    .filter((image) => image.useInGallery !== false)
    .slice()
    .sort(
      (left, right) =>
        (left.gallerySortOrder ?? missingOrder) -
        (right.gallerySortOrder ?? missingOrder)
    );
}

export function selectTreatmentGalleryImages(
  images: GalleryImage[],
  serviceId: string
): GalleryImage[] {
  return images
    .filter(
      (image) =>
        image.useInTreatmentGallery === true &&
        image.serviceId === serviceId &&
        Boolean(image.imageUrl)
    )
    .slice()
    .sort(
      (left, right) =>
        (left.treatmentSortOrder ?? missingOrder) -
        (right.treatmentSortOrder ?? missingOrder)
    );
}
