import { CalendarDays } from "lucide-react";
import { LocalizedLink as Link } from "./LocalizedLink";
import type { BlogPost } from "../types/spa";
import { formatDate } from "../utils/formatDate";
import { useSiteContent } from "../hooks/useSiteContent";
import { applyImageFallback, optimizeImageUrl } from "../utils/imageUrls";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { language } = useSiteContent();
  return (
    <article className="overflow-hidden rounded-lg border border-blush bg-ivory shadow-soft">
      <Link to={`/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden">
        <img
          src={optimizeImageUrl(post.imageUrl, 800)}
          onError={({ currentTarget }) =>
            applyImageFallback(currentTarget, post.imageFallback, 800)
          }
          alt={post.title}
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </Link>
      <div className="space-y-3 p-5">
        <p className="inline-flex rounded-full bg-blush px-3 py-1 text-xs font-bold uppercase text-copper">{post.category}</p>
        <Link to={`/blog/${post.slug}`} className="block font-display text-xl font-bold leading-tight text-cocoa hover:text-terracotta">
          {post.title}
        </Link>
        <p className="line-clamp-2 text-sm leading-6 text-taupe">{post.excerpt}</p>
        <p className="flex items-center gap-2 text-sm font-semibold text-taupe">
          <CalendarDays className="h-4 w-4" />
          {formatDate(post.publishedAt, language)}
        </p>
      </div>
    </article>
  );
}
