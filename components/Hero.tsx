"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useIntroSeen, useDeviceType } from "@/lib/hooks";
import { ArrowRight, Layers, Compass, Users } from "lucide-react";

// ─── 3 Core Pillars (Focus & Philosophy) ───
const PILLARS = [
  {
    num: "01",
    title: "Full-Stack Systems",
    icon: Layers,
    tags: "React · Next.js · TypeScript · API",
    desc: "Engineering high-performance web platforms and scalable backends with modular, resilient architecture.",
    dotColor: "bg-blue-400",
    hoverBorder: "group-hover:border-blue-500/30",
    hoverGlow: "group-hover:bg-blue-500/[0.04]",
  },
  {
    num: "02",
    title: "Geospatial & IoT",
    icon: Compass,
    tags: "QGIS · Spatial Data · Telemetry",
    desc: "Merging real-world sensors, automated mapping, and interactive dashboards to solve tangible environmental problems.",
    dotColor: "bg-emerald-400",
    hoverBorder: "group-hover:border-emerald-500/30",
    hoverGlow: "group-hover:bg-emerald-500/[0.04]",
  },
  {
    num: "03",
    title: "Community & Leadership",
    icon: Users,
    tags: "Mentorship · Tadulako · I-Fest",
    desc: "Leading tech initiatives and mentoring developer communities across Central Sulawesi to empower the next generation.",
    dotColor: "bg-purple-400",
    hoverBorder: "group-hover:border-purple-500/30",
    hoverGlow: "group-hover:bg-purple-500/[0.04]",
  },
];

function Hero() {
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
    [deviceInfo.isMobile, deviceInfo.isLowEnd, deviceInfo.prefersReducedMotion]
  );

  // Adaptive transition helper
  const getTransition = (duration: number, delay: number): object => {
    if (deviceInfo.prefersReducedMotion) {
      return { duration: 0.01, delay: 0 };
    }
    if (deviceInfo.isLowEnd) {
      return { duration: 0.3, delay: delay * 0.3 };
    }
    if (deviceInfo.isMobile) {
      return { duration: duration * 0.8, delay: delay * 0.8 };
    }
    return { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] };
  };

  // Statement words for stagger animation — User's core brand slogan
  const STATEMENT_LINES = [
    { text: "FROM PIXEL", accent: false },
    { text: "TO", accent: false },
    { text: "PEOPLE.", accent: true },
  ];

  // Parallax offset (subtle, max 12px)
  const parallaxX = mousePos.x * 12;
  const parallaxY = mousePos.y * 8;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-center bg-[#0c0c0c] text-white overflow-hidden border-b border-white/[0.08]"
    >
      {/* ── Noise Grain Layer ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Warm Ambient Glow — subtle, not cold blue ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none z-[1]">
        <div
          className="w-full h-full rounded-full blur-[160px] opacity-[0.07]"
          style={{ background: "radial-gradient(circle, rgba(86,69,212,0.6), rgba(86,69,212,0.2) 50%, transparent 80%)" }}
        />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-[1400px] mx-auto">
          {/* ── Identity Line — editorial, top-aligned ── */}
          <motion.div
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 10 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getTransition(0.6, 0)}
          >
            <p className="text-[13px] md:text-[14px] font-mono text-white/40 tracking-wide">
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
            {STATEMENT_LINES.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, skewY: 2 }}
                animate={showContent ? { opacity: 1, y: 0, skewY: 0 } : {}}
                transition={getTransition(0.8, 0.15 + i * 0.12)}
                className="overflow-hidden"
              >
                <h1
                  className={`hero-statement select-none ${
                    line.accent
                      ? "text-primary italic"
                      : "text-white"
                  }`}
                >
                  {line.text}
                </h1>
              </motion.div>
            ))}
          </div>

          {/* ── Subtitle ── */}
          <motion.p
            className="text-[15px] md:text-[17px] text-white/35 max-w-md leading-relaxed mb-10 md:mb-14 font-light"
            initial={{ opacity: 0, y: 16 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getTransition(0.7, 0.6)}
          >
            Bridging technical execution with human impact —
            focusing on scalable web systems, geospatial tools, and developer communities.
          </motion.p>

          {/* ── 3 Core Pillars (Focus & Philosophy) ── */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-14 max-w-4xl"
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : {}}
            transition={getTransition(0.5, 0.75)}
          >
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0, y: 24 }}
                  animate={showContent ? { opacity: 1, y: 0 } : {}}
                  transition={getTransition(0.6, 0.8 + i * 0.1)}
                  className={`group relative rounded-xl p-5 md:p-6 bg-white/[0.02] border border-white/[0.07] ${pillar.hoverBorder} ${pillar.hoverGlow} transition-all duration-300 flex flex-col justify-between hover:-translate-y-1`}
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

          {/* ── CTA Row ── */}
          <motion.div
            className="flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 14 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getTransition(0.6, 1.1)}
          >
            <Link
              href="#work"
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-[13px] md:text-[14px] font-medium rounded-lg border border-white/10 transition-all duration-300"
            >
              <span>Explore Selected Work</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>

            <Link
              href="/journey"
              className="group inline-flex items-center gap-2 text-[13px] md:text-[14px] font-medium text-white/50 hover:text-white transition-colors duration-300"
            >
              <span className="relative">
                Read My Journey
                <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-white/40 group-hover:w-full transition-all duration-300" />
              </span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
