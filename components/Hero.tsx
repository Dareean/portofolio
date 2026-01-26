"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax: text moves slower than scroll (0.5x speed)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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

  return (
    <section
      ref={containerRef}
      className="relative h-[120vh] sm:h-[130vh] md:h-[150vh] flex items-start justify-center overflow-hidden px-4 sm:px-6"
    >
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
          className="mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg lg:text-xl text-off-white/60 font-sans tracking-widest uppercase text-center px-4"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Logic meets Aesthetics
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
