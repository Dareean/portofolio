"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
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

      {/* Bento Grid */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ gridAutoRows: 'minmax(340px, auto)' }}
        layout
      >
        {filteredProjects.map((project, index) => {
          // Determine card size for bento effect
          const isLarge = project.featured && index < 2;
          const isMedium = index === 2 || index === 5;
          const isExpanded = expandedDescriptions.has(project.id);
          
          return (
            <motion.article
              key={project.id}
              className={`relative ${
                isLarge ? "md:col-span-2 md:row-span-2" : ""
              } ${isMedium && !isExpanded ? "lg:row-span-2" : ""}`}
              style={{ minHeight: isExpanded ? 'auto' : undefined }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              layout
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <TiltCard className="h-full">
                <Link href={project.link || `/work/${project.id}`} className="block h-full" target={project.link ? "_blank" : undefined}>
                  <div 
                    className="group relative h-full rounded-2xl overflow-hidden border border-off-white/10 transition-all duration-500 hover:border-off-white/25 hover:shadow-2xl hover:shadow-off-white/5"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    {/* Project Image Background */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                    
                    {/* Dark Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-void-black from-30% via-void-black/70 via-60% to-transparent" />

                    {/* Hover Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-void-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Project Number */}
                    <div className="absolute top-6 right-6 z-10">
                      <span className="font-display text-6xl lg:text-7xl text-off-white/[0.07] transition-all duration-300 group-hover:text-off-white/[0.12]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative h-full p-6 flex flex-col justify-between z-10 overflow-hidden">
                      {/* Top Row - Featured Badge & Project Number */}
                      <div className="flex items-start justify-between">
                        {project.featured ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 + index * 0.1 }}
                          >
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-off-white text-void-black text-xs tracking-widest uppercase rounded-full">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                              Featured
                            </span>
                          </motion.div>
                        ) : (
                          <div />
                        )}
                      </div>

                      {/* Bottom Section */}
                      <div>
                        {/* Categories & Year */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {(Array.isArray(project.category) ? project.category : [project.category]).map((cat, i) => (
                            <span key={i} className="px-2.5 py-1 text-[10px] tracking-widest uppercase text-off-white/80 border border-off-white/20 rounded-full">
                              {cat}
                            </span>
                          ))}
                          <span className="text-off-white/100 font-mono text-xs">
                            {project.year}
                          </span>
                        </div>

                      {/* Title */}
                      <h2 className={`font-display text-off-white transition-colors duration-300 group-hover:text-off-white/90 leading-tight ${
                        isLarge ? "text-4xl lg:text-5xl" : "text-2xl lg:text-3xl line-clamp-3"
                      }`}>
                        {project.title}
                      </h2>

                      {/* Description */}
                      {project.description && (
                        <div className="mt-3">
                          <motion.div
                            initial={false}
                            animate={{ 
                              height: isExpanded ? 'auto' : (isLarge ? '3.5rem' : '1.5rem')
                            }}
                            transition={{ 
                              duration: 0.4, 
                              ease: [0.4, 0, 0.2, 1]
                            }}
                            className="overflow-hidden"
                          >
                            <p className={`text-off-white/50 leading-relaxed transition-colors duration-300 group-hover:text-off-white/60 ${
                              isLarge ? "text-base max-w-md" : "text-sm"
                            }`}>
                              {project.description}
                            </p>
                          </motion.div>
                          {project.description.length > 50 && (
                            <motion.button
                              onClick={(e) => toggleDescription(project.id, e)}
                              className="mt-2 text-xs text-off-white/70 hover:text-off-white transition-colors underline decoration-dotted underline-offset-2 z-30 relative"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <AnimatePresence mode="wait">
                                <motion.span
                                  key={isExpanded ? 'less' : 'more'}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  {isExpanded ? "Show less" : "Show more"}
                                </motion.span>
                              </AnimatePresence>
                            </motion.button>
                          )}
                        </div>
                      )}

                      {/* View Link */}
                      <motion.div 
                        className="mt-6 flex items-center gap-3 text-off-white/50 group-hover:text-off-white transition-colors duration-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: hoveredProject === project.id ? 1 : 0.6, 
                          x: hoveredProject === project.id ? 0 : -10 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm tracking-widest uppercase">View Project</span>
                        <svg 
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.div>
                      </div>

                      {/* Decorative Corner Lines */}
                      <div className="absolute bottom-0 right-0 w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                        <div className="absolute bottom-4 right-4 w-full h-[1px] bg-gradient-to-l from-off-white to-transparent" />
                        <div className="absolute bottom-4 right-4 h-full w-[1px] bg-gradient-to-t from-off-white to-transparent" />
                      </div>
                    </div>

                    {/* Shine Effect on Hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{
                        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
                        transform: "translateX(-100%)",
                      }}
                      animate={{
                        transform: hoveredProject === project.id ? "translateX(100%)" : "translateX(-100%)",
                      }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                </Link>
              </TiltCard>
            </motion.article>
          );
        })}
      </motion.section>
    </main>
  );
}
