"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function MoireEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Transform patterns based on scroll
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate line patterns
  const lineCount = 60;
  const lines = Array.from({ length: lineCount }, (_, i) => i);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black">
      {/* Pattern Layer 1 - Vertical Lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotate: rotate1,
          scale,
          x: mousePosition.x * 20 - 10,
          y: mousePosition.y * 20 - 10,
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

      {/* Pattern Layer 2 - Diagonal Lines (creates moiré) */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotate: rotate2,
          scale,
          x: mousePosition.x * -15 + 7.5,
          y: mousePosition.y * -15 + 7.5,
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

      {/* Pattern Layer 3 - Horizontal Lines */}
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [0, 10, 0],
        }}
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
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scaleX: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Pattern Layer 4 - Radial from mouse */}
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

      {/* Mathematical Grid - Creates interference patterns */}
      <motion.div
        className="absolute inset-0"
        animate={{
          rotate: [0, 360],
        }}
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

      {/* Pulsating Circles - Mathematical precision */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/5 rounded-full pointer-events-none"
          style={{
            width: `${(i + 1) * 20}%`,
            height: `${(i + 1) * 20}%`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.03, 0.08, 0.03],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Wave interference pattern */}
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
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

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
