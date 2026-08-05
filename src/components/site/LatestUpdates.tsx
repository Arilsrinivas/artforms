import { useEffect, useState } from "react";
import { UpdatesStore, Post } from "@/lib/updates-store";
import { Link } from "@tanstack/react-router";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

export function LatestUpdates() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Retrieve only top 3 published posts
    const posts = UpdatesStore.getPosts(false).slice(0, 3);
    setLatestPosts(posts);
  }, []);

  if (latestPosts.length === 0) return null;

  return (
    <section id="latest-updates" className="bg-[color:var(--sand)]/30 py-24 md:py-36 border-t border-ink/5">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        
        {/* Header Title */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-10 bg-ink/30" /> Real-time Feed
            </div>
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-light leading-[1.05] tracking-tight text-ink md:text-6xl">
              Latest business <em className="italic text-clay">updates.</em>
            </h2>
          </div>
          <Link
            to="/updates"
            className="group inline-flex items-center gap-2.5 text-[12px] uppercase tracking-[0.24em] text-ink font-semibold story-link"
          >
            View All Updates
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map((post) => {
            const hasMedia = post.media && post.media.length > 0;
            const coverImage = hasMedia 
              ? (post.media[0].type === "before-after" ? post.media[0].beforeUrl : post.media[0].url)
              : "";

            return (
              <Link
                key={post.id}
                to="/updates"
                className="group flex flex-col h-full bg-canvas border border-ink/10 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500"
              >
                {/* Image Cover */}
                {coverImage && (
                  <div className="aspect-[16/10] overflow-hidden bg-sand/20 relative">
                    <img
                      src={coverImage}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-ink/75 text-canvas text-[9px] uppercase tracking-wider px-2.5 py-1 rounded">
                      {post.category}
                    </div>
                  </div>
                )}

                {/* Content info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      {post.location && (
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {post.location}</span>
                      )}
                    </div>
                    <p className="text-[14px] leading-relaxed text-ink/80 line-clamp-3">
                      {post.caption}
                    </p>
                  </div>

                  <span className="mt-6 text-[11px] uppercase tracking-wider text-clay group-hover:underline inline-block font-semibold">
                    Read Full Story →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
