"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function WaveTransition() {
  const pathname = usePathname();
  if (pathname?.startsWith("/cms")) {
    return null;
  }
  const { isTransitioning, pendingTheme } = useTheme();
  const targetColor = pendingTheme === "light" ? "#FFFFFF" : "#0A1530";

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key="wave-container"
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: targetColor, originX: 1 }}
            initial={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
