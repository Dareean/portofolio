"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function FixedLogo() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Position: Top-Left on Home, Top-Right on other pages
  const positionClass = isHomePage
    ? "left-4 sm:left-6 md:left-8"
    : "right-4 sm:right-6 md:right-8";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: isHomePage ? 2.5 : 0.5 }}
      className={`fixed top-4 sm:top-6 md:top-8 z-50 ${positionClass}`}
    >
      <Link href="/" aria-label="Home - Dareean">
        <Image
          src="/assets/logo_lambang_dareean.png"
          alt="Dareean Logo"
          width={48}
          height={48}
          className="w-10 h-10 sm:w-12 sm:h-12 logo-adaptive hover:scale-110 transition-transform duration-300"
        />
      </Link>
    </motion.div>
  );
}
