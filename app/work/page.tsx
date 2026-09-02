"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useScroll, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS } from "@/lib/data";
import TopNav from "@/components/TopNav";
import {
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  Star,
  FolderOpen,
  Search,
  X,
  Zap,
  Globe,
  Layers,
} from "lucide-react";
import { useDeviceType, getAnimationConfig } from "@/lib/hooks";

// Helper for unique categories
const getCategoriesFromProjects = (projects: typeof PROJECTS) => {
  const allCategories = projects.flatMap((p) =>
    Array.isArray(p.category) ? p.category : [p.category],
  );
  return ["All", ...Array.from(new Set(allCategories))];
};

// ─────────────────────────────────────────────────────
// EDITORIAL PROJECT ROW — Numbered stagger, zigzag
// ─────────────────────────────────────────────────────
function EditorialProjectRow({
  project,
  index,
  isEven,
  deviceInfo,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  isEven: boolean;
  deviceInfo: ReturnType<typeof useDeviceType>;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-80px" });
  const [isHovered, setIsHovered] = useState(false);

  const number = String(index + 1).padStart(2, "0");

  // Tech stack — take up to 4 items
  const proj = project as any;
  const techStack: string[] = Array.isArray(proj.technologies) ? proj.technologies.slice(0, 4) : [];
  const metricsData: Array<{ label: string; value: string }> = Array.isArray(proj.metrics) ? proj.metrics : [];

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: deviceInfo.prefersReducedMotion ? 0 : 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: deviceInfo.prefersReducedMotion ? 0.01 : 0.7,
        delay: deviceInfo.prefersReducedMotion ? 0 : 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      {/* Separator line */}
      <motion.div
        className="h-px bg-hairline"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        style={{ originX: 0 }}
      />

      <div
        onMouseEnter={() => !deviceInfo.isMobile && setIsHovered(true)}
        onMouseLeave={() => !deviceInfo.isMobile && setIsHovered(false)}
        className={`flex flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"} gap-0 py-10 md:py-12 lg:py-16 transition-all duration-500`}
      >
        {/* ── Image Column ── */}
        <div
          className={`relative w-full md:w-[52%] flex-shrink-0 ${isEven ? "md:pl-10 lg:pl-16" : "md:pr-10 lg:pr-16"}`}
        >
          <Link
            href={project.link || `/work/${project.id}`}
            target={project.link ? "_blank" : undefined}
            className="block relative overflow-hidden rounded-lg"
            aria-label={`View ${project.title}`}
          >
            {/* Aspect ratio wrapper */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
              <motion.div
                animate={{ scale: isHovered ? 1.04 : 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 52vw"
                  className="object-cover object-top"
                  priority={index < 3}
                />
              </motion.div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />

              {/* Hover CTA overlay */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center bg-ink/20 backdrop-blur-[2px]"
              >
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-canvas/95 text-charcoal text-sm font-semibold shadow-lg">
                  {project.link ? (
                    <>
                      <Globe className="w-4 h-4 text-primary" />
                      <span>Visit Live Site</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4 text-primary" />
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </div>
              </motion.div>

              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-canvas/95 backdrop-blur-md border border-hairline text-[11px] font-semibold text-charcoal">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span>Featured</span>
                </div>
              )}

              {/* Status badge */}
              {project.status === "In Progress" && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-yellow/90 backdrop-blur-md text-[11px] font-semibold text-brand-brown">
                  <Zap className="w-3 h-3" />
                  <span>In Progress</span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* ── Content Column ── */}
        <div
          className={`flex flex-col justify-center flex-1 pt-6 md:pt-0 ${isEven ? "md:pr-10 lg:pr-16 md:text-right md:items-end" : "md:pl-0"}`}
        >
          {/* Index Number */}
          <motion.span
            animate={{
              opacity: isHovered ? 1 : 0.25,
              x: isHovered ? (isEven ? 4 : -4) : 0,
            }}
            transition={{ duration: 0.3 }}
            className="text-[64px] md:text-[80px] lg:text-[96px] font-bold font-mono leading-none text-charcoal tracking-tight mb-2 select-none"
          >
            {number}
          </motion.span>

          {/* Category + Year meta */}
          <div className={`flex items-center gap-2 mb-3 flex-wrap ${isEven ? "md:justify-end" : ""}`}>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wider font-mono">
              {Array.isArray(project.category) ? project.category[0] : project.category}
            </span>
            <span className="text-muted text-xs">·</span>
            <span className="text-steel text-xs font-mono">{project.year}</span>
          </div>

          {/* Title */}
          <h2 className="text-heading-3 md:text-heading-2 lg:text-heading-1 text-charcoal font-semibold tracking-tight leading-tight mb-4">
            <Link
              href={project.link || `/work/${project.id}`}
              target={project.link ? "_blank" : undefined}
              className="hover:text-primary transition-colors duration-200"
            >
              {project.title}
            </Link>
          </h2>

          {/* Description */}
          {project.description && (
            <p className="text-body-md text-slate leading-relaxed mb-6 max-w-md line-clamp-3">
              {project.description}
            </p>
          )}

          {/* Tech Stack chips */}
          {techStack.length > 0 && (
            <div className={`flex flex-wrap gap-1.5 mb-6 ${isEven ? "md:justify-end" : ""}`}>
              {techStack.map((tech: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-surface border border-hairline text-steel text-[11px] font-mono"
                >
                  {tech}
                </span>
              ))}
              {proj.technologies?.length > 4 && (
                <span className="px-2.5 py-1 rounded-md bg-surface border border-hairline text-muted text-[11px] font-mono">
                  +{proj.technologies.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Metrics */}
          {metricsData.length > 0 && (
            <div className={`flex flex-wrap gap-3 mb-6 ${isEven ? "md:justify-end" : ""}`}>
              {metricsData.slice(0, 2).map((metric: { label: string; value: string }, i: number) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-primary font-bold text-sm font-mono">{metric.value}</span>
                  <span className="text-steel text-xs">{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Link */}
          <div>
            <Link
              href={project.link || `/work/${project.id}`}
              target={project.link ? "_blank" : undefined}
              className="inline-flex items-center gap-2 text-charcoal hover:text-primary transition-colors duration-200 group/link"
            >
              <motion.span
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.25 }}
                className="text-body-sm-medium uppercase tracking-widest text-xs"
              >
                {project.link ? "Visit Live Site" : "Explore Case Study"}
              </motion.span>
              <motion.div
                animate={{ x: isHovered ? 4 : 0, rotate: project.link ? -45 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// COMPACT GRID CARD — for filtered "all projects" section
// ─────────────────────────────────────────────────────
function CompactProjectCard({
  project,
  index,
  deviceInfo,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  deviceInfo: ReturnType<typeof useDeviceType>;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: deviceInfo.prefersReducedMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: deviceInfo.prefersReducedMotion ? 0.01 : 0.45,
        delay: deviceInfo.prefersReducedMotion ? 0 : index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => !deviceInfo.isMobile && setIsHovered(true)}
      onMouseLeave={() => !deviceInfo.isMobile && setIsHovered(false)}
      className="group"
    >
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block bg-canvas rounded-lg border border-hairline shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/20 overflow-hidden transition-all duration-300"
      >
        {/* Image */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />

          {project.link && (
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.85 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3 p-1.5 rounded-md bg-canvas/90 backdrop-blur-sm border border-hairline"
            >
              <ExternalLink className="w-3 h-3 text-charcoal" />
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-sm uppercase tracking-wider font-mono">
              {Array.isArray(project.category) ? project.category[0] : project.category}
            </span>
            {project.status === "In Progress" && (
              <span className="px-2 py-0.5 bg-brand-yellow/30 text-brand-brown text-[10px] font-semibold rounded-sm uppercase font-mono">
                In Progress
              </span>
            )}
            <span className="ml-auto text-[11px] font-mono text-steel">{project.year}</span>
          </div>

          {/* Title */}
          <h3 className="text-heading-5 text-charcoal font-semibold group-hover:text-primary transition-colors duration-200 line-clamp-1 mb-2">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-body-sm text-slate leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Tech chips (max 3) */}
          {Array.isArray((project as any).technologies) && (project as any).technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {((project as any).technologies as string[]).slice(0, 3).map((tech: string, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded bg-surface border border-hairline text-steel text-[10px] font-mono">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-hairline">
            <span className="inline-flex items-center gap-1.5 text-steel hover:text-primary text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200">
              {project.link ? "View Live" : "Explore"}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// FILTER + SEARCH BAR
// ─────────────────────────────────────────────────────
function SearchFilterBar({
  categories,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
}: {
  categories: string[];
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Search Input */}
      <div className="relative flex-shrink-0 w-full sm:w-56">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full h-9 pl-8 pr-8 rounded-full bg-surface border border-hairline text-charcoal text-body-sm placeholder:text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all font-mono text-[12px]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5 w-full sm:w-auto">
        {categories.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`relative px-3.5 py-1.5 rounded-full text-[12px] font-mono font-medium transition-all duration-200 whitespace-nowrap border outline-none flex-shrink-0 ${
                isActive
                  ? "bg-ink-deep text-on-dark border-ink-deep shadow-sm"
                  : "bg-transparent text-steel border-hairline hover:text-charcoal hover:border-hairline-strong"
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

// ─────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────
export default function WorkPage() {
  const { scrollYProgress } = useScroll();
  const deviceInfo = useDeviceType();

  const isScrollAnimationDisabled = deviceInfo.prefersReducedMotion || deviceInfo.isLowEnd || deviceInfo.isMobile;

  const [projectsList, setProjectsList] = useState<typeof PROJECTS>(PROJECTS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.projects?.length > 0) {
          setProjectsList(json.data.projects);
        }
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => getCategoriesFromProjects(projectsList), [projectsList]);
  const featuredProjects = useMemo(() => projectsList.filter((p) => p.featured), [projectsList]);
  const regularProjects = useMemo(() => projectsList.filter((p) => !p.featured), [projectsList]);

  const filteredProjects = useMemo(() => {
    let list = activeFilter === "All" ? regularProjects : regularProjects.filter((p) => {
      const cats = Array.isArray(p.category) ? p.category : [p.category];
      return cats.includes(activeFilter);
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (Array.isArray(p.category) ? p.category : [p.category]).some((c) =>
            c.toLowerCase().includes(q)
          ) ||
          (Array.isArray((p as any).technologies) && (p as any).technologies.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [activeFilter, searchQuery, regularProjects]);

  return (
    <main className="min-h-screen bg-canvas relative overflow-x-hidden">
      <TopNav />

      {/* Scroll progress bar */}
      {!isScrollAnimationDisabled && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-50 origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      )}

      {/* Subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-32 right-0 w-[600px] h-[600px] bg-primary/[0.025] rounded-full blur-[120px] translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] -translate-x-1/4" />
      </div>

      {/* ── HERO HEADER ── */}
      <section className="pt-28 pb-8 md:pt-36 md:pb-10 px-6 md:px-8 relative">
        <div className="max-w-container mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-steel hover:text-charcoal transition-colors group text-body-sm-medium"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-5"
              >
                <span className="w-8 h-px bg-primary/40" />
                <span className="text-micro-uppercase text-primary font-semibold tracking-wider">
                  Selected Work
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08 }}
                className="text-heading-1 md:text-display-lg text-charcoal font-semibold tracking-tight mb-4"
              >
                The Archive &amp; Projects
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-body-md text-slate leading-relaxed"
              >
                A curated catalog of full-stack platforms, geospatial systems, and mobile applications — built with precision, utility, and human experience in mind.
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex flex-wrap gap-4 md:flex-col md:items-end"
            >
              <div className="text-right">
                <div className="text-display-lg text-charcoal font-bold font-mono leading-none">
                  {projectsList.length}
                </div>
                <div className="text-xs text-steel font-mono uppercase tracking-wider mt-1">Projects</div>
              </div>
              <div className="w-px h-8 bg-hairline hidden md:block" />
              <div className="text-right">
                <div className="text-display-lg text-primary font-bold font-mono leading-none">
                  {featuredProjects.length}
                </div>
                <div className="text-xs text-steel font-mono uppercase tracking-wider mt-1">Featured</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED — EDITORIAL STAGGER ── */}
      {featuredProjects.length > 0 && (
        <section className="px-6 md:px-8 relative">
          <div className="max-w-container mx-auto">
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span className="text-micro-uppercase text-primary font-semibold tracking-wider">
                  Featured Work
                </span>
              </div>
              <div className="flex-1 h-px bg-hairline" />
              <span className="text-muted text-xs font-mono">{String(featuredProjects.length).padStart(2, "0")}</span>
            </motion.div>

            {/* Editorial rows */}
            <div>
              {featuredProjects.map((project, index) => (
                <EditorialProjectRow
                  key={project.id}
                  project={project}
                  index={index}
                  isEven={index % 2 !== 0}
                  deviceInfo={deviceInfo}
                />
              ))}
              <div className="h-px bg-hairline" />
            </div>
          </div>
        </section>
      )}

      {/* ── ALL PROJECTS GRID ── */}
      <section className="px-6 md:px-8 py-section relative">
        <div className="max-w-container mx-auto">
          {/* Section header */}
          <div className="flex flex-col gap-5 mb-10">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-6 h-px bg-primary/40" />
                  <span className="text-micro-uppercase text-primary font-semibold tracking-wider">All Projects</span>
                </div>
                <h2 className="text-heading-2 text-charcoal font-semibold">
                  More Work
                  <span className="text-muted font-mono text-heading-4 ml-3">
                    ({filteredProjects.length})
                  </span>
                </h2>
              </motion.div>
            </div>

            {/* Search + Filter */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SearchFilterBar
                categories={categories}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </motion.div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div
                key={`${activeFilter}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
              >
                {filteredProjects.map((project, index) => (
                  <CompactProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    deviceInfo={deviceInfo}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center border border-hairline">
                  <FolderOpen className="w-8 h-8 text-muted" />
                </div>
                <h3 className="text-heading-5 text-charcoal mb-2">No projects found</h3>
                <p className="text-body-sm text-slate mb-5">Try adjusting your search or filter.</p>
                <button
                  onClick={() => { setActiveFilter("All"); setSearchQuery(""); }}
                  className="px-5 py-2.5 bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="px-6 md:px-8 pb-section-lg text-center">
        <div className="section-divider mx-auto max-w-5xl mb-section-lg" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: deviceInfo.prefersReducedMotion ? 0.01 : 0.7 }}
        >
          <p className="text-micro-uppercase text-primary font-semibold tracking-wider mb-4">
            Let's Build Together
          </p>
          <h2 className="text-heading-2 text-charcoal font-semibold mb-4">
            Have a project in mind?
          </h2>
          <p className="text-body-md text-slate mb-8 max-w-md mx-auto">
            I'm open to freelance opportunities, collaborations, and interesting engineering challenges.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200 shadow-sm"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
