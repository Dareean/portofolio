"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

type CMSTab = "hero" | "projects" | "about" | "writing" | "journey" | "site";

export default function CMSDashboard({ initialData }: { initialData: PortfolioCMSData }) {
  const [data, setData] = useState<PortfolioCMSData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<CMSTab>("hero");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
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

  const navItems = [
    { id: "hero", label: "Hero & Narrative", icon: Sliders, count: null },
    { id: "projects", label: "Projects Catalog", icon: Layers, count: data.projects.length },
    { id: "about", label: "Profile & Bento", icon: User, count: null },
    { id: "writing", label: "Writing & Blog", icon: FileText, count: data.stories.length },
    { id: "journey", label: "Journey Milestones", icon: Compass, count: data.experiences.length },
    { id: "site", label: "Site & Social", icon: Globe, count: null },
  ];

  return (
    <div className="min-h-screen bg-canvas text-charcoal flex flex-col md:flex-row">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-elevation-3 border flex items-center gap-2.5 text-caption font-mono ${
              toast.type === "success"
                ? "bg-charcoal text-white border-white/10"
                : "bg-rose-600 text-white border-rose-700"
            }`}
          >
            {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════
          LEFT SIDEBAR NAVIGATION (CMS-Exclusive)
          ═══════════════════════════════════════════ */}
      <aside className="w-full md:w-64 lg:w-72 bg-surface border-r border-hairline flex flex-col justify-between md:h-screen md:sticky md:top-0 z-30 flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-hairline">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-charcoal text-white flex items-center justify-center font-mono font-bold text-base shadow-elevation-1">
                D
              </div>
              <div>
                <h1 className="text-body-md-medium font-semibold text-charcoal tracking-tight">
                  CMS Control Plane
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-steel font-medium">
                    Local JSON DB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-muted font-semibold">
              Content Sections
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as CMSTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-body-sm font-mono transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-charcoal text-white font-semibold shadow-elevation-1"
                      : "text-steel hover:text-charcoal hover:bg-canvas"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${
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
        <div className="p-4 border-t border-hairline space-y-2 bg-canvas/40">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-surface border border-hairline text-charcoal text-caption font-mono hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={14} className="text-steel" />
              <span>View Live Website</span>
            </div>
            <ArrowUpRight size={13} className="text-steel" />
          </Link>

          <button
            type="button"
            onClick={async () => {
              await fetch("/api/cms/auth", { method: "DELETE" });
              window.location.reload();
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-caption font-mono transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          RIGHT MAIN CONTENT AREA
          ═══════════════════════════════════════════ */}
      <main className="flex-1 min-w-0 bg-canvas min-h-screen flex flex-col justify-between">
        <div>
          {/* Top Sticky Bar */}
          <div className="sticky top-0 z-20 border-b border-hairline bg-surface/90 backdrop-blur-md px-6 md:px-8 py-4 flex items-center justify-between">
            <div>
              <span className="text-micro font-mono uppercase tracking-wider text-muted font-semibold">
                Editing Section
              </span>
              <h2 className="text-heading-4 font-semibold text-charcoal tracking-tight capitalize">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-charcoal text-white text-caption font-mono font-semibold hover:bg-ink-deep transition-all duration-200 disabled:opacity-50 shadow-elevation-1 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 lg:p-10 max-w-5xl">
            {/* ── TAB 1: HERO & NARRATIVE STATEMENT ── */}
            {activeTab === "hero" && (
              <div className="space-y-8">
                {/* Hero Section Headlines */}
                <div className="p-6 md:p-8 rounded-xl bg-surface border border-hairline space-y-6 shadow-elevation-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                      Hero Statement &amp; Headlines
                    </h3>
                    <span className="text-micro font-mono text-steel uppercase">#hero</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        Line 1 (e.g. FROM PIXEL)
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
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        Line 2 (e.g. TO)
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
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        Accent Line (e.g. PEOPLE.)
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
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-primary font-mono text-body-sm font-semibold focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-caption font-mono text-steel mb-1.5">
                      Hero Subtitle Paragraph
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
                      className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3 Core Focus Pillars */}
                <div className="p-6 md:p-8 rounded-xl bg-surface border border-hairline space-y-6 shadow-elevation-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                        3 Core Focus Pillars
                      </h3>
                      <p className="text-caption text-slate mt-0.5">
                        The 3 interactive focus cards featured directly underneath the Hero statement
                      </p>
                    </div>
                    <span className="text-micro font-mono text-steel uppercase">3 Pillars</span>
                  </div>

                  <div className="space-y-4">
                    {data.hero.pillars.map((pillar, index) => (
                      <div
                        key={pillar.id || index}
                        className="p-5 rounded-lg bg-canvas border border-hairline space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-caption font-mono font-semibold text-primary">
                            Pillar #{pillar.num}
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
                            className="px-2.5 py-1 rounded bg-surface border border-hairline text-steel text-micro font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-micro font-mono text-steel mb-1">
                              Pillar Title
                            </label>
                            <input
                              type="text"
                              value={pillar.title}
                              onChange={(e) => {
                                const updated = [...data.hero.pillars];
                                updated[index].title = e.target.value;
                                setData({ ...data, hero: { ...data.hero, pillars: updated } });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-hairline text-charcoal font-semibold text-body-sm focus:border-primary focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-micro font-mono text-steel mb-1">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={pillar.desc}
                              onChange={(e) => {
                                const updated = [...data.hero.pillars];
                                updated[index].desc = e.target.value;
                                setData({ ...data, hero: { ...data.hero, pillars: updated } });
                              }}
                              className="w-full px-3 py-2 rounded bg-surface border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scroll Reveal Narrative Statement */}
                <div className="p-6 md:p-8 rounded-xl bg-surface border border-hairline space-y-4 shadow-elevation-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                        Scroll Reveal Statement
                      </h3>
                      <p className="text-caption text-slate mt-0.5">
                        The buttery smooth scroll-illuminated text reveal right after the Hero
                      </p>
                    </div>
                    <span className="text-micro font-mono text-steel uppercase">Scroll Kinetic</span>
                  </div>

                  <div>
                    <label className="block text-caption font-mono text-steel mb-1.5">
                      Narrative Text (Words will illuminate word-by-word on scroll)
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
                      className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm leading-relaxed focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: PROJECTS (SELECTED WORK) ── */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-heading-3 font-semibold text-charcoal tracking-tight">
                      Projects Catalog
                    </h3>
                    <p className="text-body-sm text-slate mt-0.5">
                      Manage all case studies shown on Homepage (#work) and /work page
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newProject: CMSProject = {
                        id: Date.now(),
                        title: "New Project Showcase",
                        slug: `project-${Date.now()}`,
                        category: "Web Platform",
                        year: new Date().getFullYear(),
                        image: "/assets/greengnsulteng_web.png",
                        link: "https://example.com",
                        featured: true,
                        description: "Detailed overview of the engineering architecture and problem solved.",
                        technologies: ["React", "TypeScript", "Tailwind CSS"],
                        metrics: [{ label: "Efficiency", value: "+30%" }],
                      };
                      setData({ ...data, projects: [newProject, ...data.projects] });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg text-caption font-mono font-medium hover:bg-ink-deep transition-colors duration-200 shadow-elevation-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.projects.map((project, index) => (
                    <div
                      key={project.id}
                      className="p-6 rounded-xl bg-surface border border-hairline space-y-4 shadow-elevation-0 hover:border-hairline-strong transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline pb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded bg-canvas border border-hairline flex items-center justify-center font-mono text-caption text-steel font-bold">
                            #{index + 1}
                          </span>
                          <div>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => {
                                const updated = [...data.projects];
                                updated[index].title = e.target.value;
                                setData({ ...data, projects: updated });
                              }}
                              className="font-semibold text-heading-4 text-charcoal bg-transparent border-b border-transparent hover:border-hairline focus:border-primary focus:outline-none px-1"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-canvas border border-hairline cursor-pointer text-caption font-mono">
                            <input
                              type="checkbox"
                              checked={project.featured}
                              onChange={(e) => {
                                const updated = [...data.projects];
                                updated[index].featured = e.target.checked;
                                setData({ ...data, projects: updated });
                              }}
                              className="w-4 h-4 text-primary rounded"
                            />
                            <span className={project.featured ? "text-primary font-semibold" : "text-steel"}>
                              {project.featured ? "Featured on Home" : "Standard Archive"}
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete project "${project.title}"?`)) {
                                const updated = data.projects.filter((p) => p.id !== project.id);
                                setData({ ...data, projects: updated });
                              }
                            }}
                            className="p-2 rounded hover:bg-rose-50 text-steel hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Category</label>
                          <input
                            type="text"
                            value={project.category}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[index].category = e.target.value;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Year</label>
                          <input
                            type="number"
                            value={project.year}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[index].year = parseInt(e.target.value) || 2025;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">Live / Demo Link</label>
                          <input
                            type="text"
                            value={project.link}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[index].link = e.target.value;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-micro font-mono text-steel mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...data.projects];
                            updated[index].description = e.target.value;
                            setData({ ...data, projects: updated });
                          }}
                          className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">
                            Technologies (comma separated)
                          </label>
                          <input
                            type="text"
                            value={project.technologies.join(", ")}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[index].technologies = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm font-mono focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">
                            Image Asset Path
                          </label>
                          <input
                            type="text"
                            value={project.image}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[index].image = e.target.value;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full px-3 py-2 rounded bg-canvas border border-hairline text-charcoal text-body-sm font-mono focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: ABOUT & PROFILE BENTO ── */}
            {activeTab === "about" && (
              <div className="space-y-8">
                {/* Identity & Portrait */}
                <div className="p-6 md:p-8 rounded-xl bg-surface border border-hairline space-y-6 shadow-elevation-0">
                  <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                    Profile Identity &amp; Portrait
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption font-mono text-steel mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={data.about.fullName}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, fullName: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-caption font-mono text-steel mb-1.5">Role Tag Badge</label>
                      <input
                        type="text"
                        value={data.about.roleTag}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, roleTag: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        Portrait Photo Path
                      </label>
                      <input
                        type="text"
                        value={data.about.portraitImage}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, portraitImage: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        Location &amp; Coordinates
                      </label>
                      <input
                        type="text"
                        value={data.about.locationText}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, locationText: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Philosophy & Bio */}
                <div className="p-6 md:p-8 rounded-xl bg-surface border border-hairline space-y-4 shadow-elevation-0">
                  <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                    Philosophy &amp; Ethos
                  </h3>

                  <div>
                    <label className="block text-caption font-mono text-steel mb-1.5">
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
                    <label className="block text-caption font-mono text-steel mb-1.5">
                      Bio Paragraph
                    </label>
                    <textarea
                      rows={4}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        Resume PDF Path
                      </label>
                      <input
                        type="text"
                        value={data.about.resumeUrl}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, resumeUrl: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        Status Tag (e.g. Remote Ready)
                      </label>
                      <input
                        type="text"
                        value={data.about.statusTag}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, statusTag: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Community Roles */}
                <div className="p-6 md:p-8 rounded-xl bg-surface border border-hairline space-y-4 shadow-elevation-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                      Community Leadership Roles
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...data.about.communityRoles, { org: "New Community", role: "Role Title" }];
                        setData({ ...data, about: { ...data.about, communityRoles: updated } });
                      }}
                      className="inline-flex items-center gap-1.5 text-caption font-mono text-primary font-semibold hover:underline cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Role</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.about.communityRoles.map((role, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-canvas border border-hairline">
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
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Tech Stack */}
                <div className="p-6 md:p-8 rounded-xl bg-surface border border-hairline space-y-4 shadow-elevation-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                      Active Tech Stack
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...data.about.techStack, { name: "New Tech", category: "Tool" }];
                        setData({ ...data, about: { ...data.about, techStack: updated } });
                      }}
                      className="inline-flex items-center gap-1.5 text-caption font-mono text-primary font-semibold hover:underline cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Tech</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {data.about.techStack.map((tech, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-canvas border border-hairline">
                        <input
                          type="text"
                          placeholder="Name"
                          value={tech.name}
                          onChange={(e) => {
                            const updated = [...data.about.techStack];
                            updated[idx].name = e.target.value;
                            setData({ ...data, about: { ...data.about, techStack: updated } });
                          }}
                          className="flex-1 px-2.5 py-1 rounded bg-surface border border-hairline text-charcoal font-mono text-caption font-semibold focus:border-primary focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          value={tech.category}
                          onChange={(e) => {
                            const updated = [...data.about.techStack];
                            updated[idx].category = e.target.value;
                            setData({ ...data, about: { ...data.about, techStack: updated } });
                          }}
                          className="w-24 px-2 py-1 rounded bg-surface border border-hairline text-steel text-micro font-mono focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = data.about.techStack.filter((_, i) => i !== idx);
                            setData({ ...data, about: { ...data.about, techStack: updated } });
                          }}
                          className="p-1 text-steel hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 4: WRITING & PUBLICATIONS ── */}
            {activeTab === "writing" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-heading-3 font-semibold text-charcoal tracking-tight">
                      Selected Publications &amp; Stories
                    </h3>
                    <p className="text-body-sm text-slate mt-0.5">
                      Manage the minimalist publication feed articles shown on the landing page
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg text-caption font-mono font-medium hover:bg-ink-deep transition-colors duration-200 shadow-elevation-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Article</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.stories.map((story, index) => (
                    <div
                      key={story.id}
                      className="p-6 rounded-xl bg-surface border border-hairline space-y-4 shadow-elevation-0"
                    >
                      <div className="flex items-center justify-between border-b border-hairline pb-4">
                        <input
                          type="text"
                          value={story.title}
                          onChange={(e) => {
                            const updated = [...data.stories];
                            updated[index].title = e.target.value;
                            setData({ ...data, stories: updated });
                          }}
                          className="font-semibold text-heading-4 text-charcoal bg-transparent border-b border-transparent hover:border-hairline focus:border-primary focus:outline-none px-1 flex-1 mr-4"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete article "${story.title}"?`)) {
                              const updated = data.stories.filter((s) => s.id !== story.id);
                              setData({ ...data, stories: updated });
                            }
                          }}
                          className="p-2 text-steel hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
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
                          <label className="block text-micro font-mono text-steel mb-1">Reading Time</label>
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

            {/* ── TAB 5: JOURNEY MILESTONES ── */}
            {activeTab === "journey" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-heading-3 font-semibold text-charcoal tracking-tight">
                      Journey Milestones &amp; Experience
                    </h3>
                    <p className="text-body-sm text-slate mt-0.5">
                      Manage the editorial ledger entries on the /journey page
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
                        description: "Description of the milestone and contributions made.",
                        highlights: ["Leadership", "Engineering"],
                        category: "community",
                      };
                      setData({ ...data, experiences: [newExp, ...data.experiences] });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg text-caption font-mono font-medium hover:bg-ink-deep transition-colors duration-200 shadow-elevation-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Milestone</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {data.experiences.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="p-6 rounded-xl bg-surface border border-hairline space-y-4 shadow-elevation-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline pb-4">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-caption font-mono text-steel">#{index + 1}</span>
                          <input
                            type="text"
                            value={exp.role}
                            placeholder="Role"
                            onChange={(e) => {
                              const updated = [...data.experiences];
                              updated[index].role = e.target.value;
                              setData({ ...data, experiences: updated });
                            }}
                            className="font-semibold text-heading-4 text-charcoal bg-transparent border-b border-transparent hover:border-hairline focus:border-primary focus:outline-none px-1"
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
                            className="p-2 text-steel hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-micro font-mono text-steel mb-1">
                            Start Date (YYYY-MM)
                          </label>
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
                          <label className="block text-micro font-mono text-steel mb-1">
                            End Date (Leave blank for Ongoing)
                          </label>
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
                          <label className="block text-micro font-mono text-steel mb-1">
                            Display Title
                          </label>
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
                        <label className="block text-micro font-mono text-steel mb-1">
                          Detailed Narrative Description
                        </label>
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
                        <label className="block text-micro font-mono text-steel mb-1">
                          Highlights &amp; Tags (comma separated)
                        </label>
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

            {/* ── TAB 6: SITE & SOCIAL ── */}
            {activeTab === "site" && (
              <div className="space-y-8">
                <div className="p-6 md:p-8 rounded-xl bg-surface border border-hairline space-y-6 shadow-elevation-0">
                  <h3 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                    Global Contact &amp; Social Links
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        Primary Email
                      </label>
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
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        GitHub Profile Link
                      </label>
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
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        LinkedIn Profile Link
                      </label>
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
                      <label className="block text-caption font-mono text-steel mb-1.5">
                        Instagram Profile Link
                      </label>
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
                    <label className="block text-caption font-mono text-steel mb-1.5">
                      Footer Slogan / Note
                    </label>
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
        <footer className="px-6 md:px-8 py-4 border-t border-hairline text-caption text-steel font-mono flex items-center justify-between">
          <span>Dareean Portfolio CMS v1.2</span>
          <span>Last active session: Localhost</span>
        </footer>
      </main>
    </div>
  );
}
