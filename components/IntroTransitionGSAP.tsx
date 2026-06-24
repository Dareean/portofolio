"use client";

import { useEffect, useRef, useState } from "react";
import { useDeviceType } from "@/lib/hooks";

// This version requires GSAP
// Install with: npm install gsap

export default function IntroTransitionGSAP() {
  const [showIntro, setShowIntro] = useState(true);
  const blindsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceType();

  useEffect(() => {
    // Dynamically import GSAP (client-side only)
    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;

      const blinds = blindsRef.current?.children;
      if (!blinds) return;

      // Adjust animation durations based on device capability
      const duration = deviceInfo.isLowEnd
        ? 0.4
        : deviceInfo.isMobile
          ? 0.6
          : 0.8;
      const stagger = deviceInfo.isLowEnd ? 0.04 : 0.08;

      // Animate vertical blinds with stagger
      gsap.to(blinds, {
        scaleY: 0,
        transformOrigin: "top",
        duration: duration,
        stagger: stagger,
        ease: "power3.inOut",
      });

      // Animate SVG path (handwriting effect) - Skip on low-end
      if (logoRef.current && !deviceInfo.isLowEnd) {
        const path = logoRef.current.querySelector("path");
        if (path) {
          const length = path.getTotalLength();

          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          gsap.to(path, {
            strokeDashoffset: 0,
            duration: deviceInfo.isMobile ? 1.0 : 1.5,
            delay: 0.6,
            ease: "power1.inOut",
          });
        }
      }

      // Animate text
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: deviceInfo.isLowEnd ? 0.8 : 1.8,
          },
        );
      }

      // Hide intro after complete - Faster on low-end devices
      const hideDelay = deviceInfo.isLowEnd
        ? 1500
        : deviceInfo.isMobile
          ? 2500
          : 3000;
      setTimeout(() => {
        gsap.to(blindsRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => setShowIntro(false),
        });
      }, hideDelay);
    };

    loadGSAP();
  }, [deviceInfo.isLowEnd, deviceInfo.isMobile]);

  if (!showIntro) return null;

  const blinds = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div
      ref={blindsRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#E8E4D9]"
    >
      {/* Vertical Blinds */}
      <div className="absolute inset-0 flex">
        {blinds.map((index) => (
          <div
            key={index}
            className="flex-1 bg-gradient-to-b from-[#A8A896] via-[#C8C4B4] to-[#A8A896]"
            style={{ transformOrigin: "top" }}
          />
        ))}
      </div>

      {/* SVG Signature */}
      <svg
        ref={logoRef}
        width="200"
        height="80"
        viewBox="0 0 200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <path
          d="M 20 40 Q 30 20, 50 40 T 90 40 M 95 25 L 95 55 M 100 25 Q 110 20, 120 40 Q 130 60, 140 40 M 145 25 L 145 55 L 165 55 M 145 40 L 160 40"
          stroke="#2A2A2A"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Text */}
      <div
        ref={textRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0"
      >
        <p className="font-mono text-xs tracking-[0.4em] text-[#2A2A2A]/60 uppercase">
          Portfolio 2026
        </p>
      </div>
    </div>
  );
}
