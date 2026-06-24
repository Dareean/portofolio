"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { useIntroSeen, useDeviceType, getAnimationConfig } from "@/lib/hooks";
import { ArrowRight, ArrowDown } from "lucide-react";

const ROLES = [
  "Frontend Enthusiast",
  "UI/UX Enthusiast",
  "Lead Management",
  "Community Builder",
];

const MARQUEE_ITEMS = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Figma",
  "UI/UX Design", "GSAP", "Node.js", "Python", "IoT",
  "Leadership", "Community", "Problem Solving",
];

// Decorative sticky-note dots scattered positions
const STICKY_DOTS = [
  { x: "10%", y: "15%", color: "bg-tint-peach", size: 14 },
  { x: "85%", y: "20%", color: "bg-tint-rose", size: 10 },
  { x: "15%", y: "75%", color: "bg-tint-yellow-bold", size: 12 },
  { x: "78%", y: "70%", color: "bg-tint-sky", size: 8 },
  { x: "5%", y: "45%", color: "bg-tint-lavender", size: 10 },
  { x: "92%", y: "50%", color: "bg-tint-mint", size: 12 },
  { x: "50%", y: "8%", color: "bg-tint-yellow", size: 9 },
  { x: "25%", y: "85%", color: "bg-tint-rose", size: 11 },
];

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isIntroSeen = useIntroSeen();
  const deviceInfo = useDeviceType();
  const animConfig = getAnimationConfig(deviceInfo);

  const baseDelay = isIntroSeen ? 0.3 : 4.8;

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), baseDelay * 1000);
    return () => clearTimeout(timer);
  }, [baseDelay]);

  useEffect(() => {
    if (!showContent || deviceInfo.prefersReducedMotion) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showContent, deviceInfo.prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax desktop-only, no opacity fade (opacity fade triggers per-frame style updates)
  const isScrollAnimationDisabled = deviceInfo.prefersReducedMotion || deviceInfo.isLowEnd || deviceInfo.isMobile;
  const y = useTransform(scrollYProgress, [0, 1], ["0%", isScrollAnimationDisabled ? "0%" : "18%"]);

  // Helper for adaptive Framer Motion transitions
  const getAdaptedTransition = (duration: number, delay: number): any => {
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

  // Render fewer dots on mobile/low-end to minimize layout paint cycles
  const activeDots = deviceInfo.isMobile || deviceInfo.isLowEnd
    ? STICKY_DOTS.slice(0, 3)
    : STICKY_DOTS;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-start items-center bg-brand-navy"
    >
      {/* ── SVG Mesh Wire Illustration Overlay ── */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04] select-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mesh-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mesh-grid)" />
          {/* Abstract floating wires resembling Notion branding */}
          <path d="M-100,250 C300,50 450,450 850,150" fill="none" stroke="currentColor" strokeWidth="1" className="text-white" />
          <path d="M150,550 C550,350 450,750 1150,450" fill="none" stroke="currentColor" strokeWidth="1" className="text-white" />
          <circle cx="150" cy="180" r="3" className="fill-white" />
          <circle cx="750" cy="120" r="3" className="fill-white" />
          <circle cx="450" cy="420" r="3" className="fill-white" />
        </svg>
      </div>

      {/* ── Decorative sticky-note dots ── */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {activeDots.map((dot, i) => (
          <motion.div
            key={i}
            className={`sticky-dot ${dot.color} absolute`}
            style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={showContent ? {
              opacity: deviceInfo.isLowEnd ? 0.5 : [0, 0.7, 0.5],
              scale: deviceInfo.isLowEnd ? 1 : [0, 1, 1],
              rotate: deviceInfo.isLowEnd ? 45 : [0, 45, 45],
            } : {}}
            transition={{
              delay: deviceInfo.isLowEnd ? 0.1 : (1.0 + i * 0.15),
              duration: deviceInfo.isLowEnd ? 0.1 : 0.8,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ── Subtle purple gradient glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none z-[1]">
        <div
          className="w-full h-full rounded-full blur-[150px] opacity-[0.08]"
          style={{ background: "radial-gradient(circle, rgb(var(--color-primary)), transparent 70%)" }}
        />
      </div>

      <motion.div
        style={{ y }}
        className="relative z-10 w-full flex flex-col items-center px-6 md:px-8 pt-28 pb-16 md:pt-36 md:pb-24"
      >
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge — "Portfolio" */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getAdaptedTransition(0.6, 0.2)}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-on-dark-muted/30 text-on-dark-muted text-micro-uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Portfolio
            </span>
          </motion.div>

          {/* Headline - Notion typography hero-display style */}
          <motion.h1
            className="text-[48px] sm:text-[64px] md:text-hero-display text-on-dark font-semibold tracking-[-2px] leading-[1.05]"
            initial={{ opacity: 0, y: 30 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getAdaptedTransition(0.8, 0.4)}
          >
            Dareean
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-subtitle text-on-dark-muted max-w-xl mx-auto mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getAdaptedTransition(0.8, 0.6)}
          >
            Bringing stories to life,{" "}
            <span className="text-on-dark font-medium">one pixel</span> at a time.
          </motion.p>

          {/* Rotating role */}
          <motion.div
            className="flex items-center gap-3 mt-6"
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : {}}
            transition={getAdaptedTransition(0.6, 0.8)}
          >
            <span className="text-micro-uppercase text-on-dark-muted/50">
              Currently
            </span>
            <span className="text-on-dark-muted/30">|</span>
            <div className="h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentRoleIndex}
                  className="block text-caption-bold text-on-dark-muted"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {ROLES[currentRoleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Button Row - Rectangular Geometry */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={getAdaptedTransition(0.8, 1.0)}
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200"
            >
              Explore My Work
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/journey"
              className="inline-flex items-center gap-2 px-[18px] py-[10px] bg-transparent text-on-dark text-button-md font-medium rounded-md border border-on-dark-muted/30 hover:bg-white/5 transition-all duration-200"
            >
              My Journey
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="flex flex-col items-center gap-2 mt-16"
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : {}}
            transition={{ delay: deviceInfo.isLowEnd ? 0.1 : 1.6, duration: 0.8 }}
          >
            <span className="text-micro-uppercase text-on-dark-muted/30">
              Scroll to explore
            </span>
            <ArrowDown size={16} className="text-on-dark-muted/30 animate-chevron-bounce" />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Portfolio Mockup Card (Realistic Notion Workspace UI) ── */}
      {/* Placed outside the opacity motion.div to avoid stacking context issues */}
      <motion.div
        style={{ y }}
        className="relative w-full max-w-4xl mx-auto px-6 md:px-8 -mt-4 md:-mt-8 pb-20 md:pb-32 z-10"
        initial={{ opacity: 0, y: deviceInfo.isMobile ? 20 : 60, scale: deviceInfo.isMobile ? 1 : 0.95 }}
        animate={showContent ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={getAdaptedTransition(1.2, 1.2)}
      >
        <div className="bg-canvas rounded-lg border border-hairline shadow-elevation-3 overflow-hidden text-left flex flex-col">
            {/* Mockup browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-surface">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 max-w-md mx-auto">
                <div className="h-6 rounded-md bg-hairline/50 flex items-center justify-center text-caption text-steel font-mono">
                  dareean.notion.site/projects
                </div>
              </div>
            </div>
            
            {/* Mockup Notion Layout: Sidebar + Main Area */}
            <div className="flex min-h-[360px] divide-x divide-hairline">
              {/* Left Sidebar - Notion style */}
              <div className="hidden md:flex flex-col w-[200px] bg-surface p-4 gap-6 flex-shrink-0">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-primary text-xs font-bold font-mono">D</div>
                  <span className="text-caption-bold text-charcoal truncate">Dareean&apos;s Hub</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="px-2 text-micro-uppercase text-steel font-semibold block mb-1">Favorites</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-1 bg-hairline/50 rounded-sm text-body-sm text-charcoal font-medium">
                        <span>🏠</span> <span className="truncate">Home</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-sm text-body-sm text-steel hover:bg-hairline/30 hover:text-charcoal transition-colors">
                        <span>📂</span> <span className="truncate">Projects</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="px-2 text-micro-uppercase text-steel font-semibold block mb-1">Pages</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-sm text-body-sm text-steel hover:bg-hairline/30 hover:text-charcoal transition-colors">
                        <span>🎓</span> <span className="truncate">Journey</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-sm text-body-sm text-steel hover:bg-hairline/30 hover:text-charcoal transition-colors">
                        <span>✉️</span> <span className="truncate">Contact</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Content Editor */}
              <div className="flex-1 bg-canvas p-6 md:p-8 flex flex-col gap-6">
                {/* Page Icon & Title */}
                <div>
                  <span className="text-4xl block mb-2">⚡</span>
                  <h3 className="text-heading-2 text-charcoal font-semibold tracking-tight">
                    Dareean Ahmad Raffi
                  </h3>
                  <p className="text-body-sm text-slate mt-1 leading-relaxed">
                    Full-stack developer &amp; UI/UX enthusiast. Combining logical systems with high-end aesthetic design.
                  </p>
                </div>
                
                {/* Page Properties */}
                <div className="border-t border-b border-hairline py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-micro-uppercase text-stone font-semibold block mb-0.5">Role</span>
                    <span className="text-body-sm-medium text-charcoal">Developer / Designer</span>
                  </div>
                  <div>
                    <span className="text-micro-uppercase text-stone font-semibold block mb-0.5">Location</span>
                    <span className="text-body-sm-medium text-charcoal">Palu, Indonesia 🇮🇩</span>
                  </div>
                  <div>
                    <span className="text-micro-uppercase text-stone font-semibold block mb-0.5">Availability</span>
                    <span className="text-body-sm-medium text-brand-green flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Open for work
                    </span>
                  </div>
                  <div>
                    <span className="text-micro-uppercase text-stone font-semibold block mb-0.5">Stack</span>
                    <span className="text-body-sm-medium text-charcoal truncate block">React / Next.js / IoT</span>
                  </div>
                </div>
                
                {/* Embedded Board View Preview */}
                <div>
                  <div className="flex items-center gap-2 mb-3 text-micro-uppercase text-steel font-semibold tracking-wide">
                    <span>📋</span> Selected Projects Board
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Card 1 */}
                    <div className="p-3.5 bg-surface border border-hairline rounded-md hover:shadow-elevation-1 hover:border-primary/20 transition-all duration-300">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] text-primary font-mono uppercase font-bold tracking-wider">Featured</span>
                      </div>
                      <span className="text-caption-bold text-charcoal block mb-0.5">Medicflow</span>
                      <p className="text-[11px] text-slate line-clamp-2">Medical record platform with streamlined clinical workflows.</p>
                      <div className="flex gap-1.5 mt-2">
                        <span className="px-1.5 py-0.5 bg-tint-lavender text-brand-purple-800 text-[9px] font-semibold rounded-sm">Next.js</span>
                        <span className="px-1.5 py-0.5 bg-tint-sky text-link-blue text-[9px] font-semibold rounded-sm">React</span>
                      </div>
                    </div>
                    
                    {/* Card 2 */}
                    <div className="p-3.5 bg-surface border border-hairline rounded-md hover:shadow-elevation-1 hover:border-primary/20 transition-all duration-300">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[10px] text-primary font-mono uppercase font-bold tracking-wider">Featured</span>
                      </div>
                      <span className="text-caption-bold text-charcoal block mb-0.5">Sorot App</span>
                      <p className="text-[11px] text-slate line-clamp-2">Geospatial reporting tool for environmental problems.</p>
                      <div className="flex gap-1.5 mt-2">
                        <span className="px-1.5 py-0.5 bg-tint-mint text-brand-green text-[9px] font-semibold rounded-sm">Mobile</span>
                        <span className="px-1.5 py-0.5 bg-tint-peach text-brand-orange-deep text-[9px] font-semibold rounded-sm">QGIS</span>
                      </div>
                    </div>
                    
                    {/* Card 3 */}
                    <div className="p-3.5 bg-surface border border-hairline rounded-md hover:shadow-elevation-1 hover:border-primary/20 transition-all duration-300">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                        <span className="text-[10px] text-brand-green font-mono uppercase font-bold tracking-wider">Active</span>
                      </div>
                      <span className="text-caption-bold text-charcoal block mb-0.5">DreamPOS</span>
                      <p className="text-[11px] text-slate line-clamp-2">High-performance inventory management system.</p>
                      <div className="flex gap-1.5 mt-2">
                        <span className="px-1.5 py-0.5 bg-tint-yellow-bold text-brand-brown text-[9px] font-semibold rounded-sm">PHP</span>
                        <span className="px-1.5 py-0.5 bg-tint-gray text-steel text-[9px] font-semibold rounded-sm">MySQL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </motion.div>

      {/* Hero bottom fade to canvas */}
      <div className="hero-bottom-fade absolute z-20 pointer-events-none" />

      {/* ── Skill Marquee at bottom ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden py-4 border-t border-white/5"
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : {}}
        transition={{ delay: 2.0, duration: 1 }}
      >
        <div className="marquee-gradient-mask">
          <div className="flex whitespace-nowrap">
            <div className="animate-marquee-scroll flex items-center gap-8 pr-8">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} className="text-micro-uppercase text-on-dark-muted/20 flex items-center gap-8">
                  {item}
                  <span className="w-1 h-1 rounded-full bg-on-dark-muted/20" />
                </span>
              ))}
            </div>
            <div className="animate-marquee-scroll flex items-center gap-8 pr-8" aria-hidden>
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} className="text-micro-uppercase text-on-dark-muted/20 flex items-center gap-8">
                  {item}
                  <span className="w-1 h-1 rounded-full bg-on-dark-muted/20" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
