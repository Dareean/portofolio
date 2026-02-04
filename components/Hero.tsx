"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import KineticTypography from "./KineticTypography";

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

  return (
    <section
      ref={containerRef}
      className="relative h-[120vh] sm:h-[130vh] md:h-[150vh] flex items-start justify-center overflow-hidden px-4 sm:px-6 bg-black"
    >
      {/* Kinetic Typography Background */}
      <KineticTypography />

      {/* Bottom Gradient Fade to blend with AboutMe */}
      <div className="hero-bottom-fade" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 sticky top-0 h-screen w-full flex flex-col items-center justify-center will-change-transform px-4"
      >
        {/* Main Title - Bold Brutalist Statement */}
        <div className="relative max-w-full w-full flex flex-col items-center">
          {/* Top Marquee Section */}
          <motion.div
            className="w-full overflow-hidden mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5, duration: 1 }}
          >
            <motion.div
              animate={{ x: [0, -1500] }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex gap-8 whitespace-nowrap"
            >
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-8">
                  <span className="text-white/20 font-mono text-xs sm:text-sm tracking-[0.3em] uppercase">
                    Web Development
                  </span>
                  <span className="text-white/10">•</span>
                  <span className="text-white/20 font-mono text-xs sm:text-sm tracking-[0.3em] uppercase">
                    UI/UX Design
                  </span>
                  <span className="text-white/10">•</span>
                  <span className="text-white/20 font-mono text-xs sm:text-sm tracking-[0.3em] uppercase">
                    Creative Coding
                  </span>
                  <span className="text-white/10">•</span>
                  <span className="text-white/20 font-mono text-xs sm:text-sm tracking-[0.3em] uppercase">
                    Digital Experience
                  </span>
                  <span className="text-white/10">•</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Large Horizontal Marquee - Mobile Only */}
          <motion.div
            className="w-full overflow-hidden mb-4 sm:mb-6 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.7, duration: 1 }}
          >
            <motion.div
              animate={{ x: [-2000, 0] }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex gap-4 whitespace-nowrap"
            >
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  className="font-display text-[18vw] leading-none tracking-tighter text-white/[0.06] select-none uppercase"
                >
                  CREATIVE • DEVELOPER • DESIGNER • STORYTELLER
                </span>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative inline-block">
            {/* Dark backdrop for better text visibility */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.3, duration: 0.8 }}
            />

            {/* Brutalist Frame */}
            <motion.div
              className="absolute -inset-2 sm:-inset-3 md:-inset-4 border border-white/20"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 4.5, duration: 1, ease: "easeOut" }}
            />

            <motion.h1
              className="font-display text-[11.5vw] sm:text-[13vw] md:text-[12vw] lg:text-[10vw] xl:text-[9vw] leading-none text-white will-change-transform text-center py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 relative z-10"
              style={{
                fontWeight: 900,
                letterSpacing: "-0.08em",
                textTransform: "uppercase",
                textShadow:
                  "0 0 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 0.7), 0 0 120px rgba(255, 255, 255, 0.2)",
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.1)",
              }}
              initial={{ y: 100, opacity: 0, scaleY: 0 }}
              animate={{ y: 0, opacity: 1, scaleY: 1 }}
              transition={{
                delay: 5,
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              DAREEAN
            </motion.h1>

            {/* Accent Lines - Editorial Style */}
            <motion.div
              className="absolute left-2 right-2 sm:left-3 sm:right-3 md:left-4 md:right-4 h-px bg-white"
              style={{ top: "1rem" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 5.5, duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
              className="absolute left-2 right-2 sm:left-3 sm:right-3 md:left-4 md:right-4 h-px bg-white"
              style={{ bottom: "1rem" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 5.5, duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Subtitle - Clean Editorial Style */}
        <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-[10px] sm:text-xs md:text-sm lg:text-base text-white/60 font-mono tracking-[0.15em] sm:tracking-[0.2em] text-center px-4 uppercase max-w-full">
          <motion.div
            className="border-l border-white/40 pl-3 sm:pl-4 inline-block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 6, duration: 0.8 }}
          >
            <span className="text-white/80 inline-block">
              Creative Developer
            </span>
            <span className="mx-2 sm:mx-3 text-white/30">/</span>
            <span className="text-white/80 inline-block">
              Digital Storyteller
            </span>
          </motion.div>
        </div>

        {/* Scroll Indicator - Brutalist Design */}
        <motion.div
          className="absolute bottom-16 sm:bottom-20 md:bottom-24 lg:bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6.5, duration: 1 }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              className="h-px w-6 sm:w-8 bg-white/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 7, duration: 0.5 }}
            />
            <span className="text-[9px] sm:text-[10px] md:text-xs text-white/60 tracking-[0.25em] sm:tracking-[0.3em] uppercase font-mono">
              Scroll
            </span>
            <motion.div
              className="h-px w-6 sm:w-8 bg-white/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 7, duration: 0.5 }}
            />
          </div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 sm:h-12 bg-gradient-to-b from-white/60 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
