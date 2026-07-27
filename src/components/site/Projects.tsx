import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import i1 from "@/assets/inspiration-1.jpg";
import i2 from "@/assets/inspiration-2.jpg";
import i3 from "@/assets/inspiration-3.jpg";

const featured = [
  { title: "Krishnaraja Villa", loc: "KR Puram, Hassan", year: "2024", cover: p1, over: i2 },
  { title: "Ananda Residence", loc: "Vidyanagar, Hassan", year: "2024", cover: p2, over: i3 },
  { title: "Sri Manjunatha Haven", loc: "Shanthi Nagar, Hassan", year: "2023", cover: p3, over: i1 },
  { title: "Apex Commercial Plaza", loc: "BM Road, Hassan", year: "2023", cover: p4, over: i2 },
  { title: "Sampige Luxury Villa", loc: "Kuvempunagar, Hassan", year: "2022", cover: p5, over: i3 },
];

export function Projects() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" });
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setI(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  return (
    <section id="projects" className="relative overflow-hidden bg-canvas py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-10 bg-ink/30" /> Selected Work
            </div>
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-light leading-[1.05] tracking-tight text-ink md:text-6xl">
              Projects built with <em className="italic text-clay">lasting quality.</em>
            </h2>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              aria-label="Previous project"
              onClick={() => embla?.scrollPrev()}
              className="grid h-12 w-12 place-items-center rounded-full border border-ink/30 text-ink transition-all hover:border-ink hover:bg-ink hover:text-canvas"
            >
              ←
            </button>
            <button
              aria-label="Next project"
              onClick={() => embla?.scrollNext()}
              className="grid h-12 w-12 place-items-center rounded-full border border-ink/30 text-ink transition-all hover:border-ink hover:bg-ink hover:text-canvas"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {featured.map((p, idx) => (
            <div
              key={idx}
              className="relative flex-[0_0_92%] pl-6 pr-6 md:flex-[0_0_78%] md:pl-10 md:pr-10 lg:flex-[0_0_66%]"
            >
              <div className="relative">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={p.cover}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out"
                    style={{ transform: idx === i ? "scale(1.02)" : "scale(1)" }}
                  />
                </div>
                {/* Overlapping secondary carousel image */}
                <div className="pointer-events-none absolute -bottom-10 right-4 hidden aspect-[3/4] w-40 overflow-hidden border-4 border-canvas shadow-2xl md:block md:w-56 lg:-right-8 lg:w-64">
                  <img
                    src={p.over}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                      {p.loc} · {p.year}
                    </div>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-light italic text-ink md:text-5xl">
                      {p.title}
                    </h3>
                  </div>
                  <span className="text-[12px] uppercase tracking-[0.24em] text-ink story-link">
                    View Project →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1400px] items-center justify-center gap-2 px-6 md:px-10">
        {featured.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to project ${idx + 1}`}
            onClick={() => embla?.scrollTo(idx)}
            className={`h-[2px] transition-all ${
              idx === i ? "w-12 bg-ink" : "w-6 bg-ink/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}