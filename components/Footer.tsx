"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-24 px-8 md:px-16 border-t border-off-white/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        {/* Left - Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-off-white mb-4">
            DAREEAN
          </h2>
          <p className="text-off-white/40 text-sm tracking-widest uppercase">
            Logic meets Aesthetics
          </p>
        </motion.div>

        {/* Right - Links & Copyright */}
        <motion.div
          className="flex flex-col items-start md:items-end gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Navigation Links */}
          <div className="flex gap-8">
            <Link
              href="/blog"
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
