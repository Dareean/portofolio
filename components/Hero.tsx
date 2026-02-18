"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import Image from "next/image";
import { useDeviceType, useIntroSeen } from "@/lib/hooks";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
const ROLES = [
  "Frontend Enthusiast",
  "UI/UX Enthusiast",
  "Lead Management",
  "Every Pixels Matters",
];
const BENTO_IMAGES = {
  main: "/assets/foto_closeup.jpg", // User's closeup photo
  topRight: "/assets/dreampos_showcase.jpeg", // Random project photo
  bottomRight: "/assets/greengnsulteng_web.png", // Another project photo
};
// Scramble text hook
function useScrambleText(finalText: string, startDelayMs: number) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const delayRef = useRef(startDelayMs);
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

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bentoMainRef = useRef<HTMLDivElement>(null);
  const bentoTopRef = useRef<HTMLDivElement>(null);
  const bentoBottomRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceType();
  const isIntroSeen = useIntroSeen();

  const baseDelay = isIntroSeen ? 0.5 : 4.8;
  const scrambleDelay = baseDelay * 1000;
  const { displayText, isComplete } = useScrambleText("DAREEAN", scrambleDelay);

  // Rotating roles
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
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

  // GSAP animation for bento grid
  useEffect(() => {
    if (
      !bentoMainRef.current ||
      !bentoTopRef.current ||
      !bentoBottomRef.current
    )
      return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      bentoMainRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1 },
    )
      .fromTo(
        bentoTopRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        "-=0.5",
      )
      .fromTo(
        bentoBottomRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        "-=0.5",
      );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-void-black"
    >
      <div className="absolute inset-0 bg-void-black" />
      <div className="hero-bottom-fade relative z-[3]" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full h-full flex items-center px-6 sm:px-8 md:px-12 lg:px-20"
      >
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-8 md:gap-12 lg:gap-20">
          {/* ── Left: Text content ── */}
          <div className="flex-1 flex flex-col items-start text-left">
            {/* Name — scramble effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay, duration: 0.3 }}
            >
              <h1
                className="font-sans text-[14vw] sm:text-[10vw] md:text-[7vw] lg:text-[6vw] leading-[0.9] text-off-white uppercase"
                style={{ fontWeight: 600, letterSpacing: "-0.04em" }}
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
                {!isComplete && (
                  <motion.span
                    className="text-off-white/50 font-light"
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

            {/* Divider line */}
            <motion.div
              className="w-12 h-px bg-off-white/20 mt-6 mb-5"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: baseDelay + 0.8, duration: 0.8 }}
              style={{ transformOrigin: "left" }}
            />

            {/* Tagline */}
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-off-white/50 font-light leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: baseDelay + 1.0, duration: 0.8 }}
            >
              Bringing stories to life,
              <br />
              one pixel at a time.
            </motion.p>

            {/* Rotating Role */}
            <motion.div
              className="mt-5 h-6 sm:h-7 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 1.4, duration: 0.8 }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentRoleIndex}
                  className="text-xs sm:text-sm text-off-white/25 font-light tracking-[0.15em] uppercase"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {ROLES[currentRoleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Right: Bento grid ── */}
          <div className="hidden md:flex flex-shrink-0 w-[320px] lg:w-[400px] h-[380px] lg:h-[460px] gap-3">
            {/* Left column — tall image */}
            <div
              ref={bentoMainRef}
              className="flex-1 relative rounded-2xl overflow-hidden"
              style={{ cursor: "pointer" }}
            >
              <Image
                src={BENTO_IMAGES.main}
                alt="Featured work"
                fill
                className="object-cover"
                sizes="240px"
                priority
              />
            </div>

            {/* Right column — 2 stacked images */}
            <div className="flex flex-col gap-3 w-[45%]">
              <div
                ref={bentoTopRef}
                className="relative flex-1 rounded-2xl overflow-hidden"
                style={{ cursor: "pointer" }}
              >
                <Image
                  src={BENTO_IMAGES.topRight}
                  alt="Project highlight"
                  fill
                  className="object-cover"
                  sizes="180px"
                  priority
                />
              </div>

              <div
                ref={bentoBottomRef}
                className="relative flex-1 rounded-2xl overflow-hidden"
                style={{ cursor: "pointer" }}
              >
                <Image
                  src={BENTO_IMAGES.bottomRight}
                  alt="Creative work"
                  fill
                  className="object-cover"
                  sizes="180px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-10 sm:bottom-14 flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: baseDelay + 2.0, duration: 1 }}
      >
        <motion.div className="w-5 h-8 rounded-full border border-off-white/25 flex items-start justify-center pt-1.5">
          <motion.div
            className="w-[3px] h-[3px] rounded-full bg-off-white/50"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
