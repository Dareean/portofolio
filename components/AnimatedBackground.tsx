"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "./ThemeProvider";

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Theme-aware colors
  const isDark = theme === "dark";

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate asterisk/star rotation
    gsap.to(".animated-star", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });

    // Animate circles floating
    gsap.to(".animated-circle", {
      y: "random(-30, 30)",
      x: "random(-20, 20)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.3,
        from: "random",
      },
    });

    // Animate dots with scale pulse
    gsap.to(".animated-dot", {
      scale: "random(0.8, 1.2)",
      opacity: "random(0.3, 0.8)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.5,
        from: "random",
      },
    });

    // Animate curved path
    gsap.to(".animated-path", {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Floating text animation
    gsap.to(".animated-text", {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-[1]"
    >
      {/* Asterisk/Star - Top Right */}
      <svg
        className={`animated-star absolute top-20 right-[15%] w-16 h-16 ${isDark ? "opacity-20" : "opacity-40"}`}
        viewBox="0 0 100 100"
      >
        <path
          d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z"
          fill="none"
          stroke={isDark ? "url(#gradient1)" : "#1e40af"}
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </svg>

      {/* Circle - Top Left */}
      <svg
        className={`animated-circle absolute top-32 left-[10%] w-12 h-12 ${isDark ? "opacity-15" : "opacity-40"}`}
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={isDark ? "#34D399" : "#059669"}
          strokeWidth="3"
        />
      </svg>

      {/* Small dots scattered */}
      <div className={`animated-dot absolute top-[25%] left-[20%] w-2 h-2 rounded-full ${isDark ? "bg-blue-400 opacity-40" : "bg-blue-600 opacity-60"}`} />
      <div className={`animated-dot absolute top-[40%] right-[25%] w-3 h-3 rounded-full ${isDark ? "bg-purple-400 opacity-30" : "bg-purple-600 opacity-50"}`} />
      <div className={`animated-dot absolute bottom-[30%] left-[15%] w-2 h-2 rounded-full ${isDark ? "bg-pink-400 opacity-40" : "bg-pink-600 opacity-60"}`} />
      <div className={`animated-dot absolute top-[60%] right-[15%] w-2 h-2 rounded-full ${isDark ? "bg-emerald-400 opacity-35" : "bg-emerald-600 opacity-55"}`} />

      {/* Curved Path - Left Side */}
      <svg
        className={`absolute top-[35%] left-0 w-64 h-64 ${isDark ? "opacity-10" : "opacity-30"}`}
        viewBox="0 0 200 200"
      >
        <path
          className="animated-path"
          d="M 10,100 Q 50,20 100,50 T 190,100"
          fill="none"
          stroke={isDark ? "url(#gradient2)" : "#2563eb"}
          strokeWidth="2"
          strokeDasharray="300"
          strokeDashoffset="300"
        />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </svg>

      {/* Diamond shape - Bottom Right */}
      <svg
        className={`animated-circle absolute bottom-[20%] right-[20%] w-10 h-10 ${isDark ? "opacity-15" : "opacity-40"}`}
        viewBox="0 0 100 100"
      >
        <path
          d="M 50,10 L 90,50 L 50,90 L 10,50 Z"
          fill="none"
          stroke={isDark ? "#F472B6" : "#db2777"}
          strokeWidth="2"
        />
      </svg>

      {/* Plus shape - Middle */}
      <svg
        className={`animated-star absolute top-[50%] left-[50%] w-8 h-8 ${isDark ? "opacity-10" : "opacity-30"}`}
        viewBox="0 0 100 100"
      >
        <path
          d="M 50,20 L 50,80 M 20,50 L 80,50"
          stroke={isDark ? "#60A5FA" : "#2563eb"}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

