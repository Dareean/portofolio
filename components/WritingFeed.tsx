"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useDeviceType } from "@/lib/hooks";
import { CMSStory } from "@/lib/cms";

interface WritingFeedProps {
  storiesData?: CMSStory[];
}

export default function WritingFeed({ storiesData }: WritingFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const deviceInfo = useDeviceType();

  const stories = storiesData || [
    {
      id: 3,
      title: "Building SOROT: Lessons from Geospatial App Development",
      excerpt: "Overcoming challenges in real-time GPS telemetry, QGIS mapping integration, and offline-first mobile architecture.",
      date: "Nov 2024",
      category: "Engineering",
      readTime: "5 min read",
      link: "/journey",
    },
    {
      id: 5,
      title: "Design System Deep Dive: Scalability in Production",
      excerpt: "Strategies for tokenizing design variables, atomic components, and maintaining visual consistency across large platforms.",
      date: "Aug 2024",
      category: "Design Systems",
      readTime: "4 min read",
      link: "/journey",
    },
    {
      id: 2,
      title: "Crafting a Minimalist Workspace & Engineering Workflow",
      excerpt: "Principles behind an intentional desk setup, hardware ergonomics, and focus-enhancing ambient tooling.",
      date: "Dec 2024",
      category: "Productivity",
      readTime: "3 min read",
      link: "/journey",
    },
  ];

  return (
    <section
      id="writing"
      ref={containerRef}
      className="py-section md:py-section-lg px-6 md:px-8 bg-canvas text-ink relative"
    >
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-px bg-primary/40" />
              <span className="text-micro-uppercase text-primary font-semibold tracking-wider font-mono">
                Writing &amp; Perspective
              </span>
            </div>
            <h2 className="text-heading-2 md:text-display-lg text-charcoal font-semibold tracking-tight">
              Selected Publications
            </h2>
            <p className="text-body-md text-slate mt-2 max-w-xl">
              Reflections on software architecture, geospatial tools, and design engineering.
            </p>
          </div>

          <Link
            href="/journey"
            className="group inline-flex items-center gap-2 text-button-md font-medium text-steel hover:text-charcoal transition-colors duration-200 font-mono"
          >
            <span>View All Stories</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Minimalist Publication Feed — Linear/Substack style */}
        <div className="border-t border-hairline divide-y divide-hairline">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: deviceInfo.isMobile ? 12 : 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: deviceInfo.prefersReducedMotion ? 0.01 : 0.5,
                delay: deviceInfo.prefersReducedMotion ? 0 : i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Link
                href={story.link}
                className="group py-6 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 transition-colors duration-200 hover:bg-surface-soft/60 px-3 md:px-4 rounded-lg -mx-3 md:-mx-4"
              >
                {/* Meta column: Date & Category */}
                <div className="flex items-center gap-3 md:w-48 flex-shrink-0">
                  <span className="text-caption text-steel font-mono">
                    {story.date}
                  </span>
                  <span className="text-muted text-xs">•</span>
                  <span className="px-2 py-0.5 rounded bg-surface border border-hairline text-micro font-mono text-steel uppercase tracking-wider">
                    {story.category}
                  </span>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-heading-4 text-charcoal font-semibold tracking-tight group-hover:text-primary transition-colors duration-200 mb-1.5 line-clamp-1">
                    {story.title}
                  </h3>
                  <p className="text-body-sm text-slate leading-relaxed line-clamp-2">
                    {story.excerpt}
                  </p>
                </div>

                {/* Right side: Read time & Arrow */}
                <div className="flex items-center gap-4 flex-shrink-0 pt-2 md:pt-0">
                  <span className="text-caption text-muted font-mono flex items-center gap-1.5">
                    <Clock size={13} className="text-muted" />
                    <span>{story.readTime}</span>
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface border border-hairline flex items-center justify-center text-steel group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-200">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
