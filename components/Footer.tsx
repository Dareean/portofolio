"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDeviceType } from "@/lib/hooks";

type FooterLink = { href: string; label: string; external?: boolean };

const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Navigation: [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/blog", label: "Blog" },
    { href: "/journey", label: "Journey" },
    { href: "/contact", label: "Contact" },
  ],
  Social: [
    { href: "https://github.com/Dareean", label: "GitHub", external: true },
    { href: "https://www.linkedin.com/in/dareean-ahmad-raffi-mardin-72247a229/", label: "LinkedIn", external: true },
    { href: "https://www.instagram.com/darenrafi/", label: "Instagram", external: true },
  ],
  "Get in Touch": [
    { href: "mailto:dmardin@gmail.com", label: "dmardin@gmail.com", external: true },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const deviceInfo = useDeviceType();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (deviceInfo.prefersReducedMotion || deviceInfo.isLowEnd) {
        if (footerRef.current) gsap.set(footerRef.current, { opacity: 1, y: 0 });
        return;
      }

      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, [deviceInfo]);

  return (
    <footer ref={footerRef} className="bg-canvas border-t border-hairline">
      <div className="max-w-container mx-auto px-6 md:px-8 py-section-sm md:py-section">
        {/* Top section: Logo + Columns */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 mb-12">
          {/* Brand column */}
          <div className="md:w-64 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/assets/logo_lambang_dareean.png"
                alt="Dareean"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10 logo-adaptive"
              />
              <span className="text-heading-5 text-charcoal font-semibold">Dareean</span>
            </div>
            <p className="text-body-sm text-steel leading-relaxed">
              Bringing stories to life, one pixel at a time. Based in Palu, Central Sulawesi.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-caption-bold text-charcoal uppercase tracking-wider mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-sm text-steel hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-body-sm text-steel hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-hairline">
          <p className="text-caption text-steel">
            © {currentYear} Dareean. All rights reserved.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-caption-bold text-steel hover:text-primary transition-colors duration-200 flex items-center gap-1.5"
          >
            ↑ Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
