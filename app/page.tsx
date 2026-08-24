import Hero from "@/components/Hero";
import WorkList from "@/components/WorkList";
import AboutBento from "@/components/AboutBento";
import WritingFeed from "@/components/WritingFeed";
import Footer from "@/components/Footer";
import { PROJECTS } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Hero Section — dark kinetic statement & 3 core pillars */}
      <Hero />

      {/* Selected Work — direct proof of craftsmanship */}
      <div id="work" className="py-section-sm md:py-section">
        <WorkList projects={PROJECTS.filter((p) => p.featured)} />
      </div>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* About & Tech Bento Grid — portrait photo, philosophy, live location, community & stack */}
      <AboutBento />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Writing & Publications Feed — minimalist publication list */}
      <WritingFeed />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Footer */}
      <Footer />
    </main>
  );
}
