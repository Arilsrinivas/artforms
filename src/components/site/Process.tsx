const steps = [
  {
    n: "I",
    title: "Consultation & Site Study",
    desc: "We analyze site dimensions, evaluate functional requirements, and formulate clear budget expectations for your project.",
  },
  {
    n: "II",
    title: "3D Elevation & Planning",
    desc: "Detailed 3D architectural renders, structural blueprints, and material specifications are crafted for client approval.",
  },
  {
    n: "III",
    title: "Civil & Interior Execution",
    desc: "Our skilled civil engineers and interior craftsmen execute structural work and interior joinery with strict quality supervision.",
  },
  {
    n: "IV",
    title: "Turnkey Handover",
    desc: "Thorough quality inspection, finishing touches, and a complete turnkey handover ready for immediate move-in.",
  },
];

export function Process() {
  return (
    <section id="process" className="bg-ink py-24 text-canvas md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 max-w-3xl">
          <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-canvas/50">
            <span className="h-px w-10 bg-canvas/40" /> Our Process
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
            Four stages, one <em className="italic text-clay">seamless execution.</em>
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <li
              key={s.n}
              className="relative border-t border-canvas/20 pt-8 transition-colors hover:border-clay"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="font-[family-name:var(--font-display)] text-3xl italic text-clay">
                {s.n}
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-light md:text-3xl">
                {s.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-canvas/70">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}