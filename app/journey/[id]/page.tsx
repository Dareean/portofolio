"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { STORIES } from "@/lib/data";
import TopNav from "@/components/TopNav";
import { ChevronLeft } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const postId = Number(params.id);
  const post = STORIES.find((p) => p.id === postId);

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <h1 className="text-heading-2 text-charcoal font-semibold mb-4">Post Not Found</h1>
          <Link href="/journey" className="text-primary hover:text-primary-pressed transition-colors text-button-md font-medium">
            ← Back to Journey
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-24 md:py-32 px-6 md:px-8 bg-canvas text-ink">
      <TopNav />

      <div className="max-w-3xl mx-auto pt-16">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/journey" className="inline-flex items-center gap-2 text-steel hover:text-charcoal mb-10 transition-colors text-body-sm-medium">
            <ChevronLeft className="w-4 h-4" />
            Back to Journey
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header className="mb-12" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <div className="flex items-center gap-4 text-body-sm mb-6">
            <span className="text-steel font-mono">
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="text-micro-uppercase text-charcoal px-3 py-1 border border-hairline rounded-md">
              {post.category}
            </span>
          </div>

          <h1 className="text-heading-1 md:text-display-lg text-charcoal font-semibold leading-tight">
            {post.title}
          </h1>

          <p className="text-body-md text-slate leading-relaxed mt-4">
            {post.excerpt}
          </p>
        </motion.header>

        {/* Featured Image */}
        <motion.div
          className="relative aspect-video mb-12 overflow-hidden bg-surface border border-hairline rounded-lg"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal/5 to-transparent flex items-center justify-center">
            <span className="text-heading-2 text-muted font-semibold">{post.category}</span>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.article initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <p className="text-body-md text-charcoal leading-relaxed mb-8">
            {post.content}
          </p>
          <p className="text-body-md text-slate leading-relaxed mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus justo, ut fringilla velit fermentum a.
          </p>
          <p className="text-body-md text-slate leading-relaxed mb-8">
            Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Pellentesque in ipsum id orci porta dapibus. Praesent sapien massa, convallis a pellentesque nec.
          </p>
        </motion.article>

        {/* More Posts */}
        <motion.div className="mt-16 pt-12 border-t border-hairline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
          <h3 className="text-heading-5 text-charcoal font-semibold mb-6">More Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STORIES.filter((p) => p.id !== post.id).slice(0, 2).map((relatedPost) => (
              <Link key={relatedPost.id} href={`/journey/${relatedPost.id}`} className="group">
                <div className="relative aspect-video mb-4 overflow-hidden bg-surface border border-hairline rounded-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-charcoal/5 to-transparent flex items-center justify-center">
                    <span className="text-heading-5 text-muted">{relatedPost.category}</span>
                  </div>
                </div>
                <h4 className="text-heading-5 text-charcoal font-semibold group-hover:text-primary transition-colors mb-1">{relatedPost.title}</h4>
                <p className="text-body-sm text-slate">{relatedPost.excerpt}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
