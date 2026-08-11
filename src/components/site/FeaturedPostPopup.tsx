import { useEffect, useState } from "react";
import { UpdatesStore, Post } from "@/lib/updates-store";
import { Link } from "@tanstack/react-router";
import { X, MapPin, Calendar, ArrowRight, Eye, Heart } from "lucide-react";

import { SafeVideoPlayer } from "@/components/site/SafeVideoPlayer";

export function FeaturedPostPopup() {
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Fetch the latest published post
    const posts = UpdatesStore.getPosts(false);
    if (posts.length > 0) {
      const post = posts[0];
      setLatestPost(post);
      
      // Check session storage to see if we already showed it in this session
      const shown = sessionStorage.getItem("artforms_featured_popup_shown");
      if (!shown) {
        // Smooth fade-in delay
        const timer = setTimeout(() => {
          setIsOpen(true);
          // Small nested delay for scale/opacity animation transition
          setTimeout(() => setAnimate(true), 100);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setAnimate(false);
    // Wait for animation to finish before unmounting
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem("artforms_featured_popup_shown", "true");
    }, 400);
  };

  if (!isOpen || !latestPost) return null;

  const hasMedia = latestPost.media && latestPost.media.length > 0;
  const coverImage = hasMedia 
    ? (latestPost.media[0].type === "before-after" ? latestPost.media[0].beforeUrl : latestPost.media[0].url)
    : "";

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ease-out bg-black/60 backdrop-blur-md ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      <div 
        className={`w-full max-w-2xl bg-canvas border border-ink/10 rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-500 ease-out transform ${
          animate ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Subtle Accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-clay" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-ink/10 hover:bg-clay text-ink hover:text-canvas flex items-center justify-center transition-all duration-300"
          aria-label="Close featured post popup"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Media Section */}
          <div className="md:col-span-6 relative aspect-[4/3] md:aspect-auto md:min-h-[380px] bg-sand/20 overflow-hidden">
            {hasMedia && latestPost.media[0].type === "video" ? (
              <SafeVideoPlayer src={latestPost.media[0].url} />
            ) : coverImage ? (
              <img
                src={coverImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                No Media Attachment
              </div>
            )}
            
            {/* Project status pill */}
            <div className="absolute bottom-4 left-4 bg-ink/85 text-canvas text-[9px] uppercase tracking-wider px-2.5 py-1 rounded shadow">
              {latestPost.category} · {latestPost.status}
            </div>
          </div>

          {/* Right Text Content Section */}
          <div className="md:col-span-6 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-0.5"><Calendar className="h-3.5 w-3.5" /> {new Date(latestPost.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                {latestPost.location && (
                  <span className="flex items-center gap-0.5"><MapPin className="h-3.5 w-3.5" /> {latestPost.location}</span>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-clay font-bold block mb-1">
                  NEW PROJECT ANNOUNCEMENT
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-3xl font-light text-ink leading-tight">
                  Featured <em className="italic">Update.</em>
                </h3>
              </div>

              <p className="text-xs text-ink/75 leading-relaxed line-clamp-4 whitespace-pre-line">
                {latestPost.caption}
              </p>

              <div className="flex gap-4 text-[10px] text-muted-foreground border-t border-ink/5 pt-3">
                <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {latestPost.views} Views</span>
                <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" /> {latestPost.likes} Likes</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleClose}
                className="flex-1 rounded-full border border-ink/20 py-2.5 text-[10px] uppercase tracking-wider font-semibold text-ink hover:bg-ink hover:text-canvas transition-colors"
              >
                Skip to site
              </button>
              <Link
                to="/updates"
                onClick={handleClose}
                className="flex-1 text-center rounded-full bg-clay py-2.5 text-[10px] uppercase tracking-wider font-semibold text-canvas hover:bg-ink transition-colors flex items-center justify-center gap-1.5"
              >
                View Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
