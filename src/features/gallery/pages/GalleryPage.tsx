import { useCallback, useMemo, useState } from "react";
import { Play } from "lucide-react";
import { serviceGalleryCollections } from "../../../data/serviceGalleryImages";
import { ImageLightbox } from "../../../shared/components/ImageLightbox";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import type { GalleryImage } from "../../../shared/types/spa";
import {
  hasTreatmentGalleryConfiguration,
  selectGeneralGalleryImages
} from "../../../shared/utils/galleryImages";
import {
  applyImageFallback,
  optimizeImageUrl
} from "../../../shared/utils/imageUrls";

export function GalleryPage() {
  const { galleryImages, spaServices, t } = useSiteContent();

  const allLabel = t("common.all", "All");
  const serviceLabel = t("nav.services", "Services");
  const [category, setCategory] = useState("__all__");
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const configuredGalleryImages = useMemo(
    () => selectGeneralGalleryImages(galleryImages),
    [galleryImages]
  );
  const fallbackTreatmentImages = useMemo<GalleryImage[]>(
    () => {
      if (hasTreatmentGalleryConfiguration(galleryImages)) return [];

      return serviceGalleryCollections.flatMap((collection) => {
        const service = spaServices.find((item) => item.id === collection.serviceId);
        if (!service) return [];
        return [{
          id: `service-${collection.serviceId}`,
          title: service.name,
          category: serviceLabel,
          imageUrl: collection.featuredImage,
          mediaType: "image" as const
        }];
      });
    },
    [galleryImages, serviceLabel, spaServices]
  );
  const allImages = useMemo(
    () => [...configuredGalleryImages, ...fallbackTreatmentImages],
    [configuredGalleryImages, fallbackTreatmentImages]
  );
  const categories = [
    "__all__",
    ...Array.from(new Set(allImages.map((image) => image.category)))
  ];
  const images = category === "__all__"
    ? allImages
    : allImages.filter((image) => image.category === category);
  const lightboxImages = images.filter((image) => image.imageUrl && !image.videoUrl);
  const activeIndex = activeImageId
    ? lightboxImages.findIndex((image) => image.id === activeImageId)
    : -1;
  const closeLightbox = useCallback(() => setActiveImageId(null), []);
  const changeImage = useCallback(
    (index: number) => setActiveImageId(lightboxImages[index]?.id ?? null),
    [lightboxImages]
  );

  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <SectionTitle
          headingLevel="h1"
          eyebrow={t("nav.gallery", "Gallery")}
          title={t("gallery.title", "Fiona Spa space and treatments")}
          description={t(
            "gallery.description",
            "Browse massage rooms, shampoo area, facial care and nail services."
          )}
        />
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-bold ${category === item ? "bg-terracotta text-white" : "bg-blush text-copper"}`}
            >
              {item === "__all__" ? allLabel : item}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => {
            const cardClass = "group relative aspect-[4/3] overflow-hidden rounded-lg text-left shadow-soft";
            const content = image.imageUrl ? (
              <img
                src={optimizeImageUrl(image.imageUrl, 900)}
                onError={({ currentTarget }) =>
                  applyImageFallback(currentTarget, image.imageFallback, 900)
                }
                alt={image.title}
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="grid h-full place-items-center bg-cocoa text-center font-bold text-white">
                {t("gallery.watchVideo", "Watch video")}
              </div>
            );
            const caption = (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/80 to-transparent p-4 font-bold text-white">
                {image.title}
              </span>
            );

            return image.videoUrl ? (
              <a
                key={image.id}
                href={image.videoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${t("gallery.watchVideo", "Watch video")}: ${image.title}`}
                className={cardClass}
              >
                {content}
                <span className="absolute inset-0 grid place-items-center bg-cocoa/15 transition group-hover:bg-cocoa/25" aria-hidden="true">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-terracotta shadow-soft transition group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/90 to-transparent p-4 text-white">
                  <span className="block font-bold">{image.title}</span>
                  <span className="mt-1 block text-sm">{t("gallery.watchVideo", "Watch video")}</span>
                </span>
              </a>
            ) : (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageId(image.id)}
                className={cardClass}
              >
                {content}
                {caption}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://www.instagram.com/fionaspa.danang"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-terracotta px-6 py-3 font-bold text-terracotta transition hover:bg-blush"
          >
            Xem thêm hình ảnh tại instagram
          </a>
        </div>

        <ImageLightbox
          images={lightboxImages.map((image) => image.imageUrl)}
          fallbackImages={lightboxImages.map((image) => image.imageFallback)}
          activeIndex={activeIndex >= 0 ? activeIndex : null}
          altPrefix={t("nav.gallery", "Gallery")}
          onChange={changeImage}
          onClose={closeLightbox}
        />
      </div>
    </section>
  );
}
