import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-canvas/90 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-gradient-to-b from-ink/80 via-ink/40 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <span
            className={`font-[family-name:var(--font-display)] text-2xl tracking-[0.02em] transition-colors ${
              scrolled ? "text-ink" : "text-canvas"
            }`}
          >
            Artforms<span className="text-clay">.</span>Civil & Interior
          </span>
        </Link>
        <nav
          className={`hidden items-center gap-9 text-[13px] uppercase tracking-[0.18em] transition-colors md:flex ${
            scrolled ? "text-ink/80" : "text-canvas/90"
          }`}
        >
          {["Services", "Projects", "Process", "Journal", "Contact"].map((i) => (
            <a
              key={i}
              href={`#${i.toLowerCase()}`}
              className={`story-link transition-colors ${
                scrolled ? "hover:text-ink" : "hover:text-canvas"
              }`}
            >
              {i}
            </a>
          ))}
        </nav>
        <a
          href="#cta"
          className={`hidden rounded-full border px-5 py-2.5 text-[12px] uppercase tracking-[0.2em] transition-all duration-300 md:inline-block ${
            scrolled
              ? "border-ink/80 text-ink hover:bg-ink hover:text-canvas"
              : "border-canvas/80 text-canvas hover:bg-canvas hover:text-ink"
          }`}
        >
          Get Free Quote
        </a>
      </div>
    </header>
  );
}