"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useScroll } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import { PROJECTS } from "@/lib/data";

// Generate categories dynamically
const allCategories = PROJECTS.flatMap(p => 
  Array.isArray(p.category) ? p.category : [p.category]
);
const categories = ["All", ...Array.from(new Set(allCategories))];

// Minimal Project Card with scroll animation
function ProjectCard({ 
  project, 
  index 
}: { 
  project: typeof PROJECTS[0]; 
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [80, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y, scale }}
      className="group"
    >
      <Link 
        href={project.link || `/work/${project.id}`} 
        target={project.link ? "_blank" : undefined}
        className="block"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-off-white/5 mb-6">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${project.image})` }}
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-void-black/0 group-hover:bg-void-black/20 transition-colors duration-500" />
          
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-off-white text-void-black text-xs tracking-widest uppercase rounded-full">
                Featured
              </span>
            </div>
          )}

          {/* View indicator on hover */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="px-6 py-3 bg-off-white text-void-black text-sm tracking-wider uppercase rounded-full">
              View
            </span>
          </motion.div>
        </div>

        {/* Info */}
        <div className="space-y-3">
          {/* Categories + Year */}
          <div className="flex items-center gap-3 text-off-white/40 text-xs tracking-widest uppercase">
            <span>{Array.isArray(project.category) ? project.category[0] : project.category}</span>
            <span className="w-1 h-1 bg-off-white/20 rounded-full" />
            <span>{project.year}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-2xl md:text-3xl text-off-white group-hover:text-off-white/80 transition-colors duration-300 leading-tight">
            {project.title}
          </h3>

          {/* Description */}
          {project.description && (
            <p className="text-off-white/50 text-sm leading-relaxed line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

  // Hero scroll effects
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, -100]);

  const toggleDescription = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredProjects = activeFilter === "All" 
    ? PROJECTS 
    : PROJECTS.filter(p => 
        Array.isArray(p.category) 
          ? p.category.includes(activeFilter) 
          : p.category === activeFilter
      );

  return (
    <main className="min-h-screen overflow-hidden bg-void-black">
      {/* ============================================ */}
      {/* HERO - Horizontal Marquee */}
      {/* ============================================ */}
      <motion.section 
        ref={heroRef}
        className="h-screen pt-20 pb-8 flex flex-col items-center justify-between relative overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        {/* Marquee Container */}
        <div className="w-full overflow-hidden py-4 flex-1 flex flex-col justify-center">
          {/* First marquee row - scrolling left */}
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: [0, "-50%"] }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...Array(4)].map((_, i) => (
              <span 
                key={i} 
                className="font-display text-[10vw] md:text-[8vw] lg:text-[6vw] text-off-white tracking-tighter mx-6 flex items-center gap-6"
              >
                WORK
                <span className="text-off-white/20">•</span>
                PLAY
                <span className="text-off-white/20">•</span>
                CREATE
                <span className="text-off-white/20">•</span>
                REPEAT
                <span className="text-off-white/20">•</span>
              </span>
            ))}
          </motion.div>

          {/* Second marquee row - scrolling right (reverse) */}
          <motion.div
            className="flex whitespace-nowrap mt-2"
            animate={{ x: ["-50%", 0] }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...Array(4)].map((_, i) => (
              <span 
                key={i} 
                className="font-display text-[10vw] md:text-[8vw] lg:text-[6vw] text-off-white/10 tracking-tighter mx-6 flex items-center gap-6"
              >
                IDEAS
                <span className="text-off-white/5">→</span>
                PIXELS
                <span className="text-off-white/5">→</span>
                REALITY
                <span className="text-off-white/5">→</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Centered content below marquee */}
        <motion.div 
          className="text-center px-6 max-w-xl"
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-off-white/50 text-sm md:text-base leading-relaxed">
            A curated collection of projects spanning mobile apps, 
            web platforms, and digital experiences.
          </p>

          {/* Scroll indicator - simple arrow */}
          <motion.div
            className="mt-6 flex flex-col items-center gap-2 text-off-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <motion.svg 
              width="14" 
              height="20" 
              viewBox="0 0 16 24" 
              fill="none"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path 
                d="M8 0V22M8 22L1 15M8 22L15 15" 
                stroke="currentColor" 
                strokeWidth="1.5"
              />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Gradient fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-void-black to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-void-black to-transparent pointer-events-none z-10" />
      </motion.section>




      {/* ============================================ */}
      {/* FILTER - Minimal Underline Style */}
      {/* ============================================ */}
      <section className="px-6 md:px-12 lg:px-20 py-12 border-b border-off-white/10">
        <motion.nav
          className="flex flex-wrap gap-x-8 gap-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="relative py-2 text-sm tracking-wider uppercase transition-colors duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.4 + i * 0.05 }}
            >
              <span className={activeFilter === cat ? "text-off-white" : "text-off-white/40 hover:text-off-white/70"}>
                {cat}
              </span>
              {/* Underline indicator */}
              {activeFilter === cat && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-off-white"
                  layoutId="filter-underline"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </motion.button>
          ))}
        </motion.nav>
      </section>

      {/* ============================================ */}
      {/* PROJECT GRID - Clean Minimal Cards */}
      {/* ============================================ */}
      <section className="px-6 md:px-12 lg:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-off-white/40 text-lg">No projects found in this category.</p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
