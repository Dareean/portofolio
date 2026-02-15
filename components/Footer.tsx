"use client";

import { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger Animations
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Left section animation
      if (leftSectionRef.current) {
        gsap.fromTo(leftSectionRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }

      // Right section animation with delay
      if (rightSectionRef.current) {
        gsap.fromTo(rightSectionRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16">
      {/* Gradient top border */}
      <div className="section-divider mb-12 sm:mb-16 md:mb-24" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-10 md:gap-12">
        {/* Left Section (GSAP animated) */}
        <div ref={leftSectionRef}>
          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src="/assets/logo_lambang_dareean.png"
                alt="Dareean Logo"
                width={72}
                height={72}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 logo-adaptive"
              />
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-off-white">
              DAREEAN
            </h2>
          </div>
          <p className="text-off-white/40 text-xs sm:text-sm tracking-wide">
            Bringing stories to life, one pixel at a time
          </p>
        </div>

        {/* Right - Links & Copyright (GSAP animated) */}
        <div
          ref={rightSectionRef}
          className="flex flex-col items-start md:items-end gap-4 sm:gap-6"
        >
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-6 md:gap-x-8">
            <Link
              href="/journey"
              className="text-off-white/60 hover:text-off-white text-sm tracking-widest uppercase transition-colors duration-300 hover:underline underline-offset-4 decoration-off-white/30"
            >
              Journey
            </Link>
            {[
              { name: "GitHub", href: "https://github.com/Dareean" },
              {
                name: "LinkedIn",
                href: "https://www.linkedin.com/in/dareean-ahmad-raffi-mardin-72247a229/",
              },
              {
                name: "Instagram",
                href: "https://www.instagram.com/darenrafi/",
              },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-off-white/60 hover:text-off-white text-sm tracking-widest uppercase transition-colors duration-300 hover:underline underline-offset-4 decoration-off-white/30"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Copyright & Back to Top */}
          <div className="flex items-center gap-6">
            <p className="text-off-white/30 text-xs tracking-wider">
              © {currentYear} Dareean. All rights reserved.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-off-white/30 hover:text-off-white text-xs tracking-wider uppercase transition-colors duration-300 flex items-center gap-1.5"
            >
              ↑ Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
