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
      className="relative h-[150vh] flex items-start justify-center overflow-hidden"
    >
      <motion.div
        style={{ y, opacity }}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center will-change-transform"
      >
        {/* Main Title with Mask Reveal */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-[15vw] leading-none tracking-tighter text-off-white will-change-transform"
            variants={textRevealVariants}
            initial="hidden"
            animate="visible"
          >
            DAREEAN
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="mt-8 text-lg md:text-xl text-off-white/60 font-sans tracking-widest uppercase"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Logic meets Aesthetics
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-xs text-off-white/40 tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-off-white/40 to-transparent"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
