import { LocalizedLink as Link } from "../../../shared/components/LocalizedLink";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";

export function NotFoundPage() {
  const { t } = useSiteContent();

  return (
    <section className="section-pad bg-cream">
      <div className="container-page mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-olive">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-cocoa md:text-5xl">
          {t("notFound.title", "Page not found")}
        </h1>
        <p className="mt-5 text-base leading-7 text-taupe">
          {t(
            "notFound.description",
            "The page may have moved. Explore our spa services or return to the Fiona Massage & Spa homepage."
          )}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/services"
            className="rounded-full bg-terracotta px-7 py-4 font-bold text-white hover:bg-copper"
          >
            {t("common.viewServices", "View Services")}
          </Link>
          <Link
            to="/"
            className="rounded-full border border-terracotta px-7 py-4 font-bold text-terracotta hover:bg-blush"
          >
            {t("notFound.home", "Back to homepage")}
          </Link>
        </div>
      </div>
    </section>
  );
}
