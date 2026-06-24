"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { EXPERIENCES, Experience } from "@/lib/data";
import TopNav from "@/components/TopNav";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { useDeviceType, getAnimationConfig } from "@/lib/hooks";

// Filter type
type FilterType = "all" | "professional" | "volunteer" | "community";

// Category styling
const categoryStyles: Record<string, { bg: string; text: string; border: string }> = {
  education: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
  work: { bg: "bg-tint-mint", text: "text-brand-green", border: "border-brand-green/30" },
  award: { bg: "bg-tint-yellow-bold", text: "text-brand-brown", border: "border-brand-brown/30" },
  community: { bg: "bg-tint-lavender", text: "text-brand-purple-800", border: "border-brand-purple/30" },
  volunteer: { bg: "bg-tint-sky", text: "text-link-blue", border: "border-link-blue/30" },
  committee: { bg: "bg-tint-peach", text: "text-brand-orange-deep", border: "border-brand-orange/30" },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "-01");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getYear(dateStr: string): number {
  return new Date(dateStr + "-01").getFullYear();
}

// Timeline Experience Card sitting on a vertical line
function ExperienceCard({ experience, isOngoing, index, deviceInfo, animConfig }: {
  experience: Experience;
  isOngoing?: boolean;
  index: number;
  deviceInfo: ReturnType<typeof useDeviceType>;
  animConfig: ReturnType<typeof getAnimationConfig>;
}) {
  const style = categoryStyles[experience.category] || categoryStyles.work;
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  
  const categoryEmojis: Record<string, string> = {
    education: "🎓",
    work: "💼",
    award: "🏆",
    community: "🤝",
    volunteer: "🙋‍♂️",
    committee: "📋",
  };
  const emoji = categoryEmojis[experience.category] || "💼";

  return (
    <motion.div
      initial={{ opacity: 0, y: (deviceInfo.isMobile || deviceInfo.isLowEnd) ? 15 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: deviceInfo.prefersReducedMotion ? 0.01 : deviceInfo.isLowEnd ? 0.25 : 0.5,
        delay: deviceInfo.prefersReducedMotion ? 0 : deviceInfo.isLowEnd ? (index * 0.02) : (index * 0.08)
      }}
      className="relative pl-8 sm:pl-10"
    >
      {/* Timeline Node sitting on the vertical line */}
      <div className="absolute left-0 top-2.5 -translate-x-1/2 w-8 h-8 rounded-full bg-canvas border border-hairline flex items-center justify-center text-sm shadow-elevation-1 z-10 select-none">
        {emoji}
      </div>

      {/* Timeline Card */}
      <div className="p-5 md:p-6 bg-canvas border border-hairline rounded-lg shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/20 transition-all duration-300">
        {/* Meta Info Row */}
        <div className="flex items-center gap-2 md:gap-3 mb-3 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-micro-uppercase font-semibold ${style.bg} ${style.text}`}>
            {experience.category}
          </span>
          <span className="text-muted text-xs">•</span>
          <span className="text-steel text-micro font-mono">
            {formatDate(experience.dateStart)}
            {experience.dateEnd ? ` — ${formatDate(experience.dateEnd)}` : " — Now"}
          </span>
          {isOngoing && (
            <>
              <span className="text-muted text-xs">•</span>
              <div className="flex items-center gap-1.5">
                <motion.div className="w-1.5 h-1.5 bg-brand-green rounded-full" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-micro text-brand-green font-medium">Active</span>
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-heading-4 text-charcoal font-semibold tracking-tight mb-1">
          {experience.title}
        </h3>

        {/* Role & Org */}
        <div className="mb-3">
          <p className="text-body-md-medium text-charcoal/80">
            {experience.role}
          </p>
          <p className="text-body-sm text-steel">{experience.organization}</p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className={`text-body-sm text-slate leading-relaxed ${isDescExpanded ? "" : "line-clamp-3"}`}>
            {experience.description}
          </p>
          {experience.description.length > 180 && (
            <button
              className="read-more-btn mt-1.5 inline-flex items-center gap-1 text-steel hover:text-charcoal text-micro font-semibold uppercase transition-colors duration-200"
              onClick={() => setIsDescExpanded(!isDescExpanded)}
            >
              <motion.span animate={{ rotate: isDescExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-block">
                <ChevronRight className="w-3 h-3" />
              </motion.span>
              <span>{isDescExpanded ? "Less" : "More"}</span>
            </button>
          )}
        </div>

        {/* Highlights */}
        {experience.highlights && experience.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-hairline mt-2">
            {experience.highlights.map((highlight, i) => (
              <span key={i} className="text-micro text-steel bg-surface px-2 py-0.5 rounded-sm border border-hairline">
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Year Section
function YearSection({ year, experiences, ongoingIds, deviceInfo, animConfig }: {
  year: number | "ongoing";
  experiences: Experience[];
  ongoingIds: Set<number>;
  deviceInfo: ReturnType<typeof useDeviceType>;
  animConfig: ReturnType<typeof getAnimationConfig>;
}) {
  return (
    <div className="mb-12 sm:mb-16 md:mb-20">
      {/* Year Header */}
      <motion.div
        initial={{ opacity: 0, x: (deviceInfo.isMobile || deviceInfo.isLowEnd) ? -15 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: deviceInfo.prefersReducedMotion ? 0.01 : deviceInfo.isLowEnd ? 0.3 : 0.5 }}
        className="mb-6"
      >
        <div className="flex items-baseline gap-4 mb-2">
          <h2 className="text-heading-2 md:text-heading-1 text-charcoal font-semibold leading-none">
            {year === "ongoing" ? "Now" : year}
          </h2>
          {year === "ongoing" && (
            <div className="flex items-center gap-2">
              <motion.div className="w-2 h-2 bg-brand-green rounded-full" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-micro-uppercase text-brand-green font-semibold">ONGOING</span>
            </div>
          )}
        </div>
        <div className="h-px bg-hairline" />
      </motion.div>

      {/* Timeline List Connector */}
      <div className="relative border-l border-hairline ml-4 space-y-6 pt-2 pb-2">
        {experiences.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            experience={exp}
            isOngoing={ongoingIds.has(exp.id)}
            index={index}
            deviceInfo={deviceInfo}
            animConfig={animConfig}
          />
        ))}
      </div>
    </div>
  );
}

// Filter Pills - Styled as Notion pill tabs
function FilterPills({ activeFilter, setActiveFilter, filterCounts }: {
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-12 py-1">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => setActiveFilter(filter.key)}
          className={`px-4 py-1.5 rounded-full text-body-sm-medium transition-all duration-200 whitespace-nowrap border ${
            activeFilter === filter.key
              ? "bg-ink-deep text-on-dark border-ink-deep font-semibold shadow-elevation-1"
              : "bg-transparent text-steel border-hairline hover:text-charcoal hover:bg-hairline/20"
          }`}
        >
          {filter.label}
          <span className={`ml-1.5 text-xs ${activeFilter === filter.key ? "opacity-60" : "text-muted"}`}>
            {filterCounts[filter.key]}
          </span>
        </button>
      ))}
    </motion.div>
  );
}

export default function ExperiencePage() {
  const deviceInfo = useDeviceType();
  const animConfig = getAnimationConfig(deviceInfo);

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const sortedExperiences = [...EXPERIENCES].sort(
    (a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime(),
  );

  const ongoingExperiences = sortedExperiences.filter((exp) => !exp.dateEnd);
  const ongoingIds = new Set(ongoingExperiences.map((exp) => exp.id));

  const filteredExperiences = useMemo(() => {
    let filtered = sortedExperiences;
    if (activeFilter === "professional") {
      filtered = filtered.filter((exp) => ["work", "education", "award"].includes(exp.category));
    } else if (activeFilter === "volunteer") {
      filtered = filtered.filter((exp) => exp.category === "volunteer");
    } else if (activeFilter === "community") {
      filtered = filtered.filter((exp) => ["community", "committee"].includes(exp.category));
    }
    return filtered;
  }, [activeFilter, sortedExperiences]);

  const experiencesByYear = useMemo(() => {
    const grouped: Partial<Record<number | "ongoing", Experience[]>> = {};
    if (ongoingExperiences.length > 0 && activeFilter === "all") {
      grouped["ongoing"] = ongoingExperiences;
    }
    filteredExperiences.forEach((exp) => {
      if (!exp.dateEnd) return;
      const year = getYear(exp.dateStart);
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(exp);
    });
    return grouped;
  }, [filteredExperiences, ongoingExperiences, activeFilter]);

  const sortedYears = Object.keys(experiencesByYear).sort((a, b) => {
    if (a === "ongoing") return -1;
    if (b === "ongoing") return 1;
    return Number(b) - Number(a);
  });

  const filterCounts = {
    all: sortedExperiences.length,
    professional: sortedExperiences.filter((exp) => ["work", "education", "award"].includes(exp.category)).length,
    volunteer: sortedExperiences.filter((exp) => exp.category === "volunteer").length,
    community: sortedExperiences.filter((exp) => ["community", "committee"].includes(exp.category)).length,
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-canvas">
      <TopNav />

      {/* Static decorative background — no parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-primary/[0.03] rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 relative">
        <motion.div className="fixed top-20 left-6 md:left-8 z-50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-steel hover:text-charcoal transition-colors group">
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-body-sm-medium tracking-wide">Home</span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: (deviceInfo.isMobile || deviceInfo.isLowEnd) ? 20 : 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: deviceInfo.prefersReducedMotion ? 0.01 : 0.8 }} className="text-center max-w-4xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary/40" />
            <span className="text-micro-uppercase text-primary font-semibold tracking-wider">My Journey</span>
            <span className="w-8 h-px bg-primary/40" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="text-heading-1 md:text-display-lg text-charcoal font-semibold mb-4"
          >
            Experience
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
            className="text-body-md text-slate max-w-2xl mx-auto"
          >
            An editorial view of my journey — organized by time, focused on the story.
          </motion.p>
        </motion.div>
      </section>

      {/* Main Timeline Content */}
      <section className="px-6 md:px-8 py-section relative">
        <div className="max-w-container mx-auto">
          <FilterPills activeFilter={activeFilter} setActiveFilter={setActiveFilter} filterCounts={filterCounts} />

          <div className="space-y-16 sm:space-y-24">
            {sortedYears.map((yearKey) => {
              const year = yearKey === "ongoing" ? "ongoing" : Number(yearKey);
              const experiences = experiencesByYear[year] || [];
              return (
                <YearSection
                  key={yearKey}
                  year={year}
                  experiences={experiences}
                  ongoingIds={ongoingIds}
                  deviceInfo={deviceInfo}
                  animConfig={animConfig}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {sortedYears.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-surface rounded-full flex items-center justify-center">
                <Inbox className="w-10 h-10 text-muted" />
              </div>
              <h3 className="text-heading-5 text-charcoal mb-2">No experiences found</h3>
              <button onClick={() => setActiveFilter("all")} className="px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-colors">
                View All
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: deviceInfo.prefersReducedMotion ? 0.01 : 0.8 }}
        className="px-6 md:px-8 py-section-lg text-center"
      >
        <h2 className="text-heading-2 text-charcoal font-semibold mb-4">Want to work together?</h2>
        <p className="text-body-md text-slate mb-8 max-w-xl mx-auto">
          I&apos;m always open to discussing new opportunities, collaborations, or just having a chat.
        </p>
        <Link href="/contact" className="inline-flex items-center gap-2 px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200">
          Get in Touch
        </Link>
      </motion.section>
    </main>
  );
}
