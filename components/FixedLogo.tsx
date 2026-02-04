"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FixedLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-50"
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
