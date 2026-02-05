"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ExploreItem {
  id: string;
  title: string;
  href: string;
  category: string;
}

const exploreItems: ExploreItem[] = [
  {
    id: "journey",
    title: "My Journey",
    href: "/journey",
    category: "Experience & Story",
  },
  {
    id: "contact",
    title: "Get in Touch",
    href: "/contact",
    category: "Let's Connect",
  },
];

export default function ExploreLinks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const linksListRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger Animations
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
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

      // Links staggered animation
      if (linksListRef.current) {
        const linkItems = linksListRef.current.querySelectorAll('.link-item');
        gsap.fromTo(linkItems,
          { opacity: 0, x: -80 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: linksListRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-16">
      {/* Section Header (GSAP animated) */}
      <div ref={headerRef} className="mb-8 sm:mb-12 md:mb-16">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-off-white">
          Explore More
        </h2>
      </div>

      {/* Links List (GSAP animated) */}
      <div ref={linksListRef} className="space-y-0">
        {exploreItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="link-item group border-t border-off-white/10"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href={item.href} className="block">
              <motion.div
                className="py-6 sm:py-8 md:py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 transition-opacity duration-300 cursor-pointer"
                animate={{
                  opacity:
                    hoveredIndex === null || hoveredIndex === index ? 1 : 0.3,
                }}
              >
                {/* Item Info */}
                <div className="flex items-baseline gap-2 sm:gap-4 md:gap-8">
                  <span className="text-xs sm:text-sm text-off-white/40 font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl text-off-white tracking-tight group-hover:text-off-white/80 transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Item Meta */}
                <div className="flex sm:hidden md:flex items-center gap-4 sm:gap-8 md:gap-12 ml-6 sm:ml-0">
                  <span className="text-off-white/60 uppercase tracking-widest text-xs sm:text-sm">
                    {item.category}
                  </span>
                  <motion.div
                    animate={{ x: hoveredIndex === index ? 8 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      className="w-5 h-5 text-off-white/40 group-hover:text-off-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
        {/* Bottom border */}
        <div className="border-t border-off-white/10" />
      </div>
    </section>
  );
}
