"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PROJECTS, Project } from "@/lib/data";
import TopNav from "@/components/TopNav";
import { ChevronLeft, ArrowRight, ExternalLink, Stethoscope, Globe, Users, ShieldAlert, CreditCard, BookOpen, UserCheck, Palette, Leaf, Zap, Code, LayoutGrid } from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = Number(params.id);
  const [projectsList, setProjectsList] = useState<Project[]>(PROJECTS);

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.projects?.length > 0) {
          setProjectsList(json.data.projects);
        }
      })
      .catch(() => {});
  }, []);

  const project = projectsList.find((p) => p.id === projectId);

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center">
          <h1 className="text-heading-2 text-charcoal font-semibold mb-4">Project Not Found</h1>
          <Link href="/work" className="px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-colors">
            ← Back to Work
          </Link>
        </div>
      </main>
    );
  }

  const categoryDisplay = Array.isArray(project.category) ? project.category.join(", ") : project.category;

  // Determine Icon based on title
  const getProjectIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("medicflow")) return <Stethoscope className="w-8 h-8 text-blue-500" />;
    if (t.includes("sorot")) return <Globe className="w-8 h-8 text-emerald-500" />;
    if (t.includes("jasakita")) return <Users className="w-8 h-8 text-indigo-500" />;
    if (t.includes("guard riders") || t.includes("helmet")) return <ShieldAlert className="w-8 h-8 text-amber-500" />;
    if (t.includes("dreampos") || t.includes("pos")) return <CreditCard className="w-8 h-8 text-rose-500" />;
    if (t.includes("library")) return <BookOpen className="w-8 h-8 text-cyan-500" />;
    if (t.includes("employee")) return <UserCheck className="w-8 h-8 text-violet-500" />;
    if (t.includes("batik")) return <Palette className="w-8 h-8 text-orange-500" />;
    if (t.includes("green generation") || t.includes("green")) return <Leaf className="w-8 h-8 text-emerald-600" />;
    if (t.includes("portfolio") || t.includes("dareean")) return <Zap className="w-8 h-8 text-blue-500" />;
    return <Code className="w-8 h-8 text-slate-500" />;
  };
  const projectIcon = getProjectIcon(project.title);

  return (
    <main className="min-h-screen py-20 md:py-28 bg-canvas text-ink">
      <TopNav />

      <div className="max-w-container mx-auto px-6 md:px-8 pt-6">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Link href="/work" className="inline-flex items-center gap-2 text-steel hover:text-charcoal mb-6 transition-colors text-body-sm-medium">
            <ChevronLeft className="w-4 h-4" />
            Back to Work
          </Link>
        </motion.div>

        {/* Notion Page Cover Image */}
        <motion.div
          className="relative w-full h-48 sm:h-64 md:h-72 overflow-hidden rounded-lg bg-surface border border-hairline shadow-elevation-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Notion Overlapping Page Icon / Emoji */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="relative -mt-10 sm:-mt-12 ml-6 mb-4 z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-canvas border border-hairline shadow-elevation-2 flex items-center justify-center text-4xl sm:text-5xl select-none"
        >
          {projectIcon}
        </motion.div>

        {/* Page title */}
        <motion.header 
          className="max-w-4xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-heading-1 md:text-display-lg text-charcoal font-semibold leading-tight tracking-tight">
            {project.title}
          </h1>
        </motion.header>

        {/* Notion Database-style properties grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 border-t border-b border-hairline py-6 mb-8 max-w-4xl"
        >
          <div className="flex items-center gap-3">
            <span className="text-stone text-micro-uppercase font-semibold w-24">Date</span>
            <span className="text-body-sm-medium text-charcoal font-mono">{project.year}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-stone text-micro-uppercase font-semibold w-24">Category</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-semibold rounded-sm uppercase font-mono">
              {categoryDisplay}
            </span>
          </div>
          {project.link && (
            <div className="flex items-center gap-3">
              <span className="text-stone text-micro-uppercase font-semibold w-24">Live URL</span>
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-body-sm text-link-blue hover:text-link-blue-pressed hover:underline inline-flex items-center gap-1 font-medium font-mono"
              >
                {project.link.replace("https://", "").replace("www.", "").split("/")[0]}
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          )}
        </motion.div>

        {/* Notion Block-style description content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-4xl mb-16"
        >
          <h2 className="text-heading-3 text-charcoal font-semibold border-b border-hairline pb-2 mb-4">
            Description
          </h2>
          <p className="text-body-md text-slate leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {project.link && (
            <div className="mt-8">
              <Link 
                href={project.link} 
                target="_blank"
                className="inline-flex items-center gap-2 px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200"
              >
                Visit Live Site
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* More Projects - Gallery card style */}
        <motion.div 
          className="pt-12 border-t border-hairline"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-heading-3 text-charcoal font-semibold mb-8 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-steel" /> Other Projects Database
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectsList.filter((p) => p.id !== project.id).slice(0, 3).map((relatedProject) => (
              <Link key={relatedProject.id} href={`/work/${relatedProject.id}`} className="group block">
                <div className="bg-canvas border border-hairline rounded-lg shadow-elevation-1 hover:shadow-elevation-2 overflow-hidden flex flex-col h-full transition-all duration-300">
                  {/* Image Cover */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface border-b border-hairline">
                    <Image
                      src={relatedProject.image}
                      alt={relatedProject.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col gap-2.5 bg-canvas">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-sm uppercase font-mono">
                        {Array.isArray(relatedProject.category) ? relatedProject.category[0] : relatedProject.category}
                      </span>
                      <span className="text-steel font-mono text-[10px] bg-hairline/40 px-2 py-0.5 rounded-sm">
                        {relatedProject.year}
                      </span>
                    </div>
                    
                    <h4 className="text-body-md-medium text-charcoal group-hover:text-primary transition-colors line-clamp-1">
                      {relatedProject.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
