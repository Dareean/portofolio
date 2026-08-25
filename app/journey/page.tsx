"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { EXPERIENCES, Experience } from "@/lib/data";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import {
  ChevronLeft,
  ChevronDown,
  Briefcase,
  Trophy,
  Users,
  GraduationCap,
  HeartHandshake,
  ClipboardList,
  Layers,
} from "lucide-react";
import { useDeviceType } from "@/lib/hooks";

type FilterType = "all" | "work" | "community" | "award" | "committee" | "education";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "All Milestones" },
  { id: "community", label: "Community & Leadership" },
  { id: "work", label: "Work & Industry" },
  { id: "award", label: "Competitions & Awards" },
  { id: "committee", label: "Committees & Events" },
  { id: "education", label: "Education" },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "-01");
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getYear(dateStr: string): number {
  return new Date(dateStr + "-01").getFullYear();
}

export default function JourneyPage() {
  const [experiencesList, setExperiencesList] = useState<Experience[]>(EXPERIENCES);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const deviceInfo = useDeviceType();

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.experiences?.length > 0) {
          setExperiencesList(json.data.experiences);
        }
      })
      .catch((err) => console.log("Using static experiences"));
  }, []);

  // Toggle single item expansion
  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle expand all / collapse all
  const toggleExpandAll = () => {
    if (expandedIds.size === filteredExperiences.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredExperiences.map((e) => e.id)));
    }
  };

  // Filter experiences
  const filteredExperiences = useMemo(() => {
    if (activeFilter === "all") return experiencesList;
    if (activeFilter === "committee") {
      return experiencesList.filter((e) => e.category === "committee" || e.category === "volunteer");
    }
    return experiencesList.filter((e) => e.category === activeFilter);
  }, [activeFilter, experiencesList]);

  // Group filtered experiences by year (descending)
  const groupedExperiences = useMemo(() => {
    const groups: { [year: string]: Experience[] } = {};

    filteredExperiences.forEach((exp) => {
      const year = getYear(exp.dateStart);
      const isNow = !exp.dateEnd || exp.dateEnd >= "2026-01";
      const groupKey = isNow && year >= 2026 ? "2026 — Present" : year.toString();

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(exp);
    });

    // Sort experiences within groups (newest dateStart first)
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => (b.dateStart > a.dateStart ? 1 : -1));
    });

    // Return ordered array of groups
    return Object.entries(groups).sort((a, b) => (b[0] > a[0] ? 1 : -1));
  }, [filteredExperiences]);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      <TopNav />

      <main className="flex-1 pb-20">
        {/* ═══════════════════════════════════════════
            Editorial Hero Header (Consistent with Home / Work)
            ═══════════════════════════════════════════ */}
        <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 px-6 md:px-8 border-b border-hairline bg-canvas">
          <div className="max-w-container mx-auto">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-steel hover:text-charcoal text-caption font-mono transition-colors duration-200 group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back to Overview</span>
              </Link>
            </motion.div>

            {/* Section Tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-8 h-px bg-primary/60" />
              <span className="text-micro-uppercase text-primary font-semibold tracking-wider font-mono">
                Trajectory &amp; Experience
              </span>
            </motion.div>

            {/* Title & Subtitle */}
            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-display-lg md:text-display-xl font-semibold text-charcoal tracking-tight mb-4"
              >
                The Journey
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-body-md md:text-subtitle text-slate leading-relaxed mb-8"
              >
                A structured ledger of professional programming internships, computer science education, regional tech leadership in Central Sulawesi, and product competitions.
              </motion.p>

              {/* Metric Badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-2.5"
              >
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-surface border border-hairline text-charcoal text-caption font-mono">
                  <span>14 Milestones Logged</span>
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-surface border border-hairline text-charcoal text-caption font-mono">
                  <span>Palu, Indonesia → Global</span>
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-surface border border-hairline text-charcoal text-caption font-mono">
                  <span>2021 — Present</span>
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            Filter Bar & Quick Actions
            ═══════════════════════════════════════════ */}
        <section className="px-6 md:px-8 py-6 border-b border-hairline sticky top-16 md:top-20 z-20 bg-canvas/90 backdrop-blur-md">
          <div className="max-w-container mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-md text-caption font-mono transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-charcoal text-white font-medium shadow-elevation-1"
                        : "bg-surface border border-hairline text-steel hover:text-charcoal hover:border-charcoal/20"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* Expand / Collapse All Toggle */}
            <button
              onClick={toggleExpandAll}
              className="text-caption text-steel hover:text-charcoal font-mono self-end sm:self-auto transition-colors duration-200"
            >
              {expandedIds.size === filteredExperiences.length ? "Collapse All" : "Expand All Details"}
            </button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            Minimalist Editorial Ledger (Year Grouped)
            ═══════════════════════════════════════════ */}
        <section className="px-6 md:px-8 py-10 md:py-14">
          <div className="max-w-container mx-auto space-y-12 md:space-y-16">
            {groupedExperiences.map(([yearLabel, items], groupIndex) => (
              <div key={yearLabel} className="space-y-4">
                {/* Year Ledger Header */}
                <div className="flex items-center gap-4">
                  <h2 className="text-heading-3 md:text-heading-2 font-semibold text-charcoal font-mono tracking-tight">
                    {yearLabel}
                  </h2>
                  <div className="h-px flex-1 bg-hairline" />
                  <span className="text-caption text-muted font-mono">
                    {items.length} {items.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                {/* Ledger Items Table / Rows */}
                <div className="border border-hairline rounded-xl bg-surface overflow-hidden divide-y divide-hairline shadow-elevation-0">
                  {items.map((exp, itemIndex) => {
                    const isExpanded = expandedIds.has(exp.id);
                    const isOngoing = !exp.dateEnd || exp.dateEnd >= "2026-01";

                    return (
                      <div
                        key={exp.id}
                        className={`transition-colors duration-200 ${
                          isExpanded ? "bg-canvas/60" : "hover:bg-canvas/30"
                        }`}
                      >
                        {/* Primary Row Trigger */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(exp.id)}
                          className="w-full text-left p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 group cursor-pointer"
                        >
                          {/* Left Column: Date & Category */}
                          <div className="flex items-center gap-3 md:w-56 flex-shrink-0">
                            <span className="text-caption text-steel font-mono font-medium">
                              {formatDate(exp.dateStart)}
                              {exp.dateEnd ? ` — ${formatDate(exp.dateEnd)}` : " — Present"}
                            </span>
                            {isOngoing && (
                              <span className="px-1.5 py-0.5 rounded bg-charcoal/5 border border-charcoal/10 text-[10px] font-mono text-charcoal uppercase tracking-wider font-semibold">
                                Active
                              </span>
                            )}
                          </div>

                          {/* Center Column: Role & Organization */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-2 mb-1">
                              <h3 className="text-heading-4 text-charcoal font-semibold tracking-tight group-hover:text-primary transition-colors duration-200">
                                {exp.role}
                              </h3>
                              <span className="text-caption text-steel">
                                @ {exp.organization}
                              </span>
                            </div>
                            <p className="text-body-sm text-slate line-clamp-1">
                              {exp.title}
                            </p>
                          </div>

                          {/* Right Column: Category Badge & Chevron */}
                          <div className="flex items-center gap-3 flex-shrink-0 self-start md:self-center">
                            <span className="px-2.5 py-1 rounded bg-canvas border border-hairline text-caption font-mono text-steel uppercase tracking-wider text-[11px]">
                              {exp.category}
                            </span>
                            <div
                              className={`w-7 h-7 rounded-full bg-canvas border border-hairline flex items-center justify-center text-steel group-hover:text-charcoal transition-transform duration-200 ${
                                isExpanded ? "rotate-180 bg-primary/10 text-primary border-primary/30" : ""
                              }`}
                            >
                              <ChevronDown size={14} />
                            </div>
                          </div>
                        </button>

                        {/* Expandable Detail Drawer */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="overflow-hidden border-t border-hairline bg-canvas/40"
                            >
                              <div className="p-5 md:p-6 md:pl-64 space-y-4">
                                {/* Detailed Description */}
                                <p className="text-body-sm md:text-body-md text-slate leading-relaxed max-w-3xl">
                                  {exp.description}
                                </p>

                                {/* Highlights / Skills Tags */}
                                {exp.highlights && exp.highlights.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-2 pt-2">
                                    <span className="text-micro font-mono text-muted uppercase tracking-wider mr-1">
                                      Focus:
                                    </span>
                                    {exp.highlights.map((tag, i) => (
                                      <span
                                        key={i}
                                        className="px-2.5 py-1 rounded bg-surface border border-hairline text-caption text-charcoal font-mono text-xs"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Attached Image if any (e.g. Guard Riders / RSICT) */}
                                {exp.image && (
                                  <div className="pt-3">
                                    <div className="relative w-full max-w-md h-52 rounded-lg overflow-hidden border border-hairline shadow-elevation-1">
                                      <Image
                                        src={exp.image}
                                        alt={exp.title}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
