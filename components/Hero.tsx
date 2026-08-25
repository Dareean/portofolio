"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useIntroSeen, useDeviceType } from "@/lib/hooks";
import { ArrowRight, Layers, Compass, Users, Code2, Sparkles, LucideIcon } from "lucide-react";
import { HeroConfig } from "@/lib/cms";

const ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  Compass,
  Users,
  Code2,
  Sparkles,
};

interface HeroProps {
  heroData?: HeroConfig;
}

export default function Hero({ heroData }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const isIntroSeen = useIntroSeen();
  const deviceInfo = useDeviceType();

  const baseDelay = isIntroSeen ? 0.15 : 4.8;

  const [showContent, setShowContent] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), baseDelay * 1000);
    return () => clearTimeout(timer);
  }, [baseDelay]);

  // Cursor-reactive parallax — desktop only
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (deviceInfo.isMobile || deviceInfo.isLowEnd || deviceInfo.prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    },
    [deviceInfo]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  const parallaxX = mousePos.x * 12; // subtle max 12px shift
  const parallaxY = mousePos.y * 8;

  const getTransition = (duration: number, delay: number) => ({
    duration: deviceInfo.prefersReducedMotion ? 0.01 : deviceInfo.isLowEnd ? duration * 0.7 : duration,
    delay: deviceInfo.prefersReducedMotion ? 0 : baseDelay + delay,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  });

  const headline1 = heroData?.headlineLine1 || "FROM PIXEL";
  const headline2 = heroData?.headlineLine2 || "TO";
  const headlineAccent = heroData?.headlineAccent || "PEOPLE.";
  const subtitle = heroData?.subtitle || "Bridging technical execution with human impact — focusing on scalable web systems, geospatial tools, and developer communities.";

  const pillars = heroData?.pillars || [
    {
      id: "fullstack",
      num: "01",
      title: "Full-Stack Systems",
      icon: "Layers",
      tags: "React · Next.js · TypeScript · API",
      desc: "Engineering high-performance web platforms and scalable backends with modular, resilient architecture.",
    },
    {
      id: "geospatial",
      num: "02",
      title: "Geospatial & IoT",
      icon: "Compass",
      tags: "QGIS · Spatial Data · Telemetry",
      desc: "Merging real-world sensors, automated mapping, and interactive dashboards to solve tangible environmental problems.",
    },
    {
      id: "community",
      num: "03",
      title: "Community & Leadership",
      icon: "Users",
      tags: "Mentorship · Tadulako · I-Fest",
      desc: "Leading tech initiatives and mentoring developer communities across Central Sulawesi to empower the next generation.",
    },
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-between bg-ink text-on-dark overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 border-b border-white/[0.08]"
    >
      {/* Subtle Noise / Grid Pattern Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Main Hero Content Area */}
      <div className="relative z-10 w-full max-w-container mx-auto px-6 md:px-8">
        <div className="max-w-4xl">
          {/* ── Editorial Monogram & Identification ── */}
          <motion.div
            className="mb-8 md:mb-12"
            initial={{ opacity: 0, y: 12 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getTransition(0.6, 0.05)}
          >
            <p className="text-[13px] md:text-[14px] font-mono font-medium text-white/50 tracking-wider uppercase">
              Dareean Ahmad Raffi
            </p>
            <p className="text-[12px] md:text-[13px] font-mono text-white/25 tracking-wide mt-1">
              Developer · Palu, Indonesia
            </p>
          </motion.div>

          {/* ── Kinetic Statement ── */}
          <div
            ref={statementRef}
            className="mb-12 md:mb-16"
            style={{
              transform:
                !deviceInfo.isMobile && !deviceInfo.isLowEnd && !deviceInfo.prefersReducedMotion
                  ? `translate(${parallaxX}px, ${parallaxY}px)`
                  : undefined,
              transition: "transform 0.15s ease-out",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, skewY: 2 }}
              animate={showContent ? { opacity: 1, y: 0, skewY: 0 } : {}}
              transition={getTransition(0.8, 0.15)}
              className="overflow-hidden"
            >
              <h1 className="hero-statement select-none text-white">
                {headline1}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, skewY: 2 }}
              animate={showContent ? { opacity: 1, y: 0, skewY: 0 } : {}}
              transition={getTransition(0.8, 0.27)}
              className="overflow-hidden"
            >
              <h1 className="hero-statement select-none text-white">
                {headline2}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, skewY: 2 }}
              animate={showContent ? { opacity: 1, y: 0, skewY: 0 } : {}}
              transition={getTransition(0.8, 0.39)}
              className="overflow-hidden"
            >
              <h1 className="hero-statement select-none text-primary italic">
                {headlineAccent}
              </h1>
            </motion.div>
          </div>

          {/* ── Subtitle ── */}
          <motion.p
            className="text-[15px] md:text-[17px] text-white/35 max-w-md leading-relaxed mb-10 md:mb-14 font-light"
            initial={{ opacity: 0, y: 16 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getTransition(0.7, 0.6)}
          >
            {subtitle}
          </motion.p>

          {/* ── 3 Core Pillars (Focus & Philosophy) ── */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-14 max-w-4xl"
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : {}}
            transition={getTransition(0.5, 0.75)}
          >
            {pillars.map((pillar, i) => {
              const Icon = ICON_MAP[pillar.icon] || Layers;
              return (
                <motion.div
                  key={pillar.num || i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={showContent ? { opacity: 1, y: 0 } : {}}
                  transition={getTransition(0.6, 0.8 + i * 0.1)}
                  className="group relative rounded-xl p-5 md:p-6 bg-white/[0.02] border border-white/[0.07] hover:border-white/20 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    {/* Header: Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[12px] font-mono text-white/40 group-hover:text-white/80 transition-colors tracking-wider font-semibold">
                        /{pillar.num}
                      </span>
                      <Icon className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors duration-300" />
                    </div>

                    {/* Title */}
                    <h2 className="text-[16px] md:text-[17px] font-semibold text-white/90 group-hover:text-white transition-colors duration-200 mb-2">
                      {pillar.title}
                    </h2>

                    {/* Description */}
                    <p className="text-[13px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors duration-200 mb-4">
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="pt-3 border-t border-white/[0.05]">
                    <span className="text-[11px] font-mono text-white/30 tracking-tight">
                      {pillar.tags}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Action Buttons ── */}
          <motion.div
            className="flex flex-wrap items-center gap-4 pt-2"
            initial={{ opacity: 0, y: 12 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getTransition(0.5, 1.0)}
          >
            <Link
              href="#work"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-ink text-button-md font-medium rounded-lg hover:bg-white/90 transition-all duration-200 group shadow-elevation-1"
            >
              <span>{heroData?.ctaWorkText || "Explore Selected Work"}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              href="/journey"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white/70 hover:text-white text-button-md font-medium rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              <span>{heroData?.ctaJourneyText || "Read My Journey"}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
