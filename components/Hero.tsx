"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useDeviceType, getAnimationConfig } from "@/lib/hooks";
import ShootingStars from "./ShootingStars";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  const deviceInfo = useDeviceType();
  const animConfig = getAnimationConfig(deviceInfo);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Reduce parallax on mobile for better performance
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", deviceInfo.isMobile ? "15%" : "30%"],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100vh] sm:h-[110vh] md:h-[120vh] flex items-center justify-center overflow-hidden bg-void-black"
    >
      {/* Shooting Stars */}
      <ShootingStars />

      {/* Aurora blur background - Always visible */}
      <div className="absolute inset-0 bg-void-black overflow-hidden">
        {/* Aurora gradient orbs */}
        <motion.div
          className="absolute top-0 -left-1/4 w-[80vw] h-[80vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0) 70%)",
            filter: "blur(80px)",
            opacity: 0.5,
            willChange: deviceInfo.prefersReducedMotion
              ? "auto"
              : "transform",
          }}
          animate={
            animConfig.enabled
              ? {
                  x: [0, 60, 0],
                  y: [0, 40, 0],
                  scale: [1, 1.15, 1],
                }
              : {}
          }
          transition={{
            duration: deviceInfo.isMobile ? 20 : 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.45) 0%, rgba(34, 197, 94, 0) 70%)",
            filter: "blur(100px)",
            opacity: 0.45,
            willChange: deviceInfo.prefersReducedMotion
              ? "auto"
              : "transform",
          }}
          animate={
            animConfig.enabled
              ? {
                  x: [0, -50, 0],
                  y: [0, 60, 0],
                  scale: [1, 1.2, 1],
                }
              : {}
          }
          transition={{
            duration: deviceInfo.isMobile ? 24 : 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        {/* Additional orbs on desktop */}
        {!deviceInfo.isMobile && (
          <>
            <motion.div
              className="absolute bottom-0 left-1/4 w-[75vw] h-[75vw] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(168, 85, 247, 0) 70%)",
                filter: "blur(90px)",
                opacity: 0.4,
                willChange: deviceInfo.prefersReducedMotion
                  ? "auto"
                  : "transform",
              }}
              animate={
                animConfig.enabled
                  ? {
                      x: [0, -40, 0],
                      y: [0, -50, 0],
                      scale: [1, 1.25, 1],
                    }
                  : {}
              }
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
            />
            <motion.div
              className="absolute top-1/3 right-1/3 w-[60vw] h-[60vw] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(14, 165, 233, 0.45) 0%, rgba(14, 165, 233, 0) 70%)",
                filter: "blur(80px)",
                opacity: 0.35,
                willChange: deviceInfo.prefersReducedMotion
                  ? "auto"
                  : "transform",
              }}
              animate={
                animConfig.enabled
                  ? {
                      x: [0, 70, 0],
                      y: [0, -40, 0],
                      scale: [1, 1.15, 1],
                    }
                  : {}
              }
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 6,
              }}
            />
          </>
        )}
      </div>

      {/* Minimal decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle corner accents */}
        <motion.div
          className="absolute top-8 left-8 w-16 h-16 border-l border-t border-off-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: animConfig.enabled ? 4.5 : 0.5,
            duration: animConfig.duration,
          }}
        />
        <motion.div
          className="absolute top-8 right-8 w-16 h-16 border-r border-t border-off-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: animConfig.enabled ? 4.6 : 0.5,
            duration: animConfig.duration,
          }}
        />
        <motion.div
          className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-off-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: animConfig.enabled ? 4.7 : 0.5,
            duration: animConfig.duration,
          }}
        />
        <motion.div
          className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-off-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: animConfig.enabled ? 4.8 : 0.5,
            duration: animConfig.duration,
          }}
        />
      </div>

      {/* Bottom Gradient Fade to blend with next section */}
      <div className="hero-bottom-fade" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full h-full flex items-center justify-center px-6 sm:px-8"
      >
        {/* Main Content Container - Perfectly Centered */}
        <div className="flex flex-col items-center justify-center text-center w-full">
          {/* Elegant Name - Blur to Focus Animation */}
          <motion.h1
            className="font-display text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] leading-none text-off-white uppercase"
            style={{
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
            initial={{
              opacity: 0,
              filter: "blur(20px)",
              scale: 1.05,
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              scale: 1,
            }}
            transition={{
              delay: 4.8,
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Dareean
          </motion.h1>

          {/* Subtle divider line */}
          <motion.div
            className="w-12 sm:w-16 h-px bg-off-white/40 my-5 sm:my-6"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 5.8, duration: 0.8 }}
          />

          {/* Tagline - Simple Fade Up */}
          <motion.p
            className="text-xs sm:text-sm md:text-base text-off-white/60 font-light tracking-[0.15em] uppercase"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 6.2, duration: 0.8, ease: "easeOut" }}
          >
            Creative Developer & Digital Storyteller
          </motion.p>

          {/* Descriptor - Word by Word Reveal */}
          <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-x-1.5">
            {[
              "Bringing",
              "stories",
              "to",
              "life",
              "one",
              "pixel",
              "at",
              "a",
              "time",
            ].map((word, index) => (
              <motion.span
                key={word}
                className="text-[10px] sm:text-xs text-off-white/35 font-light tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 6.6 + index * 0.15,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6.2, duration: 1 }}
        >
          <span className="text-[10px] sm:text-xs text-off-white/40 tracking-[0.2em] uppercase font-light">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-off-white/40 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
