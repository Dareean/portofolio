"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { useDeviceType, getAnimationConfig, useIntroSeen } from "@/lib/hooks";
import ShootingStars from "./ShootingStars";

// Scramble text characters
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

// Role titles for rotation
const ROLES = [
  "Frontend Developer",
  "UI/UX Enthusiast",
  "Creative Problem Solver",
  "Storyteller through Code",
];

// Scramble text hook - uses ref to avoid re-triggering on delay changes
function useScrambleText(finalText: string, startDelayMs: number) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const delayRef = useRef(startDelayMs);

  // Always use the latest delay but don't re-trigger effect
  delayRef.current = startDelayMs;

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const timer = setTimeout(() => {
      let iteration = 0;
      const totalIterations = finalText.length * 3;

      intervalId = setInterval(() => {
        const resolvedCount = Math.floor(iteration / 3);

        const text = finalText
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < resolvedCount) return char;
            if (i <= resolvedCount + 2) {
              return SCRAMBLE_CHARS[
                Math.floor(Math.random() * SCRAMBLE_CHARS.length)
              ];
            }
            return " ";
          })
          .join("");

        setDisplayText(text);
        iteration++;

        if (iteration > totalIterations) {
          setDisplayText(finalText);
          setIsComplete(true);
          clearInterval(intervalId);
        }
      }, 65);
    }, delayRef.current);

    return () => {
      clearTimeout(timer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [finalText]);

  return { displayText, isComplete };
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  const deviceInfo = useDeviceType();
  const animConfig = getAnimationConfig(deviceInfo);
  const isIntroSeen = useIntroSeen();

  // Animation Delays
  const baseDelay = isIntroSeen ? 0.5 : 4.8;
  const scrambleDelay = baseDelay * 1000; // Start scramble exactly when wrapper becomes visible

  // Scramble text effect
  const { displayText, isComplete } = useScrambleText(
    "DAREEAN",
    scrambleDelay,
  );

  // Rotating roles
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Start role rotation after scramble completes
  useEffect(() => {
    if (!isComplete) return;

    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isComplete]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

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

      {/* Aurora blur background - Light mode only */}
      <div className="absolute inset-0 bg-void-black overflow-hidden">
        {theme !== 'dark' && (
          <>
            {/* Aurora gradient orbs */}
            <motion.div
              className="absolute top-0 -left-1/4 w-[80vw] h-[80vw] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0) 70%)",
                filter: "blur(80px)",
                opacity: 0.5,
                willChange: deviceInfo.prefersReducedMotion ? "auto" : "transform",
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
                willChange: deviceInfo.prefersReducedMotion ? "auto" : "transform",
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
          </>
        )}
      </div>

      {/* Bottom Gradient Fade to blend with next section */}
      <div className="hero-bottom-fade" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full h-full flex items-center justify-center px-6 sm:px-8"
      >
        {/* Main Content Container - Shifted up for scroll indicator visibility */}
        <div className="flex flex-col items-center justify-center text-center w-full -mt-24 sm:-mt-32">
          {/* Scramble Text Name */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay, duration: 0.3 }}
          >
            <h1
              className="font-display text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] leading-none text-off-white uppercase"
              style={{
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              {displayText.split("").map((char, i) => (
                <span
                  key={i}
                  className={
                    isComplete
                      ? ""
                      : i ===
                          Math.floor(
                            displayText.replace(/\s+$/g, "").length - 1,
                          )
                        ? "text-off-white"
                        : displayText[i] === "DAREEAN"[i]
                          ? "text-off-white"
                          : "text-off-white/40"
                  }
                >
                  {char}
                </span>
              ))}
              {/* Blinking cursor during scramble */}
              {!isComplete && (
                <motion.span
                  className="text-off-white/60 font-light"
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  _
                </motion.span>
              )}
            </h1>
          </motion.div>

          {/* Subtle divider line */}
          <motion.div
            className="w-12 sm:w-16 h-px bg-off-white/40 my-5 sm:my-6"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: baseDelay + 1.0, duration: 0.8 }}
          />

          {/* Rotating Role Titles */}
          <motion.div
            className="h-8 sm:h-10 overflow-hidden relative"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: baseDelay + 1.2,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentRoleIndex}
                className="text-sm sm:text-base md:text-lg text-off-white/60 font-light tracking-[0.1em] uppercase"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {ROLES[currentRoleIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Static tagline below roles */}
          <motion.p
            className="mt-4 text-[10px] sm:text-xs text-off-white/30 tracking-[0.2em] uppercase font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 1.6, duration: 1 }}
          >
            Bringing Stories to life, one pixel at a time
          </motion.p>
        </div>
      </motion.div>

      {/* Enhanced Scroll Indicator — positioned from top to stay within viewport */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        style={{ top: "85vh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: baseDelay + 2.0, duration: 1 }}
      >
        {/* Mouse icon outline */}
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-off-white/40 flex items-start justify-center pt-2"
          animate={{ borderColor: ["rgba(255,255,255,0.4)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.4)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-off-white/60"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <span className="text-[10px] sm:text-xs text-off-white/50 tracking-[0.25em] uppercase font-light">
          Scroll to Explore
        </span>
      </motion.div>
    </section>
  );
}

