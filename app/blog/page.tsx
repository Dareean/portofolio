"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { STORIES, Story } from "@/lib/data";

const categories = ["all", "travel", "life", "tech", "creative"] as const;

function StoryCard({ story, index }: { story: Story; index: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.article
      className="group border-b border-off-white/10 pb-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Image Gallery */}
      <div className="relative mb-6">
        {/* Scroll Buttons */}
        {story.images.length > 1 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-void-black/80 border border-off-white/20 text-off-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-void-black"
            >
              ←
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-void-black/80 border border-off-white/20 text-off-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-void-black"
            >
              →
            </button>
          </>
        )}

        {/* Scrollable Images */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {story.images.map((img, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-80 h-56 md:w-96 md:h-64 snap-start overflow-hidden"
            >
              <Image
                src={img}
                alt={`${story.title} - image ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-void-black/80 text-off-white/80 text-xs font-mono">
          {story.images.length} photos
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-4">
            <span className="text-off-white/40 font-mono text-sm">
              {new Date(story.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="px-2 py-1 text-xs uppercase tracking-widest text-off-white/60 border border-off-white/20">
              {story.category}
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-off-white">
            {story.title}
          </h2>
          <p className="text-off-white/60 leading-relaxed max-w-xl">
            {story.excerpt}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export default function StoriesPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredStories =
    activeFilter === "all"
      ? STORIES
      : STORIES.filter((s) => s.category === activeFilter);

  return (
    <main className="min-h-screen py-32 px-8 md:px-16">
      {/* Header */}
      <motion.div
        className="mb-16 max-w-2xl"
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
          Stories
        </h1>
        <p className="text-off-white/60 text-lg">
          Personal moments, travel adventures, and behind-the-scenes of
          projects I'm working on.
        </p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        className="flex flex-wrap gap-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 text-sm tracking-widest uppercase border transition-all duration-300 ${
              activeFilter === category
                ? "border-off-white bg-off-white text-void-black"
                : "border-off-white/20 text-off-white/60 hover:border-off-white/40 hover:text-off-white"
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Stories List */}
      <div className="space-y-16">
        {filteredStories.map((story, index) => (
          <StoryCard key={story.id} story={story} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {filteredStories.length === 0 && (
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-off-white/40 text-lg">
            No stories found in this category.
          </p>
        </motion.div>
      )}
    </main>
  );
}
