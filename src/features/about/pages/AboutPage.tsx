import { Award, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import { CTASection } from "../../../shared/components/CTASection";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import { resolveImageResource } from "../../../shared/utils/imageUrls";

const values = [
  { key: "calmSpace", title: "Calm space", text: "Warm rooms, soft colors and a quiet pace.", icon: Leaf },
  { key: "clearPricing", title: "Clear pricing", text: "Transparent service time, price and package details.", icon: ShieldCheck },
  { key: "kindService", title: "Kind service", text: "Friendly care for local guests and travelers.", icon: HeartHandshake },
  { key: "skilledTeam", title: "Skilled team", text: "Professional therapists focused on comfort.", icon: Award }
];

export function AboutPage() {
  const { imageResources, t } = useSiteContent();
  const aboutImageUrl = resolveImageResource(imageResources, "about.hero", 1200);
  return (
    <>
      <section className="section-pad bg-cream">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle
              headingLevel="h1"
              align="left"
              eyebrow={t("about.eyebrow", "Our story")}
              title={t("about.title", "A relaxing beauty destination in Da Nang")}
              description={t(
                "about.description",
                "Fiona Massage & Spa was created for guests who want a trustworthy, warm and simple spa experience in the heart of Da Nang."
              )}
            />
            <p className="mt-6 leading-8 text-taupe">
              {t(
                "about.body",
                "From massage and facial care to nails, shampoo, eyelash, threading and waxing, every service is designed to be easy to choose, easy to book and comfortable from start to finish."
              )}
            </p>
          </div>
          {aboutImageUrl ? (
            <img
              src={aboutImageUrl}
              alt={t("about.imageAlt", "Fiona Beauty and Spa relaxing space")}
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="rounded-lg shadow-soft"
            />
          ) : null}
        </div>
        <div className="container-page grid gap-5 pt-6 md:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article key={value.key} className="rounded-lg border border-blush bg-ivory p-5 shadow-soft">
                <Icon className="h-8 w-8 text-terracotta" />
                <h3 className="mt-4 font-display text-xl font-bold text-cocoa">
                  {t(`about.value.${value.key}.title`, value.title)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-taupe">
                  {t(`about.value.${value.key}.text`, value.text)}
                </p>
              </article>
            );
          })}
        </div>
      </section>
      <CTASection />
    </>
  );
}
