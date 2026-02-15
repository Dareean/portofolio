"use client";

import ScrollReveal from "./ScrollReveal";

export default function IntroSection() {
  const introText = `I see code not just as syntax, but as a bridge between ideas and reality. My journey is defined by a relentless curiosity from building smart solutions to nurturing tech communities in Palu. I craft digital experiences that don't just function, but inspire. For me, innovation isn't about the tools, it's about the lives we touch and the future we build together.`;

  return (
    <section className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-off-white/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-px bg-off-white/30" />
          <span className="text-off-white/40 text-xs tracking-[0.3em] uppercase">
            About Me
          </span>
        </div>

        {/* Decorative opening quote */}
        <div className="text-off-white/10 font-display text-6xl sm:text-7xl md:text-8xl leading-none mb-4 select-none" aria-hidden="true">
          &ldquo;
        </div>

        {/* Scroll Reveal Text */}
        <ScrollReveal
          enableBlur={true}
          baseOpacity={0.15}
          blurStrength={6}
          baseRotation={2}
          containerClassName="mb-4"
          textClassName="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-off-white leading-relaxed tracking-tight"
        >
          {introText}
        </ScrollReveal>

        {/* Decorative closing quote */}
        <div className="text-off-white/10 font-display text-6xl sm:text-7xl md:text-8xl leading-none text-right select-none" aria-hidden="true">
          &rdquo;
        </div>
      </div>
    </section>
  );
}
