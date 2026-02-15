"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import FloatingNav from "@/components/FloatingNav";
import {
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Generate categories dynamically
const allCategories = PROJECTS.flatMap((p) =>
  Array.isArray(p.category) ? p.category : [p.category],
);
const categories = ["All", ...Array.from(new Set(allCategories))];

// Featured vs Regular projects
const featuredProjects = PROJECTS.filter((p) => p.featured);
const regularProjects = PROJECTS.filter((p) => !p.featured);

// Animated Background (matching /journey page)
function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.to(".animated-star", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    gsap.to(".animated-circle", {
      y: "random(-30, 30)",
      x: "random(-20, 20)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: { each: 0.3, from: "random" },
    });

    gsap.to(".animated-dot", {
      scale: "random(0.8, 1.2)",
      opacity: "random(0.3, 0.8)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: { each: 0.5, from: "random" },
    });

    gsap.to(".animated-path", {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Asterisk/Star - Top Right */}
      <svg
        className="animated-star absolute top-20 right-[15%] w-16 h-16 opacity-20"
        viewBox="0 0 100 100"
      >
        <path
          d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </svg>

      {/* Circle - Top Left */}
      <svg
        className="animated-circle absolute top-32 left-[10%] w-12 h-12 opacity-15"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#34D399"
          strokeWidth="3"
        />
      </svg>

      {/* Small dots scattered */}
      <div className="animated-dot absolute top-[25%] left-[20%] w-2 h-2 rounded-full bg-blue-400 opacity-40" />
      <div className="animated-dot absolute top-[40%] right-[25%] w-3 h-3 rounded-full bg-purple-400 opacity-30" />
      <div className="animated-dot absolute bottom-[30%] left-[15%] w-2 h-2 rounded-full bg-pink-400 opacity-40" />
      <div className="animated-dot absolute top-[60%] right-[15%] w-2 h-2 rounded-full bg-emerald-400 opacity-35" />

      {/* Curved Path - Left Side */}
      <svg
        className="absolute top-[35%] left-0 w-64 h-64 opacity-10"
        viewBox="0 0 200 200"
      >
        <path
          className="animated-path"
          d="M 10,100 Q 50,20 100,50 T 190,100"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="2"
          strokeDasharray="300"
          strokeDashoffset="300"
        />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </svg>

      {/* Diamond shape - Bottom Right */}
      <svg
        className="animated-circle absolute bottom-[20%] right-[20%] w-10 h-10 opacity-15"
        viewBox="0 0 100 100"
      >
        <path
          d="M 50,10 L 90,50 L 50,90 L 10,50 Z"
          fill="none"
          stroke="#F472B6"
          strokeWidth="2"
        />
      </svg>

      {/* Plus shape - Middle */}
      <svg
        className="animated-star absolute top-[50%] left-[50%] w-8 h-8 opacity-10"
        viewBox="0 0 100 100"
      >
        <path
          d="M 50,20 L 50,80 M 20,50 L 80,50"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Featured Project Card - Compact Side-by-Side Design
function FeaturedProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if text is long enough to need expansion
  const needsExpansion =
    project.description && project.description.length > 100;

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block"
        onClick={(e) => {
          // Prevent navigation if clicking expand button
          if ((e.target as HTMLElement).closest(".expand-btn")) {
            e.preventDefault();
          }
        }}
      >
        <div className="relative flex flex-col sm:flex-row gap-6 p-5 sm:p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-off-white/[0.04] to-transparent border border-off-white/10 hover:border-off-white/30 transition-all duration-500 overflow-hidden">
          {/* Animated accent line on left */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-off-white"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isInView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            style={{ originY: 0 }}
          />

          {/* Thumbnail */}
          <div className="relative w-full sm:w-32 md:w-40 lg:w-48 xl:w-56 h-48 sm:h-28 md:h-32 lg:h-36 xl:h-40 flex-shrink-0 rounded-xl overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.image})` }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void-black/60 to-transparent" />

            {/* Number overlay */}
            <span className="absolute bottom-2 right-2 font-display text-2xl text-off-white/20 leading-none">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top row - Badge + Year */}
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-off-white/10 rounded-full border border-off-white/20"
                animate={{ scale: isHovered ? 1.05 : 1 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-3 h-3 text-off-white/70" />
                </motion.div>
                <span className="text-off-white/70 text-[10px] tracking-widest uppercase font-medium">
                  Featured
                </span>
              </motion.div>

              <span className="text-off-white/30 text-xs">•</span>
              <span className="text-off-white/40 text-xs">{project.year}</span>

              {(Array.isArray(project.category)
                ? project.category
                : [project.category]
              ).map((cat, i) => (
                <span
                  key={i}
                  className="hidden sm:inline text-off-white/30 text-xs"
                >
                  • {cat}
                </span>
              ))}
            </div>

            {/* Title with tooltip for full text */}
            <motion.h3
              className="font-display text-xl sm:text-2xl text-off-white leading-tight mb-2 group/title relative"
              animate={{ x: isHovered ? 4 : 0 }}
              title={project.title}
            >
              <span className={isExpanded ? "" : "line-clamp-1"}>
                {project.title}
              </span>
            </motion.h3>

            {/* Description - expandable */}
            {project.description && (
              <div className="relative">
                <motion.p
                  className={`text-off-white/50 text-sm lg:text-base leading-relaxed mb-2 ${isExpanded ? "" : "line-clamp-2"}`}
                  animate={{ height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {project.description}
                </motion.p>

                {/* View More / View Less Button */}
                {needsExpansion && (
                  <motion.button
                    className="expand-btn inline-flex items-center gap-1.5 text-off-white/60 hover:text-off-white text-xs tracking-wide transition-colors duration-200 mb-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight className="w-3 h-3" />
                    </motion.span>
                    <span>{isExpanded ? "View Less" : "View More"}</span>
                  </motion.button>
                )}
              </div>
            )}

            {/* CTA */}
            <motion.div
              className="flex items-center gap-2"
              animate={{ x: isHovered ? 6 : 0, opacity: isHovered ? 1 : 0.7 }}
            >
              <span className="text-off-white/60 text-xs tracking-wider uppercase group-hover:text-off-white transition-colors">
                {project.link ? "View Project" : "Explore"}
              </span>
              <ArrowRight className="w-3 h-3 text-off-white/40 group-hover:text-off-white transition-all group-hover:translate-x-1" />
              {project.link && (
                <ExternalLink className="w-3 h-3 text-off-white/30" />
              )}
            </motion.div>
          </div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            animate={{
              boxShadow: isHovered
                ? "inset 0 0 40px rgba(255,255,255,0.03)"
                : "inset 0 0 0px transparent",
            }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

// Bento Card (from Option B)
function BentoCard({
  project,
  size,
  index,
}: {
  project: (typeof PROJECTS)[0];
  size: "small" | "medium" | "large" | "xlarge";
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
    large: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
    xlarge: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  };

  // Size-aware description line clamp
  const descClamp = {
    small: "line-clamp-2",
    medium: "line-clamp-2",
    large: "line-clamp-4",
    xlarge: "line-clamp-4",
  };

  const isLargeCard = size === "large" || size === "xlarge";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`${sizeClasses[size]} bento-card`}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full w-full relative bg-gradient-to-br from-off-white/5 to-off-white/[0.02] backdrop-blur-xl rounded-2xl lg:rounded-3xl overflow-hidden border border-off-white/20 hover:border-off-white/40 shadow-2xl group transition-all duration-500"
      >
        <Link
          href={project.link || `/work/${project.id}`}
          target={project.link ? "_blank" : undefined}
          className="block h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-110"
              style={{
                backgroundImage: `url(${project.image})`,
                backgroundPosition: "center 30%",
                filter: "brightness(0.75) saturate(0.7) contrast(1.1)",
              }}
            />
            {/* Base gradient */}
            <motion.div
              className="absolute inset-0 transition-all duration-500"
              animate={{
                background: isHovered
                  ? "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 100%)"
                  : "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.8) 100%)",
              }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Content — bottom-anchored */}
          <div className="absolute inset-0 flex flex-col justify-end z-10">
            {/* Top-right external link icon (absolute positioned) */}
            {project.link && (
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 p-2 bg-off-white/10 backdrop-blur-md rounded-full border border-off-white/20"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-off-white" />
              </motion.div>
            )}

            {/* Bottom content area */}
            <div className="relative p-4 sm:p-6 lg:p-8 space-y-2.5">
              {/* Category & Year row */}
              <motion.div
                className="flex items-center gap-2 flex-wrap"
                animate={{ y: isHovered ? 0 : 4, opacity: isHovered ? 1 : 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="inline-flex px-2.5 py-1 bg-void-black/70 backdrop-blur-xl rounded-full border border-off-white/25 text-off-white text-[10px] sm:text-xs tracking-wider uppercase font-medium">
                  {Array.isArray(project.category)
                    ? project.category[0]
                    : project.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-off-white/10 backdrop-blur-xl rounded-full text-off-white/60 text-[10px] sm:text-xs">
                  <Calendar className="w-3 h-3" />
                  {project.year}
                </span>
              </motion.div>

              {/* Title */}
              <h3
                className="font-display text-sm sm:text-base md:text-lg text-off-white leading-snug"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
              >
                {project.title}
              </h3>

              {/* Description — size-aware, animated reveal */}
              {project.description && (
                <motion.div
                  initial={false}
                  animate={{
                    height: isHovered || isLargeCard ? "auto" : 0,
                    opacity: isHovered || isLargeCard ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p
                    className={`text-off-white/70 text-xs sm:text-sm leading-relaxed ${descClamp[size]}`}
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                  >
                    {project.description}
                  </p>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                animate={{
                  y: isHovered ? 0 : 8,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-off-white/10 hover:bg-off-white/20 backdrop-blur-xl border border-off-white/30 hover:border-off-white/50 rounded-full text-off-white text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300 group/cta">
                  {project.link ? "View Live" : "Explore"}
                  <ArrowRight className="w-3 h-3 transition-transform group-hover/cta:translate-x-1" />
                </span>
              </motion.div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

// Filter Tabs
function FilterTabs({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  return (
    <div className="relative flex items-center bg-off-white/5 rounded-full border border-off-white/10 backdrop-blur-xl max-w-full shadow-inner group/tabs">
      {/* Scroll Indicators */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-void-black/40 to-transparent z-20 pointer-events-none transition-opacity duration-300 rounded-l-full ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-void-black/40 to-transparent z-20 pointer-events-none transition-opacity duration-300 rounded-r-full flex items-center justify-end pr-2 ${canScrollRight ? "opacity-100" : "opacity-0"}`}
      >
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-4 h-4 text-off-white/70" />
        </motion.div>
      </div>

      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex items-center gap-1 p-1.5 overflow-x-auto max-w-full scrollbar-hide w-full"
      >
        {categories.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`relative px-5 py-2.5 rounded-full text-xs tracking-widest uppercase transition-all duration-300 whitespace-nowrap outline-none focus:outline-none ${
                isActive
                  ? "text-void-black font-bold"
                  : "text-off-white/50 hover:text-off-white hover:bg-off-white/5"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-b from-off-white to-off-white/90 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent rounded-full opacity-50" />
                </motion.div>
              )}
              <span className="relative z-10 flex items-center gap-2">
                {cat}
                {isActive && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-1 h-1 rounded-full bg-void-black/50"
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkPage() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const [activeFilter, setActiveFilter] = useState("All");

  const filteredRegularProjects = useMemo(() => {
    if (activeFilter === "All") return regularProjects;
    return regularProjects.filter((p) => {
      const cats = Array.isArray(p.category) ? p.category : [p.category];
      return cats.includes(activeFilter);
    });
  }, [activeFilter]);

  const getSizeForProject = (
    index: number,
  ): "small" | "medium" | "large" | "xlarge" => {
    const patterns = [
      "large",
      "medium",
      "small",
      "xlarge",
      "small",
      "medium",
      "medium",
      "xlarge",
      "small",
      "large",
    ];
    return patterns[index % patterns.length] as any;
  };

  return (
    <main className="min-h-screen bg-void-black relative overflow-x-hidden">
      <AnimatedBackground />
      <FloatingNav />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-off-white/80 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-off-white/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-40 left-20 w-[400px] h-[400px] bg-off-white/[0.02] rounded-full blur-[80px]" />
      </motion.div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
        <motion.div
          className="absolute top-8 left-8 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-off-white/50 hover:text-off-white transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-wide">Home</span>
          </Link>
        </motion.div>

        <div className="text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="text-off-white/30 text-xs tracking-[0.5em] uppercase">
              Portfolio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-off-white leading-[0.9] mb-6 md:mb-8"
          >
            The
            <br />
            <span className="text-off-white/60">Archive</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-off-white/50 text-lg max-w-xl mx-auto leading-relaxed"
          >
            A curated collection of digital craftsmanship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-32 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-off-white/20 rounded-full flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-off-white/40 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredProjects.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-16"
          >
            <div className="w-16 h-px bg-gradient-to-r from-off-white/50 to-transparent" />
            <span className="text-off-white/60 text-xs tracking-[0.3em] uppercase font-medium flex items-center gap-2">
              <Star className="w-3.5 h-3.5 fill-off-white/60" />
              Featured Work
            </span>
          </motion.div>

          <div className="space-y-8">
            {featuredProjects.map((project, index) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>

          {/* Section Divider */}
          <div className="section-divider mt-24" />
        </section>
      )}

      {/* All Projects Section - Bento Grid */}
      <section className="px-6 md:px-12 lg:px-20 py-24 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-off-white/30 text-xs tracking-[0.3em] uppercase block mb-4"
            >
              All Projects
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl text-off-white"
            >
              More Work
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <FilterTabs
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-[280px] lg:auto-rows-[300px]">
          {filteredRegularProjects.map((project, index) => (
            <BentoCard
              key={project.id}
              project={project}
              size={getSizeForProject(index)}
              index={index}
            />
          ))}
        </div>

        {filteredRegularProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-off-white/10 rounded-full flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-off-white/50" />
            </div>
            <h3 className="font-display text-xl text-off-white mb-2">
              No projects in this category
            </h3>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 px-5 py-2 bg-off-white/10 text-off-white rounded-full text-sm hover:bg-off-white/20 transition-colors"
            >
              View All
            </button>
          </motion.div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="px-6 md:px-20 py-32 text-center">
        <div className="section-divider mb-24" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-off-white mb-6">
            Let&apos;s Create
            <span className="text-off-white/60"> Together</span>
          </h2>
          <p className="text-off-white/50 text-lg mb-10 max-w-xl mx-auto">
            Have a project in mind? Let&apos;s turn your vision into reality.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-off-white text-void-black font-medium rounded-full hover:bg-off-white/90 transition-all duration-300 group"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
