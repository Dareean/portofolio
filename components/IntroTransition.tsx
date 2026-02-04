"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import Image from "next/image";

export default function IntroTransition() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [logoScale, setLogoScale] = useState(1);
  const [logoMoveUp, setLogoMoveUp] = useState(false);
  const [closeBlinds, setCloseBlinds] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Show logo after blinds start revealing
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 800);

    // Show text after logo
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1500);

    // Scale up logo (bouncy effect) - 1.1s after text
    const scaleTimer = setTimeout(() => {
      setLogoScale(2.5);
    }, 2600); // 1500 + 1100

    // After 1.1 second pause, move logo down and close blinds
    const moveUpTimer = setTimeout(() => {
      setLogoMoveUp(true);
      setCloseBlinds(true);
    }, 3700); // 2600 + 1100

    // Hide entire intro after logo moves down
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 4700); // Give 1s for the downward animation

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(scaleTimer);
      clearTimeout(moveUpTimer);
      clearTimeout(introTimer);
    };
  }, []);

  // Generate 10 vertical blinds
  const blinds = Array.from({ length: 10 }, (_, i) => i);

  // Theme-aware colors
  const bgColor = theme === "dark" ? "#1A1A1A" : "#F5F5F5";
  const blindColor1 = theme === "dark" ? "#2A2A2A" : "#E0E0E0";
  const blindColor2 = theme === "dark" ? "#3A3A3A" : "#D0D0D0";
  const textColor = theme === "dark" ? "#F5F5F5" : "#1A1A1A";

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Vertical Blinds */}
          <div className="absolute inset-0 flex">
            {blinds.map((index) => (
              <motion.div
                key={index}
                className="flex-1"
                style={{
                  background: `linear-gradient(to bottom, ${blindColor1}, ${blindColor2}, ${blindColor1})`,
                  transformOrigin: "top",
                }}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: closeBlinds ? 1 : 0 }}
                transition={{
                  duration: closeBlinds ? 0.8 : 1,
                  delay: closeBlinds ? index * 0.05 : index * 0.1,
                  ease: [0.76, 0, 0.24, 1],
                }}
              />
            ))}
          </div>

          {/* Logo Animation */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
                animate={{
                  opacity: 1,
                  scale: logoScale,
                  rotate: 0,
                  y: logoMoveUp ? 1000 : 0,
                }}
                exit={{ opacity: 0, scale: 3 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  mass: 0.8,
                }}
              >
                {/* Logo Image */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Image
                    src="/assets/logo_lambang_dareean.png"
                    alt="Dareean"
                    width={120}
                    height={120}
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
                    style={{
                      filter:
                        theme === "dark"
                          ? "invert(1) brightness(1.2)"
                          : "invert(0)",
                    }}
                    priority
                  />
                </motion.div>

                {/* Logo glow effect */}
                <motion.div
                  className="absolute inset-0 blur-2xl opacity-30"
                  initial={{ scale: 0 }}
                  animate={{ scale: logoScale * 1.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                  }}
                  style={{
                    background:
                      theme === "dark"
                        ? "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
