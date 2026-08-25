"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Disable on CMS admin dashboard — standard native scrolling needed
    if (pathname?.startsWith("/cms")) return;

    // Disable on mobile — native touch scroll is already smooth
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || prefersReduced) return;

    // Check low-end device
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const isLowEnd = cores <= 2 || (memory !== undefined && memory <= 2);
    if (isLowEnd) return;

    const lenis = new Lenis({
      // Snappier feel — lower lerp = faster response (less lag)
      lerp: 0.08,
      duration: 0.9,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      // Prevent Lenis from hijacking scroll when user hasn't interacted
      infinite: false,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Expose globally so GSAP ScrollTrigger can sync
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, [pathname]);

  return <>{children}</>;
}
