import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Marquee from "@/components/Marquee";
import WorkList from "@/components/WorkList";
import ExploreLinks from "@/components/ExploreLinks";
import Footer from "@/components/Footer";
import FloatingNav from "@/components/FloatingNav";
import { PROJECTS } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Floating Navigation */}
      <FloatingNav />

      {/* Hero Section */}
      <Hero />

      {/* About Me */}
      <AboutMe />

      {/* Marquee Divider */}
      <div className="py-16">
        <Marquee />
      </div>

      {/* Work Section */}
      <div className="py-24">
        <WorkList projects={PROJECTS.filter(p => p.featured)} />
      </div>

      {/* Explore More - Blog & Contact */}
      <ExploreLinks />

      {/* Footer */}
      <Footer />
    </main>
  );
}
