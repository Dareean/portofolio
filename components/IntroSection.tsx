"use client";

import ScrollReveal from "./ScrollReveal";

export default function IntroSection() {
  const introText = `I'm Dareean, a passionate digital creator based in Indonesia. I craft meaningful digital experiences through design, code, and creativity. My journey spans from web development to visual storytelling, always driven by curiosity and the desire to create something impactful.`;

  return (
    <section className="relative py-20 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-off-white/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-px bg-off-white/30" />
          <span className="text-off-white/40 text-xs tracking-[0.3em] uppercase">
            About Me
          </span>
        </div>

        {/* Scroll Reveal Text */}
        <ScrollReveal
          enableBlur={true}
          baseOpacity={0.15}
          blurStrength={6}
          baseRotation={2}
          containerClassName="mb-8"
          textClassName="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-off-white leading-relaxed tracking-tight"
        >
          {introText}
        </ScrollReveal>
      </div>
    </section>
  );
}
