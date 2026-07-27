import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

export function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-ink py-24 text-canvas md:py-36">
      <img
        src={hero1}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute -left-16 top-16 hidden w-[36%] opacity-40 md:block"
      />
      <img
        src={hero2}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute -right-10 bottom-10 hidden w-[28%] opacity-30 md:block"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/70" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-canvas/60">
            <span className="h-px w-10 bg-canvas/40" /> Contact Us
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-5xl font-light leading-[1] tracking-tight md:text-7xl">
            Let&apos;s build your dream home or interior project.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-canvas/75">
            Planning a new civil construction project, 3D elevation design, or interior renovation in Hassan? Connect with Artforms Civil & Interior for expert consultation and estimates.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-12 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              required
              placeholder="Enter your phone number or email"
              className="flex-1 border-b border-canvas/30 bg-transparent px-2 py-4 text-canvas placeholder:text-canvas/40 focus:border-clay focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-canvas px-8 py-4 text-[12px] uppercase tracking-[0.24em] text-ink transition-all hover:bg-clay hover:text-canvas"
            >
              Get Free Consultation
            </button>
          </form>
          <div className="mt-6 text-[11px] uppercase tracking-[0.24em] text-canvas/45">
            Visit us at 10th Cross, KR Puram, Hassan · Call +91 98450 12345
          </div>
        </div>
      </div>
    </section>
  );
}