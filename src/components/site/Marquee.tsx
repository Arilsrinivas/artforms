export function Marquee() {
  const items = [
    "Civil Construction",
    "3D Elevation",
    "Architectural Planning",
    "Residential Interiors",
    "Commercial Design",
    "Turnkey Execution",
    "Space Optimization",
  ];
  return (
    <section className="border-y border-border bg-canvas py-6 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-4 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Core Expertise & Solutions
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-3">
          {items.map((i) => (
            <span
              key={i}
              className="font-[family-name:var(--font-display)] text-xl italic text-ink/60 transition-colors hover:text-ink"
            >
              {i}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}