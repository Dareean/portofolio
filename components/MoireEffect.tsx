"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDeviceType, getAnimationConfig } from "@/lib/hooks";

export default function MoireEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const deviceInfo = useDeviceType();
  const animConfig = getAnimationConfig(deviceInfo);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Transform patterns based on scroll
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  // Mouse tracking - disable on mobile for performance
  useEffect(() => {
    if (deviceInfo.isMobile || deviceInfo.isLowEnd) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [deviceInfo.isMobile, deviceInfo.isLowEnd]);

  // Reduce line count based on device capability
  const lineCount = deviceInfo.isLowEnd ? 20 : deviceInfo.isMobile ? 40 : 60;
  const lines = Array.from({ length: lineCount }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-black"
    >
      {/* Pattern Layer 1 - Vertical Lines - Disable on low-end */}
      {!deviceInfo.isLowEnd && (
        <motion.div
          className="absolute inset-0"
          style={{
            rotate: animConfig.enabled ? rotate1 : 0,
            scale: animConfig.enabled ? scale : 1,
            x: !deviceInfo.isMobile ? mousePosition.x * 20 - 10 : 0,
            y: !deviceInfo.isMobile ? mousePosition.y * 20 - 10 : 0,
            willChange: deviceInfo.prefersReducedMotion ? "auto" : "transform",
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="pattern1"
                x="0"
                y="0"
                width="20"
                height="100%"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.15"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern1)" />
          </svg>
        </motion.div>
      )}

      {/* Pattern Layer 2 - Diagonal Lines (creates moiré) - Disable on low-end */}
      {!deviceInfo.isLowEnd && (
        <motion.div
          className="absolute inset-0"
          style={{
            rotate: animConfig.enabled ? rotate2 : 0,
            scale: animConfig.enabled ? scale : 1,
            x: !deviceInfo.isMobile ? mousePosition.x * -15 + 7.5 : 0,
            y: !deviceInfo.isMobile ? mousePosition.y * -15 + 7.5 : 0,
            willChange: deviceInfo.prefersReducedMotion ? "auto" : "transform",
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="pattern2"
                x="0"
                y="0"
                width="20"
                height="100%"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(2)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.15"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern2)" />
          </svg>
        </motion.div>
      )}

      {/* Pattern Layer 3 - Horizontal Lines - Simplified on mobile */}
      <motion.div
        className="absolute inset-0"
        animate={animConfig.enabled ? {
          y: [0, 10, 0],
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {lines.map((i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-[2px] bg-white/10"
            style={{
              top: `${(i / lineCount) * 100}%`,
              willChange: deviceInfo.prefersReducedMotion ? "auto" : "opacity, transform",
            }}
            animate={animConfig.enabled ? {
              opacity: [0.05, 0.15, 0.05],
              scaleX: deviceInfo.isMobile ? [1, 1.01, 1] : [1, 1.02, 1],
            } : { opacity: 0.08 }}
            transition={{
              duration: deviceInfo.isMobile ? 4 : 3,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Pattern Layer 4 - Radial from mouse - Desktop only */}
      {!deviceInfo.isMobile && !deviceInfo.isLowEnd && (
        <motion.div
          className="absolute w-[800px] h-[800px] pointer-events-none"
          style={{
            left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          x: "-50%",
          y: "-50%",
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="radialPattern">
              <stop offset="0%" stopColor="white" stopOpacity="0.1" />
              <stop offset="50%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="none"
            stroke="url(#radialPattern)"
            strokeWidth="1"
          />
          <circle
            cx="50%"
            cy="50%"
            r="30%"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.05"
          />
          <circle
            cx="50%"
            cy="50%"
            r="20%"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.08"
          />
        </svg>
      </motion.div>
      )}

      {/* Mathematical Grid - Creates interference patterns - Desktop only */}
      {!deviceInfo.isLowEnd && (
        <motion.div
          className="absolute inset-0"
          animate={animConfig.enabled ? {
            rotate: [0, 360],
          } : {}}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="white" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>
      )}

      {/* Pulsating Circles - Mathematical precision - Reduce count on mobile */}
      {[0, 1, 2, 3, 4].slice(0, deviceInfo.isMobile ? 3 : 5).map((i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/5 rounded-full pointer-events-none"
          style={{
            width: `${(i + 1) * 20}%`,
            height: `${(i + 1) * 20}%`,
            willChange: deviceInfo.prefersReducedMotion ? "auto" : "transform, opacity",
          }}
          animate={animConfig.enabled ? {
            scale: [1, 1.05, 1],
            opacity: [0.03, 0.08, 0.03],
            rotate: [0, 180, 360],
          } : { opacity: 0.05 }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Wave interference pattern - Desktop only */}
      {!deviceInfo.isMobile && !deviceInfo.isLowEnd && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              ${mousePosition.x * 90}deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.02) 10px,
              rgba(255, 255, 255, 0.02) 20px
            )`,
          }}
          animate={animConfig.enabled ? {
            opacity: [0.5, 1, 0.5],
          } : { opacity: 0.7 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Vignette to soften edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}
