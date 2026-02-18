import Hero from "@/components/Hero";
import WorkList from "@/components/WorkList";
import Footer from "@/components/Footer";
import FloatingNav from "@/components/FloatingNav";
import ScrolltellingHome from "@/components/ScrolltellingHome";
import { PROJECTS } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Floating Navigation */}
      <FloatingNav />

      {/* Hero Section — clean, minimal */}
      <Hero />

      {/* Scrolltelling Narrative — typography-driven story */}
      <ScrolltellingHome />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Selected Work */}
      <div className="py-24">
        <WorkList projects={PROJECTS.filter((p) => p.featured)} />
      </div>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Footer */}
      <Footer />
    </main>
  );
}
