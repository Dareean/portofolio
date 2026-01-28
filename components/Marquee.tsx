"use client";

interface MarqueeProps {
  text?: string;
}

export default function Marquee({
    text = "DRIVEN • CREATIVE • DEDICATED • EVOLVING",    
}: MarqueeProps) {
  const repeatedText = `${text} • `.repeat(6);

  return (
    <section className="py-12 sm:py-16 md:py-24 overflow-hidden border-y border-off-white/10">
      <div className="marquee-container">
        <div className="marquee-content">
          <span
            className="font-display text-[10vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] uppercase tracking-wider"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            {repeatedText}
          </span>
          <span
            className="font-display text-[10vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw] uppercase tracking-wider"
            style={{
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            {repeatedText}
          </span>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
        }
        .marquee-content {
          display: flex;
          white-space: nowrap;
          animation: marquee 10s linear infinite;
        }
        .marquee-content span {
          flex-shrink: 0;
          padding-right: 2rem;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
