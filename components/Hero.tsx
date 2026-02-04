"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import MoireEffect from "./MoireEffect";

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
      {/* Moiré Effect Background */}
      <MoireEffect />

      {/* Bottom Gradient Fade to blend with AboutMe */}
      <div className="hero-bottom-fade" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 sticky top-0 h-screen w-full flex flex-col items-center justify-center will-change-transform px-4"
      >
        {/* Main Title - Pure Mathematical/Geometric */}
        <div className="overflow-hidden relative">
          {/* Mathematical Grid Frame */}
          <motion.div
            className="absolute -inset-8 grid grid-cols-3 grid-rows-3 gap-px"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.5, duration: 1 }}
          >
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-white/10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 4.5 + i * 0.1,
                  duration: 0.5,
                  type: "spring",
                }}
              />
            ))}
          </motion.div>

          <motion.h1
            className="font-display text-[18vw] sm:text-[16vw] md:text-[14vw] leading-none tracking-[0.02em] text-white will-change-transform text-center py-8 px-6 relative"
            style={{
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 5,
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            DAREEAN
          </motion.h1>

          {/* Precise Mathematical Lines */}
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-white/80"
            style={{ top: 0 }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 5.8, duration: 1, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-0 right-0 h-[1px] bg-white/80"
            style={{ bottom: 0 }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 5.8, duration: 1, ease: "easeInOut" }}
          />

          {/* Corner Markers - Mathematical precision */}
          <motion.div
            className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/60"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 6, duration: 0.3 }}
          />
          <motion.div
            className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/60"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 6.1, duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/60"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 6.2, duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/60"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 6.3, duration: 0.3 }}
          />
        </div>

        {/* Subtitle - Minimalist Mathematical */}
        <div className="mt-12 sm:mt-14 md:mt-16 text-xs sm:text-sm text-white/50 font-mono tracking-[0.3em] text-center px-4 uppercase">
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 6.5, duration: 1 }}
          >
            <motion.div
              className="h-px w-12 bg-white/30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 6.7, duration: 0.6 }}
            />
            <span className="text-white/70">[ 01 ]</span>
            <span className="text-white/90">Creative Developer</span>
            <span className="text-white/70">[ 02 ]</span>
            <motion.div
              className="h-px w-12 bg-white/30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 6.7, duration: 0.6 }}
            />
          </motion.div>
        </div>

        {/* Scroll Indicator - Geometric/Mathematical */}
        <motion.div
          className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 7, duration: 1 }}
        >
          {/* Geometric Frame */}
          <div className="relative">
            <motion.div
              className="w-12 h-12 border border-white/30 rotate-45"
              animate={{
                rotate: [45, 225, 45],
                borderColor: [
                  "rgba(255,255,255,0.3)",
                  "rgba(255,255,255,0.6)",
                  "rgba(255,255,255,0.3)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-1 h-1 bg-white/60 rounded-full" />
            </motion.div>
          </div>

          {/* Mathematical Notation */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-white/40 font-mono tracking-widest">
              [SCROLL]
            </span>
            <div className="flex items-center gap-2 text-[8px] text-white/30 font-mono">
              <span>∞</span>
              <motion.div
                className="h-px w-4 bg-white/30"
                animate={{ scaleX: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>∞</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
