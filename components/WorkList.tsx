"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import Link from "next/link";
import { Project } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface WorkListProps {
  projects: Project[];
}

export default function WorkList({ projects }: WorkListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse position with spring for smooth cursor following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, [mouseX, mouseY, isMobile]);

  // GSAP ScrollTrigger Animations
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Project items staggered animation
      if (projectListRef.current) {
        const projectItems =
          projectListRef.current.querySelectorAll(".project-item");
        gsap.fromTo(
          projectItems,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: projectListRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // View All button animation
      if (viewAllRef.current) {
        gsap.fromTo(
          viewAllRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: viewAllRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-16"
    >
      {/* Section Header of work (GSAP animated) */}
      <div ref={headerRef} className="mb-8 sm:mb-12 md:mb-16">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-off-white">
          Selected Work
        </h2>
      </div>

      {/* Project List (GSAP animated) */}
      <div ref={projectListRef} className="space-y-0">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="project-item group border-t border-off-white/10 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <motion.div
              className="py-6 sm:py-8 md:py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 transition-opacity duration-300"
              animate={{
                opacity:
                  hoveredIndex === null || hoveredIndex === index ? 1 : 0.3,
              }}
            >
              {/* Project Info */}
              <div className="flex items-baseline gap-2 sm:gap-4 md:gap-8">
                <span className="text-xs sm:text-sm text-off-white/40 font-mono">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl text-off-white tracking-tight">
                  {project.title}
                </h3>
              </div>

              {/* Project Meta */}
              <div className="flex sm:hidden md:flex items-center gap-4 sm:gap-8 md:gap-12 ml-6 sm:ml-0">
                <span className="text-off-white/60 uppercase tracking-widest text-xs sm:text-sm">
                  {Array.isArray(project.category)
                    ? project.category.join(" / ")
                    : project.category}
                </span>
                <span className="text-off-white/40 font-mono text-xs sm:text-sm">
                  {project.year}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
        {/* Bottom border */}
        <div className="border-t border-off-white/10" />
      </div>

      {/* View All Link (GSAP animated) */}
      <div ref={viewAllRef} className="mt-12 text-center">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-4 border border-off-white/30 text-off-white text-xs sm:text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300"
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
      </div>

      {/* Floating Image Preview - Visible on desktop */}
      {!isMobile && (
        <motion.div
          className="fixed top-0 left-0 w-56 md:w-72 lg:w-80 h-64 md:h-80 lg:h-96 pointer-events-none z-[100] will-change-transform"
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
          <div className="w-full h-full bg-void-black/95 backdrop-blur-sm border-2 border-off-white/30 rounded-lg overflow-hidden shadow-2xl">
            {hoveredIndex !== null && projects[hoveredIndex] && (
              <motion.div
                key={hoveredIndex}
                className="w-full h-full relative"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Project Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${projects[hoveredIndex].image})`,
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/60 to-transparent" />
                {/* Project info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-display text-lg text-off-white/90 mb-1">
                    {projects[hoveredIndex].title}
                  </p>
                  <p className="text-xs text-off-white/60 uppercase tracking-wide">
                    {Array.isArray(projects[hoveredIndex].category)
                      ? projects[hoveredIndex].category.join(" / ")
                      : projects[hoveredIndex].category}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
}
