"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

// Generate floating particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.1,
  }));
};

// Counter animation hook
function useCountUp(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true,
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return { count, ref, setHasStarted };
}

// 3D Tilt Card Component
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
}

export default function AboutMe() {
  const containerRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  // Detect mobile for performance optimization
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const particles = useMemo(
    () => generateParticles(isMobile ? 15 : 30),
    [isMobile],
  );
  const particleColor = theme === "dark" ? "255,255,255" : "14,15,25";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Counter states
  const projectsCounter = useCountUp(10, 1500);
  const experienceCounter = useCountUp(2, 1500);

  // Aurora colors based on theme
  const auroraColors =
    theme === "dark"
      ? {
          blob1: "rgba(87, 136, 108, 0.15)",
          blob2: "rgba(129, 166, 132, 0.1)",
          blob3: "rgba(70, 96, 96, 0.12)",
        }
      : {
          blob1: "rgba(87, 136, 108, 0.1)",
          blob2: "rgba(129, 166, 132, 0.08)",
          blob3: "rgba(248, 199, 204, 0.1)",
        };

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden"
    >
      {/* Top Gradient Overlay - Covers Hero section smoothly */}
      <div className="about-top-fade" />

      {/* Aurora Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/4 w-[60vw] h-[60vw] rounded-full will-change-transform"
          style={{
            background: `radial-gradient(circle, ${auroraColors.blob1} 0%, transparent 70%)`,
            filter: isMobile ? "blur(30px)" : "blur(60px)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-[50vw] h-[50vw] rounded-full will-change-transform"
          style={{
            background: `radial-gradient(circle, ${auroraColors.blob2} 0%, transparent 70%)`,
            filter: isMobile ? "blur(40px)" : "blur(80px)",
          }}
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 w-[45vw] h-[45vw] rounded-full will-change-transform"
          style={{
            background: `radial-gradient(circle, ${auroraColors.blob3} 0%, transparent 60%)`,
            filter: isMobile ? "blur(35px)" : "blur(70px)",
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 30, -15, 0],
            scale: [1, 1.15, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: `rgba(${particleColor}, ${particle.opacity})`,
              boxShadow: `0 0 ${particle.size * 2}px rgba(${particleColor}, ${particle.opacity * 0.5})`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [
                particle.opacity * 0.5,
                particle.opacity,
                particle.opacity * 0.5,
              ],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Parallax floating elements */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-off-white/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-48 h-48 bg-off-white/[0.02] rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header - Journey style with icon + line */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.span
              className="text-2xl sm:text-3xl"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              👋
            </motion.span>
            <motion.div
              className="h-px flex-1 bg-gradient-to-r from-off-white/20 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-off-white mb-3">
            About Me
          </h2>
          <p className="text-off-white/50 text-sm sm:text-base md:text-lg max-w-xl">
            Developer from Palu, Indonesia — driven by curiosity, learning by
            doing.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
          {/* Profile Card - Left Side */}
          <motion.div
            className="md:col-span-5 lg:col-span-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <TiltCard className="h-full">
              <div className="relative h-full min-h-[320px] sm:min-h-[380px] rounded-2xl border border-off-white/[0.06] bg-off-white/[0.015] backdrop-blur-sm p-6 sm:p-8 flex flex-col items-center justify-center group hover:border-off-white/15 transition-all duration-500 overflow-hidden">
                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
                    backgroundSize: "250% 250%",
                  }}
                  animate={{
                    backgroundPosition: ["200% 0%", "-50% 0%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />

                {/* Animated gradient ring */}
                <div className="relative mb-6">
                  <motion.div
                    className="absolute -inset-3 rounded-full opacity-60"
                    style={{
                      background:
                        "conic-gradient(from 0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.2), rgba(255,255,255,0.05), rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="absolute -inset-3 rounded-full bg-void-black" />

                  <motion.div
                    className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border border-off-white/20"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src="/assets/foto_closeup.jpg"
                      alt="Dareean"
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    {/* Subtle glow overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-void-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </div>

                {/* Name & Status with stagger */}
                <motion.h3
                  className="font-display text-2xl sm:text-3xl text-off-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  DAREEAN
                </motion.h3>
                <motion.p
                  className="text-off-white/50 text-sm mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  Developer & Designer
                </motion.p>

                {/* Status badge with pulse */}
                <motion.div
                  className="px-3 py-1.5 bg-void-black border border-off-white/20 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex items-center gap-2 text-xs text-off-white/60">
                    <motion.span
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.7, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Open to work
                  </span>
                </motion.div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Right Side - Bio & Stats */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4 sm:gap-5 md:gap-6">
            {/* Bio Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <TiltCard>
                <div className="relative rounded-2xl border border-off-white/[0.06] bg-off-white/[0.015] backdrop-blur-sm p-6 sm:p-8 hover:border-off-white/15 transition-all duration-500 overflow-hidden group">
                  {/* Animated corner accents */}
                  <motion.div
                    className="absolute top-0 left-0 w-12 h-12 border-t border-l border-off-white/20 rounded-tl-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-off-white/20 rounded-br-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  />

                  <motion.span
                    className="absolute top-4 left-6 text-4xl sm:text-5xl text-off-white/10 font-serif"
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    &ldquo;
                  </motion.span>
                  <div className="pt-6 sm:pt-8">
                    <p className="text-off-white/70 text-base sm:text-lg md:text-xl leading-relaxed mb-4">
                      Every project is a chance to grow and create something
                      meaningful. I believe in building with purpose — turning
                      ideas into
                      <span className="text-off-white font-medium">
                        {" "}
                        pixel-perfect reality
                      </span>
                      .
                    </p>
                    <p className="text-off-white/40 text-sm">
                      Currently exploring web technologies and mobile
                      development
                    </p>
                  </div>
                  <motion.span
                    className="absolute bottom-4 right-6 text-4xl sm:text-5xl text-off-white/10 font-serif"
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  >
                    &rdquo;
                  </motion.span>
                </div>
              </TiltCard>
            </motion.div>

            {/* Stats Row with Counter Animation */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  label: "Projects",
                  value: projectsCounter.count,
                  suffix: "+",
                  ref: projectsCounter.ref,
                  setStart: projectsCounter.setHasStarted,
                },
                {
                  label: "Experience",
                  value: experienceCounter.count,
                  suffix: " Yrs",
                  ref: experienceCounter.ref,
                  setStart: experienceCounter.setHasStarted,
                },
                {
                  label: "Focus",
                  value: "Web",
                  suffix: "/Mobile",
                  isText: true,
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  ref={stat.ref}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  onViewportEnter={() => stat.setStart?.(true)}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  whileHover={{
                    scale: 1.03,
                    borderColor: "rgba(255,255,255,0.3)",
                  }}
                  className="rounded-xl border border-off-white/[0.06] bg-off-white/[0.015] backdrop-blur-sm p-4 sm:p-5 text-center hover:border-off-white/15 transition-colors duration-500 cursor-default"
                >
                  <motion.div className="font-display text-xl sm:text-2xl md:text-3xl text-off-white mb-1">
                    {stat.isText ? stat.value : stat.value}
                    {stat.suffix}
                  </motion.div>
                  <div className="text-off-white/40 text-xs sm:text-sm tracking-wide uppercase">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              {/* Resume Button with hover effect */}
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
                className="group relative inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-off-white/20 text-off-white/70 text-xs sm:text-sm tracking-wider uppercase overflow-hidden hover:text-void-black transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background on hover */}
                <motion.span
                  className="absolute inset-0 bg-off-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <svg
                  className="relative w-4 h-4 transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="relative">Resume</span>
              </motion.button>

              {/* Social Links with stagger */}
              <div className="flex items-center gap-2">
                {[
                  { href: "https://github.com/Dareean", icon: "github" },
                  { href: "https://linkedin.com/in/dareean", icon: "linkedin" },
                  { href: "mailto:dmardin@gmail.com", icon: "email" },
                ].map((social, i) => (
                  <motion.a
                    key={social.icon}
                    href={social.href}
                    target={social.icon !== "email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full border border-off-white/10 text-off-white/40 hover:border-off-white/30 hover:text-off-white/70 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon === "github" && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    )}
                    {social.icon === "linkedin" && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )}
                    {social.icon === "email" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
