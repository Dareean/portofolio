"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { EXPERIENCES, Experience } from "@/lib/data";

// Category styling
const categoryStyles: Record<string, { icon: string; bg: string; text: string; border: string }> = {
  education: { icon: "🎓", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  work: { icon: "💼", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  award: { icon: "🏆", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  community: { icon: "🤝", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  volunteer: { icon: "🌱", bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
};

// Format date display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "-01");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Timeline Experience Card - Horizontal style
function TimelineCard({ experience }: { experience: Experience }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  const style = categoryStyles[experience.category] || categoryStyles.work;

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y }}
      className="relative"
    >
      {/* Timeline connector dot */}
      <div className="absolute -left-[41px] top-8 w-4 h-4 rounded-full bg-off-white/20 border-2 border-off-white/40 z-10" />
      
      <motion.div
        className="bg-void-black/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-off-white/10 hover:border-off-white/20 transition-all duration-500 group"
        whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.3)" }}
      >
        {/* Top row: Category + Date */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${style.bg} ${style.text} ${style.border} border`}>
            <span>{style.icon}</span>
            <span className="capitalize">{experience.category}</span>
          </div>
          <span className="text-off-white/40 text-sm font-mono">
            {formatDate(experience.dateStart)}
            {experience.dateEnd ? ` — ${formatDate(experience.dateEnd)}` : " — Present"}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl md:text-2xl text-off-white mb-2 group-hover:text-off-white/90 transition-colors">
          {experience.title}
        </h3>

        {/* Role & Organization */}
        <p className="text-off-white/60 font-medium mb-4">
          {experience.role} · {experience.organization}
        </p>

        {/* Description */}
        <p className="text-off-white/50 leading-relaxed mb-5">
          {experience.description}
        </p>

        {/* Highlights */}
        {experience.highlights && (
          <div className="flex flex-wrap gap-2">
            {experience.highlights.map((highlight, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-off-white/5 text-off-white/60 text-xs rounded-full border border-off-white/10"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Section Header Component
function SectionHeader({ 
  title, 
  subtitle, 
  icon 
}: { 
  title: string; 
  subtitle: string; 
  icon: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="mb-12 md:mb-16"
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{icon}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-off-white/20 to-transparent" />
      </div>
      <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-off-white mb-3">
        {title}
      </h2>
      <p className="text-off-white/50 text-lg max-w-2xl">
        {subtitle}
      </p>
    </motion.div>
  );
}

// Progress Indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 z-50">
      <div className="w-1 h-32 bg-off-white/10 rounded-full overflow-hidden">
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="w-full h-full bg-off-white/60 rounded-full"
        />
      </div>
      <span className="text-xs text-off-white/40 font-medium -rotate-90 whitespace-nowrap mt-4">
        Scroll to explore
      </span>
    </div>
  );
}

export default function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Sort experiences by date (newest first)
  const sortedExperiences = [...EXPERIENCES].sort(
    (a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime()
  );

  // Separate into Professional and Volunteer/Community
  const professionalExperiences = sortedExperiences.filter(
    (exp) => ["work", "education", "award"].includes(exp.category)
  );
  const volunteerExperiences = sortedExperiences.filter(
    (exp) => ["volunteer", "community"].includes(exp.category)
  );

  return (
    <main ref={containerRef} className="min-h-screen relative overflow-hidden bg-void-black">
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </motion.div>

      <ScrollProgress />

      {/* Hero Section - KEPT FROM ORIGINAL */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative">
        {/* Home Link */}
        <motion.div
          className="absolute top-6 left-6 md:left-16 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-off-white/50 hover:text-off-white transition-colors group"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm tracking-wide">Home</span>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-off-white/40 text-sm tracking-widest uppercase mb-4 block"
          >
            My Journey
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-off-white mb-6"
          >
            Experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-off-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            A timeline of my growth — from learning to code to contributing to communities, 
            competing in hackathons, and building meaningful projects.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-off-white/30 text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-off-white/20 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-off-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================ */}
      {/* PROFESSIONAL EXPERIENCE SECTION */}
      {/* ============================================ */}
      <section className="px-6 md:px-16 lg:px-24 py-20 relative">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Professional"
            subtitle="Work experience, education milestones, and achievements that shaped my career."
            icon="💼"
          />

          {/* Timeline container with vertical line */}
          <div className="relative pl-8 border-l-2 border-off-white/10 space-y-8">
            {professionalExperiences.map((experience) => (
              <TimelineCard key={experience.id} experience={experience} />
            ))}
          </div>
        </div>
      </section>

      {/* Visual Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto px-6 md:px-16 lg:px-24 py-12"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-off-white/20 to-transparent" />
      </motion.div>

      {/* ============================================ */}
      {/* VOLUNTEER & COMMUNITY SECTION */}
      {/* ============================================ */}
      <section className="px-6 md:px-16 lg:px-24 py-20 relative">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Volunteer & Community"
            subtitle="Giving back through community service, environmental initiatives, and collaborative projects."
            icon="🌱"
          />

          {/* Timeline container with vertical line */}
          <div className="relative pl-8 border-l-2 border-off-white/10 space-y-8">
            {volunteerExperiences.map((experience) => (
              <TimelineCard key={experience.id} experience={experience} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="px-6 md:px-16 py-32 text-center"
      >
        <h2 className="font-display text-3xl md:text-5xl text-off-white mb-6">
          Want to work together?
        </h2>
        <p className="text-off-white/50 text-lg mb-8 max-w-xl mx-auto">
          I&apos;m always open to discussing new opportunities, collaborations, or just having a chat.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-off-white text-void-black font-medium rounded-full hover:bg-off-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get in Touch
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.section>

      {/* Back Link - hidden since navbar handles this */}
    </main>
  );
}
