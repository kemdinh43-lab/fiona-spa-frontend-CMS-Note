import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  LocalizedLink as Link
} from "../../../shared/components/LocalizedLink";
import { NotFoundPage } from "../../not-found/pages/NotFoundPage";
import { BlogCard } from "../../../shared/components/BlogCard";
import { CTASection } from "../../../shared/components/CTASection";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";
import { formatDate } from "../../../shared/utils/formatDate";
import {
  applyImageFallback,
  optimizeImageUrl
} from "../../../shared/utils/imageUrls";

export function BlogDetailPage() {
  const { blogPosts, isLoading, language, t } = useSiteContent();
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post && isLoading) {
    return (
      <section className="section-pad min-h-[calc(100vh-5rem)] bg-cream text-center text-taupe">
        {t("blog.loading", "Loading article...")}
      </section>
    );
  }
  if (!post) return <NotFoundPage />;

  const related = blogPosts.filter((item) => item.id !== post.id).slice(0, 2);

  return (
    <>
      <article className="section-pad bg-cream">
        <div className="container-page max-w-4xl">
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 font-bold text-terracotta">
            <ArrowLeft className="h-4 w-4" />
            {t("blog.back", "Back to blog")}
          </Link>
          <p className="mb-4 inline-flex rounded-full bg-blush px-3 py-1 text-xs font-bold uppercase text-copper">{post.category}</p>
          <h1 className="font-display text-4xl font-bold leading-tight text-cocoa md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm font-semibold text-taupe">
            {post.author} · {formatDate(post.publishedAt, language)}
          </p>
          <img
            src={optimizeImageUrl(post.imageUrl, 1600)}
            onError={({ currentTarget }) =>
              applyImageFallback(currentTarget, post.imageFallback, 1600)
            }
            alt={post.title}
            width={1200}
            height={900}
            fetchPriority="high"
            className="mt-8 aspect-[4/3] w-full rounded-lg object-cover shadow-soft"
          />
          <div className="mt-8 rounded-lg border border-blush bg-ivory p-6 text-lg leading-9 text-taupe shadow-soft">
            <p>{post.content}</p>
          </div>
          <div className="mt-12">
            <h2 className="font-display text-3xl font-bold text-cocoa">
              {t("blog.related", "Related articles")}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {related.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </div>
      </article>
      <CTASection />
    </>
  );
}
