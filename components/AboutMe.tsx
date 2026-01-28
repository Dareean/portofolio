"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

// Typewriter component
function Typewriter({ 
  texts, 
  speed = 100, 
  deleteSpeed = 50,
  pauseDuration = 2000 
}: { 
  texts: string[]; 
  speed?: number; 
  deleteSpeed?: number;
  pauseDuration?: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      } else {
        const timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(timer);
      }
    } else {
      if (displayText === currentText) {
        setIsPaused(true);
      } else {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, speed);
        return () => clearTimeout(timer);
      }
    }
  }, [displayText, textIndex, isDeleting, isPaused, texts, speed, deleteSpeed, pauseDuration]);

  return (
    <span className="inline-flex items-center">
      <span>{displayText}</span>
      <motion.span
        className="inline-block w-[3px] h-[1em] bg-off-white ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  );
}

export default function AboutMe() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const roles = [
    "Building Digital Solutions",
    "Crafting User Experiences",
    "Turning Ideas into Reality",
    "A Curious Developer"
  ];

  return (
    <section
      ref={containerRef}
      className="py-16 sm:py-24 md:py-32 lg:py-48 px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Large background text */}
        <motion.div
          className="absolute -top-10 sm:-top-16 md:-top-20 left-0 right-0 font-display text-[25vw] sm:text-[22vw] md:text-[20vw] text-off-white/[0.02] uppercase tracking-tighter pointer-events-none select-none text-center"
          style={{ y: textY }}
        >
          ABOUT
        </motion.div>

        {/* Main content - Typography focused */}
        <div className="relative space-y-8 sm:space-y-12 md:space-y-16">
          {/* Intro label */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="h-px bg-off-white/30"
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <span className="text-off-white/50 text-sm tracking-[0.3em] uppercase">
              About Me
            </span>
            <motion.div
              className="h-px bg-off-white/30"
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>

          {/* Large typographic intro */}
          <div className="text-center space-y-3 sm:space-y-4 md:space-y-6">
            <div className="overflow-hidden">
              <motion.h2
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-off-white leading-[0.9]"
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Hi, I&apos;m
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] text-off-white leading-[0.9]"
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                DAREEAN
              </motion.h2>
            </div>
          </div>

          {/* Profile Photo - Enhanced with animated ring and floating elements */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative group">
              {/* Floating decorative elements - hidden on very small screens */}
              <motion.div
                className="hidden sm:block absolute -top-4 -right-4 w-3 h-3 rounded-full bg-off-white/20"
                animate={{ y: [-5, 5, -5], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="hidden sm:block absolute -bottom-2 -left-6 w-2 h-2 rounded-full bg-off-white/30"
                animate={{ y: [5, -5, 5], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.div
                className="hidden md:block absolute top-1/2 -right-8 w-1.5 h-1.5 rounded-full bg-off-white/25"
                animate={{ x: [-3, 3, -3], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />

              {/* Animated gradient ring */}
              <motion.div
                className="absolute -inset-2 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute -inset-2 rounded-full bg-void-black" />
              
              {/* Image container */}
              <motion.div 
                className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden border border-off-white/20"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src="/assets/foto_closeup.jpg"
                  alt="Dareean"
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                />
                {/* Hover overlay with tagline */}
                <div className="absolute inset-0 bg-void-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-off-white text-sm sm:text-base font-light tracking-wider">Let&apos;s build something</span>
                </div>
              </motion.div>

              {/* Status badge */}
              <motion.div
                className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 bg-void-black border border-off-white/20 rounded-full"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <span className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-off-white/60">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden xs:inline">Open to work</span>
                  <span className="xs:hidden">Available</span>
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Typewriter - Larger and more prominent */}
          <motion.div
            className="text-center pt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-off-white/70 font-display tracking-wide">
              <Typewriter texts={roles} speed={80} deleteSpeed={40} pauseDuration={2500} />
            </p>
          </motion.div>

          {/* Role tags - Minimal style */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {["Build", "Design", "Innovate"].map((tag, i) => (
              <motion.span
                key={tag}
                className="px-4 py-1.5 text-xs tracking-widest uppercase text-off-white/40 border border-off-white/10 rounded-full hover:border-off-white/30 hover:text-off-white/60 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Bio - Enhanced with card and decorations */}
          <motion.div
            className="max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto px-2 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="relative px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 rounded-xl sm:rounded-2xl border border-off-white/10 bg-off-white/[0.02]">
              {/* Decorative quote mark */}
              <span className="absolute -top-2 sm:-top-3 left-4 sm:left-6 text-3xl sm:text-4xl md:text-5xl text-off-white/10 font-serif">&ldquo;</span>
              
              {/* Main quote text */}
              <p className="text-off-white/60 text-base sm:text-lg md:text-xl leading-relaxed text-center italic">
                Developer from <span className="text-off-white not-italic font-medium">Palu, Indonesia</span> — driven by curiosity, learning by doing.
              </p>
              
              {/* Additional line */}
              <p className="text-off-white/40 text-sm sm:text-base mt-3 text-center">
                Every project is a chance to grow and create something meaningful.
              </p>

              {/* Decorative closing quote */}
              <span className="absolute -bottom-2 sm:-bottom-3 right-4 sm:right-6 text-3xl sm:text-4xl md:text-5xl text-off-white/10 font-serif">&rdquo;</span>
              
              {/* Subtle corner accents */}
              <div className="hidden sm:block absolute top-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-t border-l border-off-white/10 rounded-tl-xl sm:rounded-tl-2xl" />
              <div className="hidden sm:block absolute bottom-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-b border-r border-off-white/10 rounded-br-xl sm:rounded-br-2xl" />
            </div>
          </motion.div>

          {/* Action row: Resume + Social Links */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            {/* Resume Button */}
            <motion.button
              onClick={() => {
                const pdfUrl = "/assets/CV-Rafi(English).pdf";
                window.open(pdfUrl, "_blank");
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = "Dareean_Resume.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-off-white/20 text-off-white/70 text-xs sm:text-sm tracking-wider uppercase hover:bg-off-white hover:text-void-black hover:border-off-white transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg 
                className="w-4 h-4 transition-transform group-hover:translate-y-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </motion.button>

            {/* Divider */}
            <span className="hidden sm:block w-px h-6 bg-off-white/10" />

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Dareean"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 rounded-full border border-off-white/10 text-off-white/40 hover:border-off-white/30 hover:text-off-white/70 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/dareean"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-off-white/10 text-off-white/40 hover:border-off-white/30 hover:text-off-white/70 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:dmardin@gmail.com"
                className="p-2.5 rounded-full border border-off-white/10 text-off-white/40 hover:border-off-white/30 hover:text-off-white/70 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
