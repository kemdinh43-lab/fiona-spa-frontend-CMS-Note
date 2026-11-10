import { Images } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { serviceGalleryImages } from "../../../data/serviceGalleryImages";
import { ImageLightbox } from "../../../shared/components/ImageLightbox";
import { LocalizedLink as Link } from "../../../shared/components/LocalizedLink";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import type { GalleryImage, LanguageCode } from "../../../shared/types/spa";
import {
  hasTreatmentGalleryConfiguration,
  selectTreatmentGalleryImages
} from "../../../shared/utils/galleryImages";
import {
  applyImageFallback,
  optimizeImageUrl
} from "../../../shared/utils/imageUrls";

const localizedCopy: Record<LanguageCode, { title: string; description: string }> = {
  vi: {
    title: "Hình ảnh liệu trình thực tế",
    description:
      "Quan sát không gian và các thao tác chính trong liệu trình {serviceName} tại Fiona Massage & Spa."
  },
  en: {
    title: "Real treatment gallery",
    description:
      "See the setting and key techniques used during the {serviceName} treatment at Fiona Massage & Spa."
  },
  ko: {
    title: "실제 트리트먼트 갤러리",
    description:
      "Fiona Massage & Spa의 {serviceName} 트리트먼트 공간과 주요 테크닉을 사진으로 확인해 보세요."
  },
  "zh-CN": {
    title: "真实护理图片",
    description:
      "通过图片了解 Fiona Massage & Spa 的 {serviceName} 护理环境与主要手法。"
  }
};

interface ServiceTreatmentGalleryProps {
  serviceId: string;
  serviceName: string;
}

export function ServiceTreatmentGallery({
  serviceId,
  serviceName
}: ServiceTreatmentGalleryProps) {
  const { galleryImages, language, t } = useSiteContent();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const images = useMemo<GalleryImage[]>(() => {
    const configuredImages = selectTreatmentGalleryImages(galleryImages, serviceId);
    if (hasTreatmentGalleryConfiguration(galleryImages)) return configuredImages;

    return (serviceGalleryImages[serviceId] ?? []).map((imageUrl, index) => ({
      id: `${serviceId}-${index + 1}`,
      title: `${serviceName} ${index + 1}`,
      category: "",
      imageUrl
    }));
  }, [galleryImages, serviceId, serviceName]);
  const copy = localizedCopy[language];
  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const changeImage = useCallback((index: number) => setActiveIndex(index), []);

  if (!images.length) return null;

  return (
    <section className="mt-14 rounded-lg border border-blush bg-ivory p-5 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-terracotta">
            {serviceName}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-cocoa">
            {t("services.gallery.title", copy.title)}
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-taupe">
            {t(
              "services.gallery.description",
              copy.description,
              { serviceName }
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className="inline-flex items-center gap-2 rounded-full border border-terracotta px-5 py-2.5 text-sm font-bold text-terracotta transition hover:bg-blush"
        >
          <Images className="h-4 w-4" />
          {t("nav.gallery", "Gallery")} ({images.length})
        </button>
      </div>

      <div className="mt-7 flex snap-x gap-4 overflow-x-auto pb-2 lg:mx-auto lg:grid lg:max-w-[860px] lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:grid-rows-2 lg:overflow-visible">
        {images.slice(0, 3).map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`group relative aspect-[4/3] w-[86%] max-w-[500px] shrink-0 snap-center overflow-hidden rounded-lg bg-blush text-left lg:w-auto lg:max-w-none lg:aspect-auto ${
              index === 0
                ? "lg:row-span-2 lg:h-[375px]"
                : ""
            }`}
          >
            <img
              src={optimizeImageUrl(image.imageUrl, index === 0 ? 1000 : 700)}
              onError={({ currentTarget }) =>
                applyImageFallback(
                  currentTarget,
                  image.imageFallback,
                  index === 0 ? 1000 : 700
                )
              }
              alt={image.title || `${serviceName} ${index + 1}`}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover transition duration-500 ${
                index === 0 ? "" : "group-hover:scale-105"
              }`}
            />
            <span className="absolute inset-0 bg-cocoa/0 transition group-hover:bg-cocoa/10" />
          </button>
        ))}
      </div>

      <div className="mt-7 flex justify-center">
        <Link
          to={`/booking?service=${serviceId}`}
          className="rounded-full bg-terracotta px-7 py-3.5 font-bold text-white transition hover:bg-copper"
        >
          {t("common.bookNow", "Book Now")}
        </Link>
      </div>

      <ImageLightbox
        images={images.map((image) => image.imageUrl)}
        fallbackImages={images.map((image) => image.imageFallback)}
        activeIndex={activeIndex}
        altPrefix={serviceName}
        onChange={changeImage}
        onClose={closeLightbox}
      />
    </section>
  );
}
