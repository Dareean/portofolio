import Hero from "@/components/Hero";
import ScrollRevealStatement from "@/components/ScrollRevealStatement";
import WorkList from "@/components/WorkList";
import AboutBento from "@/components/AboutBento";
import WritingFeed from "@/components/WritingFeed";
import Footer from "@/components/Footer";
import GsapRevealSection from "@/components/GsapRevealSection";
import { getCMSData } from "@/lib/cms";
import { Project } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cmsData = await getCMSData();

  // Map CMS projects to Project type for WorkList
  const featuredProjects: Project[] = (cmsData.projects || [])
    .filter((p) => p.featured)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      year: String(p.year),
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
      <GsapRevealSection yOffset={24} duration={0.7}>
        <ScrollRevealStatement narrativeData={cmsData.narrative} />
      </GsapRevealSection>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Selected Work — dynamic featured projects */}
      <GsapRevealSection id="work" yOffset={30} duration={0.8} className="py-section-sm md:py-section">
        <WorkList projects={featuredProjects} />
      </GsapRevealSection>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* About & Tech Bento Grid — dynamic portrait, bio, community & tech stack */}
      <GsapRevealSection yOffset={30} duration={0.8}>
        <AboutBento aboutData={cmsData.about} />
      </GsapRevealSection>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Writing & Publications Feed — dynamic blog posts */}
      <GsapRevealSection yOffset={30} duration={0.8}>
        <WritingFeed storiesData={cmsData.stories} blogsData={cmsData.blogs} />
      </GsapRevealSection>

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* Footer */}
      <Footer />
    </main>
  );
}
