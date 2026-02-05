"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { EXPERIENCES, Experience } from "@/lib/data";
import FloatingNav from "@/components/FloatingNav";
import { ChevronLeft, Circle, Dot } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Filter type
type FilterType = "all" | "professional" | "volunteer" | "community";

// Category styling
const categoryStyles: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  education: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  work: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  award: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  community: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  volunteer: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/30",
  },
  committee: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
};

// Format date display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "-01");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Get year from date string
function getYear(dateStr: string): number {
  return new Date(dateStr + "-01").getFullYear();
}

// Rich Typography Experience Item
function TypographyExperience({
  experience,
  isOngoing,
  index,
}: {
  experience: Experience;
  isOngoing?: boolean;
  index: number;
}) {
  const style = categoryStyles[experience.category] || categoryStyles.work;

  // Vary sizes for visual interest
  const isLarge = index % 3 === 0;
  const isMedium = index % 3 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative ${
        isLarge
          ? "col-span-2 row-span-2"
          : isMedium
            ? "col-span-1 row-span-2"
            : "col-span-1 row-span-1"
      }`}
    >
      {/* Color accent line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bg}`} />

      <div className="pl-6 pr-4 py-6">
        {/* Meta info */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-xs font-bold tracking-widest uppercase ${style.text}`}
          >
            {experience.category}
          </span>
          <span className="text-off-white/30">•</span>
          <span className="text-off-white/40 text-xs font-mono">
            {formatDate(experience.dateStart)}
            {experience.dateEnd
              ? ` — ${formatDate(experience.dateEnd)}`
              : " — Now"}
          </span>
          {isOngoing && (
            <>
              <span className="text-off-white/30">•</span>
              <div className="flex items-center gap-1.5">
                <motion.div
                  className="w-1.5 h-1.5 bg-green-400 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-green-400 font-medium">
                  Active
                </span>
              </div>
            </>
          )}
        </div>

        {/* Title - Variable sizes */}
        <h3
          className={`font-display font-bold leading-tight mb-3 ${
            isLarge
              ? "text-4xl md:text-5xl"
              : isMedium
                ? "text-2xl md:text-3xl"
                : "text-xl md:text-2xl"
          } text-off-white`}
        >
          {experience.title}
        </h3>

        {/* Role & Organization */}
        <div className="mb-4">
          <p
            className={`font-medium mb-1 ${
              isLarge ? "text-lg" : "text-base"
            } text-off-white/80`}
          >
            {experience.role}
          </p>
          <p
            className={`${isLarge ? "text-base" : "text-sm"} text-off-white/50`}
          >
            {experience.organization}
          </p>
        </div>

        {/* Description - Show more for larger items */}
        <p
          className={`leading-relaxed text-off-white/60 ${
            isLarge
              ? "text-base line-clamp-none"
              : isMedium
                ? "text-sm line-clamp-4"
                : "text-sm line-clamp-3"
          } mb-4`}
        >
          {experience.description}
        </p>

        {/* Highlights */}
        {experience.highlights && experience.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {experience.highlights
              .slice(0, isLarge ? 6 : 3)
              .map((highlight, i) => (
                <span key={i} className="text-xs text-off-white/40 font-medium">
                  {highlight}
                  {i <
                    (isLarge
                      ? Math.min(5, experience.highlights!.length - 1)
                      : Math.min(2, experience.highlights!.length - 1)) &&
                    " / "}
                </span>
              ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Year Section with Masonry Grid
function YearSection({
  year,
  experiences,
  ongoingIds,
}: {
  year: number | "ongoing";
  experiences: Experience[];
  ongoingIds: Set<number>;
}) {
  return (
    <div className="mb-24 sm:mb-32">
      {/* Year Header */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-baseline gap-6 mb-2">
          <h2 className="font-display text-8xl sm:text-9xl font-bold text-off-white">
            {year === "ongoing" ? "Now" : year}
          </h2>
          {year === "ongoing" && (
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-green-400 font-medium tracking-wide">
                ONGOING ACTIVITIES
              </span>
            </div>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-off-white/30 via-off-white/10 to-transparent" />
      </motion.div>

      {/* Masonry Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 auto-rows-auto">
        {experiences.map((exp, index) => (
          <TypographyExperience
            key={exp.id}
            experience={exp}
            isOngoing={ongoingIds.has(exp.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

// Minimal Filter Pills
function FilterPills({
  activeFilter,
  setActiveFilter,
  filterCounts,
}: {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  filterCounts: Record<FilterType, number>;
}) {
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "professional", label: "Professional" },
    { key: "volunteer", label: "Volunteer" },
    { key: "community", label: "Community" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-12"
    >
      {filters.map((filter) => (
        <motion.button
          key={filter.key}
          onClick={() => setActiveFilter(filter.key)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
            ${
              activeFilter === filter.key
                ? "bg-off-white text-void-black"
                : "bg-off-white/5 text-off-white/60 hover:bg-off-white/10"
            }
          `}
          whileTap={{ scale: 0.95 }}
        >
          {filter.label}
          <span className="ml-2 opacity-60">{filterCounts[filter.key]}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// Animated Background Elements
function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Animate asterisk/star rotation
    gsap.to(".animated-star", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    // Animate circles floating
    gsap.to(".animated-circle", {
      y: "random(-30, 30)",
      x: "random(-20, 20)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.3,
        from: "random",
      },
    });

    // Animate dots with scale pulse
    gsap.to(".animated-dot", {
      scale: "random(0.8, 1.2)",
      opacity: "random(0.3, 0.8)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.5,
        from: "random",
      },
    });

    // Animate curved path
    gsap.to(".animated-path", {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Floating text animation
    gsap.to(".animated-text", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
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

export default function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Sort experiences by date (newest first)
  const sortedExperiences = [...EXPERIENCES].sort(
    (a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime(),
  );

  // Get ongoing experiences (no dateEnd)
  const ongoingExperiences = sortedExperiences.filter((exp) => !exp.dateEnd);
  const ongoingIds = new Set(ongoingExperiences.map((exp) => exp.id));

  // Filter experiences based on active filter
  const filteredExperiences = useMemo(() => {
    let filtered = sortedExperiences;

    if (activeFilter === "professional") {
      filtered = filtered.filter((exp) =>
        ["work", "education", "award"].includes(exp.category),
      );
    } else if (activeFilter === "volunteer") {
      filtered = filtered.filter((exp) => exp.category === "volunteer");
    } else if (activeFilter === "community") {
      filtered = filtered.filter((exp) =>
        ["community", "committee"].includes(exp.category),
      );
    }

    return filtered;
  }, [activeFilter, sortedExperiences]);

  // Group by year
  const experiencesByYear = useMemo(() => {
    const grouped: Record<number | "ongoing", Experience[]> = {};

    // First add ongoing experiences
    if (ongoingExperiences.length > 0 && activeFilter === "all") {
      grouped["ongoing"] = ongoingExperiences;
    }

    // Then group by year
    filteredExperiences.forEach((exp) => {
      if (!exp.dateEnd) return; // Skip ongoing (already added)
      const year = getYear(exp.dateStart);
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(exp);
    });

    return grouped;
  }, [filteredExperiences, ongoingExperiences, activeFilter]);

  // Sort years descending
  const sortedYears = Object.keys(experiencesByYear).sort((a, b) => {
    if (a === "ongoing") return -1;
    if (b === "ongoing") return 1;
    return Number(b) - Number(a);
  });

  // Count by filter type
  const filterCounts = {
    all: sortedExperiences.length,
    professional: sortedExperiences.filter((exp) =>
      ["work", "education", "award"].includes(exp.category),
    ).length,
    volunteer: sortedExperiences.filter((exp) => exp.category === "volunteer")
      .length,
    community: sortedExperiences.filter((exp) =>
      ["community", "committee"].includes(exp.category),
    ).length,
  };

  return (
    <main
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-void-black"
    >
      <FloatingNav />

      {/* Animated Background Elements */}
      <AnimatedBackground />

      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 relative">
        {/* Home Link */}
        <motion.div
          className="absolute top-6 sm:top-8 md:top-10 left-6 sm:left-8 md:left-20 z-20"
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
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-off-white mb-4 sm:mb-6"
          >
            Experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-off-white/50 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto px-2"
          >
            An editorial view of my journey — rich typography, organized by
            time, focused on the story.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-off-white/30 text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-9 sm:w-6 sm:h-10 border-2 border-off-white/20 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1 h-1.5 sm:w-1.5 sm:h-1.5 bg-off-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Main Timeline Content */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto">
          {/* Filter Pills */}
          <FilterPills
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filterCounts={filterCounts}
          />

          {/* Year Sections with Horizontal Scrolling */}
          <div className="space-y-16 sm:space-y-24">
            {sortedYears.map((yearKey) => {
              const year = yearKey === "ongoing" ? "ongoing" : Number(yearKey);
              const experiences = experiencesByYear[yearKey];

              return (
                <YearSection
                  key={yearKey}
                  year={year}
                  experiences={experiences}
                  ongoingIds={ongoingIds}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {sortedYears.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📭</div>
              <h3 className="font-display text-2xl text-off-white mb-2">
                No experiences found
              </h3>
              <p className="text-off-white/50 mb-6">
                Try selecting a different filter
              </p>
              <button
                onClick={() => setActiveFilter("all")}
                className="px-6 py-3 bg-off-white/10 text-off-white rounded-full hover:bg-off-white/20 transition-colors"
              >
                View All
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="px-4 sm:px-6 md:px-16 py-16 sm:py-24 md:py-32 text-center"
      >
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-off-white mb-4 sm:mb-6">
          Want to work together?
        </h2>
        <p className="text-off-white/50 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl mx-auto px-2">
          I&apos;m always open to discussing new opportunities, collaborations,
          or just having a chat.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 bg-off-white text-void-black font-medium rounded-full hover:bg-off-white/90 transition-all duration-300"
        >
          Get in Touch
        </Link>
      </motion.section>
    </main>
  );
}
