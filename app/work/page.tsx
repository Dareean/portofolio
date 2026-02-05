"use client";

import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { PROJECTS } from "@/lib/data";
import FloatingNav from "@/components/FloatingNav";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ExternalLink, Calendar, Star, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Generate categories dynamically
const allCategories = PROJECTS.flatMap((p) =>
  Array.isArray(p.category) ? p.category : [p.category],
);
const categories = ["All", ...Array.from(new Set(allCategories))];

// Bento Card Component with 3D Tilt
function BentoCard({
  project,
  size,
  index,
}: {
  project: (typeof PROJECTS)[0];
  size: "small" | "medium" | "large" | "xlarge";
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt effect on hover
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Size variants for bento layout
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-2 md:col-span-2 md:row-span-1",
    large: "col-span-2 row-span-2",
    xlarge: "col-span-1 row-span-2 md:col-span-2 md:row-span-2",
  };

  // Get icon based on category
  const getCategoryIcon = (category: string | string[]) => {
    const cat = Array.isArray(category) ? category[0] : category;
    if (cat.includes("Web")) return "🌐";
    if (cat.includes("Mobile")) return "📱";
    if (cat.includes("Design")) return "🎨";
    if (cat.includes("AI")) return "🤖";
    return "💼";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${sizeClasses[size]} bento-card`}
      data-id={project.id}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full w-full relative bg-gradient-to-br from-off-white/5 to-off-white/[0.02] backdrop-blur-xl rounded-2xl overflow-hidden border border-off-white/20 hover:border-off-white/40 shadow-2xl group transition-all duration-500"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Link
          href={project.link || `/work/${project.id}`}
          target={project.link ? "_blank" : undefined}
          className="block h-full"
        >
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-sm"
              style={{ padding: "1px" }}
            />
          </div>

          {/* Background Image */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
              style={{
                backgroundImage: `url(${project.image})`,
                backgroundPosition: "center 30%",
              }}
            />

            {/* Enhanced Gradient overlays for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-void-black/70 via-void-black/50 to-void-black/95 group-hover:from-void-black/80 group-hover:to-void-black/95 transition-all duration-500" />

            {/* Vignette effect for better edge contrast */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.8)_100%)]" />

            {/* Top gradient for top content */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-void-black/80 to-transparent" />

            {/* Bottom gradient for bottom content */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-void-black/90 via-void-black/60 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Animated Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-2xl animate-pulse" />
            </div>

            {/* Scanline effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-off-white to-transparent animate-scanline"
                style={{ backgroundSize: "100% 200%" }}
              />
            </div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 z-10">
            {/* Top Bar - Enhanced */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-2">
                {/* Category with Icon */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-void-black/95 backdrop-blur-xl rounded-full border border-off-white/40 hover:border-blue-400/60 shadow-lg text-off-white text-[10px] sm:text-xs tracking-wider uppercase font-medium transition-all duration-300 w-fit"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                >
                  <span className="text-sm">
                    {getCategoryIcon(project.category)}
                  </span>
                  <span>
                    {Array.isArray(project.category)
                      ? project.category[0]
                      : project.category}
                  </span>
                </motion.div>

                {/* Multiple Categories - Show on hover */}
                {Array.isArray(project.category) &&
                  project.category.length > 1 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: isHovered ? "auto" : 0,
                        opacity: isHovered ? 1 : 0,
                      }}
                      className="flex flex-wrap gap-1 overflow-hidden"
                    >
                      {project.category.slice(1).map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-void-black/90 backdrop-blur-xl rounded-full text-off-white/80 text-[9px] sm:text-[10px] tracking-wide uppercase border border-off-white/30 shadow-lg"
                          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                        >
                          {cat}
                        </span>
                      ))}
                    </motion.div>
                  )}

                {/* Year Badge - Enhanced */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-xl rounded-full border border-blue-400/50 text-blue-100 text-[10px] sm:text-xs tracking-wider font-medium w-fit shadow-lg"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{project.year}</span>
                </motion.div>
              </div>

              {/* Featured & External Link */}
              <div className="flex flex-col gap-2 items-end">
                {/* Featured Badge - Animated */}
                {project.featured && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[9px] sm:text-[10px] tracking-widest uppercase rounded-full shadow-2xl font-bold ring-2 ring-blue-400/50 ring-offset-2 ring-offset-void-black"
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured</span>
                  </motion.span>
                )}

                {/* External Link Icon - Animated */}
                {project.link && (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-off-white/10 backdrop-blur-md rounded-full border border-off-white/20 hover:border-off-white/50 hover:bg-off-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-off-white" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Bottom Content - Enhanced Information */}
            <div className="space-y-2 sm:space-y-3">
              {/* Project Number Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="inline-flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-8 h-px bg-gradient-to-r from-blue-400 to-transparent" />
                <span className="text-blue-300 text-[10px] tracking-widest font-mono font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  PROJECT {String(index + 1).padStart(2, "0")}
                </span>
              </motion.div>

              {/* Title - Enhanced */}
              <h3
                className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-off-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-off-white group-hover:via-blue-200 group-hover:to-purple-200 transition-all duration-500"
                style={{
                  textShadow:
                    "0 2px 12px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.7)",
                }}
              >
                {project.title}
              </h3>

              {/* Description - Enhanced with animated reveal */}
              {project.description && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height:
                      isHovered || size === "large" || size === "xlarge"
                        ? "auto"
                        : 0,
                    opacity:
                      isHovered || size === "large" || size === "xlarge"
                        ? 1
                        : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-void-black/80 backdrop-blur-xl rounded-lg p-3 border-l-2 border-blue-400/50">
                    <p
                      className="text-off-white/90 text-xs sm:text-sm leading-relaxed line-clamp-3"
                      style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                    >
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* CTA - Enhanced */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{
                  y: isHovered ? 0 : 10,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="pt-2"
              >
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 backdrop-blur-xl border border-off-white/40 hover:border-off-white/60 rounded-full text-off-white hover:text-white text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300 group/cta shadow-lg"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                >
                  <span>{project.link ? "View Live" : "Explore"}</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/cta:translate-x-1" />
                </span>
              </motion.div>

              {/* Info Bar - Shows on larger cards */}
              {(size === "large" || size === "xlarge") && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{
                    y: isHovered ? 0 : 10,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-3 pt-2 border-t border-off-white/20 bg-void-black/70 backdrop-blur-xl rounded-lg px-3 py-2"
                >
                  <div
                    className="flex items-center gap-1.5 text-off-white/90 text-[10px]"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                    <span>Active</span>
                  </div>
                  <div className="w-px h-3 bg-off-white/30" />
                  <div
                    className="text-off-white/80 text-[10px] tracking-wider"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                  >
                    {Array.isArray(project.category)
                      ? `${project.category.length} Categories`
                      : "1 Category"}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Hover Overlay Pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

// Enhanced Horizontal Card with Premium Design (kept for reference)
function EnhancedHorizontalCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!descRef.current) return;

    if (isExpanded) {
      gsap.to(descRef.current, {
        maxHeight: "4rem",
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(descRef.current, {
        maxHeight: descRef.current.scrollHeight,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={cardRef} className="horizontal-card h-full group cursor-pointer">
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block h-full"
      >
        {/* Premium Card Container */}
        <div className="h-full flex flex-col bg-gradient-to-br from-off-white/5 to-off-white/[0.02] backdrop-blur-sm rounded-2xl overflow-hidden border border-off-white/10 group-hover:border-off-white/30 transition-all duration-700 shadow-2xl group-hover:shadow-off-white/5">
          {/* Image Section */}
          <div className="relative aspect-[16/9] overflow-hidden">
            {/* Parallax Image */}
            <div className="card-image-inner absolute inset-0 w-[120%]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                style={{
                  backgroundImage: `url(${project.image})`,
                  backgroundPosition: "center",
                }}
              />
            </div>

            {/* Elegant Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/40 to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-void-black/50 via-transparent to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-10">
              {/* Index Number - Large & Elegant */}
              <div className="font-display text-7xl text-off-white/10 leading-none group-hover:text-off-white/20 transition-colors duration-500">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Featured Badge */}
              {project.featured && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="px-4 py-1.5 bg-off-white/10 backdrop-blur-md border border-off-white/30 rounded-full"
                >
                  <span className="text-off-white text-xs tracking-[0.2em] uppercase font-medium">
                    ★ Featured
                  </span>
                </motion.div>
              )}
            </div>

            {/* External Link Indicator */}
            {project.link && (
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                <div className="p-3 bg-off-white/10 backdrop-blur-xl rounded-full border border-off-white/20">
                  <ExternalLink className="w-5 h-5 text-off-white" />
                </div>
              </div>
            )}

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
              {/* Year Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-void-black/60 backdrop-blur-md rounded-full border border-off-white/10 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-off-white/60 animate-pulse" />
                <span className="text-off-white/80 text-xs tracking-wider uppercase">
                  {project.year}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(Array.isArray(project.category)
                ? project.category
                : [project.category]
              ).map((cat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-off-white/5 border border-off-white/10 rounded-full text-off-white/60 text-[10px] tracking-[0.15em] uppercase"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl text-off-white leading-[1.1] mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-off-white group-hover:via-off-white group-hover:to-off-white/60 transition-all duration-500">
              {project.title}
            </h3>

            {/* Description */}
            {project.description && (
              <div className="flex-1 flex flex-col">
                <p
                  ref={descRef}
                  className="text-off-white/60 text-sm sm:text-base leading-relaxed overflow-hidden transition-all duration-300 mb-4"
                  style={{ maxHeight: "4rem" }}
                >
                  {project.description}
                </p>

                {/* Action Row */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-off-white/5">
                  {/* Read More */}
                  {project.description.length > 100 && (
                    <button
                      onClick={toggleDescription}
                      className="text-off-white/50 hover:text-off-white text-xs tracking-[0.15em] uppercase transition-colors inline-flex items-center gap-2 group/btn"
                    >
                      <span>{isExpanded ? "Show Less" : "Read More"}</span>
                      <svg
                        className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""} group-hover/btn:translate-x-1`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* View Project */}
                  <div className="flex items-center gap-2 text-off-white/40 group-hover:text-off-white transition-colors duration-500">
                    <span className="text-xs tracking-wider uppercase">
                      View Project
                    </span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Magnetic Card Component
function MagneticCard({
  project,
  index,
  mousePosition,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  mousePosition: { x: number; y: number };
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const magneticRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // GSAP quickTo for smooth magnetic effect
  const xTo = useRef<any>(null);
  const yTo = useRef<any>(null);

  useEffect(() => {
    if (!magneticRef.current) return;

    // Initialize quickTo for performance
    xTo.current = gsap.quickTo(magneticRef.current, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    yTo.current = gsap.quickTo(magneticRef.current, "y", {
      duration: 0.6,
      ease: "power3.out",
    });

    // Entrance animation
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 60,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        delay: (index % 3) * 0.1,
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === cardRef.current) {
          trigger.kill();
        }
      });
    };
  }, [index]);

  // Magnetic effect on mouse move
  useEffect(() => {
    if (!cardRef.current || !magneticRef.current || !isHovered) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    // Calculate distance from cursor to card center
    const deltaX = mousePosition.x - cardCenterX;
    const deltaY = mousePosition.y - cardCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Magnetic strength based on distance
    const maxDistance = 300;
    const strength = Math.max(0, 1 - distance / maxDistance);

    if (distance < maxDistance) {
      const moveX = deltaX * strength * 0.3;
      const moveY = deltaY * strength * 0.3;

      xTo.current?.(moveX);
      yTo.current?.(moveY);
    } else {
      xTo.current?.(0);
      yTo.current?.(0);
    }
  }, [mousePosition, isHovered]);

  // Toggle description
  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!descRef.current) return;

    if (isExpanded) {
      gsap.to(descRef.current, {
        maxHeight: "3rem",
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(descRef.current, {
        maxHeight: descRef.current.scrollHeight,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={cardRef}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        xTo.current?.(0);
        yTo.current?.(0);
      }}
    >
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block"
      >
        <div ref={magneticRef} className="will-change-transform">
          {/* Image Container */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-off-white/5 mb-4 sm:mb-5 md:mb-6 border border-off-white/10 group-hover:border-off-white/30 transition-colors duration-500">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
              style={{
                backgroundImage: `url(${project.image})`,
                backgroundPosition: "center 30%",
              }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void-black/40 group-hover:to-void-black/60 transition-all duration-500" />

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 bg-off-white text-void-black text-xs tracking-widest uppercase rounded-full shadow-xl">
                  Featured
                </span>
              </div>
            )}

            {/* External link */}
            {project.link && (
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink className="w-5 h-5 text-off-white drop-shadow-lg" />
              </div>
            )}

            {/* Magnetic indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-off-white/20 rounded-full animate-ping" />
                <div className="absolute inset-0 bg-off-white/40 rounded-full" />
              </div>
              <span className="text-off-white/60 text-xs tracking-wider uppercase">
                Magnetic
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 sm:space-y-3">
            {/* Categories + Year */}
            <div className="flex items-center gap-2 sm:gap-3 text-off-white/40 text-[10px] sm:text-xs tracking-widest uppercase">
              <span>
                {Array.isArray(project.category)
                  ? project.category[0]
                  : project.category}
              </span>
              <span className="w-1 h-1 bg-off-white/20 rounded-full" />
              <span>{project.year}</span>
            </div>

            {/* Title */}
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-off-white group-hover:text-off-white/80 transition-colors duration-300 leading-tight">
              {project.title}
            </h3>

            {/* Description */}
            {project.description && (
              <div className="relative">
                <p
                  ref={descRef}
                  className="text-off-white/50 text-xs sm:text-sm leading-relaxed overflow-hidden transition-all duration-300"
                  style={{ maxHeight: "3rem" }}
                >
                  {project.description}
                </p>

                {project.description.length > 100 && (
                  <button
                    onClick={toggleDescription}
                    className="mt-2 text-off-white/40 hover:text-off-white text-[10px] tracking-wider uppercase transition-colors inline-flex items-center gap-1"
                  >
                    <span>{isExpanded ? "Show Less" : "Read More"}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Layered Parallax Card Component
function ParallaxCard({
  project,
  index,
  layer = "mid",
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  layer?: "bg" | "mid" | "fg";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    // Fade in animation
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom-=80",
          toggleActions: "play none none none",
        },
        delay: (index % 3) * 0.1,
      },
    );

    // Image parallax
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === cardRef.current) {
          trigger.kill();
        }
      });
    };
  }, [index]);

  // Toggle description
  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!descRef.current) return;

    if (isExpanded) {
      gsap.to(descRef.current, {
        maxHeight: "3rem",
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(descRef.current, {
        maxHeight: descRef.current.scrollHeight,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={cardRef} className={`parallax-${layer} group`}>
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-off-white/5 mb-4 sm:mb-5 md:mb-6">
          {/* Parallax Image */}
          <div
            ref={imageRef}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            style={{
              backgroundImage: `url(${project.image})`,
              backgroundPosition: "center 30%",
              height: "130%",
              top: "-15%",
            }}
          />

          {/* Layered overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-black/10 to-void-black/50" />
          <div className="absolute inset-0 bg-void-black/0 group-hover:bg-void-black/20 transition-colors duration-500" />

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1.5 bg-off-white/90 backdrop-blur-sm text-void-black text-xs tracking-widest uppercase rounded-full shadow-xl">
                Featured
              </span>
            </div>
          )}

          {/* External link */}
          {project.link && (
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="w-5 h-5 text-off-white drop-shadow-lg" />
            </div>
          )}

          {/* Depth indicator */}
          <div className="absolute bottom-4 right-4 opacity-30 group-hover:opacity-50 transition-opacity">
            <div className="flex gap-1">
              <div
                className={`w-1 h-8 rounded-full ${layer === "bg" ? "bg-blue-400" : layer === "mid" ? "bg-purple-400" : "bg-pink-400"}`}
              />
              <div
                className={`w-1 h-8 rounded-full ${layer !== "bg" ? "bg-off-white/30" : "bg-transparent"}`}
              />
              <div
                className={`w-1 h-8 rounded-full ${layer === "fg" ? "bg-off-white/30" : "bg-transparent"}`}
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 sm:space-y-3">
          {/* Categories + Year */}
          <div className="flex items-center gap-2 sm:gap-3 text-off-white/40 text-[10px] sm:text-xs tracking-widest uppercase">
            <span>
              {Array.isArray(project.category)
                ? project.category[0]
                : project.category}
            </span>
            <span className="w-1 h-1 bg-off-white/20 rounded-full" />
            <span>{project.year}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-off-white group-hover:text-off-white/80 transition-colors duration-300 leading-tight">
            {project.title}
          </h3>

          {/* Description */}
          {project.description && (
            <div className="relative">
              <p
                ref={descRef}
                className="text-off-white/50 text-xs sm:text-sm leading-relaxed overflow-hidden transition-all duration-300"
                style={{ maxHeight: "3rem" }}
              >
                {project.description}
              </p>

              {project.description.length > 100 && (
                <button
                  onClick={toggleDescription}
                  className="mt-2 text-off-white/40 hover:text-off-white text-[10px] tracking-wider uppercase transition-colors inline-flex items-center gap-1"
                >
                  <span>{isExpanded ? "Show Less" : "Read More"}</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

// Scroll-Snap Card Component
function ScrollSnapCard({
  project,
  index,
  isActive,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  isActive: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    // Entrance animation
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 80,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === cardRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Animate when card becomes active
  useEffect(() => {
    if (!cardRef.current) return;

    if (isActive) {
      gsap.to(cardRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      // Highlight animation
      gsap.to(cardRef.current.querySelector(".card-border"), {
        borderColor: "rgba(255, 255, 255, 0.3)",
        duration: 0.3,
      });
    } else {
      gsap.to(cardRef.current, {
        scale: 0.95,
        opacity: 0.6,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.to(cardRef.current.querySelector(".card-border"), {
        borderColor: "rgba(255, 255, 255, 0.05)",
        duration: 0.3,
      });
    }
  }, [isActive]);

  // Toggle description
  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!descRef.current) return;

    if (isExpanded) {
      gsap.to(descRef.current, {
        maxHeight: "3rem",
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(descRef.current, {
        maxHeight: descRef.current.scrollHeight,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={cardRef}
      className="snap-card scroll-mt-32 transition-all duration-500"
    >
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block group"
      >
        <div
          className="card-border border-2 rounded-lg p-1 transition-all duration-300"
          style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
        >
          {/* Image Container */}
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-off-white/5 mb-5">
            <div
              ref={imageRef}
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                backgroundImage: `url(${project.image})`,
                backgroundPosition: "center 30%",
              }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void-black/60" />

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 bg-off-white text-void-black text-xs tracking-widest uppercase rounded-full">
                  Featured
                </span>
              </div>
            )}

            {/* External link */}
            {project.link && (
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink className="w-5 h-5 text-off-white" />
              </div>
            )}

            {/* Index indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="font-display text-5xl text-off-white/30 leading-none">
                {String(index + 1).padStart(2, "0")}
              </span>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-off-white"
                />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="px-4 pb-4 space-y-3">
            {/* Categories + Year */}
            <div className="flex items-center gap-3 text-off-white/40 text-xs tracking-widest uppercase">
              <span>
                {Array.isArray(project.category)
                  ? project.category.join(" • ")
                  : project.category}
              </span>
              <span className="w-1 h-1 bg-off-white/20 rounded-full" />
              <span>{project.year}</span>
            </div>

            {/* Title */}
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-off-white group-hover:text-off-white/80 transition-colors duration-300 leading-tight">
              {project.title}
            </h3>

            {/* Description */}
            {project.description && (
              <div className="relative">
                <p
                  ref={descRef}
                  className="text-off-white/60 text-sm leading-relaxed overflow-hidden transition-all duration-300"
                  style={{ maxHeight: "3rem" }}
                >
                  {project.description}
                </p>

                {project.description.length > 100 && (
                  <button
                    onClick={toggleDescription}
                    className="mt-2 text-off-white/40 hover:text-off-white text-[10px] tracking-wider uppercase transition-colors inline-flex items-center gap-1"
                  >
                    <span>{isExpanded ? "Show Less" : "Read More"}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// 3D Perspective Card Component
function Card3D({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!cardRef.current || !innerRef.current) return;

    const card = cardRef.current;
    const inner = innerRef.current;

    // 3D entrance animation with rotation
    gsap.fromTo(
      card,
      {
        opacity: 0,
        rotateY: -45,
        rotateX: 15,
        z: -200,
      },
      {
        opacity: 1,
        rotateY: 0,
        rotateX: 0,
        z: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        delay: (index % 3) * 0.15, // Wave effect based on grid position
      },
    );

    // 3D tilt effect on scroll
    gsap.to(inner, {
      rotateY: 5,
      rotateX: -5,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    // Parallax depth on image
    const image = card.querySelector(".card-image");
    if (image) {
      gsap.to(image, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === card) {
          trigger.kill();
        }
      });
    };
  }, [index]);

  // Toggle description
  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!descRef.current) return;

    if (isExpanded) {
      gsap.to(descRef.current, {
        maxHeight: "3rem",
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(descRef.current, {
        maxHeight: descRef.current.scrollHeight,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={cardRef}
      className="group"
      style={{
        perspective: "1500px",
        transformStyle: "preserve-3d",
      }}
    >
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block"
      >
        <div
          ref={innerRef}
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-off-white/5 mb-4 sm:mb-5 md:mb-6">
            <div
              className="card-image absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
              style={{
                backgroundImage: `url(${project.image})`,
                backgroundPosition: "center 30%",
                height: "120%",
              }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void-black/40" />

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 bg-off-white text-void-black text-xs tracking-widest uppercase rounded-full shadow-lg">
                  Featured
                </span>
              </div>
            )}

            {/* External link */}
            {project.link && (
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink className="w-5 h-5 text-off-white drop-shadow-lg" />
              </div>
            )}

            {/* 3D floating badge */}
            <div
              className="absolute bottom-4 right-4 bg-void-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-off-white/20"
              style={{
                transform: "translateZ(30px)",
              }}
            >
              <span className="text-off-white/60 text-xs tracking-wider uppercase">
                {project.year}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 sm:space-y-3">
            {/* Categories */}
            <div className="flex items-center gap-2 text-off-white/40 text-[10px] sm:text-xs tracking-widest uppercase">
              <span>
                {Array.isArray(project.category)
                  ? project.category[0]
                  : project.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-off-white group-hover:text-off-white/80 transition-colors duration-300 leading-tight">
              {project.title}
            </h3>

            {/* Description */}
            {project.description && (
              <div className="relative">
                <p
                  ref={descRef}
                  className="text-off-white/50 text-xs sm:text-sm leading-relaxed overflow-hidden transition-all duration-300"
                  style={{ maxHeight: "3rem" }}
                >
                  {project.description}
                </p>

                {project.description.length > 100 && (
                  <button
                    onClick={toggleDescription}
                    className="mt-2 text-off-white/40 hover:text-off-white text-[10px] tracking-wider uppercase transition-colors inline-flex items-center gap-1"
                  >
                    <span>{isExpanded ? "Show Less" : "Read More"}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// Project Card for Horizontal Scroll
function HorizontalProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle description expansion
  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!descRef.current) return;

    if (isExpanded) {
      gsap.to(descRef.current, {
        maxHeight: "3rem",
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(descRef.current, {
        maxHeight: descRef.current.scrollHeight,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={cardRef} className="h-full group">
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block h-full"
      >
        {/* Image Container - Larger for horizontal layout */}
        <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-off-white/5 mb-5">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${project.image})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 via-void-black/20 to-transparent" />

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1.5 bg-off-white text-void-black text-xs tracking-widest uppercase rounded-full">
                Featured
              </span>
            </div>
          )}

          {/* External link indicator */}
          {project.link && (
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="w-5 h-5 text-off-white" />
            </div>
          )}

          {/* Index number - bottom left */}
          <div className="absolute bottom-4 left-4 text-off-white/30 font-display text-5xl leading-none">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3">
          {/* Categories + Year */}
          <div className="flex items-center gap-3 text-off-white/40 text-xs tracking-widest uppercase">
            <span>
              {Array.isArray(project.category)
                ? project.category.join(" • ")
                : project.category}
            </span>
            <span className="w-1 h-1 bg-off-white/20 rounded-full" />
            <span>{project.year}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-off-white group-hover:text-off-white/80 transition-colors duration-300 leading-tight">
            {project.title}
          </h3>

          {/* Description - Expandable */}
          {project.description && (
            <div className="relative">
              <p
                ref={descRef}
                className="text-off-white/60 text-sm leading-relaxed overflow-hidden transition-all duration-300"
                style={{ maxHeight: "3rem" }}
              >
                {project.description}
              </p>

              {/* Read More Button */}
              {project.description.length > 100 && (
                <button
                  onClick={toggleDescription}
                  className="mt-2 text-off-white/40 hover:text-off-white text-[10px] tracking-wider uppercase transition-colors inline-flex items-center gap-1"
                >
                  <span>{isExpanded ? "Show Less" : "Read More"}</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

// Project Card with GSAP animations
function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    // GSAP Pop-up animation with stagger
    gsap.fromTo(
      cardRef.current,
      {
        scale: 0.8,
        opacity: 0,
        y: 50,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
        delay: (index % 3) * 0.1, // Stagger based on grid position
      },
    );

    // Parallax effect on image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === cardRef.current) {
          trigger.kill();
        }
      });
    };
  }, [index]);

  // Toggle description expansion
  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!descRef.current) return;

    if (isExpanded) {
      gsap.to(descRef.current, {
        maxHeight: "3rem", // ~2 lines
        duration: 0.4,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(descRef.current, {
        maxHeight: descRef.current.scrollHeight,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={cardRef} className="group">
      <Link
        href={project.link || `/work/${project.id}`}
        target={project.link ? "_blank" : undefined}
        className="block"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-off-white/5 mb-4 sm:mb-5 md:mb-6">
          <div
            ref={imageRef}
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            style={{
              backgroundImage: `url(${project.image})`,
              backgroundPosition: "center 30%",
              height: "120%",
            }}
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-void-black/0 group-hover:bg-void-black/20 transition-colors duration-500" />

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-off-white text-void-black text-xs tracking-widest uppercase rounded-full">
                Featured
              </span>
            </div>
          )}

          {/* External link indicator */}
          {project.link && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="w-5 h-5 text-off-white" />
            </div>
          )}

          {/* View indicator on hover */}
          <motion.div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-6 py-3 bg-off-white text-void-black text-sm tracking-wider uppercase rounded-full">
              View
            </span>
          </motion.div>
        </div>

        {/* Info */}
        <div className="space-y-2 sm:space-y-3">
          {/* Categories + Year */}
          <div className="flex items-center gap-2 sm:gap-3 text-off-white/40 text-[10px] sm:text-xs tracking-widest uppercase">
            <span>
              {Array.isArray(project.category)
                ? project.category[0]
                : project.category}
            </span>
            <span className="w-1 h-1 bg-off-white/20 rounded-full" />
            <span>{project.year}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-off-white group-hover:text-off-white/80 transition-colors duration-300 leading-tight">
            {project.title}
          </h3>

          {/* Description - Expandable */}
          {project.description && (
            <div className="relative">
              <p
                ref={descRef}
                className="text-off-white/50 text-xs sm:text-sm leading-relaxed overflow-hidden transition-all duration-300"
                style={{ maxHeight: "3rem" }}
              >
                {project.description}
              </p>

              {/* Read More Button - only show if text is long */}
              {project.description.length > 100 && (
                <button
                  onClick={toggleDescription}
                  className="mt-2 text-off-white/40 hover:text-off-white text-[10px] tracking-wider uppercase transition-colors inline-flex items-center gap-1"
                >
                  <span>{isExpanded ? "Show Less" : "Read More"}</span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  // Hero scroll effects
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 0.95]);

  const filteredProjects =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) =>
          Array.isArray(p.category)
            ? p.category.includes(activeFilter)
            : p.category === activeFilter,
        );

  // Assign sizes to projects dynamically for bento layout
  const getSizeForProject = (
    index: number,
    total: number,
  ): "small" | "medium" | "large" | "xlarge" => {
    const patterns = [
      "large",
      "medium",
      "small",
      "xlarge",
      "small",
      "medium",
      "medium",
      "xlarge",
      "small",
      "large",
      "small",
      "medium",
    ];
    return patterns[index % patterns.length] as any;
  };

  // FLIP animation when filter changes
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gsap.utils.toArray(".bento-card");

    cards.forEach((card: any, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.08,
          ease: "power3.out",
        },
      );
    });
  }, [filteredProjects]);

  return (
    <main className="min-h-screen overflow-hidden bg-void-black">
      {/* Animated Background */}
      <AnimatedBackground />
      <FloatingNav />

      {/* ============================================ */}
      {/* HERO - Editorial Title */}
      {/* ============================================ */}
      <motion.section
        ref={heroRef}
        className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 flex flex-col items-center justify-center relative px-6"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Home Link */}
        <motion.div
          className="absolute top-6 left-6 md:left-16 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-off-white/50 hover:text-off-white transition-colors group"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm tracking-wide">Home</span>
          </Link>
        </motion.div>

        {/* Main Hero Content */}
        <div className="max-w-5xl text-center">
          {/* Overline */}
          <motion.div
            className="mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-off-white/40 text-[10px] sm:text-xs tracking-[0.3em] uppercase">
              Selected Projects
            </span>
          </motion.div>

          {/* Main Title - Large Editorial */}
          <motion.h1
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-off-white leading-[0.9] mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Visual
            <br />
            <span className="text-off-white/30">Narratives</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-off-white/60 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Curated collection of digital experiences — from mobile apps to web
            platforms. Each project tells a story through design and
            functionality.
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center gap-3 text-off-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase">
              Explore
            </span>
            <motion.svg
              width="14"
              height="20"
              viewBox="0 0 16 24"
              fill="none"
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                d="M8 0V22M8 22L1 15M8 22L15 15"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </motion.svg>
          </motion.div>
        </div>
      </motion.section>

      {/* ============================================ */}
      {/* FILTER - Clean Pills */}
      {/* ============================================ */}
      <section className="sticky top-16 sm:top-20 bg-void-black/80 backdrop-blur-lg z-30 border-y border-off-white/10 px-6 md:px-12 lg:px-20 py-4 sm:py-6">
        <motion.nav
          className="flex flex-wrap gap-2 sm:gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 sm:px-5 py-2 text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-all duration-300 border ${
                activeFilter === cat
                  ? "bg-off-white text-void-black border-off-white"
                  : "bg-transparent text-off-white/50 border-off-white/20 hover:text-off-white hover:border-off-white/50"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.nav>
      </section>

      {/* ============================================ */}
      {/* BENTO GRID SHOWCASE */}
      {/* ============================================ */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center justify-between"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-off-white/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
            <span className="text-off-white/40 text-xs tracking-widest uppercase">
              Bento Showcase
            </span>
          </div>
          <span className="text-off-white/30 text-xs tracking-wider">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "Project" : "Projects"}
          </span>
        </motion.div>

        {/* Bento Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[280px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProjects.map((project, index) => (
              <BentoCard
                key={project.id}
                project={project}
                size={getSizeForProject(index, filteredProjects.length)}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* End CTA */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-off-white/10 mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl animate-pulse" />
              <svg
                className="w-10 h-10 text-off-white/40 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-display text-3xl text-off-white mb-3">
              Ready to create together?
            </h3>
            <p className="text-off-white/50 text-sm mb-6 max-w-md mx-auto">
              These projects represent my journey. Let's start yours.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-off-white/20 hover:border-off-white/40 rounded-full text-off-white text-sm tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
            >
              <span>Start a Project</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <section className="px-6 md:px-12 lg:px-20 py-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-off-white/5 flex items-center justify-center">
              <span className="text-off-white/20 text-2xl">✨</span>
            </div>
            <p className="text-off-white/40 text-lg">
              No projects found in this category.
            </p>
          </motion.div>
        </section>
      )}

      {/* ============================================ */}
      {/* FOOTER CTA */}
      {/* ============================================ */}
      <section className="px-6 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24 border-t border-off-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="font-display text-4xl sm:text-5xl md:text-6xl text-off-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Let's Create Together
          </motion.h2>
          <motion.p
            className="text-off-white/60 text-base sm:text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Have a project in mind? Let's discuss how we can bring your vision
            to life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="inline-block px-8 py-4 border-2 border-off-white text-off-white text-sm tracking-[0.15em] uppercase hover:bg-off-white hover:text-void-black transition-all duration-300"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
