import { Star } from "lucide-react";
import { useSiteContent } from "../hooks/useSiteContent";

interface RatingStarsProps {
  rating: number;
}

export function RatingStars({ rating }: RatingStarsProps) {
  const { t } = useSiteContent();
  return (
    <div
      className="flex items-center gap-1 text-olive"
      aria-label={t("common.ratingStars", "{rating} stars", { rating })}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
      ))}
      <span className="ml-1 text-sm font-semibold text-taupe">{rating.toFixed(1)}</span>
    </div>
  );
}
