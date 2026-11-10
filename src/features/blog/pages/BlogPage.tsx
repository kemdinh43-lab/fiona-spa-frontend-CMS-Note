import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "../../../shared/components/BlogCard";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { useSiteContent } from "../../../shared/hooks/useSiteContent";

export function BlogPage() {
  const { blogPosts, t } = useSiteContent();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("__all__");
  const allLabel = t("common.all", "All");
  const categories = ["__all__", ...Array.from(new Set(blogPosts.map((post) => post.category)))];
  const posts = useMemo(
    () =>
      blogPosts.filter((post) => {
        const matchCategory = category === "__all__" || post.category === category;
        const matchQuery = post.title.toLowerCase().includes(query.toLowerCase());
        return matchCategory && matchQuery;
      }),
    [blogPosts, category, query]
  );

  return (
    <section className="section-pad bg-cream">
      <div className="container-page">
        <SectionTitle
          headingLevel="h1"
          eyebrow={t("blog.eyebrow", "Beauty knowledge")}
          title={t("blog.title", "Massage and beauty care blog")}
          description={t(
            "blog.description",
            "Helpful posts for visitors looking for relaxation, skincare and spa tips in Da Nang."
          )}
        />
        <div className="mx-auto mt-10 max-w-3xl rounded-lg border border-blush bg-ivory p-4 shadow-soft">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-taupe" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("blog.search", "Search articles")}
              className="w-full rounded-full border border-blush bg-white px-12 py-3 outline-none focus:border-terracotta"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${category === item ? "bg-terracotta text-white" : "bg-blush text-copper"}`}
              >
                {item === "__all__" ? allLabel : item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
