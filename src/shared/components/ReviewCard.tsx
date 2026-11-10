import type { CustomerReview } from "../types/spa";
import { formatDate } from "../utils/formatDate";
import { RatingStars } from "./RatingStars";
import { useSiteContent } from "../hooks/useSiteContent";

interface ReviewCardProps {
  review: CustomerReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { language } = useSiteContent();
  return (
    <article className="rounded-lg border border-blush bg-ivory p-6 shadow-soft">
      <RatingStars rating={review.rating} />
      <p className="mt-4 text-base leading-7 text-cocoa">"{review.content}"</p>
      <div className="mt-5 border-t border-blush pt-4">
        <p className="font-bold text-cocoa">{review.customerName}</p>
        <p className="text-sm text-taupe">
          {review.country ? `${review.country} · ` : ""}
          {review.source} · {formatDate(review.createdAt, language)}
        </p>
      </div>
    </article>
  );
}
