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
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, isHomePage ? 2800 : 500);
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
    { href: "/blog", label: "Blog" },
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
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
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
              className={`fixed top-6 right-6 md:right-16 z-50 w-12 h-12 flex flex-col items-center justify-center gap-1.5 focus:outline-none rounded-full transition-colors duration-300 ${
                isMenuOpen 
                  ? "bg-void-black/10" 
                  : isScrolled 
                    ? "bg-off-white/10 backdrop-blur-md" 
                    : "bg-off-white/20 backdrop-blur-sm"
              }`}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 6 : 0,
                  backgroundColor: isMenuOpen ? "#F5F5F5" : "#1A1A1A",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="block w-6 h-0.5 rounded-full"
              />
              <motion.span
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                  scaleX: isMenuOpen ? 0 : 1,
                  backgroundColor: isMenuOpen ? "#F5F5F5" : "#1A1A1A",
                }}
                transition={{ duration: 0.2 }}
                className="block w-6 h-0.5 rounded-full"
              />
              <motion.span
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -6 : 0,
                  backgroundColor: isMenuOpen ? "#F5F5F5" : "#1A1A1A",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="block w-6 h-0.5 rounded-full"
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
              <nav className="flex flex-col items-center gap-4 md:gap-6">
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
                        className={`font-display text-4xl md:text-6xl lg:text-7xl tracking-tight transition-all duration-300 ${
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
                className="absolute bottom-12 flex flex-col md:flex-row items-center gap-4 md:gap-8 text-void-black/40 text-sm"
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-void-black/90 backdrop-blur-md border-b border-off-white/10"
          : "bg-void-black/60 backdrop-blur-sm"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <nav className="flex items-center justify-between px-8 md:px-16 py-6">
        {/* Logo */}
        <Link href="/" className="group">
          <motion.span
            className="font-display text-xl md:text-2xl text-off-white tracking-tight"
            whileHover={{ opacity: 0.7 }}
          >
            DAREEAN
          </motion.span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative group ${link.mobileOnly ? 'md:hidden' : ''}`}
            >
              <span
                className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-off-white"
                    : "text-off-white/60 hover:text-off-white"
                }`}
              >
                {link.label}
              </span>
              {/* Active indicator */}
              {pathname === link.href && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-px bg-off-white"
                  layoutId="activeNav"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}

          {/* CTA Button for Contact */}
          <Link
            href="/contact"
            className="hidden md:block px-4 py-2 border border-off-white/30 text-off-white text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300"
          >
            Contact Me
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
