"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useTheme } from "./ThemeProvider";

// Detect device performance capability
const detectPerformance = () => {
  if (typeof window === "undefined") return "high";

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;

  // Check if mobile
  const isMobile = window.innerWidth < 768;

  // Low-end detection
  if (isMobile && (cores <= 4 || memory <= 2)) {
    return "low";
  }

  // Mid-range
  if (isMobile && (cores <= 6 || memory <= 4)) {
    return "mid";
  }

  return "high";
};

// Generate twinkling star particles (static position, opacity only)
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2, // 2-6px (bigger for visibility)
    twinkleDuration: Math.random() * 2 + 1.5, // 1.5-3.5s twinkling speed
    delay: Math.random() * 3, // 0-3s - stagger start
    baseOpacity: Math.random() * 0.4 + 0.5, // 0.5-0.9 (brighter base)
  }));
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [performance, setPerformance] = useState<"low" | "mid" | "high">(
    "high",
  );

  // Detect device performance on mount
  useEffect(() => {
    setPerformance(detectPerformance());
  }, []);

  // Detect mobile for basic optimization
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Particle count based on performance - twinkling is lighter than floating
  const particleCount = useMemo(() => {
    if (performance === "low") return 30; // Even low-end can handle twinkling
    if (performance === "mid") return 60;
    return isMobile ? 80 : 120; // More stars for desktop
  }, [performance, isMobile]);

  // Reduce particles based on performance
  const particles = useMemo(
    () => generateParticles(particleCount),
    [particleCount],
  );

  // Theme-aware colors
  const particleColor = theme === "dark" ? "255,255,255" : "14,15,25";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Disable parallax on low-end devices
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    performance === "low" ? ["0%", "0%"] : ["0%", "50%"],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    performance === "low" ? [1, 1] : [1, 0],
  );

  // Text reveal animation variants
  const textRevealVariants: Variants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Aurora colors based on theme
  const auroraColors =
    theme === "dark"
      ? {
          blob1: "rgba(87, 136, 108, 0.4)", // Jungle Mist green
          blob2: "rgba(129, 166, 132, 0.3)", // Muted Leaf
          blob3: "rgba(70, 96, 96, 0.35)", // Sargasso
        }
      : {
          blob1: "rgba(87, 136, 108, 0.25)", // Softer for light mode
          blob2: "rgba(129, 166, 132, 0.2)",
          blob3: "rgba(248, 199, 204, 0.25)", // Cotton Rose pink
        };

  return (
    <section
      ref={containerRef}
      className="relative h-[120vh] sm:h-[130vh] md:h-[150vh] flex items-start justify-center overflow-hidden px-4 sm:px-6"
    >
      {/* Bottom Gradient Fade to blend with AboutMe */}
      <div className="hero-bottom-fade" />

      {/* Aurora Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Aurora Blob 1 - Top Right */}
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full will-change-transform"
          style={{
            background: `radial-gradient(circle, ${auroraColors.blob1} 0%, transparent 70%)`,
            filter:
              performance === "low"
                ? "blur(20px)"
                : isMobile
                  ? "blur(40px)"
                  : "blur(80px)",
          }}
          animate={
            performance === "low"
              ? {}
              : {
                  x: [0, 50, -30, 0],
                  y: [0, -40, 20, 0],
                  scale: [1, 1.1, 0.95, 1],
                }
          }
          transition={{
            duration: 20,
            repeat: performance === "low" ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Aurora Blob 2 - Bottom Left */}
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full will-change-transform"
          style={{
            background: `radial-gradient(circle, ${auroraColors.blob2} 0%, transparent 70%)`,
            filter:
              performance === "low"
                ? "blur(25px)"
                : isMobile
                  ? "blur(50px)"
                  : "blur(100px)",
          }}
          animate={
            performance === "low"
              ? {}
              : {
                  x: [0, -40, 60, 0],
                  y: [0, 50, -30, 0],
                  scale: [1, 0.9, 1.15, 1],
                }
          }
          transition={{
            duration: 25,
            repeat: performance === "low" ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Aurora Blob 3 - Center */}
        <motion.div
          className="absolute top-1/3 left-1/3 w-[60vw] h-[60vw] rounded-full will-change-transform"
          style={{
            background: `radial-gradient(circle, ${auroraColors.blob3} 0%, transparent 60%)`,
            filter:
              performance === "low"
                ? "blur(30px)"
                : isMobile
                  ? "blur(60px)"
                  : "blur(120px)",
          }}
          animate={
            performance === "low"
              ? {}
              : {
                  x: [0, 80, -50, 30, 0],
                  y: [0, -60, 40, -20, 0],
                  scale: [1, 1.2, 0.85, 1.1, 1],
                }
          }
          transition={{
            duration: 30,
            repeat: performance === "low" ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Twinkling Stars Background - Lightweight animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, rgba(${particleColor},1) 0%, rgba(${particleColor},0.9) 50%, transparent 100%)`,
              boxShadow: `0 0 ${particle.size * 5}px rgba(${particleColor},0.8), 0 0 ${particle.size * 2}px rgba(${particleColor},1)`,
            }}
            animate={{
              opacity: [
                particle.baseOpacity * 0.4,
                particle.baseOpacity,
                particle.baseOpacity * 0.4,
              ],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.twinkleDuration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ y, opacity }}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center will-change-transform px-4"
      >
        {/* Main Title with Mask Reveal */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-[18vw] sm:text-[16vw] md:text-[15vw] leading-none tracking-tighter text-off-white will-change-transform text-center"
            variants={textRevealVariants}
            initial="hidden"
            animate="visible"
          >
            DAREEAN
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg lg:text-xl text-off-white/60 font-sans tracking-wide text-center px-4"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Bringing stories to life, one pixel at a time
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-[10px] sm:text-xs text-off-white/40 tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            className="w-px h-8 sm:h-10 md:h-12 bg-gradient-to-b from-off-white/40 to-transparent"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
