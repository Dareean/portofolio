"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDeviceType } from "@/lib/hooks";

interface WordProps {
  children: string;
  range: [number, number];
  progress: any;
}

function Word({ children, range, progress }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <span className="relative inline-block mr-[0.28em] my-[0.08em]">
      <motion.span
        style={{ opacity, y }}
        className="inline-block transition-colors"
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function ScrollRevealStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceType();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const statement =
    "I see code not just as syntax, but as a bridge between ideas and human reality. My journey is defined by a relentless curiosity — from building scalable software platforms to nurturing tech communities in Central Sulawesi. From pixel to people.";

  const words = statement.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative py-section md:py-section-lg px-6 md:px-8 bg-canvas text-charcoal overflow-hidden"
    >
      <div className="max-w-container mx-auto">
        <div className="max-w-4xl">
          {/* Section tag */}
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="w-8 h-px bg-primary/60" />
            <span className="text-micro-uppercase text-primary font-semibold tracking-wider font-mono">
              Narrative &amp; Ethos
            </span>
          </div>

          {/* Scroll Text Reveal Headline */}
          <h2 className="text-heading-2 sm:text-heading-1 md:text-display-lg font-semibold leading-[1.12] tracking-tight text-charcoal">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              const isAccent = word.toLowerCase().includes("pixel") || word.toLowerCase().includes("people.") || word.toLowerCase().includes("curiosity");

              return (
                <Word key={i} range={[start, end]} progress={scrollYProgress}>
                  {word}
                </Word>
              );
            })}
          </h2>
        </div>
      </div>
    </section>
  );
}
