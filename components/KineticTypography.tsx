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

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Corner Ornaments - Editorial Style */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-white/20 pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-white/20 pointer-events-none" />

      {/* Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vertical Lines */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-white/5"
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

        {/* Horizontal Lines */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-white/5"
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
      </div>

      {/* Kinetic Typography Layers */}
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
            className="inline-flex items-center gap-8"
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="font-display text-[20vw] md:text-[15vw] lg:text-[12vw] leading-none tracking-tighter text-white/10 select-none"
              >
                DAREEAN
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Layer 2 - Moving Left (Opposite direction) */}
        <motion.div
          style={{ x: x2 }}
          className="whitespace-nowrap will-change-transform -mt-8 md:-mt-12"
        >
          <motion.div
            animate={{ x: [-2000, 0] }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-flex items-center gap-8"
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="font-display text-[20vw] md:text-[15vw] lg:text-[12vw] leading-none tracking-tighter text-white/5 select-none"
              >
                CREATIVE
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Layer 3 - Moving Right (Slower) */}
        <motion.div
          style={{ x: x3 }}
          className="whitespace-nowrap will-change-transform -mt-8 md:-mt-12"
        >
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-flex items-center gap-8"
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="font-display text-[20vw] md:text-[15vw] lg:text-[12vw] leading-none tracking-tighter text-white/8 select-none"
              >
                DEVELOPER
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Accent Lines - Dynamic */}
      <motion.div
        className="absolute left-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ top: "30%" }}
        animate={{
          scaleX: [0.8, 1, 0.8],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ bottom: "30%" }}
        animate={{
          scaleX: [0.8, 1, 0.8],
          opacity: [0.3, 0.6, 0.3],
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
