const services = [
  {
    n: "01",
    title: "Civil Construction",
    desc: "General contracting, structural construction, and civil engineering for residential homes, villas, and commercial developments in Hassan.",
  },
  {
    n: "02",
    title: "Interior Design",
    desc: "Bespoke residential & commercial interiors, space planning, modular kitchen design, custom woodwork, and turnkey interior installation.",
  },
  {
    n: "03",
    title: "3D Elevation & Planning",
    desc: "Photorealistic 3D architectural renders, exterior elevation design, and floor planning to visualize your project with clarity.",
  },
  {
    n: "04",
    title: "Turnkey Execution",
    desc: "Hassle-free end-to-end execution managing material procurement, skilled labor, plumbing, electrical, and strict timeline adherence.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-canvas py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-10 bg-ink/30" /> Our Services
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-light leading-[1.05] tracking-tight text-ink md:text-6xl">
              Complete civil & interior <em className="italic text-clay">solutions.</em>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            Over 22 years of expertise delivering structural strength and timeless interior design under one roof in Hassan.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.n}
              className="group border-t border-ink/15 pt-8 transition-colors hover:border-clay"
            >
              <div className="flex items-baseline justify-between gap-6">
                <span className="font-mono text-xs tracking-widest text-muted-foreground">
                  — {s.n}
                </span>
                <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more →
                </span>
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-light text-ink md:text-4xl">
                {s.title}
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}