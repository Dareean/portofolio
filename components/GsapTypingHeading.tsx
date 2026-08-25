"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface GsapTypingHeadingProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  speed?: number; // ms per character
  delay?: number; // start delay in seconds
  showCursor?: boolean;
}

export default function GsapTypingHeading({
  text,
  className = "",
  as: Component = "h2",
  speed = 35,
  delay = 0.1,
  showCursor = true,
}: GsapTypingHeadingProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const element = containerRef.current;
    if (!element) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplayedText(text);
      setIsDone(true);
      return;
    }

    const stateObj = { count: 0 };

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 88%",
      once: true,
      onEnter: () => {
        setIsTyping(true);
        gsap.to(stateObj, {
          count: text.length,
          duration: Math.max(0.4, (text.length * speed) / 1000),
          delay: delay,
          ease: "none",
          onUpdate: () => {
            setDisplayedText(text.slice(0, Math.ceil(stateObj.count)));
          },
          onComplete: () => {
            setDisplayedText(text);
            setIsTyping(false);
            setIsDone(true);
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [text, speed, delay]);

  return (
    <Component
      ref={containerRef as any}
      className={`relative inline-block ${className}`}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {displayedText}
        {showCursor && (
          <span
            className={`inline-block ml-1 font-mono text-primary font-normal transition-opacity duration-300 ${
              isTyping
                ? "animate-pulse opacity-100"
                : isDone
                ? "opacity-0 transition-opacity duration-700"
                : "opacity-70 animate-pulse"
            }`}
          >
            |
          </span>
        )}
      </span>
    </Component>
  );
}
