import Hero from "@/components/Hero";
import WorkList from "@/components/WorkList";
import Footer from "@/components/Footer";
import ScrolltellingHome from "@/components/ScrolltellingHome";
import { PROJECTS } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Hero Section — navy hero band with mockup card */}
      <Hero />

      {/* Scrolltelling Narrative — typography-driven story */}
      <ScrolltellingHome />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Selected Work */}
      <div id="work" className="py-section-sm md:py-section">
        <WorkList projects={PROJECTS.filter((p) => p.featured)} />
      </div>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Footer */}
      <Footer />
    </main>
  );
}
