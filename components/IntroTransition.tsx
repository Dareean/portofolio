"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { useDeviceType } from "@/lib/hooks";

export default function IntroTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const blindsWrapRef = useRef<HTMLDivElement>(null);
  // Use 8 blinds always in DOM; GSAP picks them all up regardless of device
  // This avoids SSR hydration mismatch from deviceInfo being default on first render
  const BLIND_COUNT = 8;
  const [showIntro, setShowIntro] = useState(true);
  const { theme } = useTheme();
  const deviceInfo = useDeviceType();

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const blindsWrap = blindsWrapRef.current;

    // Safety fallback: Ensure intro unmounts after 3.5s max even if GSAP or client JS hangs
    const safetyTimer = setTimeout(() => {
      document.body.style.overflow = "";
      if (container) container.style.display = "none";
      setShowIntro(false);
    }, 3500);

    if (!container || !logo || !blindsWrap) {
      clearTimeout(safetyTimer);
      return;
    }

    // If reduced motion: skip instantly
    if (deviceInfo.prefersReducedMotion) {
      clearTimeout(safetyTimer);
      document.body.style.overflow = "";
      setShowIntro(false);
      return;
    }

    const isFast = deviceInfo.isLowEnd || deviceInfo.isMobile;

    // Prevent page scroll during intro
    document.body.style.overflow = "hidden";

    // Collect blind elements
    const blindEls = Array.from(blindsWrap.children) as HTMLElement[];

    // Set initial state for blinds & logo via GSAP (avoids CSS conflict)
    gsap.set(blindEls, { yPercent: 0, willChange: "transform" });
    gsap.set(logo, { opacity: 0, scale: 0.7, yPercent: 0, willChange: "transform, opacity" });

    // Build coordinated timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Re-allow scroll, then unmount
        document.body.style.overflow = "";
        gsap.set(container, { display: "none" });
        setShowIntro(false);
      },
    });

    if (isFast) {
      // ─── Fast path: simplified 2-step animation ───
      // 1. Logo in
      tl.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      });
      // 2. Brief hold
      tl.to({}, { duration: 0.25 });
      // 3. Logo out + blinds slide up together
      tl.to(logo, {
        yPercent: -120,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      }, "exit");
      tl.to(blindEls, {
        yPercent: -101,
        duration: 0.4,
        stagger: {
          each: 0.03,
          from: "start",
        },
        ease: "power3.inOut",
      }, "exit");
    } else {
      // ─── Full path: premium cinematic sequence ───
      // 1. Logo fades + scales in
      tl.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.4)",
      });
      // 2. Brief hold — let user read the logo
      tl.to({}, { duration: 0.55 });
      // 3. Logo zooms up and out (cinematic exit)
      tl.to(logo, {
        yPercent: -140,
        scale: 1.3,
        opacity: 0,
        duration: 0.55,
        ease: "power2.in",
      }, "exit");
      // 4. Blinds slide up with stagger — starts same time as logo exit
      tl.to(blindEls, {
        yPercent: -101,
        duration: 0.55,
        stagger: {
          each: 0.045,
          from: "start",
        },
        ease: "power3.inOut",
      }, "exit+=0.05");
    }

    return () => {
      clearTimeout(safetyTimer);
      tl.kill();
      document.body.style.overflow = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceInfo.prefersReducedMotion, deviceInfo.isLowEnd, deviceInfo.isMobile]);

  if (!showIntro) return null;

  const blinds = Array.from({ length: BLIND_COUNT });

  const bgColor = theme === "dark" ? "#0A1530" : "#FFFFFF";
  const blindColor = theme === "dark"
    ? "linear-gradient(to bottom, #1A2A52, #0A1530, #1A2A52)"
    : "linear-gradient(to bottom, #F0EEEC, #FAFAF9, #EDE9E4)";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* ── Vertical Blinds ── */}
      {/* These slide UPWARD using translateY, not scaleY — smoother on GPU */}
      <div
        ref={blindsWrapRef}
        className="absolute inset-0 flex pointer-events-none"
      >
        {blinds.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{ background: blindColor }}
          />
        ))}
      </div>

      {/* ── Logo ── */}
      <div
        ref={logoRef}
        className="relative z-10 flex flex-col items-center gap-4 select-none"
      >
        <div className="relative">
          <Image
            src="/assets/logo_lambang_dareean.png"
            alt="Dareean"
            width={96}
            height={96}
            priority
            className="w-20 h-20 sm:w-24 sm:h-24"
            style={{
              filter: theme === "dark" ? "invert(1) brightness(1.2)" : "none",
            }}
          />
          {/* Subtle glow ring */}
          <div
            className="absolute inset-[-12px] rounded-full blur-xl opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(86,69,212,0.6) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Wordmark below logo */}
        <p
          className="text-xs tracking-[0.5em] font-medium uppercase"
          style={{
            color: theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
            fontFamily: "var(--font-notion), Inter, sans-serif",
          }}
        >
          Dareean
        </p>
      </div>
    </div>
  );
}
