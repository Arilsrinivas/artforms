import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Check admin login
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("artforms_admin_auth") === "true");
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { name: "Services", href: "/#services", isExternal: false },
    { name: "Projects", href: "/#projects", isExternal: false },
    { name: "Process", href: "/#process", isExternal: false },
    { name: "Journal", href: "/#journal", isExternal: false },
    { name: "Updates", href: "/updates", isExternal: true },
    ...(isAdmin ? [{ name: "Business Updates", href: "/admin/business-updates", isExternal: true }] : []),
    { name: "Contact", href: "/#cta", isExternal: false }
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-canvas/90 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-gradient-to-b from-ink/80 via-ink/40 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-10">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span
            className={`font-[family-name:var(--font-display)] text-xl sm:text-2xl tracking-[0.02em] transition-colors ${
              scrolled ? "text-ink" : "text-canvas"
            }`}
          >
            Artforms<span className="text-clay">.</span>Civil & Interior
          </span>
        </Link>
        <nav
          className={`hidden items-center gap-3 lg:gap-5 xl:gap-7 text-[11px] lg:text-[12px] xl:text-[13px] uppercase tracking-[0.1em] lg:tracking-[0.14em] xl:tracking-[0.18em] transition-colors lg:flex ${
            scrolled ? "text-ink/80" : "text-canvas/90"
          }`}
        >
          {navItems.map((item) => {
            const isHomePage = typeof window !== "undefined" && window.location.pathname === "/";
            const targetHref = item.isExternal
              ? item.href
              : isHomePage
              ? item.href.replace("/", "")
              : item.href;

            return item.isExternal ? (
              <Link
                key={item.name}
                to={item.href}
                className={`story-link transition-colors whitespace-nowrap ${
                  scrolled ? "hover:text-ink animate-fade-in" : "hover:text-canvas animate-fade-in"
                }`}
              >
                {item.name}
              </Link>
            ) : (
              <a
                key={item.name}
                href={targetHref}
                className={`story-link transition-colors whitespace-nowrap ${
                  scrolled ? "hover:text-ink" : "hover:text-canvas"
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </nav>
        <a
          href="#cta"
          className={`shrink-0 hidden rounded-full border px-4 py-2 lg:px-5 lg:py-2.5 text-[11px] lg:text-[12px] uppercase tracking-[0.16em] lg:tracking-[0.2em] transition-all duration-300 md:inline-block ${
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