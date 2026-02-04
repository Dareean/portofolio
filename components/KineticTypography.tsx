"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function KineticTypography() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Transform text based on scroll
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const x4 = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Corner Ornaments - Editorial Style - Responsive */}
      <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-l border-t sm:border-l-2 sm:border-t-2 border-white/20 pointer-events-none" />
      <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-r border-t sm:border-r-2 sm:border-t-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-l border-b sm:border-l-2 sm:border-b-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-r border-b sm:border-r-2 sm:border-b-2 border-white/20 pointer-events-none" />

      {/* Architectural Grid Lines - Responsive density */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vertical Lines - Less dense on mobile */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-white/5 hidden sm:block"
            style={{ left: `${(i + 1) * 5}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Mobile - Fewer vertical lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`v-mobile-${i}`}
            className="absolute top-0 bottom-0 w-px bg-white/5 sm:hidden"
            style={{ left: `${(i + 1) * 12}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Horizontal Lines - Fewer on mobile */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-white/5 hidden sm:block"
            style={{ top: `${(i + 1) * 8}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.15, 0.05] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Mobile - Fewer horizontal lines */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`h-mobile-${i}`}
            className="absolute left-0 right-0 h-px bg-white/5 sm:hidden"
            style={{ top: `${(i + 1) * 15}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Kinetic Typography Layers - Optimized for mobile */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
        {/* Layer 1 - Moving Right */}
        <motion.div
          style={{ x: x1 }}
          className="whitespace-nowrap will-change-transform"
        >
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-flex items-center gap-4 sm:gap-6 md:gap-8"
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="font-display text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none tracking-tighter text-white/[0.04] sm:text-white/[0.06] select-none"
              >
                DAREEAN
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Layer 2 - Moving Left (Opposite direction) */}
        <motion.div
          style={{ x: x2 }}
          className="whitespace-nowrap will-change-transform -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-12"
        >
          <motion.div
            animate={{ x: [-2000, 0] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-flex items-center gap-4 sm:gap-6 md:gap-8"
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="font-display text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none tracking-tighter text-white/[0.03] sm:text-white/[0.04] select-none"
              >
                CREATIVE
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Layer 3 - Moving Right (Slower) */}
        <motion.div
          style={{ x: x3 }}
          className="whitespace-nowrap will-change-transform -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-12"
        >
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-flex items-center gap-4 sm:gap-6 md:gap-8"
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="font-display text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none tracking-tighter text-white/[0.04] sm:text-white/[0.05] select-none"
              >
                DEVELOPER
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Layer 4 - Moving Left (Fast) */}
        <motion.div
          style={{ x: x4 }}
          className="whitespace-nowrap will-change-transform -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-12"
        >
          <motion.div
            animate={{ x: [-2000, 0] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-flex items-center gap-4 sm:gap-6 md:gap-8"
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="font-display text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none tracking-tighter text-white/[0.03] sm:text-white/[0.04] select-none"
              >
                STORYTELLER
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Accent Lines - Dynamic - More subtle on mobile */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 sm:via-white/15 to-transparent"
        style={{ top: "30%" }}
        animate={{
          scaleX: [0.8, 1, 0.8],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 sm:via-white/15 to-transparent"
        style={{ bottom: "30%" }}
        animate={{
          scaleX: [0.8, 1, 0.8],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </div>
  );
}
