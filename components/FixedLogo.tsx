"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// FixedLogo is now redundant with TopNav; kept as a small top-left logo
export default function FixedLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      className="fixed top-4 left-6 md:left-8 z-[60]"
    >
      <Link href="/" aria-label="Home - Dareean">
        <Image
          src="/assets/logo_lambang_dareean.png"
          alt="Dareean Logo"
          width={28}
          height={28}
          className="w-6 h-6 md:w-7 md:h-7 logo-adaptive hover:opacity-80 transition-opacity duration-300"
        />
      </Link>
    </motion.div>
  );
}
