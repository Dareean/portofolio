"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { JOURNEY_ITEMS } from "@/lib/data";

const typeIcons: Record<string, string> = {
  milestone: "🚀",
  project: "💻",
  education: "📚",
  award: "🏆",
  experience: "💼",
};

const typeColors: Record<string, string> = {
  milestone: "border-blue-400/50",
  project: "border-purple-400/50",
  education: "border-green-400/50",
  award: "border-yellow-400/50",
  experience: "border-pink-400/50",
};

export default function JourneyPage() {
  // Sort by date ascending (oldest first)
  const sortedJourney = [...JOURNEY_ITEMS].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <main className="min-h-screen py-32 px-8 md:px-16">
      {/* Header */}
      <motion.div
        className="mb-20 max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-off-white/60 hover:text-off-white mb-8 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>
        <h1 className="font-display text-5xl md:text-7xl text-off-white mb-4">
          Journey
        </h1>
        <p className="text-off-white/60 text-lg">
          A timeline of my career milestones, projects, and growth as a developer.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-3xl mx-auto">
        {/* Center Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-off-white/10 md:-translate-x-px" />

        {/* Start Point - The Beginning */}
        <motion.div
          className="relative flex items-center mb-16"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-off-white/10 border border-off-white/20 flex items-center justify-center">
            <span className="text-off-white/60 text-xs">✦</span>
          </div>
          <span className="ml-20 md:ml-0 md:absolute md:left-1/2 md:translate-x-8 text-off-white/40 text-sm tracking-widest uppercase">
            The Beginning
          </span>
        </motion.div>

        {sortedJourney.map((item, index) => (
          <motion.div
            key={item.id}
            className={`relative flex items-start gap-8 mb-16 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Timeline Node */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-void-black border-2 border-off-white/40 z-10" />

            {/* Content Card */}
            <div
              className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] p-6 bg-off-white/5 border ${
                typeColors[item.type]
              } hover:bg-off-white/10 transition-colors duration-300`}
            >
              {/* Date & Type */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{typeIcons[item.type]}</span>
                <span className="text-off-white/40 font-mono text-sm">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-off-white/30 text-xs uppercase tracking-widest">
                  {item.type}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-xl md:text-2xl text-off-white mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-off-white/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}

        {/* End Point - Will Keep Going */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-off-white text-void-black flex items-center justify-center">
            <span className="text-sm">→</span>
          </div>
          <span className="ml-20 md:ml-0 md:absolute md:left-1/2 md:translate-x-8 text-off-white text-sm tracking-widest uppercase font-medium">
            Will Keep Going...
          </span>
        </motion.div>
      </div>
    </main>
  );
}
