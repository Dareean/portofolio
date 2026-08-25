"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  PortfolioCMSData,
  CMSProject,
  CMSStory,
  CMSExperience,
} from "@/lib/cms";
import {
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Layers,
  FileText,
  User,
  Compass,
  Globe,
  ArrowUpRight,
  Sliders,
  LogOut,
  ExternalLink,
  Star,
  Edit3,
  X,
  Eye,
  Sparkles,
  ChevronRight,
  FolderOpen,
  Calendar,
  Clock,
  Tag,
  Briefcase,
  Trophy,
  Users as UsersIcon,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Upload,
  Database,
  Cloud,
  HardDrive,
  FileUp,
} from "lucide-react";

type CMSTab = "hero" | "projects" | "about" | "writing" | "journey" | "site";

export default function CMSDashboard({ initialData }: { initialData: PortfolioCMSData }) {
  const [data, setData] = useState<PortfolioCMSData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<CMSTab>("projects");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal / Drawer state for deep project editing
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);

  // Uploading states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  // Hidden file inputs
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const portraitFileInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // New tech input state
  const [newTechName, setNewTechName] = useState("");
  const [newTechCategory, setNewTechCategory] = useState("Framework");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Upload file helper (uploads to Supabase Storage / local fallback)
  const handleFileUpload = async (
    file: File,
    folder: string = "projects",
    onSuccess: (url: string) => void
  ) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onSuccess(json.url);
        const storageLabel = json.storage === "supabase" ? "Supabase Cloud Storage" : "Local Storage (/uploads)";
        showToast(`Uploaded successfully to ${storageLabel}!`);
      } else {
        showToast(json.error || "Upload failed", "error");
      }
    } catch (err) {
      showToast("Network error during file upload", "error");
    } finally {
      setIsUploading(false);
      setUploadTarget(null);
    }
  };

  // Save full data to API
  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        showToast("All changes published to portfolio_cms.json!");
      } else {
        showToast(json.error || "Failed to save changes", "error");
      }
    } catch (err) {
      showToast("Network error while saving", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick toggle featured for a project
  const toggleProjectFeatured = (id: number) => {
    const updated = data.projects.map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    setData({ ...data, projects: updated });
    showToast(`Project visibility updated!`);
  };

  // Save edited project from modal
  const saveProjectModal = (updatedProject: CMSProject) => {
    const updated = data.projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    setData({ ...data, projects: updated });
    setEditingProject(null);
    showToast("Project details updated!");
  };

  // Add new project
  const handleAddNewProject = () => {
    const newProj: CMSProject = {
      id: Date.now(),
      title: "New Project Showcase",
      slug: `project-${Date.now()}`,
      category: "Web Platform",
      year: new Date().getFullYear(),
      image: "/assets/greengnsulteng_web.png",
      link: "https://example.com",
      featured: false,
      description: "Comprehensive case study of the system architecture, stack, and problem solved.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      metrics: [{ label: "Impact", value: "+30%" }],
    };
    setData({ ...data, projects: [newProj, ...data.projects] });
    setEditingProject(newProj);
    showToast("New project created! You can now upload images and edit details.");
  };

  // Delete a project
  const handleDeleteProject = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = data.projects.filter((p) => p.id !== id);
      setData({ ...data, projects: updated });
      if (editingProject?.id === id) setEditingProject(null);
      showToast("Project removed.");
    }
  };

  // Add new tech stack chip
  const handleAddTechStack = () => {
    if (!newTechName.trim()) return;
    const updated = [...data.about.techStack, { name: newTechName.trim(), category: newTechCategory }];
    setData({ ...data, about: { ...data.about, techStack: updated } });
    setNewTechName("");
    showToast(`Added ${newTechName} to tech stack!`);
  };

  // Remove tech stack chip
  const handleRemoveTechStack = (index: number) => {
    const updated = data.about.techStack.filter((_, i) => i !== index);
    setData({ ...data, about: { ...data.about, techStack: updated } });
  };

  const navItems = [
    {
      id: "projects",
      num: "01",
      label: "Projects & Work",
      icon: Layers,
      count: data.projects.length,
      desc: "Visual Catalog & Uploads",
    },
    {
      id: "hero",
      num: "02",
      label: "Hero & Headlines",
      icon: Sliders,
      count: null,
      desc: "Live Kinetic Preview",
    },
    {
      id: "about",
      num: "03",
      label: "About & Bento",
      icon: User,
      count: null,
      desc: "Portrait, Bio & Tech Stack",
    },
    {
      id: "writing",
      num: "04",
      label: "Writing & Stories",
      icon: FileText,
      count: data.stories.length,
      desc: "Publication Feeds",
    },
    {
      id: "journey",
      num: "05",
      label: "Journey Timeline",
      icon: Compass,
      count: data.experiences.length,
      desc: "Milestones & Roles",
    },
    {
      id: "site",
      num: "06",
      label: "Supabase & Settings",
      icon: Globe,
      count: null,
      desc: "Storage & Cloud Sync",
    },
  ];

  const currentNav = navItems.find((n) => n.id === activeTab) || navItems[0];
  const featuredCount = data.projects.filter((p) => p.featured).length;

  return (
    <div className="min-h-screen bg-canvas text-charcoal flex flex-col md:flex-row font-sans selection:bg-primary/20 selection:text-ink">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-elevation-3 border flex items-center gap-3 text-caption font-mono ${
              toast.type === "success"
                ? "bg-charcoal text-white border-charcoal shadow-elevation-2"
                : "bg-rose-600 text-white border-rose-700"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} />}
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs for Direct Media Uploads */}
      <input
        type="file"
        ref={projectFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && editingProject) {
            handleFileUpload(file, "projects", (url) => {
              setEditingProject({ ...editingProject, image: url });
            });
          }
        }}
      />

      <input
        type="file"
        ref={portraitFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file, "profile", (url) => {
              setData({ ...data, about: { ...data.about, portraitImage: url } });
            });
          }
        }}
      />

      <input
        type="file"
        ref={resumeFileInputRef}
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file, "documents", (url) => {
              setData({ ...data, about: { ...data.about, resumeUrl: url } });
            });
          }
        }}
      />

      {/* ═══════════════════════════════════════════
          LEFT SIDEBAR (Refined Studio Workspace)
          ═══════════════════════════════════════════ */}
      <aside className="w-full md:w-64 lg:w-72 bg-surface border-r border-hairline flex flex-col justify-between md:h-screen md:sticky md:top-0 z-30 flex-shrink-0">
        <div>
          {/* Workspace Identity */}
          <div className="p-5 border-b border-hairline">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal text-white flex items-center justify-center font-mono font-bold text-base shadow-elevation-1">
                D
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-body-sm-medium font-semibold text-charcoal tracking-tight truncate">
                    Portfolio Studio
                  </h1>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px] font-semibold">
                    Supabase Ready
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-mono text-steel truncate">
                    {data.about.fullName || "Dareean"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Snapshot Metrics */}
          <div className="p-3 border-b border-hairline bg-surface-soft grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-canvas border border-hairline">
              <div className="text-[10px] font-mono uppercase text-muted font-semibold">Featured</div>
              <div className="text-body-sm font-bold text-primary font-mono mt-0.5">
                {featuredCount} / {data.projects.length}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-canvas border border-hairline">
              <div className="text-[10px] font-mono uppercase text-muted font-semibold">Milestones</div>
              <div className="text-body-sm font-bold text-charcoal font-mono mt-0.5">
                {data.experiences.length}
              </div>
            </div>
          </div>

          {/* Navigation Workspaces */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-micro-uppercase text-muted font-semibold font-mono">
              Workspaces
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as CMSTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-body-sm font-mono transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-charcoal text-white font-medium shadow-elevation-1"
                      : "text-steel hover:text-charcoal hover:bg-canvas"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`text-micro font-mono ${isActive ? "text-white/60" : "text-muted"}`}>
                      /{item.num}
                    </span>
                    <Icon size={15} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.count !== null && (
                    <span
                      className={`text-micro px-1.5 py-0.5 rounded font-mono ${
                        isActive ? "bg-white/20 text-white" : "bg-canvas border border-hairline text-steel"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-3 border-t border-hairline space-y-1.5 bg-surface-soft">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-canvas border border-hairline text-charcoal text-caption font-mono hover:border-steel transition-colors group"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={13} className="text-steel group-hover:text-charcoal" />
              <span>Preview Live Website</span>
            </div>
            <ArrowUpRight size={13} className="text-steel group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={async () => {
              await fetch("/api/cms/auth", { method: "DELETE" });
              window.location.reload();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-caption font-mono transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          RIGHT MAIN WORKSPACE
          ═══════════════════════════════════════════ */}
      <main className="flex-1 min-w-0 bg-canvas min-h-screen flex flex-col justify-between">
        <div>
          {/* Top Sticky Action Bar */}
          <div className="sticky top-0 z-20 border-b border-hairline bg-surface/95 backdrop-blur-md px-6 md:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-micro font-mono text-primary font-bold uppercase tracking-wider">
                /{currentNav.num}
              </span>
              <span className="w-1 h-1 rounded-full bg-hairline-strong" />
              <div>
                <h2 className="text-body-md font-semibold text-charcoal tracking-tight">
                  {currentNav.label}
                </h2>
                <p className="text-micro text-steel font-mono hidden sm:block">
                  {currentNav.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-pressed text-white text-caption font-mono font-medium transition-colors duration-150 disabled:opacity-50 shadow-elevation-1 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save All Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8 max-w-6xl space-y-6">
            {/* ═══════════════════════════════════════════
                WORKSPACE 1: PROJECTS & WORK (Visual Catalog)
                ═══════════════════════════════════════════ */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                {/* Header with Stats & Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-surface border border-hairline">
                  <div>
                    <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                      Projects &amp; Selected Work
                    </h3>
                    <p className="text-body-sm text-slate mt-0.5">
                      Toggle the star icon to feature projects on the homepage. Click <strong>Edit</strong> to upload screenshots and manage stack.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddNewProject}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-charcoal text-white rounded-lg text-caption font-mono font-medium hover:bg-ink-deep transition-colors cursor-pointer shadow-elevation-1 flex-shrink-0"
                  >
                    <Plus size={15} />
                    <span>Add New Project</span>
                  </button>
                </div>

                {/* Visual Project Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.projects.map((project, index) => (
                    <div
                      key={project.id}
                      className={`group rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden bg-surface ${
                        project.featured
                          ? "border-primary/40 shadow-elevation-1 ring-1 ring-primary/20"
                          : "border-hairline hover:border-hairline-strong"
                      }`}
                    >
                      {/* Image Thumbnail Preview */}
                      <div className="relative h-40 bg-surface-soft border-b border-hairline overflow-hidden">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted font-mono text-xs">
                            No image preview
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                          <span className="px-2 py-0.5 rounded bg-surface/90 backdrop-blur-md border border-hairline text-charcoal font-mono text-[11px] font-semibold">
                            {project.category} · {project.year}
                          </span>

                          {/* Quick Star Toggle Button */}
                          <button
                            type="button"
                            onClick={() => toggleProjectFeatured(project.id)}
                            className={`p-1.5 rounded-md backdrop-blur-md transition-all cursor-pointer ${
                              project.featured
                                ? "bg-primary text-white shadow-elevation-1"
                                : "bg-surface/90 text-steel hover:text-charcoal hover:bg-surface"
                            }`}
                            title={project.featured ? "Featured on Home (Click to unfeature)" : "Click to feature on Home"}
                          >
                            <Star size={14} className={project.featured ? "fill-white" : ""} />
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-charcoal text-body-md leading-tight line-clamp-1">
                              {project.title}
                            </h4>
                          </div>

                          <p className="text-slate text-body-sm line-clamp-2 leading-relaxed mb-3">
                            {project.description}
                          </p>

                          {/* Tech stack chips */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.slice(0, 3).map((tech, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-canvas border border-hairline text-steel text-[10px] font-mono"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded bg-canvas border border-hairline text-steel text-[10px] font-mono">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-3 border-t border-hairline flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setEditingProject(project)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-canvas border border-hairline text-charcoal hover:border-steel text-caption font-mono font-medium transition-colors cursor-pointer"
                          >
                            <Edit3 size={13} />
                            <span>Edit Details &amp; Upload</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id, project.title)}
                            className="p-1.5 text-steel hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                WORKSPACE 2: HERO & NARRATIVE (Live Kinetic Preview)
                ═══════════════════════════════════════════ */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                {/* Live Simulation Box */}
                <div className="p-6 md:p-8 rounded-xl bg-charcoal text-white space-y-4 shadow-elevation-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-micro font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Landing Page Simulation
                    </span>
                    <span className="text-micro font-mono text-white/50">#hero</span>
                  </div>

                  <div className="py-4">
                    <div className="text-heading-2 md:text-display-sm font-bold tracking-tight leading-none uppercase">
                      <span>{data.hero.headlineLine1 || "FROM PIXEL"} </span>
                      <span className="text-white/40">{data.hero.headlineLine2 || "TO"} </span>
                      <span className="text-primary-deep bg-white px-2 py-0.5 rounded ml-1">
                        {data.hero.headlineAccent || "PEOPLE."}
                      </span>
                    </div>

                    <p className="text-body-md text-white/70 max-w-2xl mt-4 leading-relaxed">
                      {data.hero.subtitle || "Bridging technical execution with human impact."}
                    </p>
                  </div>
                </div>

                {/* Direct Editing Form */}
                <div className="p-6 rounded-xl bg-surface border border-hairline space-y-5">
                  <h3 className="text-heading-5 font-semibold text-charcoal tracking-tight border-b border-hairline pb-3">
                    Edit Headline Typography
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                        Line 1
                      </label>
                      <input
                        type="text"
                        value={data.hero.headlineLine1}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, headlineLine1: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                        Line 2
                      </label>
                      <input
                        type="text"
                        value={data.hero.headlineLine2}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, headlineLine2: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-micro font-mono text-primary font-semibold uppercase tracking-wider mb-1.5">
                        Accent Word
                      </label>
                      <input
                        type="text"
                        value={data.hero.headlineAccent}
                        onChange={(e) =>
                          setData({
                            ...data,
                            hero: { ...data.hero, headlineAccent: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-primary/40 text-primary font-mono text-body-sm font-semibold focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                      Subtitle Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={data.hero.subtitle}
                      onChange={(e) =>
                        setData({
                          ...data,
                          hero: { ...data.hero, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* 3 Core Focus Pillars */}
                <div className="p-6 rounded-xl bg-surface border border-hairline space-y-4">
                  <h3 className="text-heading-5 font-semibold text-charcoal tracking-tight border-b border-hairline pb-3">
                    3 Core Focus Pillars (Row underneath Hero)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.hero.pillars.map((pillar, index) => (
                      <div key={pillar.id || index} className="p-4 rounded-lg bg-canvas border border-hairline space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-caption font-mono font-bold text-primary">
                            /{pillar.num}
                          </span>
                          <input
                            type="text"
                            placeholder="Tags (e.g. React · Next.js)"
                            value={pillar.tags}
                            onChange={(e) => {
                              const updated = [...data.hero.pillars];
                              updated[index].tags = e.target.value;
                              setData({ ...data, hero: { ...data.hero, pillars: updated } });
                            }}
                            className="px-2 py-0.5 rounded bg-surface border border-hairline text-steel text-micro font-mono text-right"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Title</label>
                          <input
                            type="text"
                            value={pillar.title}
                            onChange={(e) => {
                              const updated = [...data.hero.pillars];
                              updated[index].title = e.target.value;
                              setData({ ...data, hero: { ...data.hero, pillars: updated } });
                            }}
                            className="w-full px-3 py-1.5 rounded bg-surface border border-hairline text-charcoal font-semibold text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={pillar.desc}
                            onChange={(e) => {
                              const updated = [...data.hero.pillars];
                              updated[index].desc = e.target.value;
                              setData({ ...data, hero: { ...data.hero, pillars: updated } });
                            }}
                            className="w-full px-3 py-1.5 rounded bg-surface border border-hairline text-charcoal text-caption focus:border-primary focus:outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scroll Reveal Narrative */}
                <div className="p-6 rounded-xl bg-surface border border-hairline space-y-4">
                  <h3 className="text-heading-5 font-semibold text-charcoal tracking-tight border-b border-hairline pb-3">
                    Scroll Reveal Narrative Statement
                  </h3>

                  <div>
                    <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                      Statement (Words illuminate sequentially on scroll)
                    </label>
                    <textarea
                      rows={4}
                      value={data.narrative.statement}
                      onChange={(e) =>
                        setData({
                          ...data,
                          narrative: { ...data.narrative, statement: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                WORKSPACE 3: ABOUT & BENTO (Visual Studio)
                ═══════════════════════════════════════════ */}
            {activeTab === "about" && (
              <div className="space-y-6">
                {/* Visual Identity Deck (Live portrait + Profile inputs side-by-side) */}
                <div className="p-6 rounded-xl bg-surface border border-hairline space-y-5">
                  <h3 className="text-heading-5 font-semibold text-charcoal tracking-tight border-b border-hairline pb-3">
                    Profile Identity &amp; Portrait
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Live Portrait Preview + Upload Button */}
                    <div className="p-4 rounded-lg bg-canvas border border-hairline flex flex-col items-center text-center">
                      <div className="w-28 h-28 rounded-xl overflow-hidden border border-hairline bg-surface mb-3 relative group">
                        <Image
                          src={data.about.portraitImage || "/assets/foto_closeup.jpg"}
                          alt={data.about.fullName}
                          fill
                          className="object-cover object-top"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => portraitFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-hairline hover:border-steel text-charcoal text-micro font-mono font-medium transition-colors cursor-pointer mb-2"
                      >
                        <Upload size={12} />
                        <span>{isUploading ? "Uploading..." : "Upload New Photo"}</span>
                      </button>

                      <div className="text-body-sm-medium font-semibold text-charcoal">
                        {data.about.fullName}
                      </div>
                      <div className="text-micro font-mono text-primary font-semibold mt-0.5">
                        {data.about.roleTag}
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={data.about.fullName}
                            onChange={(e) =>
                              setData({ ...data, about: { ...data.about, fullName: e.target.value } })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                            Role Tag
                          </label>
                          <input
                            type="text"
                            value={data.about.roleTag}
                            onChange={(e) =>
                              setData({ ...data, about: { ...data.about, roleTag: e.target.value } })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                            Portrait Image URL / Path
                          </label>
                          <input
                            type="text"
                            value={data.about.portraitImage}
                            onChange={(e) =>
                              setData({ ...data, about: { ...data.about, portraitImage: e.target.value } })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                            Location &amp; Coordinates
                          </label>
                          <input
                            type="text"
                            value={data.about.locationText}
                            onChange={(e) =>
                              setData({ ...data, about: { ...data.about, locationText: e.target.value } })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Philosophy & Bio */}
                <div className="p-6 rounded-xl bg-surface border border-hairline space-y-4">
                  <h3 className="text-heading-5 font-semibold text-charcoal tracking-tight border-b border-hairline pb-3">
                    Philosophy &amp; Bio Statement
                  </h3>

                  <div>
                    <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                      Philosophy Headline
                    </label>
                    <input
                      type="text"
                      value={data.about.philosophyHeading}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, philosophyHeading: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm font-semibold focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                      Bio Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={data.about.philosophyBio}
                      onChange={(e) =>
                        setData({
                          ...data,
                          about: { ...data.about, philosophyBio: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-micro font-mono text-steel uppercase tracking-wider">
                          Resume PDF File URL
                        </label>
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => resumeFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1 text-micro font-mono text-primary font-semibold hover:underline cursor-pointer"
                        >
                          <Upload size={11} />
                          <span>Upload PDF</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={data.about.resumeUrl}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, resumeUrl: e.target.value } })
                        }
                        className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
                        Status Badge (e.g. Remote Ready)
                      </label>
                      <input
                        type="text"
                        value={data.about.statusTag}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, statusTag: e.target.value } })
                        }
                        className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Tech Stack Manager (Chips Tagging UI) */}
                <div className="p-6 rounded-xl bg-surface border border-hairline space-y-4">
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <div>
                      <h3 className="text-heading-5 font-semibold text-charcoal tracking-tight">
                        Active Tech Stack ({data.about.techStack.length} chips)
                      </h3>
                      <p className="text-caption text-slate mt-0.5">
                        Click the &times; on any chip to remove it, or add new technologies below.
                      </p>
                    </div>
                  </div>

                  {/* Active Chips */}
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-canvas border border-hairline min-h-[50px]">
                    {data.about.techStack.map((tech, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-hairline text-charcoal font-mono text-caption shadow-elevation-0 hover:border-steel transition-colors"
                      >
                        <span className="font-semibold">{tech.name}</span>
                        <span className="text-muted text-xs font-normal">({tech.category})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTechStack(index)}
                          className="ml-1 text-steel hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove tech"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Quick Add Tech Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <input
                      type="text"
                      placeholder="Tech name (e.g. Supabase, Docker, Golang)"
                      value={newTechName}
                      onChange={(e) => setNewTechName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTechStack();
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm font-mono focus:border-primary focus:outline-none"
                    />

                    <select
                      value={newTechCategory}
                      onChange={(e) => setNewTechCategory(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-canvas border border-hairline text-charcoal text-caption font-mono focus:border-primary focus:outline-none"
                    >
                      <option value="Framework">Framework</option>
                      <option value="Language">Language</option>
                      <option value="Database">Database</option>
                      <option value="Library">Library</option>
                      <option value="Styling">Styling</option>
                      <option value="Spatial">Spatial</option>
                      <option value="Design">Design</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Tool">Tool</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleAddTechStack}
                      className="px-4 py-2 bg-charcoal hover:bg-ink-deep text-white text-caption font-mono font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0"
                    >
                      <Plus size={14} />
                      <span>Add Chip</span>
                    </button>
                  </div>
                </div>

                {/* Community Roles */}
                <div className="p-6 rounded-xl bg-surface border border-hairline space-y-4">
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <h3 className="text-heading-5 font-semibold text-charcoal tracking-tight">
                      Community Leadership Roles
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...data.about.communityRoles, { org: "Organization Name", role: "Role Title" }];
                        setData({ ...data, about: { ...data.about, communityRoles: updated } });
                      }}
                      className="inline-flex items-center gap-1 text-caption font-mono text-primary font-semibold hover:underline cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Add Role</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {data.about.communityRoles.map((role, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-canvas border border-hairline">
                        <input
                          type="text"
                          placeholder="Organization Name"
                          value={role.org}
                          onChange={(e) => {
                            const updated = [...data.about.communityRoles];
                            updated[idx].org = e.target.value;
                            setData({ ...data, about: { ...data.about, communityRoles: updated } });
                          }}
                          className="flex-1 px-3 py-1.5 rounded bg-surface border border-hairline text-charcoal text-body-sm font-medium focus:border-primary focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Role Title"
                          value={role.role}
                          onChange={(e) => {
                            const updated = [...data.about.communityRoles];
                            updated[idx].role = e.target.value;
                            setData({ ...data, about: { ...data.about, communityRoles: updated } });
                          }}
                          className="flex-1 px-3 py-1.5 rounded bg-surface border border-hairline text-charcoal font-mono text-caption focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.about.communityRoles.filter((_, i) => i !== idx);
                            setData({ ...data, about: { ...data.about, communityRoles: updated } });
                          }}
                          className="p-1.5 text-steel hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                WORKSPACE 4: WRITING & STORIES
                ═══════════════════════════════════════════ */}
            {activeTab === "writing" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 rounded-xl bg-surface border border-hairline">
                  <div>
                    <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                      Selected Publications &amp; Writing Feed
                    </h3>
                    <p className="text-body-sm text-slate mt-0.5">
                      Articles displayed in the minimalist publication feed on the landing page.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newStory: CMSStory = {
                        id: Date.now(),
                        title: "New Publication Article",
                        excerpt: "A brief summary of the key technical reflections and architecture decisions.",
                        date: "Aug 2025",
                        category: "Engineering",
                        readTime: "4 min read",
                        link: "/journey",
                      };
                      setData({ ...data, stories: [newStory, ...data.stories] });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal text-white rounded-lg text-caption font-mono font-medium hover:bg-ink-deep transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Article</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.stories.map((story, index) => (
                    <div key={story.id} className="p-5 rounded-xl bg-surface border border-hairline space-y-4">
                      <div className="flex items-center justify-between border-b border-hairline pb-3">
                        <input
                          type="text"
                          value={story.title}
                          onChange={(e) => {
                            const updated = [...data.stories];
                            updated[index].title = e.target.value;
                            setData({ ...data, stories: updated });
                          }}
                          className="font-semibold text-heading-5 text-charcoal bg-transparent border-b border-transparent hover:border-hairline focus:border-primary focus:outline-none px-1 flex-1 mr-4"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete article "${story.title}"?`)) {
                              const updated = data.stories.filter((s) => s.id !== story.id);
                              setData({ ...data, stories: updated });
                            }
                          }}
                          className="p-1.5 text-steel hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Date</label>
                          <input
                            type="text"
                            value={story.date}
                            onChange={(e) => {
                              const updated = [...data.stories];
                              updated[index].date = e.target.value;
                              setData({ ...data, stories: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Category</label>
                          <input
                            type="text"
                            value={story.category}
                            onChange={(e) => {
                              const updated = [...data.stories];
                              updated[index].category = e.target.value;
                              setData({ ...data, stories: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Read Time</label>
                          <input
                            type="text"
                            value={story.readTime}
                            onChange={(e) => {
                              const updated = [...data.stories];
                              updated[index].readTime = e.target.value;
                              setData({ ...data, stories: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-micro font-mono text-steel mb-1">Excerpt Teaser</label>
                        <textarea
                          rows={2}
                          value={story.excerpt}
                          onChange={(e) => {
                            const updated = [...data.stories];
                            updated[index].excerpt = e.target.value;
                            setData({ ...data, stories: updated });
                          }}
                          className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                WORKSPACE 5: JOURNEY TIMELINE
                ═══════════════════════════════════════════ */}
            {activeTab === "journey" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 rounded-xl bg-surface border border-hairline">
                  <div>
                    <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                      Journey Milestones &amp; Experience
                    </h3>
                    <p className="text-body-sm text-slate mt-0.5">
                      Entries rendered in the editorial ledger on the /journey page.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newExp: CMSExperience = {
                        id: Date.now(),
                        title: "New Milestone",
                        role: "Role Title",
                        organization: "Organization / Project",
                        dateStart: "2026-01",
                        dateEnd: "",
                        description: "Description of the milestone, responsibilities, and achievements.",
                        highlights: ["Leadership", "Engineering"],
                        category: "community",
                      };
                      setData({ ...data, experiences: [newExp, ...data.experiences] });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal text-white rounded-lg text-caption font-mono font-medium hover:bg-ink-deep transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Milestone</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.experiences.map((exp, index) => (
                    <div key={exp.id} className="p-5 rounded-xl bg-surface border border-hairline space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline pb-3">
                        <div className="flex items-center gap-2.5 flex-1">
                          <span className="text-caption font-mono text-steel font-bold">#{index + 1}</span>
                          <input
                            type="text"
                            value={exp.role}
                            placeholder="Role"
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[index].role = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="font-semibold text-heading-5 text-charcoal bg-transparent border-b border-transparent hover:border-hairline focus:border-primary focus:outline-none px-1"
                          />
                          <span className="text-steel">@</span>
                          <input
                            type="text"
                            value={exp.organization}
                            placeholder="Organization"
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[index].organization = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="text-body-sm text-steel bg-transparent border-b border-transparent hover:border-hairline focus:border-primary focus:outline-none px-1"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            value={exp.category}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[index].category = e.target.value as any;
                              setData({ ...data, experiences: updated });
                            }}
                            className="px-3 py-1.5 rounded bg-canvas border border-hairline text-caption font-mono text-charcoal focus:border-primary focus:outline-none"
                          >
                            <option value="community">Community</option>
                            <option value="work">Work</option>
                            <option value="award">Award</option>
                            <option value="committee">Committee</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="education">Education</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete milestone "${exp.role} @ ${exp.organization}"?`)) {
                                const updated = data.experiences.filter((e) => e.id !== exp.id);
                                setData({ ...data, experiences: updated });
                              }
                            }}
                            className="p-1.5 text-steel hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Start Date (YYYY-MM)</label>
                          <input
                            type="text"
                            value={exp.dateStart}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[index].dateStart = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">End Date (Blank = Present)</label>
                          <input
                            type="text"
                            placeholder="YYYY-MM (or empty)"
                            value={exp.dateEnd || ""}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[index].dateEnd = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Display Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[index].title = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-micro font-mono text-steel mb-1">Narrative Description</label>
                        <textarea
                          rows={3}
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].description = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-micro font-mono text-steel mb-1">Highlights (comma separated)</label>
                        <input
                          type="text"
                          value={exp.highlights.join(", ")}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].highlights = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                WORKSPACE 6: SUPABASE & GLOBAL SETTINGS
                ═══════════════════════════════════════════ */}
            {activeTab === "site" && (
              <div className="space-y-6">
                {/* Supabase Storage Card */}
                <div className="p-6 rounded-xl bg-surface border border-hairline space-y-4">
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-mono font-bold text-sm">
                        <Database size={16} />
                      </div>
                      <div>
                        <h3 className="text-heading-5 font-semibold text-charcoal tracking-tight">
                          Supabase Storage &amp; Database
                        </h3>
                        <p className="text-caption text-slate">
                          Automatic Cloud CDN uploads for screenshots, profile photos, and documents.
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-canvas border border-hairline text-primary font-mono text-micro font-semibold flex items-center gap-1.5">
                      <Cloud size={12} />
                      <span>Ready</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-lg bg-canvas border border-hairline space-y-2">
                    <div className="text-body-sm font-semibold text-charcoal">
                      How to connect your Supabase Project:
                    </div>
                    <ol className="text-caption text-slate space-y-1.5 list-decimal list-inside font-mono">
                      <li>Open your <strong>.env.local</strong> file in this project.</li>
                      <li>Fill in <strong>NEXT_PUBLIC_SUPABASE_URL</strong> and <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong>.</li>
                      <li>In Supabase Dashboard, create a Storage bucket named <strong>portfolio-assets</strong> and set it to Public.</li>
                      <li>All future uploads in this CMS will automatically stream to your Supabase Cloud CDN!</li>
                    </ol>
                  </div>
                </div>

                {/* Global Contact & Social Links */}
                <div className="p-6 rounded-xl bg-surface border border-hairline space-y-5">
                  <h3 className="text-heading-5 font-semibold text-charcoal tracking-tight border-b border-hairline pb-3">
                    Global Contact &amp; Social Links
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-micro font-mono text-steel mb-1.5">Primary Email</label>
                      <input
                        type="email"
                        value={data.site.email}
                        onChange={(e) =>
                          setData({ ...data, site: { ...data.site, email: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-micro font-mono text-steel mb-1.5">GitHub URL</label>
                      <input
                        type="text"
                        value={data.site.github}
                        onChange={(e) =>
                          setData({ ...data, site: { ...data.site, github: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-micro font-mono text-steel mb-1.5">LinkedIn URL</label>
                      <input
                        type="text"
                        value={data.site.linkedin}
                        onChange={(e) =>
                          setData({ ...data, site: { ...data.site, linkedin: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-micro font-mono text-steel mb-1.5">Instagram URL</label>
                      <input
                        type="text"
                        value={data.site.instagram}
                        onChange={(e) =>
                          setData({ ...data, site: { ...data.site, instagram: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-micro font-mono text-steel mb-1.5">Footer Note / Slogan</label>
                    <input
                      type="text"
                      value={data.site.footerNote}
                      onChange={(e) =>
                        setData({ ...data, site: { ...data.site, footerNote: e.target.value } })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info in main */}
        <footer className="px-6 md:px-8 py-3.5 border-t border-hairline text-caption text-steel font-mono flex items-center justify-between bg-surface-soft">
          <span>Dareean Portfolio Studio · Supabase Ready</span>
          <span>Local JSON DB &amp; Cloud Storage</span>
        </footer>
      </main>

      {/* ═══════════════════════════════════════════
          PROJECT EDITING MODAL / DRAWER (With File Upload)
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-2xl bg-surface border border-hairline rounded-2xl shadow-elevation-3 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-hairline flex items-center justify-between bg-surface-soft">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
                    <Edit3 size={15} />
                  </div>
                  <div>
                    <h3 className="text-body-md font-semibold text-charcoal">
                      Edit Project Details
                    </h3>
                    <p className="text-micro font-mono text-steel">
                      {editingProject.slug}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 text-steel hover:text-charcoal hover:bg-canvas rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Image Upload Zone & Preview inside modal */}
                <div className="p-4 rounded-xl bg-canvas border border-hairline flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-20 rounded-lg bg-surface-soft overflow-hidden relative border border-hairline flex-shrink-0">
                    {editingProject.image ? (
                      <Image
                        src={editingProject.image}
                        alt={editingProject.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted font-mono text-[10px]">
                        No img
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-micro font-mono text-steel uppercase">
                        Showcase Thumbnail
                      </label>
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => projectFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-charcoal hover:bg-ink-deep text-white text-caption font-mono font-medium transition-colors cursor-pointer"
                      >
                        <Upload size={12} />
                        <span>{isUploading ? "Uploading..." : "Upload New Image"}</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Image URL or local path"
                      value={editingProject.image}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, image: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-md bg-surface border border-hairline text-charcoal font-mono text-caption focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-micro font-mono text-steel uppercase mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-hairline text-charcoal font-semibold text-body-md focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-micro font-mono text-steel uppercase mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-micro font-mono text-steel uppercase mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={editingProject.year}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          year: parseInt(e.target.value) || 2025,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-micro font-mono text-steel uppercase mb-1">
                    Live Demo / Link URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.link}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, link: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-micro font-mono text-steel uppercase mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-micro font-mono text-steel uppercase mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingProject.technologies.join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Featured toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-canvas border border-hairline cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, featured: e.target.checked })
                      }
                      className="w-4 h-4 text-primary rounded"
                    />
                    <div>
                      <div className="text-body-sm font-semibold text-charcoal">
                        Feature this project on the Homepage
                      </div>
                      <div className="text-caption text-slate">
                        Featured projects are displayed in the main showcase section on the landing page.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-hairline bg-surface-soft flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteProject(editingProject.id, editingProject.title)}
                  className="px-3.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-caption font-mono font-medium transition-colors cursor-pointer"
                >
                  Delete Project
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-lg bg-canvas border border-hairline text-charcoal text-caption font-mono hover:bg-surface transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => saveProjectModal(editingProject)}
                    className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-pressed text-white text-caption font-mono font-semibold transition-colors cursor-pointer shadow-elevation-1"
                  >
                    Done &amp; Update
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
