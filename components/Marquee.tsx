"use client";

import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface MarqueeProps {
  text?: string;
}

export default function Marquee({
    text = "DRIVEN • CREATIVE • DEDICATED • EVOLVING",
}: MarqueeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const repeatedText = `${text} • `.repeat(6);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = sectionRef.current?.querySelector(".marquee-track");
      if (!track) return;

      gsap.to(track, {
        xPercent: -50,
        duration: 25,
        ease: "none",
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-12 overflow-hidden border-y border-hairline bg-surface">
      <div className="marquee-gradient-mask">
        <div className="marquee-track flex whitespace-nowrap">
          <span className="text-heading-5 text-muted font-semibold uppercase tracking-widest px-8">
            {repeatedText}
          </span>
          <span className="text-heading-5 text-muted font-semibold uppercase tracking-widest px-8" aria-hidden>
            {repeatedText}
          </span>
        </div>
      </div>
    </section>
  );
}
