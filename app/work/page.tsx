"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import { PROJECTS } from "@/lib/data";

const categories = ["All", "Mobile App", "Web Platform", "Dashboard", "Design System", "E-Commerce"];

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
    : PROJECTS.filter(p => p.category === activeFilter);

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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]"
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
                <Link href={`/work/${project.id}`} className="block h-full">
                  <div 
                    className="group relative h-full rounded-2xl overflow-hidden border border-off-white/10 bg-gradient-to-br from-off-white/[0.03] to-transparent backdrop-blur-sm transition-all duration-500 hover:border-off-white/25 hover:shadow-2xl hover:shadow-off-white/5"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26,26,26,0.15) 1px, transparent 0)`,
                        backgroundSize: "24px 24px"
                      }} />
                    </div>

                    {/* Gradient Overlay on Hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-off-white/5 via-transparent to-off-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Project Number */}
                    <div className="absolute top-6 right-6 z-10">
                      <span className="font-display text-6xl lg:text-7xl text-off-white/[0.07] transition-all duration-300 group-hover:text-off-white/[0.12]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative h-full p-8 flex flex-col justify-end z-10">
                      {/* Featured Badge */}
                      {project.featured && (
                        <motion.div 
                          className="absolute top-6 left-6"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 + index * 0.1 }}
                        >
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-off-white text-void-black text-xs tracking-widest uppercase rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Featured
                          </span>
                        </motion.div>
                      )}

                      {/* Category & Year */}
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 text-xs tracking-widest uppercase text-off-white/60 border border-off-white/20 rounded-full">
                          {project.category}
                        </span>
                        <span className="text-off-white/40 font-mono text-xs">
                          {project.year}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className={`font-display text-off-white transition-colors duration-300 group-hover:text-off-white/90 ${
                        isLarge ? "text-5xl lg:text-6xl" : "text-3xl lg:text-4xl"
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

      {/* Footer CTA */}
      <motion.footer
        className="mt-24 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <p className="text-off-white/40 mb-6">Have a project in mind?</p>
        <Link
          href="mailto:hello@dareean.com"
          className="group inline-flex items-center gap-4 px-8 py-4 border-2 border-off-white/20 rounded-full text-off-white hover:border-off-white hover:bg-off-white hover:text-void-black transition-all duration-300"
        >
          <span className="text-lg tracking-widest uppercase">Let&apos;s Talk</span>
          <svg 
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-45" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.footer>
    </main>
  );
}
