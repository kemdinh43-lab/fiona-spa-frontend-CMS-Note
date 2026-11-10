import { LocalizedLink as Link } from "../../../shared/components/LocalizedLink";
import { BlogCard } from "../../../shared/components/BlogCard";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";

export function BlogPreviewSection() {
  const { blogPosts, t } = useSiteContent();

  return (
    <section className="section-pad bg-ivory">
      <div className="container-page">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            align="left"
            eyebrow={t("blog.eyebrow", "Beauty knowledge")}
            title={t("home.blog.title", "Spa tips for your Da Nang trip")}
            description={t(
              "home.blog.description",
              "Helpful notes about massage, skincare and aftercare."
            )}
          />
          <Link to="/blog" className="rounded-full border border-terracotta px-5 py-3 text-center text-sm font-bold text-terracotta hover:bg-blush">
            {t("common.readBlog", "Read Blog")}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
