"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { EXPERIENCES, Experience } from "@/lib/data";

// Category styling
const categoryStyles: Record<string, { icon: string; bg: string; text: string; border: string }> = {
  education: { icon: "🎓", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  work: { icon: "💼", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  award: { icon: "🏆", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  community: { icon: "🤝", bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  volunteer: { icon: "🌱", bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
};

// Format date display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "-01");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Experience Card Component
function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.5],
    [index % 2 === 0 ? -100 : 100, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  const style = categoryStyles[experience.category] || categoryStyles.work;
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, x, scale }}
      className={`relative flex items-center gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Timeline dot */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`w-12 h-12 rounded-full ${style.bg} ${style.border} border-2 flex items-center justify-center text-xl shadow-lg`}
        >
          {style.icon}
        </motion.div>
      </div>

      {/* Card */}
      <div className={`w-full md:w-5/12 ${isLeft ? "md:pr-16" : "md:pl-16"}`}>
        <motion.div
          className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
          whileHover={{ y: -5 }}
        >
          {/* Category Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${style.bg} ${style.text} ${style.border} border mb-4`}>
            <span>{style.icon}</span>
            <span className="capitalize">{experience.category}</span>
          </div>

          {/* Date */}
          <div className="text-off-white/40 text-sm font-medium mb-2">
            {formatDate(experience.dateStart)}
            {experience.dateEnd ? ` — ${formatDate(experience.dateEnd)}` : " — Present"}
          </div>

          {/* Title */}
          <h3 className="font-display text-xl md:text-2xl text-off-white mb-1">
            {experience.title}
          </h3>

          {/* Role & Organization */}
          <p className="text-off-white/60 font-medium mb-4">
            {experience.role} · {experience.organization}
          </p>

          {/* Description */}
          <p className="text-off-white/50 leading-relaxed mb-4">
            {experience.description}
          </p>

          {/* Highlights */}
          {experience.highlights && (
            <div className="flex flex-wrap gap-2">
              {experience.highlights.map((highlight, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-off-white/60 text-xs rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Empty space for the other side */}
      <div className="hidden md:block w-5/12" />
    </motion.div>
  );
}

// Progress Indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 z-50">
      <div className="w-1 h-32 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="w-full h-full bg-off-white rounded-full"
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
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Sort experiences by date (newest first)
  const sortedExperiences = [...EXPERIENCES].sort(
    (a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime()
  );

  return (
    <main ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl" />
      </motion.div>

      <ScrollProgress />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative">
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

      {/* Timeline Section */}
      <section className="px-6 md:px-16 py-20 relative">
        {/* Center Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden md:block" />

        {/* Experience Cards */}
        <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
          {sortedExperiences.map((experience, index) => (
            <ExperienceCard key={experience.id} experience={experience} index={index} />
          ))}
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

      {/* Back Link */}
      <div className="fixed top-8 left-6 md:left-16 z-50">
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>
    </main>
  );
}
