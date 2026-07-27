import i1 from "@/assets/inspiration-1.jpg";
import i2 from "@/assets/inspiration-2.jpg";
import i3 from "@/assets/inspiration-3.jpg";

const posts = [
  {
    kind: "Civil Engineering",
    date: "April 2025",
    title: "Structural stability & foundation best practices for homes in Hassan.",
    img: i1,
  },
  {
    kind: "Interior Design",
    date: "March 2025",
    title: "Optimizing modular kitchen layouts for ergonomics & durability.",
    img: i2,
  },
  {
    kind: "3D Elevation",
    date: "February 2025",
    title: "Why 3D exterior elevation planning saves time and construction cost.",
    img: i3,
  },
];

export function Journal() {
  return (
    <section id="journal" className="bg-canvas py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-10 bg-ink/30" /> Construction Insights
            </div>
            <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-light leading-[1.05] tracking-tight text-ink md:text-6xl">
              Knowledge from our <em className="italic text-clay">engineering & design team.</em>
            </h2>
          </div>
          <a
            href="#journal"
            className="text-[12px] uppercase tracking-[0.24em] text-ink story-link"
          >
            Read the Journal →
          </a>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {posts.map((p, idx) => (
            <article key={idx} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
              </div>
              <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <span>{p.kind}</span>
                <span className="h-px w-6 bg-ink/25" />
                <span>{p.date}</span>
              </div>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-light leading-tight text-ink md:text-3xl">
                {p.title}
              </h3>
              <div className="mt-4 text-[12px] uppercase tracking-[0.24em] text-ink story-link inline-block">
                Read essay →
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}