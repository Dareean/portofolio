"use client";

import { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { JOURNEY_ITEMS } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const typeIcons: Record<string, string> = {
  milestone: "🚀",
  project: "💻",
  education: "📚",
  award: "🏆",
  experience: "💼",
  community: "🤝",
};

const typeColors: Record<string, string> = {
  milestone: "border-blue-400/50",
  project: "border-purple-400/50",
  education: "border-green-400/50",
  award: "border-yellow-400/50",
  experience: "border-pink-400/50",
  community: "border-cyan-400/50",
};

export default function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Sort by date ascending (oldest first)
  const sortedJourney = [...JOURNEY_ITEMS].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // GSAP ScrollTrigger Animations
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }

      // Timeline items alternating animation
      if (timelineRef.current) {
        const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
          const direction = index % 2 === 0 ? -80 : 80;
          gsap.fromTo(item,
            { opacity: 0, x: direction },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse",
              }
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16">
      {/* Section Header (GSAP animated) */}
      <div ref={headerRef} className="mb-12 sm:mb-16 md:mb-20 max-w-2xl">
        <span className="text-off-white/40 text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 block">
          My Path
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-off-white mb-3 sm:mb-4">
          Journey
        </h2>
        <p className="text-off-white/60 text-sm sm:text-base md:text-lg">
          A timeline of my career milestones, projects, and growth as a developer.
        </p>
      </div>

      {/* Timeline (GSAP animated) */}
      <div ref={timelineRef} className="relative max-w-3xl mx-auto">
        {/* Center Line */}
        <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-px bg-off-white/10 md:-translate-x-px" />

        {/* Start Point - The Beginning */}
        <motion.div
          className="timeline-item relative flex items-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute left-6 sm:left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-off-white/10 border border-off-white/20 flex items-center justify-center">
            <span className="text-off-white/60 text-[10px] sm:text-xs">✦</span>
          </div>
          <span className="ml-14 sm:ml-16 md:ml-0 md:absolute md:left-1/2 md:translate-x-8 text-off-white/40 text-xs sm:text-sm tracking-widest uppercase">
            The Beginning
          </span>
        </motion.div>

        {sortedJourney.map((item, index) => (
          <div
            key={item.id}
            className={`timeline-item relative flex items-start gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Timeline Node */}
            <div className="absolute left-6 sm:left-8 md:left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-void-black border-2 border-off-white/40 z-10" />

            {/* Content Card */}
            <div
              className={`ml-12 sm:ml-14 md:ml-0 md:w-[calc(50%-2rem)] p-4 sm:p-5 md:p-6 bg-off-white/5 border ${
                typeColors[item.type]
              } hover:bg-off-white/10 transition-colors duration-300`}
            >
              {/* Date & Type */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{typeIcons[item.type]}</span>
                <span className="text-off-white/40 font-mono text-sm">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-off-white/30 text-xs uppercase tracking-widest">
                  {item.type}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-lg sm:text-xl md:text-2xl text-off-white mb-1.5 sm:mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-off-white/60 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}

        {/* End Point - Will Keep Going */}
        <motion.div
          className="timeline-item relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="absolute left-6 sm:left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-off-white text-void-black flex items-center justify-center">
            <span className="text-xs sm:text-sm">→</span>
          </div>
          <span className="ml-14 sm:ml-16 md:ml-0 md:absolute md:left-1/2 md:translate-x-8 text-off-white text-xs sm:text-sm tracking-widest uppercase font-medium">
            Will Keep Going...
          </span>
        </motion.div>
      </div>
    </section>
  );
}
