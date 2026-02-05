"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PROJECTS } from "@/lib/data";
import FloatingNav from "@/components/FloatingNav";
import { ChevronLeft, ArrowRight } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = Number(params.id);
  const project = PROJECTS.find((p) => p.id === projectId);

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-center">
          <h1 className="font-display text-4xl text-off-white mb-4">
            Project Not Found
          </h1>
          <Link
            href="/work"
            className="text-off-white/60 hover:text-off-white transition-colors"
          >
            ← Back to Work
          </Link>
        </div>
      </main>
    );
  }

  const categoryDisplay = Array.isArray(project.category) 
    ? project.category.join(", ") 
    : project.category;

  return (
    <main className="min-h-screen py-32 px-6 md:px-12 lg:px-20 bg-void-black text-off-white">
      <FloatingNav />
      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-off-white/60 hover:text-off-white mb-12 transition-colors uppercase tracking-widest text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Work
        </Link>
      </motion.div>

      {/* Project Header */}
      <motion.header
        className="max-w-5xl mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
          <span className="text-off-white/60 font-mono">{project.year}</span>
          <span className="w-px h-4 bg-off-white/20" />
          <span className="text-off-white/80 uppercase tracking-widest text-xs px-3 py-1 border border-off-white/20 rounded-full">
            {categoryDisplay}
          </span>
          {project.featured && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-off-white text-void-black text-xs tracking-widest uppercase rounded-full">
              Featured
            </span>
          )}
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-8xl text-off-white leading-none mb-8">
          {project.title}
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:items-start justify-between">
          <p className="mt-4 text-xl md:text-2xl text-off-white/60 leading-relaxed max-w-2xl">
            {project.description}
          </p>
          
          {project.link && (
            <Link 
              href={project.link}
              target="_blank"
              className="inline-flex items-center gap-3 px-8 py-4 bg-off-white text-void-black font-medium tracking-wide uppercase hover:bg-off-white/90 transition-colors whitespace-nowrap"
            >
              Visit Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </motion.header>

      {/* Featured Image */}
      <motion.div
        className="relative w-full aspect-[16/9] mb-24 overflow-hidden rounded-lg bg-off-white/5 border border-off-white/10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 via-transparent to-transparent" />
      </motion.div>

      {/* More Projects */}
      <motion.div
        className="pt-24 border-t border-off-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h3 className="font-display text-2xl text-off-white mb-12 uppercase tracking-widest">
          Other Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.filter((p) => p.id !== project.id)
            .slice(0, 3)
            .map((relatedProject) => (
              <Link
                key={relatedProject.id}
                href={`/work/${relatedProject.id}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-off-white/5 border border-off-white/10 rounded-sm">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${relatedProject.image})` }}
                  />
                  <div className="absolute inset-0 bg-void-black/20 group-hover:bg-void-black/40 transition-colors" />
                </div>
                <h4 className="font-display text-2xl text-off-white group-hover:text-off-white/80 transition-colors mb-2">
                  {relatedProject.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-off-white/50">
                  <span>{relatedProject.year}</span>
                  <span>•</span>
                  <span>{Array.isArray(relatedProject.category) ? relatedProject.category[0] : relatedProject.category}</span>
                </div>
              </Link>
            ))}
        </div>
      </motion.div>
    </main>
  );
}
