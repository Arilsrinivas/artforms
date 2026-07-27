import { useEffect, useState } from "react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  { src: hero1, tag: "KR Puram Residence · Turnkey Civil & Interior", location: "Hassan, KA" },
  { src: hero2, tag: "Commercial Project · 3D Elevation & Construction", location: "Hassan, KA" },
  { src: hero3, tag: "Modern Villa · Spatial Planning & Interiors", location: "Hassan, KA" },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-ink">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-all duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{
            opacity: idx === i ? 1 : 0,
            transform: `scale(${idx === i ? 1.04 : 1}) translateX(${idx === i ? 0 : idx < i ? -30 : 30}px)`,
          }}
        >
          <img
            src={s.src}
            alt={s.tag}
            className="h-full w-full object-cover"
            width={1600}
            height={1000}
            loading={idx === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/40 to-ink/85" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-between px-6 pb-6 pt-24 md:px-10 md:pb-12 md:pt-32">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-canvas/80 md:text-[11px] md:tracking-[0.32em]">
            <span className="h-px w-8 bg-canvas/60 md:w-10" />
            <span>Over 22 Years of Excellence · Hassan</span>
          </div>
          <h1 className="max-w-4xl font-[family-name:var(--font-display)] text-[clamp(1.85rem,4.8vw,4.25rem)] font-light leading-[1.1] tracking-[-0.01em] text-canvas">
            Crafting spaces with
            <br />
            <em className="italic text-clay/95">civil precision</em> & interior grace.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-canvas/80 md:mt-6 md:max-w-xl md:text-base">
            Artforms Civil & Interior is Hassan's premier one-stop solution for turnkey civil construction, architectural planning, photorealistic 3D elevation, and bespoke interior design.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-8 md:gap-4">
            <a
              href="#cta"
              className="group inline-flex items-center gap-2.5 rounded-full bg-canvas px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:bg-clay hover:text-canvas md:px-7 md:py-3.5 md:text-[12px]"
            >
              Begin Your Project
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#projects"
              className="text-[11px] uppercase tracking-[0.2em] text-canvas/90 story-link md:text-[12px]"
            >
              View the Portfolio
            </a>
          </div>
        </div>

        {/* Slide caption + indicators */}
        <div className="mt-6 flex items-end justify-between border-t border-canvas/15 pt-4 md:mt-10 md:pt-6">
          <div className="text-canvas/75">
            <div className="font-[family-name:var(--font-display)] text-base italic md:text-lg">
              {slides[i].tag}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-canvas/50 md:text-[11px]">
              {slides[i].location}
            </div>
          </div>
          <div className="flex gap-1.5 md:gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Show slide ${idx + 1}`}
                className="h-[2px] w-8 overflow-hidden bg-canvas/25 md:w-10"
              >
                <span
                  className="block h-full bg-canvas transition-all duration-500"
                  style={{ width: idx === i ? "100%" : idx < i ? "100%" : "0%" }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}