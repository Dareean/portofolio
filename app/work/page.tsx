"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import { PROJECTS } from "@/lib/data";

// Generate categories dynamically from projects
const allCategories = PROJECTS.flatMap(p => 
  Array.isArray(p.category) ? p.category : [p.category]
);
const categories = ["All", ...Array.from(new Set(allCategories))];

// Tilt card component for 3D hover effect
function TiltCard({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects = activeFilter === "All" 
    ? PROJECTS 
    : PROJECTS.filter(p => 
        Array.isArray(p.category) 
          ? p.category.includes(activeFilter) 
          : p.category === activeFilter
      );

  return (
    <main className="min-h-screen py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #1A1A1A 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, #1A1A1A 0%, transparent 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header Section - Minimal Black & White */}
      <motion.header
        className="relative mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Layout - Number Left, Text Right */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">
          
          {/* Left Side - Big Animated Number */}
          <motion.div 
            className="relative flex items-center"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Large Number with Count Animation */}
            <div className="relative">
              <motion.span
                className="font-display text-[12rem] md:text-[16rem] lg:text-[20rem] leading-none text-off-white font-bold tracking-tighter"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {PROJECTS.length}
                </motion.span>
              </motion.span>
              
              {/* Subtle animated line accent */}
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-off-white"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
              
              {/* Label below number */}
              <motion.span
                className="absolute -bottom-10 left-0 text-off-white/40 text-sm tracking-[0.3em] uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Projects
              </motion.span>
            </div>
          </motion.div>

          {/* Right Side - Typography */}
          <motion.div 
            className="flex-1 max-w-xl lg:text-right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Breadcrumb */}
            <motion.p
              className="text-off-white/40 text-sm tracking-[0.2em] uppercase mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Portfolio / Work
            </motion.p>

            {/* Main Title */}
            <motion.h1
              className="font-display text-5xl md:text-6xl lg:text-7xl text-off-white leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Selected
              <br />
              <span className="text-off-white/60">Works</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-off-white/50 text-base md:text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              A collection of projects spanning mobile apps, 
              web platforms, and digital experiences — 
              each crafted with intention and care.
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              className="mt-8 lg:ml-auto w-24 h-px bg-off-white/20"
              initial={{ scaleX: 0, originX: 1 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </motion.div>
        </div>
      </motion.header>

      {/* Filter Section */}
      <motion.nav
        className="mb-16 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex gap-2 min-w-max">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`relative px-6 py-3 text-sm tracking-widest uppercase transition-all duration-300 rounded-full ${
                activeFilter === cat
                  ? "text-void-black"
                  : "text-off-white/50 hover:text-off-white"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeFilter === cat && (
                <motion.span
                  className="absolute inset-0 bg-off-white rounded-full"
                  layoutId="activeFilter"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Bento Grid */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[340px]"
        layout
      >
        {filteredProjects.map((project, index) => {
          // Determine card size for bento effect
          const isLarge = project.featured && index < 2;
          const isMedium = index === 2 || index === 5;
          
          return (
            <motion.article
              key={project.id}
              className={`relative ${
                isLarge ? "md:col-span-2 md:row-span-2" : ""
              } ${isMedium ? "lg:row-span-2" : ""}`}
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
                    <div className="relative h-full p-6 flex flex-col justify-between z-10">
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
                        <p className={`mt-4 text-off-white/50 leading-relaxed transition-colors duration-300 group-hover:text-off-white/60 ${
                          isLarge ? "text-base max-w-md" : "text-sm line-clamp-2"
                        }`}>
                          {project.description}
                        </p>
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
