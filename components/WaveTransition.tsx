"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function WaveTransition() {
  const { isTransitioning, theme } = useTheme();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Smooth wave layers */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute inset-x-0 bottom-0 w-full"
              style={{
                height: "120vh",
                background: theme === "dark" 
                  ? `rgba(245, 245, 245, ${1 - index * 0.1})`
                  : `rgba(26, 26, 26, ${1 - index * 0.1})`,
                borderTopLeftRadius: "50% 8%",
                borderTopRightRadius: "50% 8%",
              }}
              initial={{ 
                y: "100%",
              }}
              animate={{ 
                y: "-20%",
              }}
              exit={{ 
                y: "-120%",
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.33, 1, 0.68, 1], // cubic-bezier for smooth ease-out
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
