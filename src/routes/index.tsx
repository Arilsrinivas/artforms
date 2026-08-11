import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { Styles } from "@/components/site/Styles";
import { Projects } from "@/components/site/Projects";
import { Process } from "@/components/site/Process";
import { Testimonials } from "@/components/site/Testimonials";
import { Journal } from "@/components/site/Journal";
import { LatestUpdates } from "@/components/site/LatestUpdates";
import { FeaturedPostPopup } from "@/components/site/FeaturedPostPopup";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-canvas text-ink antialiased">
      <FeaturedPostPopup />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Styles />
        <Projects />
        <Process />
        <Testimonials />
        <Journal />
        <LatestUpdates />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
