"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    number: "01",
    title: "Design & Empathize",
    description: "Understanding the people behind the screen first. I research, wireframe, and prototype until every interaction feels intuitive.",
    tags: ["Figma", "UI/UX", "User Research"],
  },
  {
    number: "02",
    title: "Code & Craft",
    description: "Translating designs into pixel-perfect, performant frontends with modern tools and obsessive attention to detail.",
    tags: ["React", "Next.js", "TypeScript"],
  },
  {
    number: "03",
    title: "Lead & Organize",
    description: "From heading I-Fest as PIC to coordinating Palu Developer Day — I thrive in bringing people together and making things happen.",
    tags: ["Event Management", "Team Leadership", "Community"],
  },
  {
    number: "04",
    title: "Iterate & Grow",
    description: "Every project teaches something new. I chase feedback, embrace challenges, and keep pushing my craft forward.",
    tags: ["Continuous Learning", "Problem Solving", "Adaptability"],
  },
];

export default function ExploreLinks() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const isMobile = window.innerWidth < 768;
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${isMobile ? 250 : 300}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      masterTl.fromTo(progressBarRef.current, { scaleX: 0 }, { scaleX: 1, duration: 4, ease: "none" }, 0);
      masterTl.fromTo(".explore-progress-label", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0);

      CHAPTERS.forEach((_, i) => {
        const startTime = 0.3 + i * 0.9;
        masterTl.fromTo(`.explore-chapter-${i}`, { opacity: 0, y: 60, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }, startTime);
        masterTl.fromTo(`.explore-chapter-${i} .chapter-number`, { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, startTime + 0.1);
        masterTl.fromTo(`.explore-chapter-${i} .chapter-tag`, { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" }, startTime + 0.2);
        if (i < CHAPTERS.length - 1) {
          masterTl.to(`.explore-chapter-${i}`, { opacity: 0, y: -30, scale: 0.98, duration: 0.3, ease: "power2.in" }, startTime + 0.7);
        }
      });

      if (scrollIndicatorRef.current) {
        masterTl.to(scrollIndicatorRef.current, { opacity: 0, y: -10, duration: 0.2, ease: "power2.in" }, 0.05);
      }
      masterTl.fromTo(".explore-final-cta", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 3.8);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-canvas h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/[0.02] rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-10 md:px-16">
        <p className="explore-progress-label text-muted text-micro-uppercase font-semibold mb-6 sm:mb-8 opacity-0">
          How I Work
        </p>

        <div className="relative mb-8 sm:mb-12 md:mb-16">
          <div className="w-full h-px bg-hairline" />
          <div ref={progressBarRef} className="absolute top-0 left-0 h-px bg-primary origin-left" style={{ width: "100%" }} />
          <div className="absolute top-0 left-0 w-full flex justify-between -translate-y-1/2">
            {CHAPTERS.map((ch, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-hairline border border-hairline" />
            ))}
          </div>
        </div>

        <div className="relative min-h-[380px] sm:min-h-[400px] md:min-h-[420px]">
          {CHAPTERS.map((chapter, i) => (
            <div key={i} className={`explore-chapter-${i} absolute inset-0 flex flex-col justify-start opacity-0`}>
              <span className="chapter-number text-heading-1 md:text-display-lg text-charcoal/[0.06] font-semibold tracking-tighter leading-none mb-2 sm:mb-4 select-none opacity-0">
                {chapter.number}
              </span>
              <h3 className="text-heading-2 md:text-heading-1 text-charcoal font-semibold tracking-tight mb-1.5 sm:mb-3">
                {chapter.title}
              </h3>
              <p className="text-body-md text-slate max-w-lg mb-3 sm:mb-6">
                {chapter.description}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {chapter.tags.map((tag, j) => (
                  <span key={j} className="chapter-tag text-micro-uppercase text-steel px-3.5 py-1.5 border border-hairline rounded-md opacity-0">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="explore-final-cta mt-4 sm:mt-8 opacity-0">
          <Link href="/journey" className="group inline-flex items-center gap-3 text-primary text-button-md font-medium transition-all duration-300 hover:text-primary-pressed">
            <span>See it in Action</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div ref={scrollIndicatorRef} className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-micro-uppercase text-muted">keep scrolling</span>
        <svg className="w-4 h-4 text-muted animate-chevron-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
