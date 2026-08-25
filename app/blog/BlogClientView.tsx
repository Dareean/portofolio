"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortfolioCMSData, CMSBlogPost } from "@/lib/cms";
import { Search, X, Clock, ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogClientViewProps {
  cmsData: PortfolioCMSData;
}

const CATEGORIES = [
  { id: "All", label: "View all" },
  { id: "Daily Life", label: "Daily Life" },
  { id: "Achievement", label: "Achievements" },
  { id: "Tech", label: "Tech & Projects" },
  { id: "Thoughts", label: "Reflections" },
];

export default function BlogClientView({ cmsData }: BlogClientViewProps) {
  const blogs: CMSBlogPost[] = cmsData.blogs || [];
  const about = cmsData.about;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 md:space-y-12">
      {/* ═══════════════════════════════════════════
          1. CENTERED HERO BANNER (Reference Style)
          ═══════════════════════════════════════════ */}
      <div className="rounded-3xl bg-surface-soft/60 dark:bg-surface-soft/20 border border-hairline px-6 py-12 md:py-16 text-center space-y-4 shadow-xs">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-surface border border-hairline text-[11px] font-mono font-medium tracking-wider uppercase text-steel shadow-xs">
          Our Blog &amp; Journal
        </div>

        <h1 className="text-heading-1 md:text-display-md font-semibold text-charcoal tracking-tight max-w-2xl mx-auto leading-tight">
          Featured insights and articles
        </h1>

        <p className="text-body-md text-slate max-w-xl mx-auto font-light leading-relaxed">
          Kumpulan cerita keseharian, pencapaian milestone, dan catatan arsitektur perangkat lunak dari Palu, Sulawesi Tengah.
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          2. FILTER PILLS & SEARCH BAR
          ═══════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#4F46E5] text-white shadow-xs font-semibold"
                    : "bg-surface text-slate hover:text-charcoal hover:bg-surface-soft border border-hairline shadow-xs"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Minimal Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-full bg-surface border border-hairline text-xs text-charcoal focus:border-[#4F46E5] focus:outline-none transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-charcoal p-1 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          3. 3-COLUMN CARD GRID (Reference Style)
          ═══════════════════════════════════════════ */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group flex flex-col justify-between rounded-3xl bg-surface border border-hairline p-5 shadow-xs hover:shadow-elevation-2 transition-all duration-300"
              >
                <div>
                  {/* Image Container with Rounded Corners & Floating Category Chip */}
                  <Link href={`/blog/${blog.slug}`} className="block relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface-soft border border-hairline mb-5 group/img">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-steel">
                        <BookOpen size={28} className="text-steel/30" />
                      </div>
                    )}

                    {/* Floating Pill on top-left of image */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-[#4F46E5] text-white text-[10px] font-mono font-medium shadow-xs">
                        {blog.category}
                      </span>
                    </div>
                  </Link>

                  {/* Title */}
                  <Link href={`/blog/${blog.slug}`} className="block group/title">
                    <h2 className="text-heading-4 font-semibold text-charcoal tracking-tight group-hover/title:text-[#4F46E5] transition-colors line-clamp-2 leading-snug mb-2">
                      {blog.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-body-sm text-slate line-clamp-2 leading-relaxed font-light mb-6">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Author Metadata Footer (Reference Style) */}
                <div className="flex items-center gap-3 pt-4 border-t border-hairline">
                  <div className="w-8 h-8 rounded-full overflow-hidden relative border border-hairline bg-surface-soft flex-shrink-0">
                    <Image
                      src={about.portraitImage || "/assets/foto_closeup.jpg"}
                      alt={about.fullName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-charcoal truncate">
                      {about.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-steel flex items-center gap-1.5 truncate">
                      <span>{blog.date}</span>
                      <span>·</span>
                      <span>{blog.readTime}</span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="w-7 h-7 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-steel group-hover:bg-[#4F46E5] group-hover:text-white group-hover:border-[#4F46E5] transition-all flex-shrink-0"
                    title="Read article"
                  >
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-surface rounded-3xl border border-hairline p-8 shadow-xs">
          <BookOpen size={36} className="mx-auto text-steel/30 mb-3" />
          <h3 className="text-heading-3 font-semibold text-charcoal">No articles found</h3>
          <p className="text-body-sm text-slate mt-1 max-w-sm mx-auto">
            There are no articles matching your filter &quot;{selectedCategory}&quot; or search query.
          </p>
        </div>
      )}
    </div>
  );
}
