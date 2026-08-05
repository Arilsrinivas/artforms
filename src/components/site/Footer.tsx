import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-canvas py-14">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="font-[family-name:var(--font-display)] text-2xl text-ink">
            Artforms<span className="text-clay">.</span>Civil & Interior
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Hassan's trusted one-stop solution for civil construction, architectural planning, 3D elevation, and interior design with over 22 years of expertise.
          </p>
        </div>
        <div>
          <div className="mb-4 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Office Address
          </div>
          <ul className="space-y-2 text-sm text-ink">
            <li>10th Cross, KR Puram</li>
            <li>Hassan, Karnataka - 573201</li>
            <li>Mon - Sat: 9:00 AM - 7:00 PM</li>
            <li>+91 98450 12345</li>
          </ul>
        </div>
        <div>
          <div className="mb-4 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Services
          </div>
          <ul className="space-y-2 text-sm text-ink">
            <li className="story-link block">Civil Construction</li>
            <li className="story-link block">3D Elevation Design</li>
            <li className="story-link block">Residential Interiors</li>
            <li className="story-link block">Turnkey Execution</li>
            <li className="block pt-2">
              <Link to="/updates" className="text-clay hover:underline block">Updates Feed</Link>
            </li>
            <li className="block">
              <Link to="/admin/login" className="text-muted-foreground hover:text-ink text-[11px] uppercase tracking-wider block">Admin Portal</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1400px] flex-col items-center justify-between gap-3 border-t border-border px-6 pt-6 text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:flex-row md:px-10">
        <span>© {new Date().getFullYear()} Artforms Civil & Interior, Hassan. All rights reserved.</span>
        <span>Crafted with engineering precision.</span>
      </div>
    </footer>
  );
}