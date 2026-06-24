"use client";

import { useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useInView,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS } from "@/lib/data";
import TopNav from "@/components/TopNav";
import {
  ExternalLink,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import { useDeviceType, getAnimationConfig } from "@/lib/hooks";

// Generate categories dynamically
const allCategories = PROJECTS.flatMap((p) =>
  Array.isArray(p.category) ? p.category : [p.category],
);
const categories = ["All", ...Array.from(new Set(allCategories))];

// Featured vs Regular projects
const featuredProjects = PROJECTS.filter((p) => p.featured);
const regularProjects = PROJECTS.filter((p) => !p.featured);

// Featured Project Card
function FeaturedProjectCard({
  project,
  index,
  deviceInfo,
  animConfig,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  deviceInfo: ReturnType<typeof useDeviceType>;
  animConfig: ReturnType<typeof getAnimationConfig>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const needsExpansion = project.description && project.description.length > 100;

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => !deviceInfo.isMobile && !deviceInfo.isLowEnd && setIsHovered(true)}
      onMouseLeave={() => !deviceInfo.isMobile && !deviceInfo.isLowEnd && setIsHovered(false)}
      initial={{ opacity: 0, x: (deviceInfo.isMobile || deviceInfo.isLowEnd) ? -15 : -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: deviceInfo.prefersReducedMotion ? 0.01 : deviceInfo.isLowEnd ? 0.3 : 0.6,
        delay: deviceInfo.prefersReducedMotion ? 0 : deviceInfo.isLowEnd ? (index * 0.05) : (index * 0.1)
      }}
      className="group relative"
    >
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest(".expand-btn")) e.preventDefault();
        }}
      >
        <div className="relative flex flex-col sm:flex-row gap-6 p-5 sm:p-6 lg:p-8 rounded-lg bg-surface border border-hairline hover:border-primary/20 transition-all duration-500 overflow-hidden">
          {/* Accent line */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isInView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            style={{ originY: 0 }}
          />

          {/* Thumbnail */}
          <div className="relative w-full sm:w-32 md:w-40 lg:w-48 xl:w-56 h-48 sm:h-28 md:h-32 lg:h-36 xl:h-40 flex-shrink-0 rounded-md overflow-hidden bg-surface">
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.image})` }}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <span className="absolute bottom-2 right-2 text-heading-3 text-ink/20 font-semibold leading-none">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-sm"
                animate={{ scale: isHovered ? 1.05 : 1 }}
              >
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-micro-uppercase text-primary font-semibold">Featured</span>
              </motion.div>
              <span className="text-muted text-xs">•</span>
              <span className="text-steel text-xs">{project.year}</span>
              {(Array.isArray(project.category) ? project.category : [project.category]).map((cat, i) => (
                <span key={i} className="hidden sm:inline text-muted text-xs">• {cat}</span>
              ))}
            </div>

            <h3 className="text-heading-4 text-charcoal font-semibold mb-2 line-clamp-1">
              {project.title}
            </h3>

            {project.description && (
              <div className="relative">
                <p className={`text-body-sm text-slate leading-relaxed mb-2 ${isExpanded ? "" : "line-clamp-2"}`}>
                  {project.description}
                </p>
                {needsExpansion && (
                  <button
                    className="expand-btn inline-flex items-center gap-1 text-steel hover:text-charcoal text-micro tracking-wide transition-colors duration-200 mb-2"
                    onClick={(e) => {
                      e.preventDefault(); e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                  >
                    <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronRight className="w-3 h-3" />
                    </motion.span>
                    <span>{isExpanded ? "View Less" : "View More"}</span>
                  </button>
                )}
              </div>
            )}

            <motion.div className="flex items-center gap-2" animate={{ x: isHovered ? 6 : 0, opacity: isHovered ? 1 : 0.7 }}>
              <span className="text-micro-uppercase text-steel">{project.link ? "View Project" : "Explore"}</span>
              <ArrowRight className="w-3 h-3 text-muted" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Bento Card - Styled as a dynamic Notion Database Gallery item
function BentoCard({
  project,
  size,
  index,
  deviceInfo,
  animConfig,
}: {
  project: (typeof PROJECTS)[0];
  size: "small" | "medium" | "large" | "xlarge";
  index: number;
  deviceInfo: ReturnType<typeof useDeviceType>;
  animConfig: ReturnType<typeof getAnimationConfig>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
    large: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
    xlarge: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  };

  const descClamp = {
    small: "line-clamp-2",
    medium: "line-clamp-2",
    large: "line-clamp-4",
    xlarge: "line-clamp-4",
  };
  
  const readMoreThreshold = { small: 80, medium: 80, large: 180, xlarge: 180 };
  const needsReadMore = project.description && project.description.length > readMoreThreshold[size];

  // Alternating tag tints
  const tagStyle = [
    "bg-tint-sky text-link-blue",
    "bg-tint-mint text-brand-green",
    "bg-tint-peach text-brand-orange-deep",
    "bg-tint-lavender text-brand-purple-800",
  ][index % 4];

  return (
    <motion.div
      initial={{ opacity: 0, scale: (deviceInfo.isMobile || deviceInfo.isLowEnd) ? 1 : 0.9, y: (deviceInfo.isMobile || deviceInfo.isLowEnd) ? 15 : 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: deviceInfo.prefersReducedMotion ? 0.01 : deviceInfo.isLowEnd ? 0.25 : 0.5,
        delay: deviceInfo.prefersReducedMotion ? 0 : deviceInfo.isLowEnd ? (index * 0.02) : (index * 0.08)
      }}
      className={`${sizeClasses[size]}`}
    >
      <div
        onMouseEnter={() => !deviceInfo.isMobile && !deviceInfo.isLowEnd && setIsHovered(true)}
        onMouseLeave={() => {
          if (!deviceInfo.isMobile && !deviceInfo.isLowEnd) {
            setIsHovered(false);
            setIsDescExpanded(false);
          }
        }}
        className="h-full w-full relative bg-canvas rounded-lg border border-hairline shadow-elevation-1 hover:shadow-elevation-2 overflow-hidden flex flex-col group transition-all duration-300"
      >
        <Link
          href={project.link || `/work/${project.id}`}
          target={project.link ? "_blank" : undefined}
          className={`flex flex-col h-full ${size === "medium" ? "md:flex-row divide-y md:divide-y-0 md:divide-x divide-hairline" : ""}`}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest(".read-more-btn")) e.preventDefault();
          }}
        >
          {/* Card Cover Preview */}
          <div className={`relative overflow-hidden bg-surface flex-shrink-0 ${
            size === "medium" 
              ? "w-full md:w-[45%] h-48 md:h-full" 
              : "w-full aspect-[16/10]"
          }`}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {project.link && (
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute top-3 right-3 p-1.5 bg-canvas/90 backdrop-blur-md rounded-md border border-hairline"
              >
                <ExternalLink className="w-3.5 h-3.5 text-charcoal" />
              </motion.div>
            )}
          </div>

          {/* Card Content - Notion properties format */}
          <div className="p-5 flex-1 flex flex-col justify-between gap-3 bg-canvas min-w-0">
            <div className="space-y-2">
              {/* Properties row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`inline-flex px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider font-mono ${tagStyle}`}>
                  {Array.isArray(project.category) ? project.category[0] : project.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-hairline/40 rounded-sm text-steel text-[10px] font-mono">
                  {project.year}
                </span>
                {project.status === "In Progress" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-yellow/30 rounded-sm text-brand-brown text-[10px] font-semibold uppercase tracking-wider font-mono">
                    In Progress
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-heading-5 text-charcoal font-semibold group-hover:text-primary transition-colors duration-200 truncate">
                {project.title}
              </h3>

              {/* Description */}
              {project.description && (
                <div className="relative">
                  <p className={`text-body-sm text-slate leading-relaxed ${isDescExpanded ? "" : descClamp[size]}`}>
                    {project.description}
                  </p>
                  {needsReadMore && (
                    <button
                      className="read-more-btn mt-1 inline-flex items-center gap-1 text-steel hover:text-charcoal text-micro tracking-wide transition-colors duration-200 font-semibold uppercase"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDescExpanded(!isDescExpanded);
                      }}
                    >
                      <motion.span animate={{ rotate: isDescExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-block">
                        <ChevronRight className="w-3 h-3" />
                      </motion.span>
                      <span>{isDescExpanded ? "Less" : "More"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bottom link footer */}
            <div className="mt-2 pt-3 border-t border-hairline flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-steel hover:text-primary text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200">
                {project.link ? "View Live" : "Explore"}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

// Filter Tabs - Styled as Notion pill tabs
function FilterTabs({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (f: string) => void }) {
  return (
    <div className="relative flex items-center bg-transparent max-w-full">
      <div className="flex items-center gap-2 overflow-x-auto max-w-full scrollbar-hide w-full py-1">
        {categories.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`relative px-4 py-1.5 rounded-full text-body-sm-medium transition-all duration-200 whitespace-nowrap outline-none border ${
                isActive
                  ? "bg-ink-deep text-on-dark border-ink-deep font-semibold shadow-elevation-1"
                  : "bg-transparent text-steel border-hairline hover:text-charcoal hover:bg-hairline/20"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkPage() {
  const { scrollYProgress } = useScroll();
  const deviceInfo = useDeviceType();
  const animConfig = getAnimationConfig(deviceInfo);

  const isScrollAnimationDisabled = deviceInfo.prefersReducedMotion || deviceInfo.isLowEnd || deviceInfo.isMobile;

  const [activeFilter, setActiveFilter] = useState("All");

  const filteredRegularProjects = useMemo(() => {
    if (activeFilter === "All") return regularProjects;
    return regularProjects.filter((p) => {
      const cats = Array.isArray(p.category) ? p.category : [p.category];
      return cats.includes(activeFilter);
    });
  }, [activeFilter]);

  const getSizeForProject = (index: number): "small" | "medium" | "large" | "xlarge" => {
    const patterns = ["large", "medium", "small", "xlarge", "small", "medium", "medium", "xlarge", "small", "large"];
    return patterns[index % patterns.length] as "small" | "medium" | "large" | "xlarge";
  };

  return (
    <main className="min-h-screen bg-canvas relative overflow-x-hidden">
      <TopNav />

      {/* Progress Bar — uses scrollYProgress directly (no spring physics) */}
      {!isScrollAnimationDisabled && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-50 origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      )}

      {/* Static decorative background — no parallax, no per-frame updates */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-40 left-20 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[80px]" />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
        <motion.div className="fixed top-20 left-6 md:left-8 z-50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-steel hover:text-charcoal transition-colors group">
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-body-sm-medium tracking-wide">Home</span>
          </Link>
        </motion.div>

        <div className="text-center relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-primary/40" />
              <span className="text-micro-uppercase text-primary font-semibold tracking-wider">Portfolio</span>
              <span className="w-8 h-px bg-primary/40" />
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-heading-1 md:text-display-lg text-charcoal font-semibold leading-[0.9] mb-6 md:mb-8"
          >
            The
            <br />
            <span className="text-steel">Archive</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-body-md text-slate max-w-xl mx-auto leading-relaxed"
          >
            A curated collection of digital craftsmanship.
          </motion.p>
        </div>
      </section>

      {/* Featured Section */}
      {featuredProjects.length > 0 && (
        <section className="px-6 md:px-8 py-section relative">
          <div className="max-w-container mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <span className="text-heading-5 text-charcoal font-semibold flex items-center gap-2">
                <Star className="w-4 h-4 fill-primary text-primary" />
                Featured Work
              </span>
              <div className="flex-1 h-px bg-hairline" />
            </motion.div>

            <div className="space-y-6">
              {featuredProjects.map((project, index) => (
                <FeaturedProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  deviceInfo={deviceInfo}
                  animConfig={animConfig}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Divider */}
      <div className="section-divider mx-auto max-w-5xl" />

      {/* All Projects Section */}
      <section className="px-6 md:px-8 py-section relative">
        <div className="max-w-container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-primary/40" />
                <span className="text-micro-uppercase text-primary font-semibold tracking-wider">All Projects</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                className="text-heading-2 text-charcoal font-semibold"
              >
                More Work
              </motion.h2>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <FilterTabs activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            </motion.div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[280px] lg:auto-rows-[300px]">
            {filteredRegularProjects.map((project, index) => (
              <BentoCard
                key={project.id}
                project={project}
                size={getSizeForProject(index)}
                index={index}
                deviceInfo={deviceInfo}
                animConfig={animConfig}
              />
            ))}
          </div>

          {filteredRegularProjects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-heading-5 text-charcoal mb-2">No projects in this category</h3>
              <button onClick={() => setActiveFilter("All")}
                className="mt-4 px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-colors"
              >
                View All
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 md:px-8 py-section-lg text-center">
        <div className="section-divider mx-auto max-w-5xl mb-section-lg" />
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: deviceInfo.prefersReducedMotion ? 0.01 : 0.8 }}>
          <h2 className="text-heading-2 text-charcoal font-semibold mb-4">
            Let&apos;s Create <span className="text-steel">Together</span>
          </h2>
          <p className="text-body-md text-slate mb-8 max-w-xl mx-auto">
            Have a project in mind? Let&apos;s turn your vision into reality.
          </p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
