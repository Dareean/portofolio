"use client";

import { useRef, useEffect, FC, ReactNode, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
}

const ScrollReveal: FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Split text into words
  const splitText = (text: string): string[] => {
    return text.split(" ");
  };

  const words =
    typeof children === "string" ? splitText(children) : [children];

  useEffect(() => {
    if (!containerRef.current) return;

    const wordElements =
      containerRef.current.querySelectorAll<HTMLSpanElement>(".scroll-word");

    gsap.fromTo(
      wordElements,
      {
        opacity: baseOpacity,
        filter: enableBlur ? `blur(${blurStrength}px)` : "none",
        y: 20, // Added slight vertical offset for "floating up" effect
        willChange: "filter, opacity, transform",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.05, // Faster stagger for quicker reveal
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          scroller: scrollContainerRef?.current || undefined,
          start: "top 85%", // Start when top of element hits 85% of viewport
          end: "top 40%", // End when top of element hits 40% (near center)
          scrub: true,
        },
      }
    );

    // Container rotation animation
    if (baseRotation !== 0) {
      gsap.fromTo(
        containerRef.current,
        { rotateX: baseRotation },
        {
          rotateX: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: scrollContainerRef?.current || undefined,
            start: "top 85%",
            end: "top 50%", // Complete rotation by center
            scrub: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [baseOpacity, baseRotation, blurStrength, enableBlur, scrollContainerRef]);

  return (
    <div
      ref={containerRef}
      className={`scroll-reveal-container ${containerClassName}`}
      style={{ perspective: "1000px" }}
    >
      <p className={`scroll-reveal-text ${textClassName}`}>
        {words.map((word, index) => (
          <span
            key={index}
            className="scroll-word inline-block mr-[0.25em] last:mr-0"
            style={{
              opacity: baseOpacity,
              filter: enableBlur ? `blur(${blurStrength}px)` : "none",
            }}
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
};

export default ScrollReveal;
