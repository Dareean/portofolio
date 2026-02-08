import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Marquee from "@/components/Marquee";
import WorkList from "@/components/WorkList";
import ExploreLinks from "@/components/ExploreLinks";
import Footer from "@/components/Footer";
import FloatingNav from "@/components/FloatingNav";
import AnimatedBackground from "@/components/AnimatedBackground";
import IntroSection from "@/components/IntroSection";
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

      {/* About Me */}
      <AboutMe />

      {/* Marquee Divider */}
      <div className="py-16">
        <Marquee />
      </div>

      {/* Explore More - 3D Scene & Stats */}
      <ExploreLinks />

      {/* Work Section */}
      <div className="py-24">
        <WorkList projects={PROJECTS.filter((p) => p.featured)} />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
