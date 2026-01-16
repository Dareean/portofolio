"use client";

interface MarqueeProps {
  text?: string;
}

export default function Marquee({
    text = "DEVELOPER • UI/UX DESIGN • LEADERSHIP • COMMUNITY",    
}: MarqueeProps) {
  const repeatedText = `${text} • `.repeat(6);

  return (
    <section className="py-24 overflow-hidden border-y border-off-white/10">
      <div className="marquee-container">
        <div className="marquee-content">
          <span
            className="font-display text-[8vw] md:text-[6vw] uppercase tracking-wider"
            style={{
              WebkitTextStroke: "1px rgba(224, 224, 224, 0.4)",
              WebkitTextFillColor: "transparent",
            }}
          >
            {repeatedText}
          </span>
          <span
            className="font-display text-[8vw] md:text-[6vw] uppercase tracking-wider"
            style={{
              WebkitTextStroke: "1px rgba(224, 224, 224, 0.4)",
              WebkitTextFillColor: "transparent",
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
