"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";
import { Project } from "@/lib/data";



interface WorkListProps {
  projects: Project[];
}

export default function WorkList({ projects }: WorkListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position with spring for smooth cursor following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative py-32 px-8 md:px-16" ref={containerRef}>
      {/* Section Header of work */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-display text-5xl md:text-7xl text-off-white">
          Selected Work
        </h2>
      </motion.div>

      {/* Project List */}
      <div className="space-y-0">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="group border-t border-off-white/10 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <motion.div
              className="py-8 md:py-12 flex items-center justify-between transition-opacity duration-300"
              animate={{
                opacity:
                  hoveredIndex === null || hoveredIndex === index ? 1 : 0.3,
              }}
            >
              {/* Project Info */}
              <div className="flex items-baseline gap-4 md:gap-8">
                <span className="text-sm text-off-white/40 font-mono">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-3xl md:text-5xl lg:text-6xl text-off-white tracking-tight">
                  {project.title}
                </h3>
              </div>

              {/* Project Meta */}
              <div className="hidden md:flex items-center gap-12">
                <span className="text-off-white/60 uppercase tracking-widest text-sm">
                  {Array.isArray(project.category) ? project.category.join(" / ") : project.category}
                </span>
                <span className="text-off-white/40 font-mono text-sm">
                  {project.year}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
        {/* Bottom border */}
        <div className="border-t border-off-white/10" />
      </div>

      {/* View All Link */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Link
          href="/work"
          className="inline-flex items-center gap-3 px-8 py-4 border border-off-white/30 text-off-white text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300"
        >
          View All Projects
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </motion.div>

      {/* Floating Image Preview */}
      <motion.div
        className="fixed top-0 left-0 w-72 h-96 pointer-events-none z-40 will-change-transform"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: hoveredIndex !== null ? 1 : 0,
          scale: hoveredIndex !== null ? 1 : 0.8,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-full h-full bg-void-black border border-off-white/20 overflow-hidden">
          {hoveredIndex !== null && (
            <motion.div
              key={hoveredIndex}
              className="w-full h-full bg-gradient-to-br from-off-white/10 to-transparent flex items-center justify-center"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <span className="font-display text-2xl text-off-white/40">
                {projects[hoveredIndex]?.title}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
