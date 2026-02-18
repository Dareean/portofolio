"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Narrative chapters ───
const CHAPTERS = [
  {
    year: "2021",
    heading: "It started with curiosity.",
    body: "I picked up my first line of code — HTML, CSS, JavaScript. No bootcamp, no deadline. Just a kid in Central Sulawesi who wanted to understand how the web worked.",
    accent: "curiosity",
  },
  {
    year: "2023",
    heading: "First real-world code.",
    body: "Interned at PT. Educa Studio as a web programmer, then joined the Teaching Factory program at Gamelab Indonesia. I learned that production code is a different sport entirely.",
    accent: "real-world",
  },
  {
    year: "2024",
    heading: "University opened new doors.",
    body: "Started my Informatics degree — combining formal computer science with the practical skills I'd already built. Algorithms met aesthetics.",
    accent: "new doors",
  },
  {
    year: "2025 — now",
    heading: "Building, leading, creating.",
    body: "Competing in UI/UX and IoT competitions. Coordinating mentors at Programming Tadulako. Leading I-Fest as PIC. Building for communities, not just clients.",
    accent: "creating",
  },
];

// ─── Split helpers ───
const splitChars = (text: string) =>
  text.split("").map((char, i) => (
    <span
      key={i}
      className="st-char inline-block"
      style={{ perspective: "600px" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

const splitWords = (text: string) =>
  text.split(" ").map((word, i) => (
    <span key={i} className="st-word inline-block mr-[0.3em]">
      {word}
    </span>
  ));

export default function ScrolltellingHome() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ──────────── GSAP master timeline ────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ── 1. Opening statement: "I see code as a bridge..." ──
      const openingSection = document.querySelector(".st-opening");
      if (openingSection) {
        const openingWords = openingSection.querySelectorAll(".st-word");
        const openingTl = gsap.timeline({
          scrollTrigger: {
            trigger: openingSection,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        });
        openingTl.fromTo(
          openingWords,
          { opacity: 0.1, filter: "blur(5px)", y: 10 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            stagger: 0.06,
            ease: "power2.out",
          },
        );
      }

      // ── 2. Each chapter: pinned + sequential reveal ──
      CHAPTERS.forEach((_, i) => {
        const section = document.querySelector(`.st-chapter-${i}`);
        if (!section) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${isMobile ? 120 : 150}%`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        // Year label slides in
        tl.fromTo(
          section.querySelector(".st-year"),
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
          0,
        );

        // Heading chars cascade in
        const chars = section.querySelectorAll(".st-char");
        tl.fromTo(
          chars,
          { opacity: 0, y: 60, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.02,
            ease: "power3.out",
          },
          0.15,
        );

        // Body text fades in word by word
        const bodyWords = section.querySelectorAll(".st-body .st-word");
        tl.fromTo(
          bodyWords,
          { opacity: 0, y: 20, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.4,
            stagger: 0.03,
            ease: "power2.out",
          },
          0.5,
        );

        // Decorative line scales in
        tl.fromTo(
          section.querySelector(".st-line"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.3, ease: "power2.inOut" },
          0.4,
        );

        // Hold for reading
        tl.to({}, { duration: 0.6 });

        // Fade out
        tl.to(
          [
            section.querySelector(".st-year"),
            section.querySelector(".st-heading"),
            section.querySelector(".st-body"),
            section.querySelector(".st-line"),
          ],
          {
            opacity: 0,
            y: -30,
            duration: 0.3,
            stagger: 0.04,
            ease: "power2.in",
          },
        );
      });

      // ── 3. "From pixels to people" typography moment ──
      const bridgeSection = document.querySelector(".st-bridge");
      if (bridgeSection) {
        const bridgeTl = gsap.timeline({
          scrollTrigger: {
            trigger: bridgeSection,
            start: "top top",
            end: () => `+=${isMobile ? 130 : 180}%`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        // "From pixels" chars cascade
        const line1Chars = bridgeSection.querySelectorAll(
          ".st-bridge-l1 .st-char",
        );
        bridgeTl.fromTo(
          line1Chars,
          { opacity: 0, y: 80, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: "power3.out",
          },
          0,
        );

        // Divider
        bridgeTl.fromTo(
          bridgeSection.querySelector(".st-bridge-divider"),
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.3, ease: "power2.inOut" },
          0.4,
        );

        // "to people." word by word
        const line2Words = bridgeSection.querySelectorAll(
          ".st-bridge-l2 .st-word",
        );
        bridgeTl.fromTo(
          line2Words,
          { opacity: 0, y: 60, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            stagger: 0.15,
            ease: "power2.out",
          },
          0.5,
        );

        // Hold
        bridgeTl.to({}, { duration: 0.8 });

        // Fade out
        bridgeTl.to(
          [
            bridgeSection.querySelector(".st-bridge-l1"),
            bridgeSection.querySelector(".st-bridge-divider"),
            bridgeSection.querySelector(".st-bridge-l2"),
          ],
          {
            opacity: 0,
            y: -40,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.in",
          },
        );
      }

      // ── 4. CTA section fade-in ──
      const ctaSection = document.querySelector(".st-cta");
      if (ctaSection) {
        const ctaItems = ctaSection.querySelectorAll(".st-cta-item");
        gsap.fromTo(
          ctaItems,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaSection,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <div ref={wrapperRef}>
      {/* ═══════════════════════════════════════════
          Section 1: Opening statement (scroll-reveal)
          ═══════════════════════════════════════════ */}
      <section className="st-opening relative py-32 md:py-48 px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-off-white/[0.015] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-px bg-off-white/25" />
            <span className="text-off-white/35 text-[10px] tracking-[0.35em] uppercase font-light">
              About
            </span>
          </div>

          {/* Quote mark */}
          <div
            className="text-off-white/[0.06] font-display text-7xl md:text-8xl leading-none mb-3 select-none"
            aria-hidden="true"
          >
            &ldquo;
          </div>

          {/* Scroll-reveal text */}
          <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-off-white leading-relaxed tracking-tight">
            {splitWords(
              "I see code not just as syntax, but as a bridge between ideas and reality. My journey is defined by a relentless curiosity — from building smart solutions to nurturing tech communities in Palu.",
            )}
          </p>

          <div
            className="text-off-white/[0.06] font-display text-7xl md:text-8xl leading-none text-right mt-3 select-none"
            aria-hidden="true"
          >
            &rdquo;
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Section 2: Chapter cards (pinned scroll)
          ═══════════════════════════════════════════ */}
      {CHAPTERS.map((ch, i) => (
        <section
          key={i}
          className={`st-chapter-${i} relative h-screen flex items-center justify-center overflow-hidden bg-void-black`}
        >
          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 md:px-16">
            {/* Year */}
            <span className="st-year block font-mono text-off-white/20 text-xs sm:text-sm tracking-[0.4em] uppercase mb-6 opacity-0">
              {ch.year}
            </span>

            {/* Heading */}
            <h2
              className="st-heading font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-off-white font-bold tracking-tight leading-[1.05]"
              style={{ perspective: "800px" }}
            >
              {splitChars(ch.heading)}
            </h2>

            {/* Decorative line */}
            <div className="st-line w-16 sm:w-24 h-px bg-gradient-to-r from-off-white/30 to-transparent my-6 sm:my-10 origin-left" />

            {/* Body */}
            <div className="st-body max-w-2xl">
              <p className="text-off-white/55 text-base sm:text-lg md:text-xl leading-relaxed font-light">
                {splitWords(ch.body)}
              </p>
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════════════════════════════════════
          Section 3: "From pixels to people" bridge
          ═══════════════════════════════════════════ */}
      <section className="st-bridge relative h-screen flex items-center justify-center overflow-hidden bg-void-black">
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-off-white/[0.01] rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6">
          {/* Line 1 */}
          <div
            className="st-bridge-l1 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-off-white tracking-tight leading-none"
            style={{ perspective: "800px" }}
          >
            {splitChars("From pixels")}
          </div>

          {/* Divider */}
          <div className="st-bridge-divider w-20 sm:w-32 h-px bg-gradient-to-r from-transparent via-off-white/40 to-transparent my-5 sm:my-8 origin-center opacity-0" />

          {/* Line 2 */}
          <div className="st-bridge-l2 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none">
            <span className="st-word inline-block mr-[0.3em] text-off-white/60">
              to
            </span>
            <span
              className="st-word inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #f0a6ca, #efc3a3, #f5d5a0)",
              }}
            >
              people.
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Section 4: CTA — Explore further
          ═══════════════════════════════════════════ */}
      <section className="st-cta relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-void-black">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtitle */}
          <p className="st-cta-item text-off-white/30 text-xs tracking-[0.35em] uppercase font-light mb-8 opacity-0">
            Want to know more?
          </p>

          {/* CTA heading */}
          <h3 className="st-cta-item font-display text-3xl sm:text-4xl md:text-5xl text-off-white tracking-tight mb-12 opacity-0">
            Explore my journey & work
          </h3>

          {/* CTA links */}
          <div className="st-cta-item flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 opacity-0">
            <Link
              href="/journey"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-off-white/25 rounded-full text-off-white text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300"
            >
              My Journey
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-off-white/25 rounded-full text-off-white text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300"
            >
              My Work
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
