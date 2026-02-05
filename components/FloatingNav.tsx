"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useDeviceType, getAnimationConfig } from "@/lib/hooks";

// SVG Icons as components
const ContactIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CodeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const navItems = [
  { href: "/journey", label: "Journey", icon: UserIcon },
  { href: "/work", label: "Work", icon: CodeIcon },
  { href: "/contact", label: "Contact", icon: ContactIcon },
];

const socialItems = [
  {
    href: "https://github.com/Dareean",
    label: "GitHub",
    icon: GitHubIcon,
    external: true,
  },
  {
    href: "https://linkedin.com/in/dareean",
    label: "LinkedIn",
    icon: LinkedInIcon,
    external: true,
  },
];

// Cartoonish bouncy animation variants - Simplified on low-end devices
const bounceAnimation: Variants = {
  hover: {
    scale: 1.25,
    y: -8,
    rotate: [0, -10, 10, -5, 5, 0],
    transition: {
      scale: { type: "spring", stiffness: 400, damping: 10 },
      y: { type: "spring", stiffness: 400, damping: 10 },
      rotate: { duration: 0.5 },
    },
  },
  tap: {
    scale: 0.85,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

// Simple version for low-end devices
const simpleBounceAnimation: Variants = {
  hover: {
    scale: 1.15,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.9,
    transition: { duration: 0.1 },
  },
};

const wiggleAnimation: Variants = {
  hover: {
    scale: 1.2,
    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
    transition: {
      scale: { type: "spring", stiffness: 400, damping: 10 },
      rotate: { duration: 0.6 },
    },
  },
  tap: {
    scale: 0.9,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

const jumpAnimation: Variants = {
  hover: {
    scale: 1.3,
    y: [0, -12, 0, -6, 0],
    transition: {
      scale: { type: "spring", stiffness: 500, damping: 15 },
      y: { duration: 0.4, times: [0, 0.4, 0.6, 0.8, 1] },
    },
  },
  tap: {
    scale: 0.85,
    y: 2,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
};

export default function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const deviceInfo = useDeviceType();
  const animConfig = getAnimationConfig(deviceInfo);

  // Show nav after loading animation delay
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsVisible(true);
      },
      isHomePage ? 2800 : 500,
    );
    return () => clearTimeout(timer);
  }, [isHomePage]);

  // Use simpler animations on low-end devices
  const getAnimation = (index: number) => {
    if (deviceInfo.isLowEnd || deviceInfo.prefersReducedMotion) {
      return simpleBounceAnimation;
    }
    const animations = [bounceAnimation, wiggleAnimation, jumpAnimation];
    return animations[index % animations.length];
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 sm:bottom-8 inset-x-0 z-50 flex justify-center pointer-events-none"
        >
          {/* Main Pill Container */}
          <motion.div
            layout
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex items-center gap-1 bg-void-black/95 backdrop-blur-xl border border-off-white/10 rounded-full shadow-2xl px-2 py-2 pointer-events-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.2,
                rotate: [0, -10, 10, 0],
                transition: {
                  scale: { type: "spring", stiffness: 400, damping: 10 },
                  rotate: { duration: 0.5 },
                },
              }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
            >
              <Link
                href="/"
                className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full"
                aria-label="Home - Dareean"
              >
                <Image
                  src="/assets/logo_lambang_dareean.png"
                  alt="Dareean Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-9 sm:h-9 logo-adaptive"
                />
              </Link>
            </motion.div>

            {/* Divider after logo */}
            <motion.div
              className="w-px h-6 bg-off-white/20 mx-1"
              whileHover={{ scaleY: 1.3, opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Navigation Items */}
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover="hover"
                  whileTap="tap"
                  variants={getAnimation(index)}
                  transition={{ delay: index * 0.05 }}
                  className="cursor-pointer relative group"
                >
                  {/* Tooltip */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-void-black/90 text-off-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100 border border-off-white/10">
                    {item.label}
                  </span>
                  <Link
                    href={item.href}
                    className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-colors duration-300 ${
                      isActive
                        ? "bg-off-white/15 text-off-white"
                        : "text-off-white/50 hover:text-off-white hover:bg-off-white/10"
                    }`}
                    aria-label={item.label}
                  >
                    <Icon />
                  </Link>
                </motion.div>
              );
            })}

            {/* Divider */}
            <motion.div
              className="w-px h-6 bg-off-white/20 mx-1"
              whileHover={{ scaleY: 1.3, opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Social Links */}
            {socialItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover="hover"
                  whileTap="tap"
                  variants={wiggleAnimation}
                  transition={{ delay: (navItems.length + index) * 0.05 }}
                  className="cursor-pointer relative group"
                >
                  {/* Tooltip */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-void-black/90 text-off-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none scale-90 group-hover:scale-100 border border-off-white/10">
                    {item.label}
                  </span>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-off-white/50 hover:text-off-white hover:bg-off-white/10 transition-colors duration-300"
                    aria-label={item.label}
                  >
                    <Icon />
                  </a>
                </motion.div>
              );
            })}

            {/* Divider */}
            <motion.div
              className="w-px h-6 bg-off-white/20 mx-1"
              whileHover={{ scaleY: 1.3, opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Theme Toggle with spin animation */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{
                scale: 1.25,
                rotate: 180,
                transition: {
                  scale: { type: "spring", stiffness: 400, damping: 10 },
                  rotate: { duration: 0.4, ease: "easeInOut" },
                },
              }}
              whileTap={{ scale: 0.85, rotate: 360 }}
              transition={{
                delay: (navItems.length + socialItems.length) * 0.05,
              }}
              className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-off-white/50 hover:text-off-white hover:bg-off-white/10 transition-colors duration-300 cursor-pointer"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={toggleTheme}
              disabled={isTransitioning}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 -z-10 rounded-full bg-off-white/5 blur-xl scale-150 opacity-50" />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
