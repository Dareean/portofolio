"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-void-black/80 backdrop-blur-md border-b border-off-white/10"
          : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.5 }}
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group"
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

          {/* CTA Button for Blog */}
          <Link
            href="/blog"
            className="hidden md:block px-4 py-2 border border-off-white/30 text-off-white text-sm tracking-widest uppercase hover:bg-off-white hover:text-void-black transition-all duration-300"
          >
            Read Blog
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
