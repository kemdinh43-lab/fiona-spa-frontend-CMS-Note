import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import { BookingForm } from "../components/BookingForm";

export function BookingPage() {
  const { brand, t } = useSiteContent();
  const workingHours = `${brand.openingHours.opens} - ${brand.openingHours.closes}`;

  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <SectionTitle
          headingLevel="h1"
          eyebrow={t("booking.eyebrow", "Book service online")}
          title={t("booking.title", "Book appointment at Fiona Massage & Spa")}
          description={t(
            "booking.description",
            "Open daily {hours}. Send your request and our team will confirm by phone, Zalo, email or Facebook.",
            { hours: workingHours }
          )}
        />
        <div className="mt-10">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
