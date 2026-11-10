import { LocalizedLink as Link } from "../../../shared/components/LocalizedLink";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import { selectGeneralGalleryImages } from "../../../shared/utils/galleryImages";
import {
  applyImageFallback,
  optimizeImageUrl
} from "../../../shared/utils/imageUrls";

export function GalleryPreviewSection() {
  const { galleryImages, t } = useSiteContent();
  const visibleGalleryImages = selectGeneralGalleryImages(galleryImages);

  return (
    <section className="section-pad bg-ivory">
      <div className="container-page">
        <SectionTitle
          eyebrow={t("nav.gallery", "Gallery")}
          title={t("home.gallery.title", "Explore the space of Fiona Spa")}
          description={t(
            "home.gallery.description",
            "A calm, clean and warm environment for massage, nail care, facial and shampoo treatments."
          )}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGalleryImages.slice(0, 6).map((image) => (
            <Link key={image.id} to="/gallery" className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-soft">
              <img
                src={optimizeImageUrl(image.imageUrl, 800)}
                onError={({ currentTarget }) =>
                  applyImageFallback(currentTarget, image.imageFallback, 800)
                }
                alt={image.title}
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/80 to-transparent p-4 font-bold text-white">
                {image.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
