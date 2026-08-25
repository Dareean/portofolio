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
  Calendar,
  Clock,
  Tag,
  Briefcase,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Upload,
  Database,
  Cloud,
  Menu,
  Search,
  Code2,
} from "lucide-react";

type CMSTab = "projects" | "hero" | "about" | "writing" | "journey" | "site";

export default function CMSDashboard({ initialData }: { initialData: PortfolioCMSData }) {
  const [data, setData] = useState<PortfolioCMSData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<CMSTab>("projects");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal state
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);

  // Uploading states
  const [isUploading, setIsUploading] = useState(false);

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

  // Upload file helper
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
        showToast("Uploaded successfully!");
      } else {
        showToast(json.error || "Upload failed", "error");
      }
    } catch (err) {
      showToast("Network error during upload", "error");
    } finally {
      setIsUploading(false);
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
        showToast("All changes saved to portfolio_cms.json!");
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
    showToast("Project visibility updated!");
  };

  // Save edited project from modal
  const saveProjectModal = (updatedProject: CMSProject) => {
    const updated = data.projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    setData({ ...data, projects: updated });
    setEditingProject(null);
    showToast("Project updated!");
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
      description: "Case study of system architecture, technology stack, and engineering impact.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      metrics: [{ label: "Impact", value: "+30%" }],
    };
    setData({ ...data, projects: [newProj, ...data.projects] });
    setEditingProject(newProj);
    showToast("New project added.");
  };

  // Delete a project
  const handleDeleteProject = (id: number, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      const updated = data.projects.filter((p) => p.id !== id);
      setData({ ...data, projects: updated });
      if (editingProject?.id === id) setEditingProject(null);
      showToast("Project deleted.");
    }
  };

  // Add new tech stack chip
  const handleAddTechStack = () => {
    if (!newTechName.trim()) return;
    const updated = [...data.about.techStack, { name: newTechName.trim(), category: newTechCategory }];
    setData({ ...data, about: { ...data.about, techStack: updated } });
    setNewTechName("");
    showToast(`Added ${newTechName}!`);
  };

  // Remove tech stack chip
  const handleRemoveTechStack = (index: number) => {
    const updated = data.about.techStack.filter((_, i) => i !== index);
    setData({ ...data, about: { ...data.about, techStack: updated } });
  };

  const navGroups = [
    {
      groupTitle: "WORKSPACES",
      items: [
        {
          id: "projects",
          label: "Projects & Work",
          icon: Layers,
          count: data.projects.length,
        },
        {
          id: "hero",
          label: "Hero & Narrative",
          icon: Sliders,
          count: null,
        },
        {
          id: "about",
          label: "About & Bento",
          icon: User,
          count: null,
        },
      ],
    },
    {
      groupTitle: "EDITORIAL",
      items: [
        {
          id: "writing",
          label: "Writing & Stories",
          icon: FileText,
          count: data.stories.length,
        },
        {
          id: "journey",
          label: "Journey Ledger",
          icon: Compass,
          count: data.experiences.length,
        },
      ],
    },
    {
      groupTitle: "SETTINGS",
      items: [
        {
          id: "site",
          label: "Cloud & Social",
          icon: Globe,
          count: null,
        },
      ],
    },
  ];

  const allNavItems = navGroups.flatMap((g) => g.items);
  const currentNav = allNavItems.find((n) => n.id === activeTab) || allNavItems[0];
  const featuredCount = data.projects.filter((p) => p.featured).length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg border text-xs font-mono font-medium shadow-md flex items-center gap-2.5 ${
              toast.type === "success"
                ? "bg-white text-[#0F172A] border-[#4F46E5]"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {toast.type === "success" ? (
              <Check size={14} className="text-[#4F46E5]" />
            ) : (
              <AlertCircle size={14} className="text-rose-500" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs */}
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
          SIDEBAR
          ═══════════════════════════════════════════ */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-white border-r border-[#E2E8F0] duration-200 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full w-0 lg:w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <Link href="/cms" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              D
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0F172A] tracking-tight">
                Dareean Studio
              </div>
              <div className="text-[10px] text-[#64748B] font-mono">
                CMS Control Plane
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="block lg:hidden text-[#64748B] hover:text-[#0F172A]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="mb-2 px-3 text-[10px] font-mono font-semibold uppercase text-[#64748B] tracking-wider">
                {group.groupTitle}
              </div>

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setActiveTab(item.id as CMSTab)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          isActive
                            ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold border border-[#E0E7FF]"
                            : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={14} className={isActive ? "text-[#4F46E5]" : "text-[#64748B]"} />
                          <span>{item.label}</span>
                        </div>

                        {item.count !== null && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              isActive
                                ? "bg-[#4F46E5] text-white"
                                : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#E2E8F0] space-y-1.5 bg-white">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] hover:text-[#0F172A] font-mono transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={13} className="text-[#4F46E5]" />
              <span>Preview Website</span>
            </div>
            <ArrowUpRight size={13} />
          </Link>

          <button
            type="button"
            onClick={async () => {
              await fetch("/api/cms/auth", { method: "DELETE" });
              window.location.reload();
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:text-rose-600 font-mono transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          MAIN WORKSPACE
          ═══════════════════════════════════════════ */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#F8FAFC]">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 flex w-full bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-3 justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded border border-[#E2E8F0] bg-white text-[#64748B]"
            >
              <Menu size={16} />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#64748B]">Dashboard</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="font-semibold text-[#0F172A]">{currentNav.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Filter entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] focus:bg-white focus:outline-none w-52"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={13} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 md:p-8 max-w-6xl space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                Total Projects
              </div>
              <div className="text-xl font-bold font-mono text-[#0F172A] mt-1">
                {data.projects.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                Featured on Home
              </div>
              <div className="text-xl font-bold font-mono text-[#4F46E5] mt-1">
                {featuredCount}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                Milestones
              </div>
              <div className="text-xl font-bold font-mono text-[#0F172A] mt-1">
                {data.experiences.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                Tech Stack
              </div>
              <div className="text-xl font-bold font-mono text-[#0F172A] mt-1">
                {data.about.techStack.length}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              TAB 1: PROJECTS
              ═══════════════════════════════════════════ */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    Projects &amp; Selected Works
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Click the star to feature a project on the landing page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition-colors cursor-pointer shadow-xs"
                >
                  <Plus size={14} />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.projects
                  .filter((p) =>
                    searchQuery
                      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.category.toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((project) => (
                    <div
                      key={project.id}
                      className={`rounded-xl border overflow-hidden flex flex-col justify-between bg-white shadow-xs transition-colors ${
                        project.featured ? "border-[#4F46E5] ring-1 ring-[#4F46E5]/20" : "border-[#E2E8F0] hover:border-[#94A3B8]"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-40 bg-[#F1F5F9] border-b border-[#E2E8F0] overflow-hidden">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#94A3B8]">
                            No image
                          </div>
                        )}

                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                          <span className="px-2 py-0.5 rounded bg-white/90 text-[#0F172A] font-mono text-[10px] font-semibold border border-[#E2E8F0] shadow-xs">
                            {project.category} · {project.year}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleProjectFeatured(project.id)}
                            className={`p-1.5 rounded transition-colors cursor-pointer ${
                              project.featured
                                ? "bg-[#4F46E5] text-white shadow-xs"
                                : "bg-white/90 text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
                            }`}
                            title={project.featured ? "Featured on Home" : "Click to feature"}
                          >
                            <Star size={13} className={project.featured ? "fill-white" : ""} />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm text-[#0F172A] line-clamp-1">
                            {project.title}
                          </h4>
                          <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-1 mt-3">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-mono text-[#64748B]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setEditingProject(project)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAFC] hover:border-[#4F46E5] border border-[#E2E8F0] text-[#0F172A] text-xs font-mono transition-colors cursor-pointer"
                          >
                            <Edit3 size={12} className="text-[#4F46E5]" />
                            <span>Edit Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id, project.title)}
                            className="p-1 text-[#64748B] hover:text-rose-600 transition cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB 2: HERO & NARRATIVE
              ═══════════════════════════════════════════ */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              {/* Live Preview Box */}
              <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                  Live Typography Preview
                </div>
                <div className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-[#0F172A]">
                  <span>{data.hero.headlineLine1 || "FROM PIXEL"} </span>
                  <span className="text-[#94A3B8]">{data.hero.headlineLine2 || "TO"} </span>
                  <span className="text-[#4F46E5] ml-1">
                    {data.hero.headlineAccent || "PEOPLE."}
                  </span>
                </div>
                <p className="text-xs text-[#64748B] max-w-2xl leading-relaxed">
                  {data.hero.subtitle || "Bridging technical execution with human impact."}
                </p>
              </div>

              {/* Form Box */}
              <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Headline Text
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                      Line 1
                    </label>
                    <input
                      type="text"
                      value={data.hero.headlineLine1}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, headlineLine1: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                      Line 2
                    </label>
                    <input
                      type="text"
                      value={data.hero.headlineLine2}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, headlineLine2: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#4F46E5] uppercase font-semibold mb-1">
                      Accent Word
                    </label>
                    <input
                      type="text"
                      value={data.hero.headlineAccent}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, headlineAccent: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#EEF2FF] border border-[#4F46E5]/40 text-xs font-mono font-semibold text-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                    Subtitle Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={data.hero.subtitle}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 3 Core Focus Pillars */}
              <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  3 Core Focus Pillars
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.hero.pillars.map((pillar, index) => (
                    <div key={pillar.id || index} className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#4F46E5]">
                          /{pillar.num}
                        </span>
                        <input
                          type="text"
                          placeholder="Tags"
                          value={pillar.tags}
                          onChange={(e) => {
                            const updated = [...data.hero.pillars];
                            updated[index].tags = e.target.value;
                            setData({ ...data, hero: { ...data.hero, pillars: updated } });
                          }}
                          className="px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[10px] font-mono text-[#64748B] text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#64748B] mb-1">Title</label>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const updated = [...data.hero.pillars];
                            updated[index].title = e.target.value;
                            setData({ ...data, hero: { ...data.hero, pillars: updated } });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#64748B] mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={pillar.desc}
                          onChange={(e) => {
                            const updated = [...data.hero.pillars];
                            updated[index].desc = e.target.value;
                            setData({ ...data, hero: { ...data.hero, pillars: updated } });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-white border border-[#E2E8F0] text-xs text-[#64748B] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Narrative Statement */}
              <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Scroll Reveal Narrative Statement
                </h3>
                <textarea
                  rows={4}
                  value={data.narrative.statement}
                  onChange={(e) =>
                    setData({ ...data, narrative: { ...data.narrative, statement: e.target.value } })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB 3: ABOUT & BENTO
              ═══════════════════════════════════════════ */}
          {activeTab === "about" && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Profile Identity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-[#4F46E5] mb-3 shadow-xs">
                      <Image
                        src={data.about.portraitImage || "/assets/foto_closeup.jpg"}
                        alt={data.about.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => portraitFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#4F46E5] text-white text-xs font-mono font-medium hover:bg-[#4338CA] transition cursor-pointer mb-2 shadow-xs"
                    >
                      <Upload size={12} />
                      <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                    </button>

                    <div className="font-semibold text-xs text-[#0F172A]">
                      {data.about.fullName}
                    </div>
                    <div className="text-[11px] font-mono text-[#4F46E5] mt-0.5">
                      {data.about.roleTag}
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={data.about.fullName}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, fullName: e.target.value } })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                        Role Tag
                      </label>
                      <input
                        type="text"
                        value={data.about.roleTag}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, roleTag: e.target.value } })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                        Portrait Image URL
                      </label>
                      <input
                        type="text"
                        value={data.about.portraitImage}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, portraitImage: e.target.value } })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={data.about.locationText}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, locationText: e.target.value } })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Statement */}
              <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Philosophy &amp; Biography
                </h3>

                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={data.about.philosophyHeading}
                    onChange={(e) =>
                      setData({ ...data, about: { ...data.about, philosophyHeading: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                    Bio Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={data.about.philosophyBio}
                    onChange={(e) =>
                      setData({ ...data, about: { ...data.about, philosophyBio: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-mono text-[#64748B] uppercase">
                        Resume PDF URL
                      </label>
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => resumeFileInputRef.current?.click()}
                        className="text-[10px] font-mono text-[#4F46E5] font-semibold hover:underline cursor-pointer"
                      >
                        Upload PDF
                      </button>
                    </div>
                    <input
                      type="text"
                      value={data.about.resumeUrl}
                      onChange={(e) =>
                        setData({ ...data, about: { ...data.about, resumeUrl: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                      Status Badge
                    </label>
                    <input
                      type="text"
                      value={data.about.statusTag}
                      onChange={(e) =>
                        setData({ ...data, about: { ...data.about, statusTag: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Tech Stack Skills ({data.about.techStack.length} chips)
                </h3>

                <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  {data.about.techStack.map((tech, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] shadow-xs"
                    >
                      <span className="font-semibold">{tech.name}</span>
                      <span className="text-[#64748B] text-[10px]">({tech.category})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechStack(index)}
                        className="ml-1 text-[#94A3B8] hover:text-rose-600 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <input
                    type="text"
                    placeholder="Skill name (e.g. Next.js, Golang)"
                    value={newTechName}
                    onChange={(e) => setNewTechName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTechStack();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] focus:outline-none"
                  />

                  <select
                    value={newTechCategory}
                    onChange={(e) => setNewTechCategory(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] focus:outline-none"
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
                    className="px-4 py-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition cursor-pointer shadow-xs"
                  >
                    Add Chip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB 4: WRITING
              ═══════════════════════════════════════════ */}
          {activeTab === "writing" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    Selected Publications &amp; Feed
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Articles displayed in the editorial feed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newStory: CMSStory = {
                      id: Date.now(),
                      title: "New Publication Article",
                      excerpt: "Summary of technical reflections and architecture decisions.",
                      date: "Aug 2026",
                      category: "Engineering",
                      readTime: "4 min read",
                      link: "/journey",
                    };
                    setData({ ...data, stories: [newStory, ...data.stories] });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition cursor-pointer shadow-xs"
                >
                  <Plus size={14} />
                  <span>Add Article</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.stories.map((story, index) => (
                  <div key={story.id} className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                      <input
                        type="text"
                        value={story.title}
                        onChange={(e) => {
                          const updated = [...data.stories];
                          updated[index].title = e.target.value;
                          setData({ ...data, stories: updated });
                        }}
                        className="font-semibold text-xs text-[#0F172A] bg-transparent border-b border-transparent hover:border-[#E2E8F0] focus:border-[#4F46E5] outline-none px-1 flex-1 mr-4"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete article "${story.title}"?`)) {
                            const updated = data.stories.filter((s) => s.id !== story.id);
                            setData({ ...data, stories: updated });
                          }
                        }}
                        className="p-1 text-[#64748B] hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-[#64748B] mb-1">Date</label>
                        <input
                          type="text"
                          value={story.date}
                          onChange={(e) => {
                            const updated = [...data.stories];
                            updated[index].date = e.target.value;
                            setData({ ...data, stories: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#64748B] mb-1">Category</label>
                        <input
                          type="text"
                          value={story.category}
                          onChange={(e) => {
                            const updated = [...data.stories];
                            updated[index].category = e.target.value;
                            setData({ ...data, stories: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#64748B] mb-1">Read Time</label>
                        <input
                          type="text"
                          value={story.readTime}
                          onChange={(e) => {
                            const updated = [...data.stories];
                            updated[index].readTime = e.target.value;
                            setData({ ...data, stories: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#64748B] mb-1">Excerpt</label>
                      <textarea
                        rows={2}
                        value={story.excerpt}
                        onChange={(e) => {
                          const updated = [...data.stories];
                          updated[index].excerpt = e.target.value;
                          setData({ ...data, stories: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] focus:border-[#4F46E5] outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB 5: JOURNEY
              ═══════════════════════════════════════════ */}
          {activeTab === "journey" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    Journey Milestones &amp; Experience
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Entries displayed in the /journey timeline.
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition cursor-pointer shadow-xs"
                >
                  <Plus size={14} />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.experiences.map((exp, index) => (
                  <div key={exp.id} className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-mono text-[#4F46E5] font-bold">#{index + 1}</span>
                        <input
                          type="text"
                          value={exp.role}
                          placeholder="Role"
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].role = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="font-semibold text-xs text-[#0F172A] bg-transparent border-b border-transparent hover:border-[#E2E8F0] focus:border-[#4F46E5] outline-none px-1"
                        />
                        <span className="text-[#64748B]">@</span>
                        <input
                          type="text"
                          value={exp.organization}
                          placeholder="Organization"
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].organization = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="text-xs text-[#64748B] bg-transparent border-b border-transparent hover:border-[#E2E8F0] focus:border-[#4F46E5] outline-none px-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={exp.category}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].category = e.target.value as any;
                            setData({ ...data, experiences: updated });
                          }}
                          className="px-2 py-1 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
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
                            if (confirm(`Delete "${exp.role} @ ${exp.organization}"?`)) {
                              const updated = data.experiences.filter((e) => e.id !== exp.id);
                              setData({ ...data, experiences: updated });
                            }
                          }}
                          className="p-1 text-[#64748B] hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-[#64748B] mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.dateStart}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].dateStart = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#64748B] mb-1">End Date</label>
                        <input
                          type="text"
                          placeholder="Present (or YYYY-MM)"
                          value={exp.dateEnd || ""}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].dateEnd = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#64748B] mb-1">Display Title</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].title = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#64748B] mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[index].description = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] focus:border-[#4F46E5] outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB 6: CLOUD & SETTINGS
              ═══════════════════════════════════════════ */}
          {activeTab === "site" && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-mono text-[#0F172A] font-semibold">
                  <Database size={15} className="text-[#4F46E5]" />
                  <span>Supabase Storage Integration</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Configure <strong>NEXT_PUBLIC_SUPABASE_URL</strong> and <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> in your <strong>.env.local</strong> to stream uploads to your public bucket <strong>portfolio-assets</strong>.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Global Social &amp; Contact Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.site.email}
                      onChange={(e) =>
                        setData({ ...data, site: { ...data.site, email: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={data.site.github}
                      onChange={(e) =>
                        setData({ ...data, site: { ...data.site, github: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={data.site.linkedin}
                      onChange={(e) =>
                        setData({ ...data, site: { ...data.site, linkedin: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={data.site.instagram}
                      onChange={(e) =>
                        setData({ ...data, site: { ...data.site, instagram: e.target.value } })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                    Footer Note
                  </label>
                  <input
                    type="text"
                    value={data.site.footerNote}
                    onChange={(e) =>
                      setData({ ...data, site: { ...data.site, footerNote: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════════════════════════════════
          PROJECT MODAL
          ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="w-full max-w-2xl rounded-xl border border-[#E2E8F0] bg-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
                    <Edit3 size={14} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-[#0F172A]">
                      Edit Project
                    </h3>
                    <p className="text-[10px] font-mono text-[#64748B]">
                      {editingProject.slug}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="text-[#64748B] hover:text-[#0F172A] transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Upload Banner */}
                <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-18 rounded bg-white overflow-hidden relative border border-[#E2E8F0] flex-shrink-0">
                    {editingProject.image ? (
                      <Image
                        src={editingProject.image}
                        alt={editingProject.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#94A3B8]">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 w-full space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-mono uppercase text-[#64748B]">
                        Thumbnail Image
                      </label>
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => projectFileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded bg-[#4F46E5] text-white text-[11px] font-mono font-medium hover:bg-[#4338CA] transition cursor-pointer shadow-xs"
                      >
                        {isUploading ? "Uploading..." : "Upload Image"}
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Image URL"
                      value={editingProject.image}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, image: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={editingProject.year}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          year: parseInt(e.target.value) || 2026,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                    Demo URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.link}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, link: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#64748B] uppercase mb-1">
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
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>

                {/* Featured toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, featured: e.target.checked })
                      }
                      className="w-4 h-4 text-[#4F46E5] rounded border-[#E2E8F0] focus:ring-[#4F46E5]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#0F172A]">
                        Feature this project on Homepage
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Displayed in the primary spotlight grid.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 border-t border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <button
                  type="button"
                  onClick={() => handleDeleteProject(editingProject.id, editingProject.title)}
                  className="text-xs font-mono text-rose-600 hover:underline cursor-pointer"
                >
                  Delete Project
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-mono text-[#64748B] hover:text-[#0F172A] bg-white transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => saveProjectModal(editingProject)}
                    className="px-4 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition cursor-pointer shadow-xs"
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
