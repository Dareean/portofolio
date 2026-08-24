"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, Code2, Zap, GraduationCap, Rocket, Lightbulb } from "lucide-react";
import { useDeviceType } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

// ─── Narrative chapters ───
const CHAPTERS = [
  {
    year: "2021",
    heading: "It started with curiosity.",
    body: "I picked up my first line of code — HTML, CSS, JavaScript. No bootcamp, no deadline. Just a kid in Central Sulawesi who wanted to understand how the web worked.",
    tint: "bg-tint-sky",
    icon: <Code2 className="w-5 h-5 text-blue-600" />,
  },
  {
    year: "2023",
    heading: "First real-world code.",
    body: "Interned at PT. Educa Studio as a web programmer, then joined the Teaching Factory program at Gamelab Indonesia. Production code is a different sport entirely.",
    tint: "bg-tint-mint",
    icon: <Zap className="w-5 h-5 text-emerald-600" />,
  },
  {
    year: "2024",
    heading: "University opened new doors.",
    body: "Started my Informatics degree — combining formal computer science with the practical skills I'd already built. Algorithms met aesthetics.",
    tint: "bg-tint-lavender",
    icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
  },
  {
    year: "2025 — now",
    heading: "Building, leading, creating.",
    body: "Competing in UI/UX and IoT competitions. Coordinating mentors at Programming Tadulako. Leading I-Fest as PIC. Building for communities, not just clients.",
    tint: "bg-tint-rose",
    icon: <Rocket className="w-5 h-5 text-rose-600" />,
  },
];

const STATS = [
  { label: "Projects Built", value: 10, suffix: "+" },
  { label: "Communities", value: 4, suffix: "" },
  { label: "Competitions", value: 3, suffix: "+" },
  { label: "Years Coding", value: 4, suffix: "" },
];

const splitWords = (text: string) =>
  text.split(" ").map((word, i) => (
    <span key={i} className="st-word inline-block mr-[0.3em]">{word}</span>
  ));

export default function ScrolltellingHome() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceType();

  // GSAP scroll-reveal animations — all "once: true" to kill observers after first fire
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (deviceInfo.prefersReducedMotion || deviceInfo.isLowEnd) {
        gsap.set(".st-word", { opacity: 1, y: 0 });
        gsap.set(".st-feature-card", { opacity: 1, y: 0 });
        gsap.set(".st-banner", { opacity: 1, y: 0 });
        gsap.set(".st-stat-item", { opacity: 1, y: 0 });
        gsap.set(".st-cta-item", { opacity: 1, y: 0 });
        return;
      }

      const isMob = deviceInfo.isMobile;

      // ── Opening paragraph — no scrub, just once-only fade ──
      // scrub fires on every pixel scrolled; once fires once and kills the observer
      const openingSection = document.querySelector(".st-opening");
      if (openingSection) {
        const words = openingSection.querySelectorAll(".st-word");
        gsap.fromTo(
          words,
          { opacity: 0, y: isMob ? 8 : 12 },
          {
            opacity: 1,
            y: 0,
            stagger: isMob ? 0.012 : 0.018,
            duration: 0.35,
            ease: "power2.out",
            scrollTrigger: {
              trigger: openingSection,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      // ── Feature cards — single batch stagger ──
      const featureCards = document.querySelectorAll(".st-feature-card");
      if (featureCards.length) {
        gsap.fromTo(
          featureCards,
          { opacity: 0, y: isMob ? 18 : 28 },
          {
            opacity: 1,
            y: 0,
            duration: isMob ? 0.4 : 0.55,
            stagger: isMob ? 0.05 : 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featureCards[0],
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // ── Bold banner ──
      const bannerSection = document.querySelector(".st-banner");
      if (bannerSection) {
        gsap.fromTo(
          bannerSection,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bannerSection,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // ── Stats ──
      const statItems = document.querySelectorAll(".st-stat-item");
      if (statItems.length) {
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".st-stats",
              start: "top 82%",
              once: true,
            },
          }
        );
      }

      // ── CTA ──
      const ctaItems = document.querySelectorAll(".st-cta-item");
      if (ctaItems.length) {
        gsap.fromTo(
          ctaItems,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.45,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".st-cta",
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [deviceInfo]);

  // Counter component
  const StatCounter = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const duration = 2000;
            const startTime = Date.now();
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.floor(eased * value));
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }, [value]);

    return (
      <div ref={ref} className="st-stat-item text-center">
        <div className="stat-counter text-display-lg text-primary font-semibold">
          {count}{suffix}
        </div>
        <div className="mt-2 text-body-sm-medium text-steel uppercase tracking-wider">
          {label}
        </div>
      </div>
    );
  };

  return (
    <div ref={wrapperRef}>
      {/* ═══════════════════════════════════════════
          Opening Statement
          ═══════════════════════════════════════════ */}
      <section className="st-opening relative py-section-lg md:py-[120px] px-6 md:px-8 overflow-hidden">
        <div className="max-w-container mx-auto">
          <div className="max-w-3xl">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-primary/40" />
              <span className="text-micro-uppercase text-primary font-semibold tracking-wider">
                About
              </span>
            </div>

            <p className="text-heading-2 md:text-display-lg text-charcoal font-semibold leading-[1.1] tracking-tight">
              {splitWords(
                "I see code not just as syntax, but as a bridge between ideas and reality. My journey is defined by a relentless curiosity — from building smart solutions to nurturing tech communities in Palu.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Feature Cards Section — Pastel-tinted cards
          ═══════════════════════════════════════════ */}
      <section className="px-6 md:px-8 pb-section-lg">
        <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {CHAPTERS.map((ch, i) => (
            <div
              key={i}
              className={`st-feature-card ${ch.tint} rounded-lg p-8 md:p-10 transition-all duration-300 hover:shadow-elevation-2`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-caption-bold text-charcoal/60 font-mono">
                  {ch.year}
                </span>
                <span className="text-2xl opacity-60">{ch.icon}</span>
              </div>
              <h3 className="text-heading-4 text-charcoal font-semibold mb-3">
                {ch.heading}
              </h3>
              <p className="text-body-md text-slate leading-relaxed">
                {ch.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Bold Yellow Banner — "Ask the assistant" style
          ═══════════════════════════════════════════ */}
      <section className="st-banner px-6 md:px-8 pb-section-lg">
        <div className="max-w-container mx-auto bg-tint-yellow-bold rounded-lg p-10 md:p-16">
          <div className="max-w-2xl mx-auto text-center">
            <Lightbulb className="w-8 h-8 text-amber-600 mb-4 inline-block" />
            <h2 className="text-heading-2 md:text-heading-1 text-charcoal font-semibold tracking-tight mb-4">
              From curiosity to creation
            </h2>
            <p className="text-body-md text-slate leading-relaxed max-w-lg mx-auto">
              Every project starts with a question. What if? Why not? How might we?
              These questions drive everything I build.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Stats Section
          ═══════════════════════════════════════════ */}
      <section className="st-stats px-6 md:px-8 pb-section-lg">
        <div className="max-w-container mx-auto bg-surface rounded-lg p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, i) => (
              <StatCounter key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Bridge Section — "From pixels to people"
          ═══════════════════════════════════════════ */}
      <section className="px-6 md:px-8 pb-[120px]">
        <div className="max-w-container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-heading-2 md:text-display-lg text-charcoal font-semibold tracking-tight leading-[1.1]">
              From pixels{" "}
              <span className="text-hairline-strong mx-4">→</span>{" "}
              <span className="text-primary">to people.</span>
            </h2>
            <div className="w-16 h-1 bg-primary/30 mx-auto mt-6 mb-6 rounded-full" />
            <p className="text-body-md text-slate max-w-xl mx-auto">
              Technology is meaningless without the people it serves. Every interface
              is a conversation. Every interaction, a relationship.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════ */}
      <section className="st-cta px-6 md:px-8 pb-section-lg">
        <div className="max-w-container mx-auto text-center">
          <p className="st-cta-item text-micro-uppercase text-primary font-semibold mb-4">
            Want to know more?
          </p>

          <h3 className="st-cta-item text-heading-2 md:text-heading-1 text-charcoal font-semibold tracking-tight mb-8">
            Explore my journey & work
          </h3>

          <div className="st-cta-item flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/journey"
              className="inline-flex items-center gap-2 px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200"
            >
              My Journey
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-[18px] py-[10px] bg-transparent text-charcoal text-button-md font-medium rounded-md border border-hairline-strong hover:bg-surface transition-all duration-200"
            >
              My Work
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
