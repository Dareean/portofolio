"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function WaveTransition() {
  const { isTransitioning, pendingTheme } = useTheme();

  // Target color - always the theme we're going TO
  const targetColor = pendingTheme === "light" 
    ? "#f5f5f5" 
    : "#0e0f19";

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key="wave-container"
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          {/* Main wave - single continuous sweep */}
          <motion.div
            className="absolute w-full"
            style={{
              height: "130vh",
              background: targetColor,
              borderRadius: "0 0 50% 50% / 0 0 5% 5%",
              left: 0,
              right: 0,
            }}
            initial={{ 
              top: "100%",
            }}
            animate={{ 
              top: "-130%",
            }}
            transition={{
              duration: 0.75,
              ease: [0.65, 0, 0.35, 1], // Smooth ease-in-out cubic
            }}
          />

          {/* Secondary wave for depth */}
          <motion.div
            className="absolute w-full"
            style={{
              height: "130vh",
              background: targetColor,
              opacity: 0.7,
              borderRadius: "0 0 50% 50% / 0 0 8% 8%",
              left: 0,
              right: 0,
            }}
            initial={{ 
              top: "100%",
            }}
            animate={{ 
              top: "-130%",
            }}
            transition={{
              duration: 0.75,
              delay: 0.03,
              ease: [0.65, 0, 0.35, 1],
            }}
          />

          {/* Third wave for extra smoothness */}
          <motion.div
            className="absolute w-full"
            style={{
              height: "130vh",
              background: targetColor,
              opacity: 0.4,
              borderRadius: "0 0 50% 50% / 0 0 12% 12%",
              left: 0,
              right: 0,
            }}
            initial={{ 
              top: "100%",
            }}
            animate={{ 
              top: "-130%",
            }}
            transition={{
              duration: 0.75,
              delay: 0.06,
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
