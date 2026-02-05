"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDeviceType, getAnimationConfig } from "@/lib/hooks";

export default function KineticTypography() {
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceType();
  const animConfig = getAnimationConfig(deviceInfo);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Transform text based on scroll - reduce on mobile
  const x1 = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", deviceInfo.isMobile ? "-15%" : "-30%"],
  );
  const x2 = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", deviceInfo.isMobile ? "15%" : "30%"],
  );
  const x3 = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", deviceInfo.isMobile ? "-10%" : "-20%"],
  );
  const x4 = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", deviceInfo.isMobile ? "12%" : "25%"],
  );

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Corner Ornaments - Editorial Style - Responsive */}
      <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-l border-t sm:border-l-2 sm:border-t-2 border-white/20 pointer-events-none" />
      <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-r border-t sm:border-r-2 sm:border-t-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-l border-b sm:border-l-2 sm:border-b-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-r border-b sm:border-r-2 sm:border-b-2 border-white/20 pointer-events-none" />

      {/* Architectural Grid Lines - Performance optimized for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vertical Lines - Conditionally rendered based on device */}
        {!deviceInfo.isLowEnd &&
          !deviceInfo.isMobile &&
          [...Array(20)].map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-white/5"
              style={{
                left: `${(i + 1) * 5}%`,
                willChange: deviceInfo.prefersReducedMotion
                  ? "auto"
                  : "opacity",
              }}
              initial={{ opacity: 0 }}
              animate={
                animConfig.enabled
                  ? { opacity: [0.05, 0.15, 0.05] }
                  : { opacity: 0.08 }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}

        {/* Mobile - Fewer vertical lines */}
        {!deviceInfo.isLowEnd &&
          deviceInfo.isMobile &&
          [...Array(8)].map((_, i) => (
            <motion.div
              key={`v-mobile-${i}`}
              className="absolute top-0 bottom-0 w-px bg-white/5"
              style={{
                left: `${(i + 1) * 12}%`,
                willChange: deviceInfo.prefersReducedMotion
                  ? "auto"
                  : "opacity",
              }}
              initial={{ opacity: 0 }}
              animate={
                animConfig.enabled
                  ? { opacity: [0.05, 0.12, 0.05] }
                  : { opacity: 0.08 }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}

        {/* Horizontal Lines - Conditionally rendered */}
        {!deviceInfo.isLowEnd &&
          !deviceInfo.isMobile &&
          [...Array(12)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-white/5"
              style={{
                top: `${(i + 1) * 8}%`,
                willChange: deviceInfo.prefersReducedMotion
                  ? "auto"
                  : "opacity",
              }}
              initial={{ opacity: 0 }}
              animate={
                animConfig.enabled
                  ? { opacity: [0.05, 0.15, 0.05] }
                  : { opacity: 0.08 }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}

        {/* Mobile - Fewer horizontal lines */}
        {!deviceInfo.isLowEnd &&
          deviceInfo.isMobile &&
          [...Array(6)].map((_, i) => (
            <motion.div
              key={`h-mobile-${i}`}
              className="absolute left-0 right-0 h-px bg-white/5"
              style={{
                top: `${(i + 1) * 15}%`,
                willChange: deviceInfo.prefersReducedMotion
                  ? "auto"
                  : "opacity",
              }}
              initial={{ opacity: 0 }}
              animate={
                animConfig.enabled
                  ? { opacity: [0.05, 0.12, 0.05] }
                  : { opacity: 0.08 }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>

      {/* Kinetic Typography Layers - Optimized for mobile */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none">
        {/* Layer 1 - Moving Right */}
        <motion.div
          style={{
            x: x1,
            willChange: deviceInfo.prefersReducedMotion ? "auto" : "transform",
          }}
          className="whitespace-nowrap will-change-transform"
        >
          <motion.div
            animate={animConfig.enabled ? { x: [0, -2000] } : {}}
            transition={{
              duration: deviceInfo.isMobile ? 50 : 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-flex items-center gap-4 sm:gap-6 md:gap-8"
          >
            {[...Array(deviceInfo.isMobile ? 2 : 3)].map((_, i) => (
              <span
                key={i}
                className="font-display text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none tracking-tighter text-white/[0.04] sm:text-white/[0.06] select-none"
              >
                DAREEAN
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Layer 2 - Moving Left (Opposite direction) */}
        <motion.div
          style={{
            x: x2,
            willChange: deviceInfo.prefersReducedMotion ? "auto" : "transform",
          }}
          className="whitespace-nowrap will-change-transform -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-12"
        >
          <motion.div
            animate={animConfig.enabled ? { x: [-2000, 0] } : {}}
            transition={{
              duration: deviceInfo.isMobile ? 60 : 50,
              repeat: Infinity,
              ease: "linear",
            }}
            className="inline-flex items-center gap-4 sm:gap-6 md:gap-8"
          >
            {[...Array(deviceInfo.isMobile ? 2 : 3)].map((_, i) => (
              <span
                key={i}
                className="font-display text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none tracking-tighter text-white/[0.03] sm:text-white/[0.04] select-none"
              >
                CREATIVE
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Layer 3 - Moving Right (Slower) - Desktop only to reduce load */}
        {!deviceInfo.isMobile && (
          <motion.div
            style={{
              x: x3,
              willChange: deviceInfo.prefersReducedMotion
                ? "auto"
                : "transform",
            }}
            className="whitespace-nowrap will-change-transform -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-12"
          >
            <motion.div
              animate={animConfig.enabled ? { x: [0, -2000] } : {}}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-flex items-center gap-4 sm:gap-6 md:gap-8"
            >
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className="font-display text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none tracking-tighter text-white/[0.04] sm:text-white/[0.05] select-none"
                >
                  DEVELOPER
                </span>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Layer 4 - Moving Left (Fast) - Desktop only to reduce load */}
        {!deviceInfo.isMobile && (
          <motion.div
            style={{
              x: x4,
              willChange: deviceInfo.prefersReducedMotion
                ? "auto"
                : "transform",
            }}
            className="whitespace-nowrap will-change-transform -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-12"
          >
            <motion.div
              animate={animConfig.enabled ? { x: [-2000, 0] } : {}}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-flex items-center gap-4 sm:gap-6 md:gap-8"
            >
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className="font-display text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] leading-none tracking-tighter text-white/[0.03] sm:text-white/[0.04] select-none"
                >
                  STORYTELLER
                </span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Accent Lines - Dynamic - Simplified on mobile */}
      {!deviceInfo.isLowEnd && (
        <>
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 sm:via-white/15 to-transparent"
            style={{ top: "30%" }}
            animate={
              animConfig.enabled
                ? {
                    scaleX: [0.8, 1, 0.8],
                    opacity: [0.1, 0.3, 0.1],
                  }
                : { opacity: 0.2 }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 sm:via-white/15 to-transparent"
            style={{ bottom: "30%" }}
            animate={
              animConfig.enabled
                ? {
                    scaleX: [0.8, 1, 0.8],
                    opacity: [0.1, 0.3, 0.1],
                  }
                : { opacity: 0.2 }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
        </>
      )}
    </div>
  );
}
