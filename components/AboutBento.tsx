"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Clock, Users, Code2, Download } from "lucide-react";
import { useDeviceType } from "@/lib/hooks";

const TECH_STACK = [
  {
    name: "Next.js 14",
    category: "Framework",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current text-charcoal flex-shrink-0" viewBox="0 0 24 24">
        <path d="M18.665 21.978C16.808 23.25 14.502 24 12 24 5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12c0 3.197-1.254 6.1-3.298 8.246l-9.84-12.724H8.4v9.552h1.696V9.453l8.569 12.525zM15.539 7.522h1.696v6.957h-1.696V7.522z"/>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    category: "Language",
    icon: (
      <span className="w-3.5 h-3.5 rounded-[2px] bg-[#3178C6] text-white flex items-center justify-center text-[8px] font-bold font-mono leading-none flex-shrink-0">
        TS
      </span>
    ),
  },
  {
    name: "React 19",
    category: "Library",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#00D8FF] flex-shrink-0" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    category: "Styling",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#38BDF8] fill-current flex-shrink-0" viewBox="0 0 24 24">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
      </svg>
    ),
  },
  {
    name: "Node.js",
    category: "Backend",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#5FA04E] fill-current flex-shrink-0" viewBox="0 0 24 24">
        <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm0 2.25l8.442 4.875v9.75L12 21.75l-8.442-4.875V7.125L12 2.25z"/>
      </svg>
    ),
  },
  {
    name: "Prisma ORM",
    category: "Database",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#2D3748] fill-current flex-shrink-0" viewBox="0 0 24 24">
        <path d="M22.5 19.5L13.8 2.3c-.6-1.2-2.3-1.2-2.9 0L2.2 19.5c-.6 1.1.3 2.5 1.5 2.5h17.3c1.2 0 2.1-1.4 1.5-2.5zM12 5.5l6.5 13H5.5L12 5.5z"/>
      </svg>
    ),
  },
  {
    name: "QGIS",
    category: "Spatial",
    icon: (
      <svg className="w-3.5 h-3.5 text-[#589632] fill-current flex-shrink-0" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
  },
  {
    name: "Figma",
    category: "Design",
    icon: (
      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
      </svg>
    ),
  },
  {
    name: "Python",
    category: "Language",
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
        <path fill="#3776AB" d="M11.91 0c-3.1 0-4.9.43-4.9 2.14v2.14h5v.72H4.9C3.1 5 1.5 6.6 1.5 8.71s1.37 3.57 3.4 3.57h1.4v-1.78c0-1.74 1.4-3.22 3.2-3.22h4.9V4.28C14.4 2.14 13.9.01 11.91 0zm-1.4 1.43c.4 0 .7.32.7.71 0 .4-.3.72-.7.72-.4 0-.71-.32-.71-.72 0-.39.31-.71.71-.71z"/>
        <path fill="#FFD43B" d="M12.09 24c3.1 0 4.9-.43 4.9-2.14v-2.14h-5v-.72h7.11c1.8 0 3.4-1.6 3.4-3.71s-1.37-3.57-3.4-3.57h-1.4v1.78c0 1.74-1.4 3.22-3.2 3.22h-4.9v3c0 2.14.5 4.27 2.49 4.28zm1.4-1.43c-.4 0-.7-.32-.7-.71 0-.4.3-.72.7-.72.4 0 .71.32.71.72 0 .39-.31-.71-.71-.71z"/>
      </svg>
    ),
  },
  {
    name: "IoT / ESP32",
    category: "Hardware",
    icon: (
      <svg className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
  },
];

export default function AboutBento() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const deviceInfo = useDeviceType();

  // Real-time clock for Palu (WITA / UTC+8)
  const [paluTime, setPaluTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Asia/Makassar (WITA UTC+8)
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Makassar",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setPaluTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: deviceInfo.isMobile ? 15 : 25 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: deviceInfo.prefersReducedMotion ? 0.01 : 0.6,
        delay: deviceInfo.prefersReducedMotion ? 0 : i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-section md:py-section-lg px-6 md:px-8 bg-canvas text-ink relative overflow-hidden"
    >
      <div className="max-w-container mx-auto">
        {/* Section Header */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-px bg-primary/40" />
            <span className="text-micro-uppercase text-primary font-semibold tracking-wider">
              Profile &amp; Craft
            </span>
          </div>
          <h2 className="text-heading-2 md:text-display-lg text-charcoal font-semibold tracking-tight">
            Behind the Code
          </h2>
          <p className="text-body-md text-slate mt-2 max-w-xl">
            A snapshot of my identity, engineering philosophy, location, community roots, and active technical stack.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {/* ── Card 0: Editorial Portrait Card (Span 4) ── */}
          <motion.div
            custom={1}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            className="md:col-span-4 rounded-xl overflow-hidden bg-surface border border-hairline relative group shadow-elevation-1 flex flex-col justify-end min-h-[340px] md:min-h-[380px]"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/assets/foto_closeup.jpg"
                alt="Dareean Ahmad Raffi"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-ink-deep/30 to-transparent" />
            </div>

            {/* Content over portrait */}
            <div className="relative z-10 p-5 md:p-6 text-white">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/80">
                  Full-Stack &amp; UI/UX
                </span>
              </div>
              <h3 className="text-heading-4 font-semibold text-white tracking-tight">
                Dareean Ahmad Raffi
              </h3>
              <p className="text-caption text-white/70 font-mono mt-0.5">
                Palu, Central Sulawesi · 0°53&apos; S
              </p>
            </div>
          </motion.div>

          {/* ── Card 1: Core Bio & Philosophy (Span 8) ── */}
          <motion.div
            custom={2}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            className="md:col-span-8 rounded-xl bg-surface border border-hairline p-6 md:p-8 flex flex-col justify-between hover:border-hairline-strong transition-all duration-300 shadow-elevation-1"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-px bg-primary/60 inline-block" />
                <span className="text-micro-uppercase text-steel font-semibold tracking-wider">
                  Philosophy &amp; Ethos
                </span>
              </div>

              <h3 className="text-heading-3 text-charcoal font-semibold tracking-tight mb-4 leading-snug">
                From pixel to people — turning complex engineering into human-centered software.
              </h3>

              <p className="text-body-md text-slate leading-relaxed mb-4">
                I see code not merely as syntax, but as a bridge between ideas and reality. Based in Central Sulawesi, I combine formal computer science fundamentals with hands-on product craft — building everything from clinical platforms to geospatial disaster tools and empowering regional tech communities.
              </p>
            </div>

            <div className="pt-6 border-t border-hairline flex flex-wrap items-center gap-3">
              <button
                type="button"
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-on-dark text-button-md font-medium rounded-lg hover:bg-ink-deep transition-all duration-200"
              >
                <Download size={15} />
                <span>Resume (PDF)</span>
              </button>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-charcoal text-button-md font-medium rounded-lg border border-hairline hover:bg-surface-soft transition-all duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>

          {/* ── Card 2: Live Location & Context (Span 4) ── */}
          <motion.div
            custom={3}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            className="md:col-span-4 rounded-xl bg-surface border border-hairline p-6 md:p-8 flex flex-col justify-between hover:border-hairline-strong transition-all duration-300 shadow-elevation-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="text-micro-uppercase text-steel font-semibold tracking-wider">
                    Base
                  </span>
                </div>
                <div className="px-2.5 py-0.5 rounded bg-canvas border border-hairline text-steel text-[10px] font-medium font-mono uppercase tracking-wider">
                  <span>Remote Ready</span>
                </div>
              </div>

              <h3 className="text-heading-4 text-charcoal font-semibold mb-1">
                Palu, Indonesia
              </h3>
              <p className="text-caption text-steel mb-6">
                Central Sulawesi · GMT+8 (WITA)
              </p>

              {/* Live Time Display */}
              <div className="p-4 rounded-lg bg-canvas border border-hairline">
                <div className="flex items-center gap-2 text-micro-uppercase text-steel font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 text-steel" />
                  <span>Local Time</span>
                </div>
                <div className="text-heading-3 text-charcoal font-mono font-semibold tracking-tight">
                  {paluTime || "--:--:-- --"}
                </div>
              </div>
            </div>

            <p className="text-caption text-slate mt-6 leading-relaxed">
              Open for remote engineering roles and open-source initiatives.
            </p>
          </motion.div>

          {/* ── Card 3: Community & Leadership (Span 4) ── */}
          <motion.div
            custom={4}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            className="md:col-span-4 rounded-xl bg-surface border border-hairline p-6 md:p-8 flex flex-col justify-between hover:border-hairline-strong transition-all duration-300 shadow-elevation-1"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-micro-uppercase text-steel font-semibold tracking-wider">
                  Community Roots
                </span>
              </div>

              <h3 className="text-heading-4 text-charcoal font-semibold mb-2">
                Empowering Tech Ecosystems
              </h3>

              <p className="text-body-sm text-slate leading-relaxed mb-4">
                Active coordinator at <strong>Programming Tadulako</strong> and Person-in-Charge for <strong>I-Fest 2026</strong>.
              </p>

              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-body-sm p-2.5 rounded bg-canvas border border-hairline">
                  <span className="text-charcoal font-medium">Programming Tadulako</span>
                  <span className="text-caption text-steel font-mono">Mentor Lead</span>
                </div>
                <div className="flex items-center justify-between text-body-sm p-2.5 rounded bg-canvas border border-hairline">
                  <span className="text-charcoal font-medium">I-Fest 2026</span>
                  <span className="text-caption text-steel font-mono">PIC</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline">
              <Link
                href="/journey"
                className="group inline-flex items-center gap-2 text-button-md font-medium text-primary hover:text-primary-pressed transition-colors duration-200"
              >
                <span>Read Journey</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </motion.div>

          {/* ── Card 4: Technical Stack & Tooling (Span 4) ── */}
          <motion.div
            custom={5}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={cardVariants}
            className="md:col-span-4 rounded-xl bg-surface border border-hairline p-6 md:p-8 flex flex-col justify-between hover:border-hairline-strong transition-all duration-300 shadow-elevation-1"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span className="text-micro-uppercase text-steel font-semibold tracking-wider">
                  Tooling &amp; Stack
                </span>
              </div>

              <h3 className="text-heading-4 text-charcoal font-semibold mb-2">
                Tech I Work With
              </h3>

              <p className="text-body-sm text-slate leading-relaxed mb-4">
                Selected technologies focused on type-safety, speed, and clean code.
              </p>

              {/* Stack Chips with Crisp Logos */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-canvas border border-hairline text-charcoal text-[11px] font-mono hover:border-primary/40 hover:text-primary transition-all duration-200"
                  >
                    {tech.icon}
                    <span className="font-medium text-charcoal">{tech.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-caption text-steel">
              <span>Continuous exploration</span>
              <span className="font-mono">Next.js 14</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
