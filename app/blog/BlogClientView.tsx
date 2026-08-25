"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CMSBlogPost } from "@/lib/cms";
import {
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Sparkles,
  BookOpen,
  X,
  Trophy,
  Coffee,
  Lightbulb,
  Code2,
  TrendingUp,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogClientViewProps {
  initialBlogs: CMSBlogPost[];
}

const CATEGORIES = [
  { id: "All", label: "Semua Cerita", icon: BookOpen },
  { id: "Daily Life", label: "Daily Life", icon: Coffee },
  { id: "Achievement", label: "Achievements", icon: Trophy },
  { id: "Thoughts", label: "Thoughts", icon: Lightbulb },
  { id: "Tech", label: "Tech & Projects", icon: Code2 },
];

const CATEGORY_STYLES: Record<
  string,
  {
    badge: string;
    borderAccent: string;
    glow: string;
    pillBg: string;
  }
> = {
  Achievement: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    borderAccent: "from-amber-500 via-orange-400 to-yellow-500",
    glow: "shadow-amber-500/10",
    pillBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  "Daily Life": {
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    borderAccent: "from-emerald-500 via-teal-400 to-green-500",
    glow: "shadow-emerald-500/10",
    pillBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  Tech: {
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    borderAccent: "from-indigo-500 via-blue-400 to-cyan-500",
    glow: "shadow-indigo-500/10",
    pillBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  Thoughts: {
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    borderAccent: "from-purple-500 via-fuchsia-400 to-pink-500",
    glow: "shadow-purple-500/10",
    pillBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  },
};

export default function BlogClientView({ initialBlogs }: BlogClientViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = initialBlogs.filter((blog) => {
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

  const featuredBlog = initialBlogs.find((b) => b.featured) || initialBlogs[0];

  // Helper to count articles per category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "All") return initialBlogs.length;
    return initialBlogs.filter((b) => b.category === categoryId).length;
  };

  return (
    <div className="space-y-12">
      {/* ═══════════════════════════════════════════
          FEATURED SPOTLIGHT HERO CARD
          ═══════════════════════════════════════════ */}
      {featuredBlog && selectedCategory === "All" && searchQuery === "" && (
        <div className="relative rounded-2xl bg-surface border border-hairline overflow-hidden shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 group">
          {/* Top subtle gradient accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-400 to-amber-400" />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Content Side */}
            <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-micro-uppercase font-bold font-mono border border-primary/20 shadow-xs">
                    <Sparkles size={12} className="animate-spin text-primary" style={{ animationDuration: "8s" }} />
                    <span>Featured Milestone</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-micro font-mono font-medium border shadow-xs ${
                      CATEGORY_STYLES[featuredBlog.category]?.badge ||
                      "bg-surface-soft text-steel border-hairline"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>{featuredBlog.category}</span>
                  </span>
                </div>

                <Link href={`/blog/${featuredBlog.slug}`} className="block group/title">
                  <h2 className="text-heading-2 md:text-display-sm font-semibold text-charcoal tracking-tight group-hover/title:text-primary transition-colors leading-[1.2]">
                    {featuredBlog.title}
                  </h2>
                </Link>

                <p className="text-body-md text-slate leading-relaxed line-clamp-3 font-light">
                  {featuredBlog.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {featuredBlog.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-surface-soft border border-hairline text-caption font-mono text-steel"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom metadata & CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-hairline">
                <div className="flex items-center gap-4 text-caption font-mono text-steel">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {featuredBlog.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" />
                    {featuredBlog.readTime}
                  </span>
                </div>

                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-pressed text-white text-button-md font-medium transition-all shadow-xs group/btn"
                >
                  <span>Baca Cerita Penuh</span>
                  <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Visual Cover Side */}
            <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-[400px] bg-surface-soft border-t lg:border-t-0 lg:border-l border-hairline overflow-hidden">
              {featuredBlog.coverImage ? (
                <>
                  <Image
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-steel bg-radial from-surface-soft to-surface">
                  <BookOpen size={48} className="text-primary/40 mb-3" />
                  <span className="text-caption font-mono uppercase tracking-wider">Journal Spotlight</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          SEARCH & CATEGORY FILTER BAR
          ═══════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 rounded-2xl bg-surface border border-hairline shadow-elevation-1">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "bg-surface-soft text-steel hover:text-charcoal hover:bg-surface border border-hairline"
                }`}
              >
                <Icon size={13} className={isSelected ? "text-white" : "text-steel"} />
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-surface text-steel border border-hairline"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72 p-1.5">
          <Search size={14} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-steel pointer-events-none" />
          <input
            type="text"
            placeholder="Cari artikel / topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-soft border border-hairline text-xs font-mono text-charcoal focus:border-primary focus:bg-surface focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4.5 top-1/2 -translate-y-1/2 text-steel hover:text-charcoal p-1 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          EDITORIAL STORIES GRID
          ═══════════════════════════════════════════ */}
      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, idx) => {
              const categoryStyle = CATEGORY_STYLES[blog.category] || {
                badge: "bg-surface-soft text-steel border-hairline",
                borderAccent: "from-primary to-indigo-400",
                glow: "shadow-primary/5",
              };

              return (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="group rounded-2xl bg-surface border border-hairline hover:border-hairline-strong overflow-hidden flex flex-col justify-between shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 relative"
                >
                  {/* Top Category Accent Line */}
                  <div
                    className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${categoryStyle.borderAccent} opacity-70 group-hover:opacity-100 transition-opacity`}
                  />

                  {/* Card Cover Image with Frosted Pill Chips */}
                  <div className="relative aspect-[16/10] bg-surface-soft overflow-hidden border-b border-hairline">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-xs text-steel">
                        <BookOpen size={28} className="text-steel/30" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Category & Date Floating Chips */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/60 text-white font-mono text-[10px] font-semibold border border-white/15 shadow-xs">
                        {blog.category}
                      </span>

                      <span className="px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/60 text-white/90 font-mono text-[10px] border border-white/15 flex items-center gap-1.5 shadow-xs">
                        <Clock size={11} className="text-white/70" />
                        <span>{blog.readTime}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3.5 text-white/80 text-[11px] font-mono flex items-center gap-1.5">
                      <Calendar size={12} className="text-white/60" />
                      <span>{blog.date}</span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <Link href={`/blog/${blog.slug}`} className="block group/link">
                        <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight group-hover/link:text-primary transition-colors line-clamp-2 leading-snug">
                          {blog.title}
                        </h3>
                      </Link>

                      <p className="text-body-sm text-slate line-clamp-3 leading-relaxed font-light">
                        {blog.excerpt}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {blog.tags.slice(0, 3).map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-surface-soft text-[10px] font-mono text-steel border border-hairline"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-5 sm:px-6 py-3.5 bg-surface-soft border-t border-hairline flex items-center justify-between text-caption font-mono">
                    <div className="flex items-center gap-2 text-steel">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Palu Ledger</span>
                    </div>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 text-primary font-semibold group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Entry</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-surface rounded-2xl border border-hairline p-8 shadow-elevation-1">
          <div className="w-14 h-14 rounded-2xl bg-surface-soft border border-hairline text-steel flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} className="text-primary" />
          </div>
          <h3 className="text-heading-3 font-semibold text-charcoal">Belum Ada Cerita Ditemukan</h3>
          <p className="text-body-md text-slate mt-2 max-w-md mx-auto">
            Tidak ada postingan yang sesuai dengan filter kategori &quot;{selectedCategory}&quot; atau kata kunci pencarian Anda.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-mono font-medium hover:bg-primary-pressed transition-colors cursor-pointer"
          >
            <span>Reset Filter &amp; Pencarian</span>
          </button>
        </div>
      )}
    </div>
  );
}
