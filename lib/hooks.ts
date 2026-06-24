import { useState, useEffect } from "react";

/**
 * Hook to detect device type for performance optimizations
 * Returns true if device is low-end or mobile
 */
export function useDeviceType() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowEnd: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Detect low-end devices
      const isLowEnd = checkLowEndDevice();

      setDeviceInfo({
        isMobile,
        isLowEnd,
        prefersReducedMotion,
      });
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    // Listen for reduced motion preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => checkDevice();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    }

    return () => {
      window.removeEventListener("resize", checkDevice);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      }
    };
  }, []);

  return deviceInfo;
}

/**
 * Check if device is low-end based on various factors
 */
function checkLowEndDevice(): boolean {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  if (cores <= 2) return true;

  // Check memory (if available)
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (memory && memory <= 2) return true;

  // Check connection (if available)
  const connection = (navigator as unknown as { connection?: { effectiveType: string } }).connection;
  if (connection) {
    const slowConnections = ["slow-2g", "2g", "3g"];
    if (slowConnections.includes(connection.effectiveType)) {
      return true;
    }
  }

  return false;
}

/**
 * Hook specifically for checking reduced motion preference
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Get optimized animation config based on device capabilities
 */
export function getAnimationConfig(deviceInfo: {
  isMobile: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
}) {
  if (deviceInfo.prefersReducedMotion) {
    return {
      duration: 0.01,
      enabled: false,
      complexity: "none" as const,
    };
  }

  if (deviceInfo.isLowEnd) {
    return {
      duration: 0.4,
      enabled: true,
      complexity: "minimal" as const,
    };
  }

  if (deviceInfo.isMobile) {
    return {
      duration: 0.6,
      enabled: true,
      complexity: "reduced" as const,
    };
  }

  return {
    duration: 1,
    enabled: true,
    complexity: "full" as const,
  };
}

// Global variable to track intro state across client-side navigations
let hasSeenIntroGlobal = false;

/**
 * Hook to check if the user has seen the intro animation in the current session
 * Returns false on first load/refresh, true on subsequent navigations
 */
export function useIntroSeen() {
  const [hasSeen, setHasSeen] = useState(hasSeenIntroGlobal);

  useEffect(() => {
    // If it's the first time, mark it as seen for future navigations
    if (!hasSeenIntroGlobal) {
      hasSeenIntroGlobal = true;
      // We keep hasSeen as false for this render to play the intro
    } else {
      // If global is already true, ensure local state is true
      setHasSeen(true);
    }
  }, []);

  return hasSeen;
}
