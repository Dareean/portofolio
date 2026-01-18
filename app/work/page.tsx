"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";

export default function WorkPage() {
  return (
    <main className="min-h-screen py-32 px-8 md:px-16">
      {/* Header */}
      <motion.div
        className="mb-16"
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
        <h1 className="font-display text-5xl md:text-7xl text-off-white">
          All Projects
        </h1>
        <p className="mt-4 text-off-white/60 text-lg max-w-xl">
          A collection of work spanning web development, mobile apps, and digital experiences.
        </p>
      </motion.div>

      {/* Filter Tags */}
      <motion.div
        className="flex flex-wrap gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {["All", "Mobile App", "Web Platform", "Dashboard", "Design System", "E-Commerce"].map(
          (tag, i) => (
            <button
              key={tag}
              className={`px-4 py-2 text-sm tracking-widest uppercase border transition-all duration-300 ${
                i === 0
                  ? "border-off-white bg-off-white text-void-black"
                  : "border-off-white/20 text-off-white/60 hover:border-off-white/40 hover:text-off-white"
              }`}
            >
              {tag}
            </button>
          )
        )}
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {PROJECTS.map((project, index) => (
          <motion.article
            key={project.id}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Image Container */}
            <div className="relative aspect-[16/9] mb-4 overflow-hidden bg-off-white/5 border border-off-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-off-white/10 to-transparent flex items-center justify-center">
                <span className="font-display text-4xl text-off-white/20">
                  {project.title}
                </span>
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-off-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-off-white text-void-black text-xs tracking-widest uppercase">
                  Featured
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-off-white group-hover:text-off-white/80 transition-colors">
                  {project.title}
                </h2>
                <span className="text-off-white/40 font-mono text-sm">
                  {project.year}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-off-white/60 uppercase tracking-widest text-xs">
                  {project.category}
                </span>
              </div>

              {project.description && (
                <p className="text-off-white/50 text-sm leading-relaxed">
                  {project.description}
                </p>
              )}

              <span className="inline-block text-off-white/60 text-sm tracking-widest uppercase group-hover:text-off-white transition-colors pt-2">
                View Project →
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </main>
  );
}
