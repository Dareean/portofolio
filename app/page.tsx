import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Marquee from "@/components/Marquee";
import WorkList from "@/components/WorkList";
import ExploreLinks from "@/components/ExploreLinks";
import Footer from "@/components/Footer";
import FloatingNav from "@/components/FloatingNav";
import AnimatedBackground from "@/components/AnimatedBackground";
import IntroSection from "@/components/IntroSection";
import FloatingGeometry from "@/components/FloatingGeometry";
import PixelsToPeople from "@/components/PixelsToPeople";
import { PROJECTS } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Floating Navigation */}
      <FloatingNav />

      {/* Hero Section */}
      <Hero />

      {/* Intro / Scroll Reveal Bio */}
      <IntroSection />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Marquee Divider */}
      <div className="py-16">
        <Marquee />
      </div>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Explore More - 3D Scene & Stats */}
      <ExploreLinks />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* About Me */}
      <AboutMe />

      {/* "From pixels to people" Scroll Reveal - Before Selected Work */}
      <PixelsToPeople />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Work Section */}
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
