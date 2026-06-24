"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useTheme } from "./ThemeProvider";

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.to(".animated-star", { rotation: 360, duration: 20, repeat: -1, ease: "none" });
    gsap.to(".animated-circle", {
      y: "random(-30, 30)", x: "random(-20, 20)", duration: "random(3, 5)",
      repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.3, from: "random" },
    });
    gsap.to(".animated-dot", {
      scale: "random(0.8, 1.2)", opacity: "random(0.3, 0.8)", duration: "random(2, 4)",
      repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.5, from: "random" },
    });
  }, []);

  const accent = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <svg className="animated-star absolute top-20 right-[15%] w-16 h-16" viewBox="0 0 100 100" style={{ opacity: 0.15 }}>
        <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" fill="none" stroke={accent} strokeWidth="2" />
      </svg>
      <svg className="animated-circle absolute top-32 left-[10%] w-12 h-12" viewBox="0 0 100 100" style={{ opacity: 0.12 }}>
        <circle cx="50" cy="50" r="40" fill="none" stroke={accent} strokeWidth="3" />
      </svg>
      <div className="animated-dot absolute top-[25%] left-[20%] w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
      <div className="animated-dot absolute top-[40%] right-[25%] w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
      <div className="animated-dot absolute bottom-[30%] left-[15%] w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
      <div className="animated-dot absolute top-[60%] right-[15%] w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
      <div className="animated-circle absolute bottom-[20%] right-[20%] w-10 h-10" style={{ opacity: 0.12 }}>
        <svg viewBox="0 0 100 100" fill="none" stroke={accent} strokeWidth="2">
          <path d="M 50,10 L 90,50 L 50,90 L 10,50 Z" />
        </svg>
      </div>
    </div>
  );
}
