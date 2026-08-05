import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { UpdatesStore, Post, ProjectType, Comment } from "@/lib/updates-store";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Pin,
  MapPin,
  Search,
  Filter,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  QrCode,
  Link2,
  ChevronDown
} from "lucide-react";

export const Route = createFileRoute("/updates")({
  component: UpdatesPage,
});

function UpdatesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProjectType | "All">("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  
  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [lightboxPosts, setLightboxPosts] = useState<Post[]>([]);
  const [lightboxScale, setLightboxScale] = useState(1);

  // Active slideshow index tracker per post
  const [slideIndices, setSlideIndices] = useState<Record<string, number>>({});

  // Collapsed comments tracker per post
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, { author: string; content: string }>>({});

  // Share drawer / QR code state
  const [qrCodeData, setQrCodeData] = useState<{ url: string; title: string } | null>(null);

  // Load posts & register view counts
  useEffect(() => {
    const loaded = UpdatesStore.getPosts(false);
    setPosts(loaded);

    // Returning visitor alert
    const isReturning = localStorage.getItem("artforms_has_visited_updates");
    if (isReturning) {
      toast.info("New Project Uploaded", {
        description: "Check out the latest updates from our engineering and design team below!",
        duration: 4000,
      });
    } else {
      localStorage.setItem("artforms_has_visited_updates", "true");
    }
  }, []);

  // Filter & Search Logic
  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    
    // Monthly matching e.g. "2026-07"
    const matchesMonth =
      selectedMonth === "All" || p.createdAt.startsWith(selectedMonth);

    const matchesSearch =
      search.trim() === "" ||
      p.caption.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesMonth && matchesSearch;
  });

  // Unique list of months for archive (July 2026, August 2026, etc.)
  const getMonthLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getMonthKey = (dateStr: string) => {
    return dateStr.substring(0, 7); // e.g. "2026-07"
  };

  const monthOptions = Array.from(
    new Map(posts.map((p) => [getMonthKey(p.createdAt), getMonthLabel(p.createdAt)])).entries()
  );

  // Reaction handler
  const handleReact = (postId: string, type: "heart" | "thumbsUp" | "clap" | "fire") => {
    const success = UpdatesStore.reactToPost(postId, type);
    if (success) {
      setPosts(UpdatesStore.getPosts(false));
      toast.success("Reaction added!", { duration: 1500 });
    } else {
      toast.error("You have already reacted to this post.", { duration: 2000 });
    }
  };

  // Comment submission
  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const input = commentInputs[postId];
    if (!input || !input.content.trim()) return;

    // Trigger store
    UpdatesStore.addComment(postId, input.author, input.content);
    
    // Clear input
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: { author: "", content: "" },
    }));

    toast.success("Comment submitted for moderation!", {
      description: "It will appear in the feed once approved by the administrator.",
      duration: 4000,
    });
  };

  // Copy share link
  const handleCopyLink = (post: Post) => {
    const url = `${window.location.origin}/updates?post=${post.id}`;
    navigator.clipboard.writeText(url);
    UpdatesStore.incrementShares(post.id);
    setPosts(UpdatesStore.getPosts(false));
    toast.success("Link copied to clipboard!");
  };

  // Trigger QR Code drawer
  const handleShowQrCode = (post: Post) => {
    const url = `${window.location.origin}/updates?post=${post.id}`;
    setQrCodeData({
      url,
      title: post.location || post.category,
    });
    UpdatesStore.incrementShares(post.id);
    setPosts(UpdatesStore.getPosts(false));
  };

  // Track post view when visible
  const viewedTracker = useRef<Record<string, boolean>>({});
  const trackView = (postId: string) => {
    if (viewedTracker.current[postId]) return;
    viewedTracker.current[postId] = true;
    UpdatesStore.incrementViews(postId);
    // Silent reload updates
    setTimeout(() => {
      setPosts(UpdatesStore.getPosts(false));
    }, 2000);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        handleLightboxNext();
      } else if (e.key === "ArrowLeft") {
        handleLightboxPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, activeMediaIndex]);

  const handleLightboxNext = () => {
    if (lightboxIndex === null) return;
    const currentPost = filteredPosts[lightboxIndex];
    if (activeMediaIndex < currentPost.media.length - 1) {
      setActiveMediaIndex((prev) => prev + 1);
    } else if (lightboxIndex < filteredPosts.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
      setActiveMediaIndex(0);
    } else {
      // Loop to beginning
      setLightboxIndex(0);
      setActiveMediaIndex(0);
    }
    setLightboxScale(1);
  };

  const handleLightboxPrev = () => {
    if (lightboxIndex === null) return;
    const currentPost = filteredPosts[lightboxIndex];
    if (activeMediaIndex > 0) {
      setActiveMediaIndex((prev) => prev - 1);
    } else if (lightboxIndex > 0) {
      const prevPost = filteredPosts[lightboxIndex - 1];
      setLightboxIndex(lightboxIndex - 1);
      setActiveMediaIndex(prevPost.media.length - 1);
    } else {
      // Loop to end
      const lastIdx = filteredPosts.length - 1;
      setLightboxIndex(lastIdx);
      setActiveMediaIndex(filteredPosts[lastIdx].media.length - 1);
    }
    setLightboxScale(1);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink antialiased">
      <Nav />

      {/* Hero Header */}
      <section className="bg-ink text-canvas pt-32 pb-16 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-canvas/50">
            <span className="h-px w-8 bg-canvas/30" />
            <span>Artforms Civil & Interior</span>
            <span className="h-px w-8 bg-canvas/30" />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
            Business <em className="italic text-clay">Updates.</em>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-canvas/70 md:text-base">
            Follow our daily site construction progress, modular interior installations, 3D visualizations, and behind-the-scenes engineering straight from Hassan, Karnataka.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
        
        {/* Search, Filter & Archive Section */}
        <div className="mb-12 flex flex-col gap-6 border-b border-ink/10 pb-10 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search updates, tags, location..."
              className="w-full rounded-full border border-ink/15 bg-canvas py-3 pl-12 pr-6 text-sm text-ink focus:border-clay focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Categories & Archive Filters */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Category Dropdown/Selector */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ProjectType | "All")}
                className="rounded-full border border-ink/15 bg-canvas px-4 py-2.5 text-xs uppercase tracking-wider text-ink focus:border-clay focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Interior">Interior</option>
                <option value="Renovation">Renovation</option>
                <option value="Architecture">Architecture</option>
                <option value="Construction">Construction</option>
                <option value="Civil Works">Civil Works</option>
                <option value="Landscape">Landscape</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Archive Dropdown */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-full border border-ink/15 bg-canvas px-4 py-2.5 text-xs uppercase tracking-wider text-ink focus:border-clay focus:outline-none cursor-pointer"
              >
                <option value="All">All Archives</option>
                {monthOptions.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Feed Cards Section */}
        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="font-[family-name:var(--font-display)] text-3xl italic text-ink/75">
              No updates match your criteria.
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Try modifying your search keywords or checking a different category.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-[760px] space-y-16">
            {filteredPosts.map((post, postIdx) => {
              // Trigger view tracking on render (simulated intersection observer)
              trackView(post.id);

              const activeIdx = slideIndices[post.id] || 0;
              const currentMedia = post.media[activeIdx];

              const setPostSlide = (idx: number) => {
                setSlideIndices((prev) => ({ ...prev, [post.id]: idx }));
              };

              return (
                <article
                  key={post.id}
                  className="group relative overflow-hidden bg-canvas border border-ink/10 rounded-2xl shadow-sm transition-all hover:shadow-md"
                >
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-ink/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-ink flex items-center justify-center font-[family-name:var(--font-display)] text-canvas text-lg font-light italic">
                        A
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-ink">Artforms Civil & Interior</span>
                          {post.pinned && <Pin className="h-3 w-3 text-clay rotate-45 fill-clay" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {post.location && (
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" /> {post.location}
                            </span>
                          )}
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-clay/10 px-3 py-1 text-[10px] uppercase tracking-wider text-clay font-medium">
                        {post.category}
                      </span>
                      <span className="rounded-full bg-ink/5 px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        {post.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body - Media Section */}
                  {post.media && post.media.length > 0 && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      
                      {/* Media Renderer */}
                      {currentMedia.type === "image" && (
                        <img
                          src={currentMedia.url}
                          alt={post.caption}
                          onClick={() => {
                            setLightboxPosts(filteredPosts);
                            setLightboxIndex(postIdx);
                            setActiveMediaIndex(activeIdx);
                          }}
                          className="h-full w-full object-cover cursor-zoom-in transition-transform duration-[1200ms] ease-out group-hover:scale-[1.01]"
                        />
                      )}

                      {currentMedia.type === "video" && (
                        <div className="relative h-full w-full">
                          <video
                            src={currentMedia.url}
                            controls
                            muted
                            autoPlay
                            loop
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}

                      {currentMedia.type === "before-after" && (
                        <div className="relative h-full w-full group/slider">
                          {/* Simulated Before/After Comparison */}
                          <img
                            src={currentMedia.beforeUrl}
                            alt="Before"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div 
                            className="absolute inset-y-0 right-0 overflow-hidden border-l-2 border-clay"
                            style={{ left: "50%" }}
                          >
                            <img
                              src={currentMedia.afterUrl}
                              alt="After"
                              className="absolute right-0 top-0 h-full object-cover"
                              style={{ width: "760px", maxBytes: "none" }} // Ensure alignment
                            />
                          </div>
                          <div className="absolute top-4 left-4 bg-ink/75 text-canvas text-[10px] uppercase tracking-wider px-2.5 py-1 rounded">
                            Before
                          </div>
                          <div className="absolute top-4 right-4 bg-clay text-canvas text-[10px] uppercase tracking-wider px-2.5 py-1 rounded">
                            After
                          </div>
                          <div 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas text-ink shadow-2xl h-10 w-10 rounded-full flex items-center justify-center font-mono pointer-events-none text-xs"
                          >
                            ↔
                          </div>
                        </div>
                      )}

                      {currentMedia.type === "pdf" && (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-sand/30 p-8 text-center">
                          <Link2 className="h-12 w-12 text-clay mb-4" />
                          <h4 className="font-semibold text-lg text-ink">Project Brochure Available</h4>
                          <p className="text-xs text-muted-foreground mt-2 max-w-xs">
                            Download the comprehensive PDF brochure for specifications and floor plan layouts.
                          </p>
                          <a
                            href={currentMedia.url}
                            download
                            className="mt-6 rounded-full bg-ink px-6 py-2.5 text-xs uppercase tracking-wider text-canvas hover:bg-clay hover:text-canvas transition-colors"
                          >
                            Download Brochure (PDF)
                          </a>
                        </div>
                      )}

                      {/* Carousel Arrow Controls */}
                      {post.media.length > 1 && (
                        <>
                          <button
                            onClick={() => setPostSlide(activeIdx > 0 ? activeIdx - 1 : post.media.length - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-canvas/80 text-ink flex items-center justify-center shadow hover:bg-canvas transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setPostSlide(activeIdx < post.media.length - 1 ? activeIdx + 1 : 0)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-canvas/80 text-ink flex items-center justify-center shadow hover:bg-canvas transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>

                          {/* Pagination indicators overlay */}
                          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
                            {post.media.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setPostSlide(idx)}
                                className={`h-1.5 rounded-full transition-all ${
                                  idx === activeIdx ? "w-4 bg-clay" : "w-1.5 bg-canvas/50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                      
                      <button
                        onClick={() => {
                          setLightboxPosts(filteredPosts);
                          setLightboxIndex(postIdx);
                          setActiveMediaIndex(activeIdx);
                        }}
                        className="absolute right-4 top-4 bg-ink/40 text-canvas h-8 w-8 rounded-full flex items-center justify-center hover:bg-ink/75 transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>

                    </div>
                  )}

                  {/* Card Actions (Reactions, Comments, Sharing) */}
                  <div className="px-6 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      
                      {/* Sub-reactions popup toggler */}
                      <div className="relative group/reaction">
                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-clay">
                          <Heart className="h-5 w-5 hover:scale-110 transition-transform" />
                          <span className="text-xs">{post.likes}</span>
                        </button>
                        
                        {/* Reaction overlay box */}
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover/reaction:flex items-center gap-2 bg-ink text-canvas rounded-full px-3 py-1.5 shadow-2xl border border-canvas/10 animate-fade-in">
                          <button onClick={() => handleReact(post.id, "heart")} className="hover:scale-125 transition-transform">❤️</button>
                          <button onClick={() => handleReact(post.id, "thumbsUp")} className="hover:scale-125 transition-transform">👍</button>
                          <button onClick={() => handleReact(post.id, "clap")} className="hover:scale-125 transition-transform">👏</button>
                          <button onClick={() => handleReact(post.id, "fire")} className="hover:scale-125 transition-transform">🔥</button>
                        </div>
                      </div>

                      {post.commentsEnabled && (
                        <button
                          onClick={() => setShowComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="flex items-center gap-1.5 text-muted-foreground hover:text-ink"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-xs">{UpdatesStore.getComments(post.id, false).length}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCopyLink(post)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-ink"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => handleShowQrCode(post)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-ink"
                        title="Show QR Code"
                      >
                        <QrCode className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> {post.views} Views
                      </span>
                    </div>
                  </div>

                  {/* Card Text Content */}
                  <div className="px-6 pb-6 pt-4">
                    <p className="text-[14px] leading-relaxed text-ink/90 whitespace-pre-line">
                      {/* Highlight Hashtags */}
                      {post.caption.split(" ").map((word, wIdx) => {
                        if (word.startsWith("#")) {
                          return (
                            <span
                              key={wIdx}
                              onClick={() => {
                                setSearch(word);
                                window.scrollTo({ top: 250, behavior: "smooth" });
                              }}
                              className="text-clay cursor-pointer hover:underline font-medium mr-1 inline-block"
                            >
                              {word}
                            </span>
                          );
                        }
                        return word + " ";
                      })}
                    </p>

                    {/* Collapsible Comments Section */}
                    {post.commentsEnabled && showComments[post.id] && (
                      <div className="mt-8 border-t border-ink/5 pt-6 space-y-4">
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-ink/70">Comments</h4>
                        
                        {/* Comments List */}
                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                          {UpdatesStore.getComments(post.id, false).length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">No approved comments yet. Be the first!</p>
                          ) : (
                            UpdatesStore.getComments(post.id, false).map((c) => (
                              <div key={c.id} className="text-xs bg-sand/10 p-3 rounded-lg border border-ink/5 relative">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-ink">{c.author}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {new Date(c.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-muted-foreground">{c.content}</p>
                                {c.pinned && (
                                  <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider bg-clay/10 text-clay px-1.5 py-0.5 rounded font-bold">
                                    Pinned
                                  </span>
                                )}
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Comment Form */}
                        <form
                          onSubmit={(e) => handleCommentSubmit(post.id, e)}
                          className="space-y-3 pt-3"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Name"
                              value={commentInputs[post.id]?.author || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post.id]: { ...(prev[post.id] || { content: "" }), author: e.target.value },
                                }))
                              }
                              className="rounded border border-ink/10 bg-canvas px-3 py-2 text-xs text-ink focus:border-clay focus:outline-none"
                            />
                            <input
                              type="text"
                              required
                              placeholder="Write a comment..."
                              value={commentInputs[post.id]?.content || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post.id]: { ...(prev[post.id] || { author: "" }), content: e.target.value },
                                }))
                              }
                              className="rounded border border-ink/10 bg-canvas px-3 py-2 text-xs text-ink focus:border-clay focus:outline-none"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full text-center rounded bg-ink px-4 py-2 text-[10px] uppercase tracking-wider text-canvas hover:bg-clay transition-colors"
                          >
                            Submit Comment for Moderation
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredPosts[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white backdrop-blur-md">
          
          {/* Top Controls */}
          <div className="flex items-center justify-between p-6">
            <span className="text-sm font-light text-canvas/50">
              Project Post {lightboxIndex + 1} of {filteredPosts.length} · Media {activeMediaIndex + 1} of {filteredPosts[lightboxIndex].media.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Central Viewer */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            
            {/* Left Control */}
            <button
              onClick={handleLightboxPrev}
              className="absolute left-6 z-10 h-14 w-14 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Content Display */}
            <div 
              className="max-h-[70vh] max-w-[85vw] overflow-hidden transition-all duration-300"
              style={{ transform: `scale(${lightboxScale})` }}
            >
              {filteredPosts[lightboxIndex].media[activeMediaIndex].type === "image" && (
                <img
                  src={filteredPosts[lightboxIndex].media[activeMediaIndex].url}
                  alt=""
                  className="max-h-[70vh] max-w-[85vw] object-contain rounded"
                  onClick={() => setLightboxScale((prev) => (prev === 1 ? 1.5 : 1))}
                  title="Click to Zoom"
                />
              )}

              {filteredPosts[lightboxIndex].media[activeMediaIndex].type === "video" && (
                <video
                  src={filteredPosts[lightboxIndex].media[activeMediaIndex].url}
                  controls
                  autoPlay
                  className="max-h-[70vh] max-w-[85vw] object-contain rounded"
                />
              )}
            </div>

            {/* Right Control */}
            <button
              onClick={handleLightboxNext}
              className="absolute right-6 z-10 h-14 w-14 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

          </div>

          {/* Bottom Info Details */}
          <div className="bg-black/50 p-8 text-center text-canvas max-w-3xl mx-auto rounded-t-2xl border-t border-white/5">
            <h3 className="font-[family-name:var(--font-display)] text-2xl italic">
              {filteredPosts[lightboxIndex].location || "Artforms Project Location"}
            </h3>
            <p className="mt-2 text-xs text-canvas/60 uppercase tracking-widest">
              Category: {filteredPosts[lightboxIndex].category} · Status: {filteredPosts[lightboxIndex].status}
            </p>
            <p className="mt-4 text-xs text-canvas/70 leading-relaxed max-h-[80px] overflow-y-auto">
              {filteredPosts[lightboxIndex].caption}
            </p>
          </div>

        </div>
      )}

      {/* QR Code Drawer Modal */}
      {qrCodeData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-canvas border border-ink/10 text-ink max-w-sm w-full p-8 rounded-2xl shadow-2xl relative text-center">
            <button
              onClick={() => setQrCodeData(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <QrCode className="h-10 w-10 text-clay mx-auto mb-4 animate-bounce" />
            <h3 className="font-[family-name:var(--font-display)] text-2xl italic text-ink">QR Code Generator</h3>
            <p className="text-xs text-muted-foreground mt-2">
              Scan the QR code below to view and share this update on your mobile device.
            </p>

            <div className="my-6 bg-white p-4 inline-block rounded-xl border border-ink/5 shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrCodeData.url)}`}
                alt="QR Code"
                className="h-40 w-40"
              />
            </div>

            <div className="text-[10px] uppercase tracking-wider bg-sand/20 text-ink/75 px-3 py-1.5 rounded inline-block truncate max-w-full">
              {qrCodeData.title} Project
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
