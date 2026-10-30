import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  PROJECT_GROUPS,
  PROJECT_PDFS,
  PROJECT_IMAGES,
  ProjectImage,
  ProjectPdf,
} from "@/data/projects-catalog";
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  Filter,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Building,
  Home,
  HardHat,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import afMarkWhite from "@/assets/logo/af-mark-white.png";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & Architectural Presentations | Artforms Civil and Interiors Hassan" },
      {
        property: "og:title",
        content: "Projects & Architectural Presentations | Artforms Civil and Interiors Hassan",
      },
      {
        name: "description",
        content:
          "Explore 128+ authentic photographs, 3D elevations, turnkey residential interiors, and downloadable architectural presentation PDFs by Artforms Civil and Interiors Hassan.",
      },
      {
        property: "og:description",
        content:
          "Explore 128+ authentic photographs, 3D elevations, turnkey residential interiors, and downloadable architectural presentation PDFs by Artforms Civil and Interiors Hassan.",
      },
      { property: "og:image", content: "/logo.jpg" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"all" | "photos" | "pdfs">("all");

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filtered Images
  const filteredImages = useMemo(() => {
    return PROJECT_IMAGES.filter((img) => {
      // Project filter
      if (selectedProjectId !== "all" && img.projectId !== selectedProjectId) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "All" && img.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          img.projectTitle.toLowerCase().includes(q) ||
          img.location.toLowerCase().includes(q) ||
          img.spaceType.toLowerCase().includes(q) ||
          img.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [selectedProjectId, selectedCategory, searchQuery]);

  // Filtered PDFs
  const filteredPdfs = useMemo(() => {
    return PROJECT_PDFS.filter((pdf) => {
      if (selectedProjectId !== "all" && pdf.id !== selectedProjectId) {
        return false;
      }
      if (selectedCategory !== "All" && pdf.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          pdf.title.toLowerCase().includes(q) ||
          pdf.client.toLowerCase().includes(q) ||
          pdf.location.toLowerCase().includes(q) ||
          pdf.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [selectedProjectId, selectedCategory, searchQuery]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredImages.length : null
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + filteredImages.length) % filteredImages.length
            : null
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <div className="min-h-screen bg-canvas text-ink antialiased flex flex-col justify-between">
      <Nav />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-ink text-canvas pt-32 pb-16 md:pt-40 md:pb-24 border-b border-canvas/10">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#c2825d_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-canvas/15 bg-canvas/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-canvas/80 backdrop-blur-sm">
              <img src={afMarkWhite} alt="AF" className="h-3.5 w-auto object-contain opacity-90" />
              <span>Authentic Project Archives · Hassan</span>
            </div>
            
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-light leading-[1.05] tracking-tight">
              Civil projects & <br />
              <em className="italic text-clay">architectural presentations.</em>
            </h1>

            <p className="mt-6 text-sm sm:text-base leading-relaxed text-canvas/75 max-w-2xl font-light">
              Explore complete project documentation for over 22 years of engineered excellence across Hassan, Karnataka.
              Inspect 128 high-resolution photographs & 3D render walkthroughs, or review official client presentation PDFs.
            </p>

            {/* Quick Metrics */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-canvas/10 max-w-xl">
              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-clay font-medium">
                  {PROJECT_GROUPS.length - 1}+
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-canvas/60 mt-1">
                  Featured Hassan Portfolios
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-clay font-medium">
                  {PROJECT_IMAGES.length}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-canvas/60 mt-1">
                  Authentic Photos & Renders
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-clay font-medium">
                  {PROJECT_PDFS.length}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-canvas/60 mt-1">
                  Downloadable PDF Brochures
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Navigation Controls */}
      <section className="sticky top-16 sm:top-20 z-30 bg-canvas/95 backdrop-blur-md border-b border-ink/10 py-4 shadow-sm transition-all">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 space-y-3">
          
          {/* Top Row: View Mode + Search Input */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-full border border-ink/15 p-1 bg-ink/5 self-start">
              <button
                onClick={() => setViewMode("all")}
                className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
                  viewMode === "all"
                    ? "bg-ink text-canvas shadow"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                All Assets ({PROJECT_IMAGES.length + PROJECT_PDFS.length})
              </button>
              <button
                onClick={() => setViewMode("photos")}
                className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
                  viewMode === "photos"
                    ? "bg-ink text-canvas shadow"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                Photos & 3D Renders ({PROJECT_IMAGES.length})
              </button>
              <button
                onClick={() => setViewMode("pdfs")}
                className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
                  viewMode === "pdfs"
                    ? "bg-ink text-canvas shadow"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                PDF Brochures ({PROJECT_PDFS.length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search room, client, location..."
                className="w-full rounded-full border border-ink/15 bg-canvas py-2 pl-10 pr-4 text-xs text-ink placeholder:text-muted-foreground focus:border-clay focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Project Portfolio Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {PROJECT_GROUPS.map((group) => {
              const active = selectedProjectId === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedProjectId(group.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 border transition-all ${
                    active
                      ? "border-clay bg-clay text-canvas font-medium shadow-sm"
                      : "border-ink/10 bg-canvas hover:border-ink/30 text-ink/80"
                  }`}
                >
                  <span>{group.name}</span>
                  <span className="ml-1.5 opacity-60 text-[10px]">
                    ({group.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Content Area */}
      <main className="flex-1 py-12 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 space-y-16">

          {/* 1. PDF BROCHURES SECTION (Shown if viewMode is "all" or "pdfs") */}
          {(viewMode === "all" || viewMode === "pdfs") && filteredPdfs.length > 0 && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-clay font-bold mb-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Architectural Presentation Books</span>
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-3xl font-light tracking-tight text-ink">
                    Client PDF Brochures & Blueprints
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  Showing {filteredPdfs.length} Document{filteredPdfs.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* PDF Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPdfs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="group flex flex-col bg-canvas border border-ink/10 rounded-2xl overflow-hidden hover:border-clay/60 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Cover Preview Image */}
                    <div className="relative aspect-[16/10] bg-sand/20 overflow-hidden border-b border-ink/5">
                      <img
                        src={pdf.coverUrl}
                        alt={pdf.title}
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Page Count Badge */}
                      <div className="absolute top-3 right-3 bg-ink/80 text-canvas text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm">
                        {pdf.pages} Pages · {pdf.size}
                      </div>

                      {/* Category Pill */}
                      <div className="absolute bottom-3 left-3 bg-clay text-canvas text-[9.5px] uppercase tracking-wider px-2.5 py-1 rounded font-medium shadow">
                        {pdf.badge}
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                          <MapPin className="h-3.5 w-3.5 text-clay" />
                          <span>{pdf.location}</span>
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] text-2xl font-light text-ink leading-snug">
                          {pdf.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                          {pdf.description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t border-ink/5 flex items-center gap-3">
                        <a
                          href={pdf.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-ink text-canvas hover:bg-clay py-2.5 px-4 text-xs uppercase tracking-wider font-medium transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>View PDF</span>
                        </a>

                        <a
                          href={pdf.pdfUrl}
                          download={pdf.filename}
                          className="inline-flex items-center justify-center rounded-full border border-ink/15 hover:border-clay hover:text-clay p-2.5 text-ink transition-colors"
                          title="Download PDF"
                          aria-label={`Download ${pdf.title} PDF`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 2. PHOTOGRAPHS & 3D RENDERS GALLERY (Shown if viewMode is "all" or "photos") */}
          {(viewMode === "all" || viewMode === "photos") && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-clay font-bold mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Project Visuals & Walkthroughs</span>
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-3xl font-light tracking-tight text-ink">
                    Photographs & 3D Architectural Renders
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  Showing {filteredImages.length} Image{filteredImages.length === 1 ? "" : "s"}
                </span>
              </div>

              {filteredImages.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-ink/15 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    No images match your current filter or search criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedProjectId("all");
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="mt-4 rounded-full bg-ink text-canvas px-6 py-2 text-xs uppercase tracking-wider hover:bg-clay transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                /* Grid Gallery */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredImages.map((img, idx) => (
                    <div
                      key={img.id}
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative aspect-[4/3] bg-sand/20 rounded-xl overflow-hidden cursor-pointer border border-ink/10 hover:shadow-lg transition-all duration-500"
                    >
                      <picture>
                        <source srcSet={img.url} type="image/webp" />
                        <img
                          src={img.fallbackUrl}
                          alt={`${img.projectTitle} - ${img.spaceType}`}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                          loading="lazy"
                        />
                      </picture>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-canvas">
                        <div className="flex justify-end">
                          <span className="rounded-full bg-canvas/20 backdrop-blur-sm p-1.5 text-canvas hover:bg-clay transition-colors">
                            <Maximize2 className="h-3.5 w-3.5" />
                          </span>
                        </div>

                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-clay font-bold">
                            {img.category}
                          </div>
                          <h4 className="font-[family-name:var(--font-display)] text-lg leading-tight mt-0.5">
                            {img.projectTitle}
                          </h4>
                          <div className="flex items-center gap-1 text-[10px] text-canvas/75 mt-1">
                            <MapPin className="h-3 w-3 text-clay" />
                            <span>{img.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      </main>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-50 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-clay p-2.5 transition-all"
            aria-label="Close Lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Left arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-clay p-3 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-clay p-3 transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Lightbox Image Container */}
          <div className="max-h-[85vh] max-w-[90vw] flex flex-col items-center">
            <picture>
              <source
                srcSet={filteredImages[lightboxIndex].url}
                type="image/webp"
              />
              <img
                src={filteredImages[lightboxIndex].fallbackUrl}
                alt={filteredImages[lightboxIndex].projectTitle}
                className="max-h-[75vh] max-w-[88vw] object-contain rounded-lg shadow-2xl"
              />
            </picture>

            {/* Lightbox Caption & Details */}
            <div className="mt-4 text-center text-canvas max-w-xl">
              <div className="text-xs uppercase tracking-widest text-clay font-medium">
                {filteredImages[lightboxIndex].category} ·{" "}
                {filteredImages[lightboxIndex].location}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-light mt-1">
                {filteredImages[lightboxIndex].projectTitle}
              </h3>
              <div className="text-xs text-canvas/60 mt-1">
                Image {lightboxIndex + 1} of {filteredImages.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA to start project */}
      <section className="bg-sand/30 border-t border-ink/10 py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-3xl font-light text-ink">
              Ready to create your dream home or commercial space?
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Get in touch with Artforms Civil and Interiors in Hassan for architectural blueprints, 3D elevations, and turnkey execution.
            </p>
          </div>
          <a
            href="/#cta"
            className="rounded-full bg-ink text-canvas hover:bg-clay px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors shrink-0"
          >
            Request Free Estimate
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
