"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useState, useEffect, useMemo, useLayoutEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDeviceType, getAnimationConfig } from "@/lib/hooks";

// Generate floating particles with device-aware count
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

// 3D Tilt Card Component - Disabled on mobile for performance
function TiltCard({
  children,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
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
    if (disabled) return;
    x.set(0);
    y.set(0);
  };

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

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
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const bioCardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const deviceInfo = useDeviceType();
  const animConfig = getAnimationConfig(deviceInfo);

  // Detect mobile for performance optimization - Use state to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Drastically reduce particle count based on device capability
    const particleCount = deviceInfo.isLowEnd
      ? 5
      : deviceInfo.isMobile
        ? 10
        : 30;
    setParticles(generateParticles(particleCount));
  }, [deviceInfo.isMobile, deviceInfo.isLowEnd]);

  const particleColor = theme === "dark" ? "255,255,255" : "14,15,25";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Counter states
  const projectsCounter = useCountUp(10, 1500);
  const experienceCounter = useCountUp(6, 1500);

  // GSAP ScrollTrigger Animations
  useLayoutEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Header animation - wave emoji and line
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Title animation - staggered letters effect
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 80, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Profile card animation - slide from left
      if (profileCardRef.current) {
        gsap.fromTo(
          profileCardRef.current,
          { opacity: 0, x: -100, rotateY: -15 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: profileCardRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Bio card animation - slide from right
      if (bioCardRef.current) {
        gsap.fromTo(
          bioCardRef.current,
          { opacity: 0, x: 100, rotateY: 15 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bioCardRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Stats animation - staggered scale up
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".stat-item");
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 50, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Tech Stack animation - staggered fade in from bottom
      const techStackContainer = containerRef.current?.querySelector(
        ".tech-stack-container",
      );
      if (techStackContainer) {
        const techBadges = techStackContainer.querySelectorAll(".tech-badge");
        gsap.fromTo(
          techBadges,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: techStackContainer,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Tech Stack Marquee - Infinite horizontal scroll
      const marqueeTrack = containerRef.current?.querySelector(
        ".tech-marquee-track",
      );
      if (marqueeTrack) {
        const marqueeWidth = marqueeTrack.scrollWidth / 2;
        const tl = gsap.to(marqueeTrack, {
          x: -marqueeWidth,
          duration: 25,
          ease: "none",
          repeat: -1,
        });
        // Store timeline reference for hover control
        (
          window as unknown as { techMarqueeTl?: gsap.core.Tween }
        ).techMarqueeTl = tl;
      }
    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  // Aurora colors based on theme - More visible for smooth transition
  const auroraColors =
    theme === "dark"
      ? {
          blob1: "rgba(99, 102, 241, 0.35)", // Indigo
          blob2: "rgba(34, 197, 94, 0.3)", // Green
          blob3: "rgba(168, 85, 247, 0.25)", // Purple
          blob4: "rgba(14, 165, 233, 0.2)", // Sky blue
        }
      : {
          blob1: "rgba(99, 102, 241, 0.25)", // Indigo
          blob2: "rgba(34, 197, 94, 0.2)", // Green
          blob3: "rgba(168, 85, 247, 0.18)", // Purple
          blob4: "rgba(14, 165, 233, 0.15)", // Sky blue
        };

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-28 md:py-36 px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden"
    >
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
        {/* Section Header - Journey style with icon + line (GSAP animated) */}
        <div ref={headerRef} className="mb-12 sm:mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-4">
            <motion.span
              className="text-2xl sm:text-3xl"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              👋
            </motion.span>
            <div className="h-px flex-1 bg-gradient-to-r from-off-white/20 to-transparent" />
          </div>
          <h2
            ref={titleRef}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-off-white mb-3"
          >
            About Me
          </h2>
          <p
            ref={subtitleRef}
            className="text-off-white/50 text-sm sm:text-base md:text-lg max-w-xl"
          >
            Developer from Palu, Indonesia — driven by curiosity, learning by
            doing.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
          {/* Profile Card - Left Side (GSAP animated) */}
          <div ref={profileCardRef} className="md:col-span-5 lg:col-span-4">
            <TiltCard
              className="h-full"
              disabled={deviceInfo.isMobile || deviceInfo.isLowEnd}
            >
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
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
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

                {/* Status badge and Contact button */}
                <div className="flex items-center gap-2 flex-wrap">
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

                  {/* Contact Button */}
                  <motion.a
                    href="/contact"
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/40 rounded-full hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/60 transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-medium text-blue-300 group-hover:text-blue-200">
                      Get in Touch
                      <svg
                        className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </motion.a>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Side - Bio & Stats */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4 sm:gap-5 md:gap-6">
            {/* Bio Quote Card (GSAP animated) */}
            <div ref={bioCardRef}>
              <TiltCard disabled={deviceInfo.isMobile || deviceInfo.isLowEnd}>
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
            </div>

            {/* Stats Row with Counter Animation (GSAP animated) */}
            <div ref={statsRef} className="grid grid-cols-3 gap-3 sm:gap-4">
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
                  className="stat-item rounded-xl border border-off-white/[0.06] bg-off-white/[0.015] backdrop-blur-sm p-4 sm:p-5 text-center hover:border-off-white/15 transition-colors duration-500 cursor-default"
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

            {/* Tech Stack Marquee - GSAP Infinite Scroll */}
            <div
              className="tech-stack-container relative overflow-hidden py-4"
              onMouseEnter={() => {
                const tl = (
                  window as unknown as { techMarqueeTl?: gsap.core.Tween }
                ).techMarqueeTl;
                if (tl) gsap.to(tl, { timeScale: 0.2, duration: 0.5 });
              }}
              onMouseLeave={() => {
                const tl = (
                  window as unknown as { techMarqueeTl?: gsap.core.Tween }
                ).techMarqueeTl;
                if (tl) gsap.to(tl, { timeScale: 1, duration: 0.5 });
              }}
            >
              {/* Gradient Mask Left - Theme aware */}
              <div
                className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, rgb(var(--background-rgb)) 0%, rgb(var(--background-rgb)) 10%, transparent 100%)",
                }}
              />
              {/* Gradient Mask Right - Theme aware */}
              <div
                className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to left, rgb(var(--background-rgb)) 0%, rgb(var(--background-rgb)) 10%, transparent 100%)",
                }}
              />

              <div className="tech-marquee-track flex">
                {/* First set of icons */}
                {[...Array(2)].map((_, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex items-center gap-12 sm:gap-16 md:gap-20 px-6 sm:px-8"
                  >
                    {[
                      {
                        name: "React",
                        path: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z",
                      },
                      {
                        name: "Next.js",
                        path: "M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z",
                      },
                      {
                        name: "TypeScript",
                        path: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z",
                      },
                      {
                        name: "JavaScript",
                        path: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z",
                      },
                      {
                        name: "Tailwind",
                        path: "M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z",
                      },
                      {
                        name: "Node.js",
                        path: "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z",
                      },
                      {
                        name: "PHP",
                        path: "M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174h-.926l-.643 3.624H9.504l1.23-6.326h1.379l-.412 2.12h1.011c.803 0 1.385.209 1.745.628.36.418.467 1.002.321 1.751l-.597 3.827h-1.379zm7.66-2.799l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174h-.926l-.643 3.624h-1.379l1.23-6.326h1.379l-.412 2.12h1.011c.803 0 1.385.209 1.745.628.36.418.467 1.002.321 1.751l-.597 3.827h-1.379z",
                      },
                      {
                        name: "Laravel",
                        path: "M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 01.024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 01.375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.146 1.225-6.127 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.04-.01-.011-.021-.022-.028-.036v-.001c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 01-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z",
                      },
                      {
                        name: "Framer",
                        path: "M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z",
                      },
                      {
                        name: "Figma",
                        path: "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z",
                      },
                      {
                        name: "Git",
                        path: "M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187",
                      },
                      {
                        name: "GSAP",
                        path: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6-9.6-4.298-9.6-9.6 4.298-9.6 9.6-9.6zm-2.4 4.8v9.6l7.2-4.8z",
                      },
                    ].map((tech, idx) => (
                      <div
                        key={`${setIndex}-${idx}`}
                        className="tech-badge flex flex-col items-center gap-2 group"
                      >
                        <svg
                          className="w-7 h-7 sm:w-9 sm:h-9 text-off-white/60 group-hover:text-off-white transition-colors duration-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d={tech.path} />
                        </svg>
                        <span className="text-off-white/40 text-[10px] sm:text-xs font-medium group-hover:text-off-white/60 transition-colors duration-300">
                          {tech.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Row (GSAP animated) */}
            <div
              ref={ctaRef}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
