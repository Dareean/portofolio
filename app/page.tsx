import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import JourneyTimeline from "@/components/JourneyTimeline";
import WorkList from "@/components/WorkList";
import Footer from "@/components/Footer";
import { PROJECTS } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Marquee Divider */}
      <div className="py-16">
        <Marquee />
      </div>

      {/* Journey Timeline */}
      <JourneyTimeline />

      {/* Work Section */}
      <div className="py-24">
        <WorkList projects={PROJECTS.filter(p => p.featured)} />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
