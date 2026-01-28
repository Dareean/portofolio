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

          {/* Profile Photo */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border border-off-white/20 bg-off-white/5"
              whileHover={{ scale: 1.05, borderColor: "rgba(26, 26, 26, 0.4)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Placeholder - replace src with your actual photo
              <div className="w-full h-full bg-gradient-to-br from-off-white/10 to-off-white/5 flex items-center justify-center">
                <span className="text-off-white/30 text-4xl sm:text-5xl md:text-6xl font-display">D</span>
              </div> */}
              <Image
                src="/assets/foto_closeup.jpg"
                alt="Dareean"
                fill
                // className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
             
            </motion.div>
          </motion.div>

          {/* Typewriter role display */}
          <motion.div
            className="text-center px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-off-white/80 font-display">
              I am <Typewriter texts={roles} speed={80} deleteSpeed={40} pauseDuration={2500} />
            </p>
          </motion.div>

          {/* Role tags */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {["Build", "Design", "Innovate"].map((role, i) => (
              <motion.span
                key={role}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 border border-off-white/20 text-off-white/70 text-xs sm:text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300 cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {role}
              </motion.span>
            ))}
          </motion.div>

          {/* Bio text - large and centered */}
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5 md:space-y-6 px-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <p className="text-off-white/60 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
              I&apos;m a developer based in{" "}
              <span className="text-off-white font-medium">Palu, Indonesia</span> —
              driven by{" "}
              <span className="text-off-white font-medium">curiosity</span> and a constant desire to{" "}
              <span className="text-off-white font-medium">learn and grow</span>.
            </p>
            <p className="text-off-white/50 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
              Currently studying Informatics, I believe in learning by doing.
              Every project is a chance to push my limits and create something meaningful.
            </p>
          </motion.div>

          {/* Resume Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              onClick={() => {
                const pdfUrl = "/assets/CV-Rafi(English).pdf";
                // Open in new tab
                window.open(pdfUrl, "_blank");
                // Trigger download
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = "Dareean_Resume.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="group inline-flex items-center gap-3 px-8 py-4 border border-off-white/30 text-off-white text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg 
                className="w-5 h-5 transition-transform group-hover:translate-y-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
