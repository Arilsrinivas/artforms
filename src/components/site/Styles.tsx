import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import i1 from "@/assets/inspiration-1.jpg";

const styles = [
  { name: "Modern Minimalist", img: p1, tone: "Sleek, space-saving, functional" },
  { name: "Contemporary Luxury", img: p2, tone: "Rich textures, premium finishes" },
  { name: "Traditional Heritage", img: p3, tone: "Teak accents, regional elegance" },
  { name: "Modular Interiors", img: p4, tone: "Ergonomic, customizable, clean" },
  { name: "Commercial Executive", img: p5, tone: "Professional, ambient, inviting" },
  { name: "Elevation & Facade", img: i1, tone: "Bold geometry, modern materials" },
];

export function Styles() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      const engine = emblaApi.internalEngine();
      engine.location.add(-0.03 * dt);
      engine.target.set(engine.location.get());
      engine.scrollLooper.loop(-1);
      engine.slideLooper.loop();
      engine.translate.to(engine.location.get());
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [emblaApi]);

  return (
    <section className="bg-[color:var(--sand)]/40 py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-10 bg-ink/30" /> Design Portfolio
            </div>
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-light leading-[1.05] tracking-tight text-ink md:text-6xl">
              Design styles for every <em className="italic text-clay">living need.</em>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            We adapt across a diverse spectrum of architectural styles — custom-tailored for your space in Hassan.
          </p>
        </div>
      </div>

      <div ref={emblaRef} className="cursor-grab active:cursor-grabbing">
        <div className="flex gap-6 pl-6 md:pl-10">
          {[...styles, ...styles].map((s, idx) => (
            <article
              key={idx}
              className="group relative flex-[0_0_78%] sm:flex-[0_0_44%] lg:flex-[0_0_28%]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={s.img}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-canvas/70">
                    {s.tone}
                  </div>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl italic text-canvas">
                    {s.name}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}