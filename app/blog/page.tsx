"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { STORIES, Story } from "@/lib/data";

const categories = ["all", "travel", "life", "tech", "creative"] as const;

// Category colors for visual distinction
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  travel: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  life: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  tech: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  creative: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
};

function StoryCard({ story, index, featured = false }: { story: Story; index: number; featured?: boolean }) {
  const [currentImage, setCurrentImage] = useState(0);
  const colors = categoryColors[story.category] || categoryColors.life;

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? "h-72 md:h-96" : "h-52 md:h-64"}`}>
        <Image
          src={story.images[currentImage]}
          alt={story.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Image Navigation Dots */}
        {story.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {story.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImage(i);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentImage === i
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase ${colors.bg} ${colors.text} ${colors.border} border backdrop-blur-sm`}>
          {story.category}
        </div>
        
        {/* Photo Count */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-off-white/80 text-xs font-medium flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {story.images.length}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Date */}
        <span className="text-off-white/40 text-sm font-medium">
          {new Date(story.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        
        {/* Title */}
        <h2 className={`font-display text-off-white mt-2 group-hover:text-off-white/80 transition-colors duration-300 ${
          featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
        }`}>
          {story.title}
        </h2>
        
        {/* Excerpt */}
        <p className={`text-off-white/60 mt-3 leading-relaxed ${
          featured ? "line-clamp-3" : "line-clamp-2"
        }`}>
          {story.excerpt}
        </p>
        
        {/* Read More Link */}
        <div className="mt-4 flex items-center gap-2 text-off-white/80 font-medium text-sm group/link">
          <span className="group-hover:underline">Read story</span>
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
      
      {/* Clickable Overlay */}
      <Link href={`/blog/${story.id}`} className="absolute inset-0 z-20" />
    </motion.article>
  );
}

export default function StoriesPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredStories =
    activeFilter === "all"
      ? STORIES
      : STORIES.filter((s) => s.category === activeFilter);

  // First story is featured
  const featuredStory = filteredStories[0];
  const otherStories = filteredStories.slice(1);

  return (
    <main className="min-h-screen py-24 md:py-32">
      {/* Hero Header */}
      <motion.div
        className="px-6 md:px-16 mb-12 md:mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-off-white/50 hover:text-off-white mb-8 transition-colors group"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
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
          Back
        </Link>
        
        <div className="max-w-3xl">
          <motion.h1 
            className="font-display text-5xl md:text-7xl lg:text-8xl text-off-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stories
          </motion.h1>
          <motion.p 
            className="text-off-white/50 text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Personal moments, travel adventures, and behind-the-scenes of projects I&apos;m working on.
          </motion.p>
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div
        className="px-6 md:px-16 mb-10 md:mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide capitalize transition-all duration-300 ${
                activeFilter === category
                  ? "bg-off-white text-void-black shadow-lg"
                  : "bg-white text-off-white/60 hover:bg-off-white/5 hover:text-off-white border border-off-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stories Grid */}
      <div className="px-6 md:px-16">
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Featured Story */}
            {featuredStory && (
              <StoryCard story={featuredStory} index={0} featured={true} />
            )}
            
            {/* Other Stories */}
            {otherStories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index + 1} />
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-24 bg-white rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-off-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-off-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-off-white/40 text-lg font-medium">
              No stories in this category yet.
            </p>
            <p className="text-off-white/30 text-sm mt-2">
              Check back soon for new adventures!
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Bottom Decoration */}
      <motion.div 
        className="mt-20 md:mt-32 px-6 md:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="border-t border-off-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-off-white/30 text-sm">
            {filteredStories.length} {filteredStories.length === 1 ? "story" : "stories"} found
          </p>
          <Link 
            href="/" 
            className="text-off-white/50 hover:text-off-white text-sm transition-colors flex items-center gap-2"
          >
            View all projects
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
