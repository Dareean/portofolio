"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/work", label: "Work", icon: "◈" },
  { href: "/journey", label: "Journey", icon: "◉" },
  { href: "/contact", label: "Contact", icon: "✉" },
];

export default function FloatingNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Get current page info
  const currentPage = navItems.find((item) => item.href === pathname) || navItems[0];
  const isHomePage = pathname === "/";

  // Show nav after loading animation delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, isHomePage ? 2800 : 500);
    return () => clearTimeout(timer);
  }, [isHomePage]);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = () => {
      if (isExpanded) setIsExpanded(false);
    };
    
    if (isExpanded) {
      // Delay to prevent immediate close
      const timer = setTimeout(() => {
        document.addEventListener("click", handleClick);
      }, 100);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("click", handleClick);
      };
    }
  }, [isExpanded]);

  // Close on route change
  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          {/* Main Pill Container */}
          <motion.div
            layout
            className="relative bg-void-black/80 backdrop-blur-xl border border-off-white/20 rounded-full shadow-2xl overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                // Expanded State - Show all nav items
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 sm:py-2"
                >
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-300 ${
                          pathname === item.href
                            ? "bg-off-white text-void-black"
                            : "text-off-white/60 hover:text-off-white hover:bg-off-white/10"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xs sm:text-sm">{item.icon}</span>
                        <span className="text-xs sm:text-sm font-medium tracking-wide">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Close button */}
                  <motion.button
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.2 }}
                    className="ml-1 p-2.5 rounded-full text-off-white/40 hover:text-off-white hover:bg-off-white/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    aria-label="Close menu"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </motion.div>
              ) : (
                // Collapsed State - Show current page
                <motion.button
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 cursor-pointer group"
                  aria-label="Open navigation"
                >
                  {/* Current page indicator */}
                  <span className="text-off-white/60 text-xs sm:text-sm">{currentPage.icon}</span>
                  <span className="text-off-white font-medium text-xs sm:text-sm tracking-wide">
                    {currentPage.label}
                  </span>
                  
                  {/* Expand indicator */}
                  <motion.div
                    className="flex items-center gap-0.5 ml-1"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="w-1 h-1 rounded-full bg-off-white/40" />
                    <span className="w-1 h-1 rounded-full bg-off-white/40" />
                    <span className="w-1 h-1 rounded-full bg-off-white/40" />
                  </motion.div>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 -z-10 rounded-full bg-off-white/5 blur-xl scale-150 opacity-50" />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
