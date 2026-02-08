"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show navbar after loading animation (delay for homepage)
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsLoaded(true);
      },
      isHomePage ? 2800 : 500,
    );
    return () => clearTimeout(timer);
  }, [isHomePage]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/journey", label: "Journey" },
    { href: "/contact", label: "Contact", mobileOnly: true },
  ];

  // Animation variants for menu overlay
  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const linkVariants = {
    closed: {
      opacity: 0,
      y: 30,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // ============================================
  // HOME PAGE: Burger Menu Only
  // ============================================
  if (isHomePage) {
    return (
      <>
        {/* Burger Button - Fixed position */}
        <AnimatePresence>
          {isLoaded && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`fixed top-4 sm:top-6 right-4 sm:right-6 md:right-16 z-50 w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center gap-1 sm:gap-1.5 focus:outline-none rounded-full transition-all duration-500 ${
                isMenuOpen
                  ? "bg-gradient-to-br from-white/50 via-white/35 to-white/25 backdrop-blur-[40px] backdrop-saturate-[250%] border-[3px] border-white/70 shadow-[0_8px_32px_rgba(255,255,255,0.4),0_0_60px_rgba(255,255,255,0.2),inset_0_2px_4px_rgba(255,255,255,0.9)]"
                  : isScrolled
                    ? "bg-gradient-to-br from-white/40 via-white/25 to-white/15 backdrop-blur-[35px] backdrop-saturate-[220%] border-[2.5px] border-white/60 shadow-[0_8px_32px_rgba(255,255,255,0.3),inset_0_2px_4px_rgba(255,255,255,0.7)]"
                    : "bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-[30px] backdrop-saturate-[200%] border-[2px] border-white/50 shadow-[0_4px_24px_rgba(255,255,255,0.2),inset_0_1px_2px_rgba(255,255,255,0.6)]"
              } relative overflow-hidden before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/40 before:via-transparent before:to-transparent before:opacity-70`}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 6 : 0,
                  backgroundColor: isMenuOpen ? "#F5F5F5" : "#1A1A1A",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="block w-5 sm:w-6 h-0.5 rounded-full"
              />
              <motion.span
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                  scaleX: isMenuOpen ? 0 : 1,
                  backgroundColor: isMenuOpen ? "#F5F5F5" : "#1A1A1A",
                }}
                transition={{ duration: 0.2 }}
                className="block w-5 sm:w-6 h-0.5 rounded-full"
              />
              <motion.span
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -6 : 0,
                  backgroundColor: isMenuOpen ? "#F5F5F5" : "#1A1A1A",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="block w-5 sm:w-6 h-0.5 rounded-full"
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Full-screen Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-40 bg-off-white flex flex-col items-center justify-center"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.08 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-1/4 -right-20 w-96 h-96 bg-void-black rounded-full blur-3xl"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.08 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="absolute bottom-1/4 -left-20 w-80 h-80 bg-void-black rounded-full blur-3xl"
                />
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    variants={linkVariants}
                    custom={index}
                  >
                    <Link
                      href={link.href}
                      className="group relative block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span
                        className={`font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight transition-all duration-300 ${
                          pathname === link.href
                            ? "text-void-black"
                            : "text-void-black/40 hover:text-void-black"
                        }`}
                      >
                        {link.label}
                      </span>
                      {/* Hover underline */}
                      <motion.span
                        className="absolute -bottom-2 left-0 w-full h-1 bg-void-black origin-left"
                        initial={{ scaleX: pathname === link.href ? 1 : 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer info */}
              <motion.div
                variants={linkVariants}
                className="absolute bottom-8 sm:bottom-12 flex flex-col md:flex-row items-center gap-2 sm:gap-4 md:gap-8 text-void-black/40 text-xs sm:text-sm px-4 text-center"
              >
                <span>Let&apos;s work together</span>
                <span className="hidden md:block">•</span>
                <a
                  href="mailto:hello@dareean.com"
                  className="hover:text-void-black transition-colors"
                >
                  hello@dareean.com
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ============================================
  // OTHER PAGES: Traditional Navbar
  // ============================================
  return (
    <motion.header
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <nav
        className={`flex items-center gap-2 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-black/10"
            : "bg-white/90 backdrop-blur-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
        } rounded-full px-6 py-3 relative overflow-hidden`}
      >
        {/* Liquid Glass Effect Layers */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          {/* Top glass highlight */}
          <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/60 to-transparent" />

          {/* Animated shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        {/* Logo */}
        <Link href="/" className="group relative z-10">
          <motion.span
            className={`font-display text-lg md:text-xl tracking-tight font-bold transition-all duration-300 px-4 py-1.5 rounded-full block ${
              pathname === "/"
                ? "text-void-black bg-black/5"
                : "text-void-black/60 hover:text-void-black hover:bg-black/5"
            }`}
            whileHover={{ opacity: 1 }}
          >
            DAREEAN
          </motion.span>
        </Link>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-black/10" />

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 relative z-10">
          {navLinks.slice(0, 3).map((link) => (
            <Link key={link.href} href={link.href} className="relative group">
              <span
                className={`text-sm tracking-wide font-medium transition-all duration-300 px-4 py-1.5 rounded-full block ${
                  pathname === link.href
                    ? "text-void-black bg-black/5"
                    : "text-void-black/60 hover:text-void-black hover:bg-black/5"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}

          {/* Divider before contact */}
          <div className="w-px h-6 bg-black/10 mx-1" />

          {/* CTA Button for Contact */}
          <Link href="/contact" className="hidden md:block relative group">
            <span className="px-4 py-1.5 bg-void-black text-white text-sm font-medium rounded-full block transition-all duration-300 hover:bg-void-black/90 hover:shadow-lg relative overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">Contact</span>
            </span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
