"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefreshCw, Users, Target, Zap } from "lucide-react";

export default function AboutMe() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (contentRef.current) {
        const cards = contentRef.current.querySelectorAll(".about-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-section-sm md:py-section px-6 md:px-8 overflow-hidden"
    >
      {/* Decorative background */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/3 w-64 h-64 bg-primary/[0.02] rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-container mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-10 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-primary/40" />
            <span className="text-micro-uppercase text-primary font-semibold tracking-wider">
              About
            </span>
          </div>
          <h2 className="text-heading-2 md:text-heading-1 text-charcoal font-semibold tracking-tight">
            About Me
          </h2>
          <p className="text-body-md text-slate mt-3 max-w-xl">
            Developer from Palu, Indonesia — driven by curiosity, learning by doing.
          </p>
        </div>

        {/* Content Grid */}
        <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Profile Card */}
          <div className="about-card md:col-span-5 lg:col-span-4">
            <div className="h-full rounded-lg bg-surface border border-hairline p-6 md:p-8 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-5 border-2 border-hairline">
                <Image
                  src="/assets/foto_closeup.jpg"
                  alt="Dareean"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>

              <h3 className="text-heading-5 text-charcoal font-semibold mb-1">Dareean</h3>
              <p className="text-body-sm text-slate mb-4">UI &amp; Social Enthusiast</p>

              {/* Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tint-mint mb-5">
                <span className="w-2 h-2 rounded-full bg-brand-green" />
                <span className="text-micro-uppercase text-brand-green font-semibold">Open to work</span>
              </div>

              {/* Contact CTA */}
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200 w-full justify-center"
              >
                Get in Touch
              </a>
            </div>
          </div>

          {/* Bio + Working Style */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4 md:gap-6">
            {/* Bio Card */}
            <div className="about-card rounded-lg bg-surface border border-hairline p-6 md:p-8">
              <span className="text-4xl text-primary/20 font-serif leading-none mb-2 block">&ldquo;</span>
              <p className="text-body-md text-charcoal leading-relaxed mb-4">
                Every project is a chance to grow and create something meaningful.
                I believe in building with purpose — turning ideas into{" "}
                <span className="font-semibold text-ink">pixel-perfect reality</span>.
              </p>
              <p className="text-body-sm text-slate">
                Currently exploring web technologies and mobile development
              </p>
              <span className="text-4xl text-primary/20 font-serif leading-none mt-2 block text-right">&rdquo;</span>
            </div>

            {/* Working Style Traits */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: "Agile Mindset", desc: "Iterative approach", icon: <RefreshCw className="w-6 h-6 text-blue-500 mx-auto" /> },
                { label: "Collaborative", desc: "Team player", icon: <Users className="w-6 h-6 text-emerald-500 mx-auto" /> },
                { label: "Detail-Oriented", desc: "Quality focused", icon: <Target className="w-6 h-6 text-rose-500 mx-auto" /> },
                { label: "Fast Learner", desc: "Adapts quickly", icon: <Zap className="w-6 h-6 text-amber-500 mx-auto" /> },
              ].map((trait) => (
                <div
                  key={trait.label}
                  className="about-card rounded-lg bg-surface border border-hairline p-4 md:p-5 text-center hover:border-primary/20 hover:shadow-elevation-1 transition-all duration-300"
                >
                  <div className="mb-2 flex justify-center">{trait.icon}</div>
                  <div className="text-caption-bold text-charcoal mb-0.5">{trait.label}</div>
                  <div className="text-micro text-steel">{trait.desc}</div>
                </div>
              ))}
            </div>

            {/* CTA Row */}
            <div className="about-card flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const pdfUrl = "/assets/CV-Rafi(English).pdf";
                  window.open(pdfUrl, "_blank");
                  const link = document.createElement("a");
                  link.href = pdfUrl;
                  link.download = "Dareean_Resume.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-canvas text-button-md font-medium rounded-md hover:bg-ink-deep transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume
              </button>

              {/* Social */}
              <div className="flex items-center gap-2">
                {[
                  { href: "https://github.com/Dareean", icon: "github" },
                  { href: "https://www.linkedin.com/in/dareean-ahmad-raffi-mardin-72247a229/", icon: "linkedin" },
                ].map((s) => (
                  <a
                    key={s.icon}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-md border border-hairline text-steel hover:text-primary hover:border-primary/30 transition-all duration-200"
                  >
                    {s.icon === "github" ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
