"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDeviceType } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

export default function PixelsToPeople() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceType();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section while scroll-telling plays out
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${window.innerWidth < 768 ? 150 : 200}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // === Line 1: "From pixels" — slide up + reveal ===
      if (line1Ref.current) {
        const chars1 = line1Ref.current.querySelectorAll(".char");
        tl.fromTo(
          chars1,
          {
            opacity: 0,
            y: 80,
            rotateX: -90,
          },
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
      }

      // === Divider line — scale in from center ===
      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.3, ease: "power2.inOut" },
          0.4,
        );
      }

      // === Line 2: "to people" — word by word stagger ===
      if (line2Ref.current) {
        const words2 = line2Ref.current.querySelectorAll(".word");
        tl.fromTo(
          words2,
          {
            opacity: 0,
            y: 60,
            filter: "blur(8px)",
          },
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
      }

      // === Line 3: subtitle — fade in ===
      if (line3Ref.current) {
        tl.fromTo(
          line3Ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.9,
        );
      }

      // === Scroll indicator fades out as user scrolls ===
      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10, duration: 0.15, ease: "power2.in" },
          0.05,
        );
      }

      // === Hold for a moment to let user read ===
      tl.to({}, { duration: 0.5 });

      // === Fade everything out as user scrolls past ===
      tl.to(
        [line1Ref.current, dividerRef.current, line2Ref.current, line3Ref.current],
        {
          opacity: 0,
          y: -40,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.in",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split text into individual character spans
  const splitChars = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ perspective: "600px" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  // Split text into word spans
  const splitWords = (text: string) =>
    text.split(" ").map((word, i) => (
      <span key={i} className="word inline-block mr-[0.3em]">
        {word}
      </span>
    ));

  return (
    <section
      ref={containerRef}
      className="relative bg-void-black h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-off-white/[0.012] rounded-full blur-[150px]" />
      </div>

      {/* Typography Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6">
        {/* Line 1: "From pixels" */}
        <div
          ref={line1Ref}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-off-white tracking-tight leading-none"
          style={{ perspective: "800px" }}
        >
          {splitChars("From pixels")}
        </div>

        {/* Decorative divider */}
        <div
          ref={dividerRef}
          className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-off-white/40 to-transparent my-6 sm:my-8 origin-center opacity-0"
        />

        {/* Line 2: "to people." */}
        <div
          ref={line2Ref}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-none"
        >
          <span className="word inline-block mr-[0.3em] text-off-white/60">to</span>
          <span
            className="word inline-block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #f0a6ca, #efc3a3, #f5d5a0)",
            }}
          >
            people.
          </span>
        </div>

        {/* Line 3: subtitle */}
        <p
          ref={line3Ref}
          className="mt-8 sm:mt-10 text-off-white/30 text-xs sm:text-sm tracking-[0.25em] uppercase font-light opacity-0"
        >
          crafting experiences that connect
        </p>
      </div>
      {/* Keep Scrolling Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-off-white/40 text-[9px] sm:text-[10px] tracking-[0.35em] uppercase font-light">
          keep scrolling
        </span>
        <svg
          className="w-4 h-4 text-off-white/30 animate-chevron-bounce"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
