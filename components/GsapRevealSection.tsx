"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface GsapRevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  id?: string;
}

export default function GsapRevealSection({
  children,
  className = "",
  delay = 0,
  yOffset = 30,
  duration = 0.8,
  id,
}: GsapRevealSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: yOffset },
      {
        opacity: 1,
        y: 0,
        duration: duration,
        delay: delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [delay, yOffset, duration]);

  return (
    <div ref={sectionRef} id={id} className={className}>
      {children}
    </div>
  );
}
