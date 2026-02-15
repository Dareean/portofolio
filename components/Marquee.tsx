"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface MarqueeProps {
  text?: string;
}

export default function Marquee({
    text = "DRIVEN • CREATIVE • DEDICATED • EVOLVING",    
}: MarqueeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const repeatedText = `${text} • `.repeat(6);

  // GSAP ScrollTrigger Animation
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        gsap.fromTo(sectionRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-24 overflow-hidden border-y border-off-white/10"
    >
      <div className="marquee-container marquee-gradient-mask">
        <div className="marquee-content">
          <span
            className="font-display text-[10vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] uppercase tracking-wider text-off-white/70"
          >
            {repeatedText}
          </span>
          <span
            className="font-display text-[10vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] uppercase tracking-wider text-off-white/70"
          >
            {repeatedText}
          </span>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
        }
        .marquee-content {
          display: flex;
          white-space: nowrap;
          animation: marquee 10s linear infinite;
        }
        .marquee-content span {
          flex-shrink: 0;
          padding-right: 2rem;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
