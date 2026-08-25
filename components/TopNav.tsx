"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { useIntroSeen } from "@/lib/hooks";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/journey", label: "Journey" },
  { href: "/contact", label: "Contact" },
];

export default function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { theme, toggleTheme } = useTheme();
  const isIntroSeen = useIntroSeen();

  // Do not render public navigation on CMS dashboard
  if (pathname?.startsWith("/cms")) {
    return null;
  }

  // Show nav after delay
  useEffect(() => {
    const delay = isHomePage && !isIntroSeen ? 2800 : 500;
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [isHomePage, isIntroSeen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // When nav is transparent on the dark navy hero, force light text
  const isOnDarkHero = isHomePage && !isScrolled;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
            !isHomePage || isScrolled
              ? "bg-canvas/80 backdrop-blur-xl border-b border-hairline"
              : "bg-transparent"
          }`}
        >
          <nav className="max-w-container mx-auto flex items-center justify-between h-16 px-6 md:px-8">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="Home">
              <Image
                src="/assets/logo_lambang_dareean.png"
                alt="Dareean"
                width={32}
                height={32}
                className={`w-7 h-7 md:w-8 md:h-8 transition-all duration-300 ${isOnDarkHero ? 'invert' : 'logo-adaptive'}`}
              />
              <span className={`font-sans text-sm font-semibold tracking-tight hidden sm:block transition-colors duration-300 ${isOnDarkHero ? 'text-on-dark' : 'text-ink'}`}>
                Dareean
              </span>
            </Link>

            {/* Center: Nav Links (desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isOnDarkHero
                      ? isActive(link.href)
                        ? "text-on-dark bg-white/15 font-semibold"
                        : "text-on-dark/60 hover:text-on-dark hover:bg-white/10"
                      : isActive(link.href)
                        ? "text-ink bg-hairline/40 font-semibold"
                        : "text-steel hover:text-charcoal hover:bg-hairline/20"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: CTA + Theme toggle */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200 ${
                  isOnDarkHero
                    ? "text-on-dark/60 hover:text-on-dark hover:bg-white/10"
                    : "text-steel hover:text-charcoal hover:bg-hairline/20"
                }`}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* Desktop CTA - Rectangular Notion primary button */}
              <Link
                href="/contact"
                className="hidden md:inline-flex items-center px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200"
              >
                Let&apos;s Talk
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200 ${
                  isOnDarkHero
                    ? "text-on-dark hover:bg-white/10"
                    : "text-ink hover:bg-hairline/20"
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>

          {/* Sliding Sidebar Menu for Mobile */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
                />

                {/* Sidebar Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 z-50 w-[280px] bg-canvas border-l border-hairline shadow-elevation-4 md:hidden flex flex-col p-6 pt-20"
                >
                  {/* Close button inside sidebar */}
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-6 w-9 h-9 flex items-center justify-center rounded-md text-steel hover:text-charcoal hover:bg-hairline/20 transition-all duration-200"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>

                  {/* Navigation Links */}
                  <div className="flex flex-col gap-2 mt-4">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center px-4 py-2.5 text-base font-medium rounded-md transition-all duration-200 ${
                          isActive(link.href)
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-steel hover:text-charcoal hover:bg-hairline/20"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile CTA at bottom */}
                  <div className="mt-auto pb-4">
                    <Link
                      href="/contact"
                      className="flex items-center justify-center w-full px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200"
                    >
                      Let&apos;s Talk
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
