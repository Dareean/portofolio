"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PixelsToPeople() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"], // Changed: complete when element is at center
  });

  const text = "From pixels to people.";
  const words = text.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative bg-void-black py-24 sm:py-32 md:py-40"
    >
      <div className="flex flex-col items-center justify-center min-h-[40vh] px-6">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, wordIndex) => (
            <motion.span
              key={wordIndex}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [0.1 + wordIndex * 0.15, 0.4 + wordIndex * 0.15], // Earlier start and end
                  [0.15, 1]
                ),
                y: useTransform(
                  scrollYProgress,
                  [0.1 + wordIndex * 0.15, 0.4 + wordIndex * 0.15],
                  [40, 0]
                ),
              }}
            >
              {word.split("").map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  className="inline-block text-off-white"
                  style={{
                    opacity: useTransform(
                      scrollYProgress,
                      [
                        0.15 + wordIndex * 0.15 + charIndex * 0.01,
                        0.45 + wordIndex * 0.15 + charIndex * 0.01,
                      ],
                      [0.3, 1]
                    ),
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          ))}
        </div>

        {/* Decorative underline */}
        <motion.div
          className="mt-8 h-px bg-gradient-to-r from-transparent via-off-white/50 to-transparent"
          style={{
            width: useTransform(scrollYProgress, [0.5, 0.8], ["0px", "250px"]),
            opacity: useTransform(scrollYProgress, [0.5, 0.8], [0, 1]),
          }}
        />
      </div>
    </section>
  );
}

