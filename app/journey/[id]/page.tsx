"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { STORIES } from "@/lib/data";
import FloatingNav from "@/components/FloatingNav";

export default function BlogPostPage() {
  const params = useParams();
  const postId = Number(params.id);
  const post = STORIES.find((p) => p.id === postId);

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-off-white mb-4">
            Post Not Found
          </h1>
          <Link
            href="/journey"
            className="text-off-white/60 hover:text-off-white transition-colors"
          >
            ← Back to Journey
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-32 px-8 md:px-16 lg:px-32">
      <FloatingNav />
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/journey"
          className="inline-flex items-center gap-2 text-off-white/60 hover:text-off-white mb-12 transition-colors"
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
          Back to Journey
        </Link>
      </motion.div>

      {/* Article Header */}
      <motion.header
        className="max-w-3xl mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <div className="flex items-center gap-4 text-sm mb-6">
          <span className="text-off-white/40 font-mono">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-off-white/60 uppercase tracking-widest text-xs px-3 py-1 border border-off-white/20">
            {post.category}
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-off-white leading-tight">
          {post.title}
        </h1>

        <p className="mt-6 text-xl text-off-white/60 leading-relaxed">
          {post.excerpt}
        </p>
      </motion.header>

      {/* Featured Image */}
      <motion.div
        className="relative aspect-video mb-16 overflow-hidden bg-off-white/5 border border-off-white/10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-off-white/10 to-transparent flex items-center justify-center">
          <span className="font-display text-4xl text-off-white/20">
            {post.category}
          </span>
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.article
        className="max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="prose prose-invert prose-lg">
          <p className="text-off-white/70 text-lg leading-relaxed mb-8">
            {post.content}
          </p>

          {/* Placeholder content for longer posts */}
          <p className="text-off-white/70 text-lg leading-relaxed mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            lacinia odio vitae vestibulum vestibulum. Cras porttitor metus
            justo, ut fringilla velit fermentum a. Class aptent taciti sociosqu
            ad litora torquent per conubia nostra, per inceptos himenaeos.
          </p>

          <p className="text-off-white/70 text-lg leading-relaxed mb-8">
            Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.
            Pellentesque in ipsum id orci porta dapibus. Praesent sapien massa,
            convallis a pellentesque nec, egestas non nisi. Vestibulum ante
            ipsum primis in faucibus orci luctus et ultrices posuere cubilia
            Curae.
          </p>
        </div>
      </motion.article>

      {/* Navigation to other posts */}
      <motion.div
        className="mt-24 pt-12 border-t border-off-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h3 className="font-display text-2xl text-off-white mb-8">
          More Posts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STORIES.filter((p) => p.id !== post.id)
            .slice(0, 2)
            .map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/journey/${relatedPost.id}`}
                className="group"
              >
                <div className="relative aspect-video mb-4 overflow-hidden bg-off-white/5 border border-off-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-off-white/10 to-transparent flex items-center justify-center">
                    <span className="font-display text-xl text-off-white/20">
                      {relatedPost.category}
                    </span>
                  </div>
                </div>
                <h4 className="font-display text-xl text-off-white group-hover:text-off-white/80 transition-colors">
                  {relatedPost.title}
                </h4>
                <p className="text-off-white/50 text-sm mt-2">
                  {relatedPost.excerpt}
                </p>
              </Link>
            ))}
        </div>
      </motion.div>
    </main>
  );
}
