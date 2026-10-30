import logoBlack from "@/assets/logo/artforms-logo-black.png";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-canvas py-14">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-3 group mb-4">
            <img
              src={logoBlack}
              alt="Artforms Civil and Interiors"
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span className="font-[family-name:var(--font-display)] text-2xl tracking-[0.04em] font-medium text-ink">
                ARTFORMS
              </span>
              <span className="text-[10px] tracking-[0.26em] uppercase text-muted-foreground font-light mt-1">
                Civil and Interiors
              </span>
            </div>
          </Link>
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
            <li><a href="https://wa.me/918147131315?text=Hello%20Artforms%20Civil%20and%20Interiors%2C%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20my%20project." target="_blank" rel="noopener noreferrer" className="hover:text-clay transition-colors font-medium flex items-center gap-1">+91 81471 31315 (WhatsApp)</a></li>
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
              <Link to="/projects" className="text-clay hover:underline block font-medium">All Projects & PDFs</Link>
            </li>
            <li className="block">
              <Link to="/updates" className="text-clay hover:underline block">Updates Feed</Link>
            </li>
            <li className="block">
              <Link to="/admin/login" className="text-muted-foreground hover:text-ink text-[11px] uppercase tracking-wider block">Admin Portal</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1400px] flex-col items-center justify-between gap-3 border-t border-border px-6 pt-6 text-[11px] uppercase tracking-[0.24em] text-muted-foreground md:flex-row md:px-10">
        <span>© {new Date().getFullYear()} Artforms Civil and Interiors, Hassan. All rights reserved.</span>
        <span>Crafted with engineering precision.</span>
      </div>
    </footer>
  );
}