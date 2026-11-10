import { ReviewCard } from "../../../shared/components/ReviewCard";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";

export function TestimonialsSection() {
  const { reviews, t } = useSiteContent();

  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <SectionTitle
          eyebrow={t("home.testimonials.eyebrow", "Testimonials")}
          title={t(
            "home.testimonials.title",
            "Guests love calm service and clear care"
          )}
          description={t(
            "home.testimonials.description",
            "Reviews from travelers and local guests who visit Fiona for massage, beauty and recovery."
          )}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
