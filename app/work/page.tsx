"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { PROJECTS } from "@/lib/data";
import FloatingNav from "@/components/FloatingNav";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Generate categories dynamically
const allCategories = PROJECTS.flatMap((p) =>
  Array.isArray(p.category) ? p.category : [p.category],
);
const categories = ["All", ...Array.from(new Set(allCategories))];

// Project Card with GSAP animations
function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    // GSAP Pop-up animation with stagger
    gsap.fromTo(
      cardRef.current,
      {
        scale: 0.8,
        opacity: 0,
        y: 50,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        delay: (index % 3) * 0.1, // Stagger based on grid position
      },
    );

    // Parallax effect on image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === cardRef.current) {
          trigger.kill();
        }
      });
    };
  }, [index]);

  // Toggle description expansion
  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!descRef.current) return;

    if (isExpanded) {
      gsap.to(descRef.current, {
        maxHeight: "3rem", // ~2 lines
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(descRef.current, {
        maxHeight: descRef.current.scrollHeight,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={cardRef} className="group">
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-off-white/5 mb-4 sm:mb-5 md:mb-6">
          <div
            ref={imageRef}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            style={{
              backgroundImage: `url(${project.image})`,
              backgroundPosition: "center 30%",
              height: "120%",
            }}
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

          {/* External link indicator */}
          {project.link && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="w-5 h-5 text-off-white" />
            </div>
          )}

          {/* View indicator on hover */}
          <motion.div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-6 py-3 bg-off-white text-void-black text-sm tracking-wider uppercase rounded-full">
              View
            </span>
          </motion.div>
        </div>

        {/* Info */}
        <div className="space-y-2 sm:space-y-3">
          {/* Categories + Year */}
          <div className="flex items-center gap-2 sm:gap-3 text-off-white/40 text-[10px] sm:text-xs tracking-widest uppercase">
            <span>
              {Array.isArray(project.category)
                ? project.category[0]
                : project.category}
            </span>
            <span className="w-1 h-1 bg-off-white/20 rounded-full" />
            <span>{project.year}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-off-white group-hover:text-off-white/80 transition-colors duration-300 leading-tight">
            {project.title}
          </h3>

          {/* Description - Expandable */}
          {project.description && (
            <div className="relative">
              <p
                ref={descRef}
                className="text-off-white/50 text-xs sm:text-sm leading-relaxed overflow-hidden transition-all duration-300"
                style={{ maxHeight: "3rem" }}
              >
                {project.description}
              </p>

              {/* Read More Button - only show if text is long */}
              {project.description.length > 100 && (
                <button
                  onClick={toggleDescription}
                  className="mt-2 text-off-white/40 hover:text-off-white text-[10px] tracking-wider uppercase transition-colors inline-flex items-center gap-1"
                >
                  <span>{isExpanded ? "Show Less" : "Read More"}</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Hero scroll effects
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.95]);

  const filteredProjects =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) =>
          Array.isArray(p.category)
            ? p.category.includes(activeFilter)
            : p.category === activeFilter,
        );

  return (
    <main className="min-h-screen overflow-hidden bg-void-black">
      {/* Animated Background */}
      <AnimatedBackground />
      <FloatingNav />

      {/* ============================================ */}
      {/* HERO - Editorial Title */}
      {/* ============================================ */}
      <motion.section
        ref={heroRef}
        className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 flex flex-col items-center justify-center relative px-6"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
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

        {/* Main Hero Content */}
        <div className="max-w-5xl text-center">
          {/* Overline */}
          <motion.div
            className="mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-off-white/40 text-[10px] sm:text-xs tracking-[0.3em] uppercase">
              Selected Projects
            </span>
          </motion.div>

          {/* Main Title - Large Editorial */}
          <motion.h1
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-off-white leading-[0.9] mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Visual
            <br />
            <span className="text-off-white/30">Narratives</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-off-white/60 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Curated collection of digital experiences — from mobile apps to web
            platforms. Each project tells a story through design and
            functionality.
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center gap-3 text-off-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase">
              Explore
            </span>
            <motion.svg
              width="14"
              height="20"
              viewBox="0 0 16 24"
              fill="none"
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                d="M8 0V22M8 22L1 15M8 22L15 15"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </motion.svg>
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================ */}
      {/* FILTER - Clean Pills */}
      {/* ============================================ */}
      <section className="sticky top-16 sm:top-20 bg-void-black/80 backdrop-blur-lg z-30 border-y border-off-white/10 px-6 md:px-12 lg:px-20 py-4 sm:py-6">
        <motion.nav
          className="flex flex-wrap gap-2 sm:gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 sm:px-5 py-2 text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all duration-300 border ${
                activeFilter === cat
                  ? "bg-off-white text-void-black border-off-white"
                  : "bg-transparent text-off-white/50 border-off-white/20 hover:text-off-white hover:border-off-white/50"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.nav>
      </section>

      {/* ============================================ */}
      {/* PROJECT GRID - Clean Minimal Cards */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-x-8 gap-y-10 sm:gap-y-12 md:gap-y-16">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-off-white/40 text-lg">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </section>

      {/* ============================================ */}
      {/* FOOTER CTA */}
      {/* ============================================ */}
      <section className="px-6 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24 border-t border-off-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="font-display text-4xl sm:text-5xl md:text-6xl text-off-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Let's Create Together
          </motion.h2>
          <motion.p
            className="text-off-white/60 text-base sm:text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Have a project in mind? Let's discuss how we can bring your vision
            to life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="inline-block px-8 py-4 border-2 border-off-white text-off-white text-sm tracking-[0.15em] uppercase hover:bg-off-white hover:text-void-black transition-all duration-300"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
