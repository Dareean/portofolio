import Hero from "@/components/Hero";
import ScrollRevealStatement from "@/components/ScrollRevealStatement";
import WorkList from "@/components/WorkList";
import AboutBento from "@/components/AboutBento";
import WritingFeed from "@/components/WritingFeed";
import Footer from "@/components/Footer";
import { getCMSData } from "@/lib/cms";
import { Project } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Home() {
  const cmsData = getCMSData();

  // Map CMS projects to Project type for WorkList
  const featuredProjects: Project[] = (cmsData.projects || [])
    .filter((p) => p.featured)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      year: p.year,
      image: p.image,
      link: p.link,
      featured: p.featured,
      description: p.description,
      technologies: p.technologies,
      metrics: p.metrics,
    }));

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Hero Section — dynamic statement & 3 core pillars */}
      <Hero heroData={cmsData.hero} />

      {/* Scroll Text Reveal Narrative — dynamic narrative ethos */}
      <ScrollRevealStatement narrativeData={cmsData.narrative} />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Selected Work — dynamic featured projects */}
      <div id="work" className="py-section-sm md:py-section">
        <WorkList projects={featuredProjects} />
      </div>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* About & Tech Bento Grid — dynamic portrait, bio, community & tech stack */}
      <AboutBento aboutData={cmsData.about} />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Writing & Publications Feed — dynamic articles */}
      <WritingFeed storiesData={cmsData.stories} />

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Footer */}
      <Footer />
    </main>
  );
}
