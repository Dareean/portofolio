import { Metadata } from "next";
import { getCMSData, CMSBlogPost } from "@/lib/cms";
import GsapTypingHeading from "@/components/GsapTypingHeading";
import GsapRevealSection from "@/components/GsapRevealSection";
import Footer from "@/components/Footer";
import BlogClientView from "./BlogClientView";
import { BookOpen, Sparkles, MapPin, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Journal · Dareean Ahmad Raffi",
  description: "Personal journal, daily life logs, milestones, achievements, and engineering reflections by Dareean Ahmad Raffi in Palu, Central Sulawesi.",
};

export const dynamic = "force-dynamic";

export default function BlogPage() {
  const cmsData = getCMSData();
  const blogs: CMSBlogPost[] = cmsData.blogs || [];

  return (
    <main className="min-h-screen bg-canvas text-charcoal pt-28 md:pt-32 pb-20 px-6 md:px-8 relative overflow-x-hidden">
      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-amber-500/[0.025] rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-container mx-auto">
        {/* ── Editorial Header Section ── */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-hairline">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-primary" />
                <span className="inline-flex items-center gap-1.5 text-micro-uppercase text-primary font-bold tracking-wider font-mono">
                  <Compass size={13} />
                  <span>Journal &amp; Personal Feed</span>
                </span>
              </div>

              <GsapTypingHeading
                text="Life, Achievements &amp; Reflections"
                as="h1"
                className="text-heading-1 md:text-display-md lg:text-display-lg text-charcoal font-semibold tracking-tight leading-[1.15]"
              />

              <p className="text-body-md md:text-body-lg text-slate leading-relaxed">
                Catatan personal seputar keseharian developer, momentum pencapaian (*achievements*), proses kreatif, dan perjalanan membangun teknologi dari Palu, Sulawesi Tengah.
              </p>
            </div>

            {/* Quick Metrics / Status Ticker */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 flex-shrink-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-hairline text-caption font-mono text-charcoal shadow-elevation-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-steel">Total Entries:</span>
                <span className="font-semibold text-charcoal">{blogs.length} Stories</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-hairline text-caption font-mono text-steel shadow-elevation-1">
                <MapPin size={13} className="text-primary" />
                <span>Palu, Sulawesi Tengah · WITA</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Interactive Client View (Search, Filters, Spotlight & Bento Grid) ── */}
        <GsapRevealSection yOffset={25} duration={0.8}>
          <BlogClientView initialBlogs={blogs} />
        </GsapRevealSection>
      </div>

      <div className="mt-28">
        <Footer />
      </div>
    </main>
  );
}
