import { CheckCircle2 } from "lucide-react";
import { LocalizedLink as Link } from "../../../shared/components/LocalizedLink";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import { resolveImageResource } from "../../../shared/utils/imageUrls";

const reasons = [
  ["home.about.reason.space", "Warm and relaxing space"],
  ["home.about.reason.therapists", "Professional therapists"],
  ["home.about.reason.pricing", "Transparent pricing"],
  ["home.about.reason.booking", "Easy online booking"],
  ["home.about.reason.tourists", "Friendly service for tourists"]
];

export function AboutPreviewSection() {
  const { imageResources, t } = useSiteContent();
  const spaceImageUrl = resolveImageResource(imageResources, "home.about.space", 900);
  return (
    <section className="section-pad bg-cream">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          {spaceImageUrl ? (
            <img
              src={spaceImageUrl}
              alt={t("home.about.spaceAlt", "Fiona Spa space")}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="h-96 w-full rounded-lg object-cover shadow-soft"
            />
          ) : null}
        </div>
        <div>
          <SectionTitle
            align="left"
            eyebrow={t("home.about.eyebrow", "About Fiona")}
            title={t("home.about.title", "A relaxing beauty destination in Da Nang")}
            description={t(
              "home.about.description",
              "Fiona Massage & Spa is designed for travelers and local guests who want reliable care, calm rooms and a simple way to book."
            )}
          />
          <div className="mt-7 grid gap-3">
            {reasons.map(([key, fallback]) => (
              <p key={key} className="flex items-center gap-3 font-semibold text-cocoa">
                <CheckCircle2 className="h-5 w-5 text-sage" />
                {t(key, fallback)}
              </p>
            ))}
          </div>
          <Link to="/about" className="mt-8 inline-flex rounded-full bg-terracotta px-6 py-3 font-bold text-white hover:bg-copper">
            {t("nav.about", "About Us")}
          </Link>
        </div>
      </div>
    </section>
  );
}
