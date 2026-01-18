"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

// Letter animation variants
const letterVariants = {
  hidden: { opacity: 0, y: 100, rotateX: 90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function AnimatedHeading({ text }: { text: string }) {
  const letters = text.split("");

  return (
    <motion.h2
      className="font-display text-5xl md:text-7xl lg:text-8xl text-off-white leading-none"
      style={{ perspective: 1000 }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          className="inline-block origin-bottom"
          style={{ display: letter === " " ? "inline" : "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h2>
  );
}

export default function AboutMe() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={containerRef}
      className="py-32 md:py-48 px-8 md:px-16 relative overflow-hidden"
    >
      {/* Subtle monochrome background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Large background text */}
        <motion.div
          className="absolute -top-20 -left-10 font-display text-[15vw] text-off-white/[0.02] uppercase tracking-tighter pointer-events-none select-none whitespace-nowrap"
          style={{ y: textY }}
        >
          ABOUT
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Image Column - Takes 5 columns */}
          <motion.div
            className="lg:col-span-5 relative"
            style={{ y: imageY }}
          >
            <div className="relative">
              {/* Main image */}
              <motion.div
                className="relative aspect-[3/4] overflow-hidden"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
                  alt="Portrait"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Decorative frame */}
              <motion.div
                className="absolute -inset-4 border border-off-white/20 -z-10"
                initial={{ opacity: 0, scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />

              {/* Decorative dots */}
              <motion.div
                className="absolute -top-8 -left-8 grid grid-cols-3 gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-off-white/30"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Content Column - Takes 7 columns */}
          <div className="lg:col-span-7 lg:pl-12 space-y-8">
            {/* Animated label */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full border border-off-white/30 flex items-center justify-center"
                whileHover={{ scale: 1.1, borderColor: "rgba(255,255,255,0.6)" }}
              >
                <span className="text-xl">👋</span>
              </motion.div>
              <div className="flex items-center gap-4">
                <motion.div
                  className="h-px bg-gradient-to-r from-off-white/60 to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: 60 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                <span className="text-off-white/50 text-sm tracking-[0.3em] uppercase">
                  Introduction
                </span>
              </div>
            </motion.div>

            {/* Main heading with animated letters */}
            <div className="space-y-2">
              <AnimatedHeading text="Hi, I'm" />
              <motion.div
                className="relative inline-block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <span className="font-display text-5xl md:text-7xl lg:text-8xl text-off-white">
                  Dareean
                </span>
                {/* Underline accent */}
                <motion.div
                  className="absolute -bottom-2 left-0 h-[2px] bg-off-white/60"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </motion.div>
            </div>

            {/* Role tags */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              {["Developer", "Designer", "Creator"].map((role, i) => (
                <motion.span
                  key={role}
                  className="px-4 py-2 border border-off-white/20 text-off-white/70 text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {role}
                </motion.span>
              ))}
            </motion.div>

            {/* Bio text */}
            <motion.div
              className="space-y-4 text-off-white/60 text-lg leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <p>
                I'm a developer and designer based in{" "}
                <span className="text-off-white font-medium">Indonesia</span>,
                passionate about crafting digital experiences that blend{" "}
                <span className="text-off-white font-medium">aesthetics</span> with{" "}
                <span className="text-off-white font-medium">functionality</span>.
              </p>
              <p>
                With expertise in full-stack development and UI/UX design, I build
                modern applications that solve real problems while delivering
                exceptional user experiences.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex gap-8 md:gap-16 pt-8 border-t border-off-white/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
            >
              {[
                { value: "20+", label: "Projects Completed" },
                { value: "10+", label: "Happy Clients" },
                { value: "∞", label: "Ideas & Concepts" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="group cursor-default"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3 + i * 0.15 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.span
                    className="font-display text-3xl md:text-4xl text-off-white block group-hover:text-off-white/80 transition-colors"
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-off-white/40 text-xs tracking-widest uppercase mt-1 block">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
