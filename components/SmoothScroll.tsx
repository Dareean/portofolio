"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disable smooth scroll on mobile for better performance
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      return; // Skip Lenis initialization on mobile
    }

    const lenis = new Lenis({
      lerp: 0.15, // Higher lerp = more responsive, less floaty (medium pace)
      duration: 1.2, // Slightly shorter duration
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slightly reduced speed for control
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Expose lenis to window for external access
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
