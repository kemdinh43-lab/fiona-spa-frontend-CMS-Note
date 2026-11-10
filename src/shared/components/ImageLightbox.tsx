import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import { applyImageFallback, optimizeImageUrl } from "../utils/imageUrls";

interface ImageLightboxProps {
  images: string[];
  fallbackImages?: Array<string | undefined>;
  activeIndex: number | null;
  altPrefix: string;
  onChange: (index: number) => void;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  fallbackImages,
  activeIndex,
  altPrefix,
  onChange,
  onClose
}: ImageLightboxProps) {
  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        onChange((activeIndex - 1 + images.length) % images.length);
      }
      if (event.key === "ArrowRight") {
        onChange((activeIndex + 1) % images.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length, onChange, onClose]);

  if (activeIndex === null || !images[activeIndex]) return null;

  const previousIndex = (activeIndex - 1 + images.length) % images.length;
  const nextIndex = (activeIndex + 1) % images.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={altPrefix}
      className="fixed inset-0 z-[100] grid place-items-center bg-cocoa/95 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
      >
        <X className="h-6 w-6" />
      </button>

      <img
        key={`${activeIndex}-${images[activeIndex]}`}
        src={optimizeImageUrl(images[activeIndex], 1800)}
        onError={({ currentTarget }) =>
          applyImageFallback(currentTarget, fallbackImages?.[activeIndex], 1800)
        }
        alt={`${altPrefix} ${activeIndex + 1}`}
        className="max-h-[84vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
      />

      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => onChange(previousIndex)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:left-6"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={() => onChange(nextIndex)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:right-6"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      ) : null}

      <span className="absolute bottom-4 rounded-full bg-black/35 px-4 py-2 text-sm font-bold text-white">
        {activeIndex + 1} / {images.length}
      </span>
    </div>
  );
}
