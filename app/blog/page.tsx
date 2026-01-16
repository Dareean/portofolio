"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/data";

export default function BlogPage() {
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
          Blog
        </h1>
        <p className="mt-4 text-off-white/60 text-lg max-w-xl">
          Thoughts, stories, and updates from my journey as a developer.
        </p>
      </motion.div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post, index) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <motion.article
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
            {/* Image Container */}
            <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-off-white/5 border border-off-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-off-white/10 to-transparent flex items-center justify-center">
                <span className="font-display text-2xl text-off-white/20">
                  {post.category}
                </span>
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-off-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-off-white/40 font-mono">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-off-white/60 uppercase tracking-widest text-xs">
                  {post.category}
                </span>
              </div>

              <h2 className="font-display text-2xl text-off-white group-hover:text-off-white/80 transition-colors">
                {post.title}
              </h2>

              <p className="text-off-white/50 text-sm leading-relaxed">
                {post.excerpt}
              </p>

              <span className="inline-block text-off-white/60 text-sm tracking-widest uppercase group-hover:text-off-white transition-colors">
                Read More →
              </span>
            </div>
          </motion.article>
          </Link>
        ))}
      </div>
    </main>
  );
}
