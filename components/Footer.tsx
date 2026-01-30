"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-16 border-t border-off-white/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-10 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-off-white mb-2 sm:mb-4">
            DAREEAN
          </h2>
          <p className="text-off-white/40 text-xs sm:text-sm tracking-widest uppercase">
            Logic meets Aesthetics
          </p>
        </motion.div>

        {/* Right - Links & Copyright */}
        <motion.div
          className="flex flex-col items-start md:items-end gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Navigation Links */}
          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8">
            <Link
              href="/journey"
              className="text-off-white/60 hover:text-off-white text-sm tracking-widest uppercase transition-colors duration-300"
            >
              Journey
            </Link>
            {[
              { name: "GitHub", href: "https://github.com/Dareean" },
              { name: "LinkedIn", href: "https://www.linkedin.com/in/dareean-ahmad-raffi-mardin-72247a229/" },
              { name: "Instagram", href: "https://www.instagram.com/darenrafi/" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-off-white/60 hover:text-off-white text-sm tracking-widest uppercase transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-off-white/30 text-xs tracking-wider">
            © {currentYear} Dareean. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
