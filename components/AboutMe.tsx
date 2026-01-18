"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

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

  const roles = ["Developer", "Designer", "Creator", "Problem Solver"];

  return (
    <section
      ref={containerRef}
      className="py-32 md:py-48 px-8 md:px-16 relative overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
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
          className="absolute -top-20 left-0 right-0 font-display text-[20vw] text-off-white/[0.02] uppercase tracking-tighter pointer-events-none select-none text-center"
          style={{ y: textY }}
        >
          ABOUT
        </motion.div>

        {/* Main content - Typography focused */}
        <div className="relative space-y-16">
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
          <div className="text-center space-y-6">
            <div className="overflow-hidden">
              <motion.h2
                className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-off-white leading-[0.9]"
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Hi, I'm
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                className="font-display text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] text-off-white leading-[0.9]"
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                DAREEAN
              </motion.h2>
            </div>
          </div>

          {/* Typewriter role display */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-2xl md:text-3xl lg:text-4xl text-off-white/80 font-display">
              I am a <Typewriter texts={roles} speed={80} deleteSpeed={40} pauseDuration={2500} />
            </p>
          </motion.div>

          {/* Role tags */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {["Developer", "Designer", "Creator"].map((role, i) => (
              <motion.span
                key={role}
                className="px-6 py-3 border border-off-white/20 text-off-white/70 text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300 cursor-default"
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
            className="max-w-3xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <p className="text-off-white/60 text-xl md:text-2xl leading-relaxed">
              I'm a developer and designer based in{" "}
              <span className="text-off-white font-medium">Indonesia</span>,
              passionate about crafting digital experiences that blend{" "}
              <span className="text-off-white font-medium">aesthetics</span> with{" "}
              <span className="text-off-white font-medium">functionality</span>.
            </p>
            <p className="text-off-white/50 text-lg md:text-xl leading-relaxed">
              With expertise in full-stack development and UI/UX design, I build
              modern applications that solve real problems while delivering
              exceptional user experiences.
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
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
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
            </motion.a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap justify-center gap-12 md:gap-20 pt-12 border-t border-off-white/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            {[
              { value: "20+", label: "Projects" },
              { value: "10+", label: "Clients" },
              { value: "5+", label: "Years" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1 + i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <motion.span className="font-display text-5xl md:text-6xl text-off-white block">
                  {stat.value}
                </motion.span>
                <span className="text-off-white/40 text-sm tracking-widest uppercase mt-2 block">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
