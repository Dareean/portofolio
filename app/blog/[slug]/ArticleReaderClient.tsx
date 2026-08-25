"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronLeft,
  Share2,
  Tag,
  Check,
  Twitter,
  Linkedin,
  Copy,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CMSBlogPost, PortfolioCMSData } from "@/lib/cms";

interface ArticleReaderClientProps {
  blog: CMSBlogPost;
  cmsData: PortfolioCMSData;
  relatedPosts: CMSBlogPost[];
}

export default function ArticleReaderClient({
  blog,
  cmsData,
  relatedPosts,
}: ArticleReaderClientProps) {
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Convert markdown content to structured editorial elements
  const renderParagraphs = (rawContent: string) => {
    return rawContent.split("\n\n").map((chunk, idx) => {
      const trimmed = chunk.trim();

      // Heading 3
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-heading-3 md:text-heading-2 font-semibold text-charcoal tracking-tight mt-10 mb-4 pb-2 border-b border-hairline flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>{trimmed.replace("### ", "")}</span>
          </h3>
        );
      }

      // Heading 2
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="text-heading-2 md:text-display-sm font-semibold text-charcoal tracking-tight mt-12 mb-5 pb-3 border-b border-hairline flex items-center gap-3"
          >
            <span className="w-3 h-1 bg-primary rounded-full" />
            <span>{trimmed.replace("## ", "")}</span>
          </h2>
        );
      }

      // Blockquote
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="my-6 p-5 rounded-2xl bg-surface-soft border-l-4 border-primary text-body-md text-charcoal italic leading-relaxed shadow-xs"
          >
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      }

      // Ordered list or bullet points
      if (trimmed.startsWith("1. ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map((li) => li.replace(/^(\d+\. |- |\* )/, "").trim());
        return (
          <div
            key={idx}
            className="my-6 p-5 rounded-2xl bg-surface border border-hairline shadow-elevation-1 space-y-3"
          >
            {items.map((item, iIdx) => {
              // Highlight bold items
              const parts = item.split("**");
              return (
                <div key={iIdx} className="flex items-start gap-3 text-body-md text-slate leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-micro font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {iIdx + 1}
                  </span>
                  <div>
                    {parts.map((p, pIdx) =>
                      pIdx % 2 === 1 ? (
                        <strong key={pIdx} className="font-semibold text-charcoal">
                          {p}
                        </strong>
                      ) : (
                        <span key={pIdx}>{p}</span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      // Standard Paragraph
      return (
        <p key={idx} className="text-body-lg text-slate leading-relaxed my-5 font-light">
          {trimmed.split("**").map((p, pIdx) =>
            pIdx % 2 === 1 ? (
              <strong key={pIdx} className="font-semibold text-charcoal">
                {p}
              </strong>
            ) : (
              <span key={pIdx}>{p}</span>
            )
          )}
        </p>
      );
    });
  };

  return (
    <article className="relative">
      {/* ── Top Pinned Reading Progress Bar ── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-400 to-amber-400 origin-left z-50"
      />

      <div className="max-w-4xl mx-auto">
        {/* ── Breadcrumbs & Back Navigation ── */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface border border-hairline text-caption font-mono text-steel hover:text-charcoal hover:bg-surface-soft transition-all shadow-xs group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Semua Cerita</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-hairline text-caption font-mono text-steel hover:text-primary transition-all cursor-pointer shadow-xs"
              title="Copy Link to Article"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copied ? "Tautan Disalin!" : "Salin Tautan"}</span>
            </button>
          </div>
        </div>

        {/* ── Editorial Article Header ── */}
        <header className="mb-10 md:mb-14 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-micro-uppercase font-bold font-mono border border-primary/20 shadow-xs">
              {blog.category}
            </span>

            {blog.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-micro font-mono font-semibold border border-amber-500/20 shadow-xs">
                <Sparkles size={12} />
                <span>Featured Milestone</span>
              </span>
            )}
          </div>

          <h1 className="text-heading-1 md:text-display-md lg:text-display-lg font-semibold text-charcoal tracking-tight leading-[1.18]">
            {blog.title}
          </h1>

          <p className="text-body-lg md:text-heading-4 text-slate leading-relaxed font-light">
            {blog.excerpt}
          </p>

          {/* Author & Meta Bar */}
          <div className="pt-6 border-t border-hairline flex flex-wrap items-center justify-between gap-4 text-caption font-mono text-steel">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-primary/30 bg-surface-soft shadow-xs">
                <Image
                  src={cmsData.about.portraitImage || "/assets/foto_closeup.jpg"}
                  alt={cmsData.about.fullName}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <span className="font-semibold text-charcoal block text-body-sm">{cmsData.about.fullName}</span>
                <span className="text-micro text-steel font-mono">Palu, Sulawesi Tengah · WITA</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-primary" />
                {blog.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-primary" />
                {blog.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* ── High-Res Cover Image Banner ── */}
        {blog.coverImage && (
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-hairline mb-12 shadow-elevation-2">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* ── Article Content Body ── */}
        <div className="bg-surface rounded-3xl border border-hairline p-6 sm:p-10 md:p-12 shadow-elevation-1 mb-14">
          <div className="prose-content">{renderParagraphs(blog.content)}</div>

          {/* Tags */}
          <div className="pt-8 mt-10 border-t border-hairline flex flex-wrap items-center gap-2">
            <span className="text-caption font-mono text-steel flex items-center gap-1.5 mr-2">
              <Tag size={13} />
              <span>Tags:</span>
            </span>
            {blog.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-surface-soft text-caption font-mono text-steel border border-hairline"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Author Bio Card ── */}
        <div className="p-6 md:p-8 rounded-3xl bg-surface border border-hairline shadow-elevation-2 mb-16 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full overflow-hidden relative border-2 border-primary flex-shrink-0 shadow-xs">
            <Image
              src={cmsData.about.portraitImage || "/assets/foto_closeup.jpg"}
              alt={cmsData.about.fullName}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <h4 className="font-semibold text-charcoal text-heading-4">
              Written by {cmsData.about.fullName}
            </h4>
            <p className="text-body-sm text-slate leading-relaxed">
              {cmsData.about.roleTag} berbasis di Palu, Sulawesi Tengah. Aktif berkarya di bidang pengembangan web modern, sistem geospasial, dan mentoring komunitas teknologi.
            </p>
          </div>

          <Link
            href="/contact"
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-pressed text-white text-xs font-mono font-medium transition-colors shadow-xs flex-shrink-0"
          >
            Get in Touch
          </Link>
        </div>

        {/* ── Related Stories ── */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-hairline">
            <div className="flex items-center justify-between">
              <h3 className="text-heading-3 font-semibold text-charcoal tracking-tight">
                Cerita &amp; Catatan Lainnya
              </h3>

              <Link
                href="/blog"
                className="text-caption font-mono text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group rounded-2xl bg-surface border border-hairline hover:border-hairline-strong p-5 md:p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-all space-y-3 block"
                >
                  <div className="flex items-center justify-between text-micro font-mono text-steel">
                    <span className="px-2.5 py-0.5 rounded-md bg-surface-soft border border-hairline text-primary font-semibold">
                      {rel.category}
                    </span>
                    <span>{rel.date}</span>
                  </div>

                  <h4 className="font-semibold text-charcoal group-hover:text-primary transition-colors text-heading-4 line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>

                  <p className="text-body-sm text-slate line-clamp-2 leading-relaxed">
                    {rel.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-1 text-caption font-mono text-primary font-medium">
                    <span>Baca Artikel</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
