"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useDeviceType } from "@/lib/hooks";

interface WorkListProps {
  projects: Project[];
}

export default function WorkList({ projects }: WorkListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceType();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (deviceInfo.prefersReducedMotion || deviceInfo.isLowEnd) {
        // Disable ScrollTriggers, make everything visible immediately
        if (headerRef.current) gsap.set(headerRef.current, { opacity: 1, y: 0 });
        if (gridRef.current) {
          const cards = gridRef.current.querySelectorAll(".work-card");
          gsap.set(cards, { opacity: 1, y: 0 });
        }
        if (viewAllRef.current) gsap.set(viewAllRef.current, { opacity: 1, y: 0 });
        return;
      }

      // Header
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Cards stagger
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".work-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: deviceInfo.isMobile ? 0.05 : 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // View all
      if (viewAllRef.current) {
        gsap.fromTo(
          viewAllRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: viewAllRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [deviceInfo]);

  return (
    <section
      ref={sectionRef}
      className="relative py-section-sm md:py-section px-6 md:px-8"
    >
      <div className="max-w-container mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="mb-10 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary/40" />
            <span className="text-micro-uppercase text-primary font-semibold tracking-wider">
              Portfolio
            </span>
          </div>
          <h2 className="text-heading-2 md:text-heading-1 text-charcoal font-semibold tracking-tight">
            Selected Work
          </h2>
        </div>

        {/* Project Grid - Styled as Notion Database Gallery view */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            return (
              <motion.div
                key={project.id}
                className={`work-card bg-canvas rounded-lg border border-hairline shadow-elevation-1 hover:shadow-elevation-2 overflow-hidden flex flex-col transition-all duration-300 cursor-pointer group ${
                  hoveredIndex !== null && hoveredIndex !== index ? "opacity-60" : "opacity-100"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                <Link href={`/work/${project.id}`} className="flex flex-col h-full">
                  {/* Card Cover Preview */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface border-b border-hairline">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Body content */}
                  <div className="p-5 flex-1 flex flex-col gap-3 bg-canvas">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-semibold rounded-sm tracking-wider uppercase font-mono">
                        {Array.isArray(project.category)
                          ? project.category[0]
                          : project.category}
                      </span>
                      {project.status === "In Progress" && (
                        <span className="px-2 py-0.5 bg-brand-yellow/30 text-brand-brown text-[11px] font-semibold rounded-sm uppercase font-mono">
                          In Progress
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-heading-5 text-charcoal font-semibold group-hover:text-primary transition-colors duration-200 line-clamp-1">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-body-sm text-slate leading-relaxed flex-1 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Bottom Metadata row */}
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-hairline">
                      <span className="text-caption-bold text-steel font-mono">
                        {project.year}
                      </span>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-steel hover:text-primary transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Visit live link for ${project.title}`}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        <div ref={viewAllRef} className="mt-10 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200"
          >
            View All Projects
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
