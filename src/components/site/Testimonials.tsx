import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import i2 from "@/assets/inspiration-2.jpg";
import i3 from "@/assets/inspiration-3.jpg";
import p1 from "@/assets/project-1.jpg";

const quotes = [
  {
    text: "Artforms delivered our home construction and interior work with exceptional quality. The 3D elevation matched the finished home 100%!",
    name: "Rajesh Gowda",
    project: "KR Puram Villa · Hassan",
    img: p1,
  },
  {
    text: "Over 22 years of experience truly shows. From foundation civil work to modular interior installation, everything was handled seamlessly.",
    name: "Suresh & Vidya M.",
    project: "Vidyanagar Residence · Hassan",
    img: i2,
  },
  {
    text: "They handled our commercial showroom's entire civil remodeling and interior design within our budget. Highly recommended contractors in Hassan!",
    name: "Dr. Ramesh Kumar",
    project: "BM Road Commercial · Hassan",
    img: i3,
  },
];

export function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const t = setInterval(() => embla.scrollNext(), 6000);
    const onSel = () => setI(embla.selectedScrollSnap());
    embla.on("select", onSel);
    return () => {
      clearInterval(t);
      embla.off("select", onSel);
    };
  }, [embla]);

  return (
    <section className="relative overflow-hidden bg-[color:var(--sand)]/50 py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 max-w-3xl">
          <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-10 bg-ink/30" /> Client Testimonials
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl font-light leading-[1.05] tracking-tight text-ink md:text-6xl">
            Words from our <em className="italic text-clay">valued clients in Hassan.</em>
          </h2>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {quotes.map((q, idx) => (
              <div
                key={idx}
                className="flex-[0_0_100%] grid grid-cols-1 items-center gap-10 md:grid-cols-12"
              >
                <div className="relative md:col-span-5">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={q.img}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* overlapping secondary image */}
                  <div className="pointer-events-none absolute -right-4 -bottom-8 hidden aspect-square w-40 overflow-hidden border-4 border-[color:var(--sand)]/50 shadow-2xl md:block md:w-52">
                    <img
                      src={quotes[(idx + 1) % quotes.length].img}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <blockquote className="md:col-span-7 md:pl-10">
                  <div className="font-[family-name:var(--font-display)] text-4xl italic leading-tight text-ink md:text-5xl">
                    &ldquo;{q.text}&rdquo;
                  </div>
                  <footer className="mt-10 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    {q.name} <span className="text-clay">·</span> {q.project}
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex items-center justify-center gap-2">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Testimonial ${idx + 1}`}
              onClick={() => embla?.scrollTo(idx)}
              className={`h-[2px] transition-all ${
                idx === i ? "w-12 bg-ink" : "w-6 bg-ink/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}