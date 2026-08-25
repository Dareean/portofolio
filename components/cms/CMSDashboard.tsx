"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  PortfolioCMSData,
  CMSProject,
  CMSStory,
  CMSBlogPost,
  CMSExperience,
} from "@/lib/cms";
import { AIAssistantButton } from "@/components/cms/AIAssistantButton";
import {
  BookOpen,
  Newspaper,
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
  Sparkles,
  Copy,
  Download,
  Languages,
  Bot,
  Send,
  FileDown,
  CheckCheck,
  Wand2,
  FileCode,
  Lightbulb,
  FileUp,
  GitMerge,
  ArrowDownToLine,
  CheckSquare,
  Square,
  Printer,
  FileCheck,
} from "lucide-react";

type CMSTab = "projects" | "hero" | "about" | "writing" | "blogs" | "journey" | "ai" | "site";

// Helper to convert Markdown to styled HTML for PDF printing & visual preview
function convertMarkdownToHTML(md: string): string {
  const lines = md.split("\n");
  const processed: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-[11px] font-mono text-indigo-600 border border-slate-200">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-indigo-600 hover:underline font-medium">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("|") && line.endsWith("|")) {
      if (line.includes("---")) continue;
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      if (!inTable) {
        inTable = true;
        tableRows = [cells];
      } else {
        tableRows.push(cells);
      }
    } else {
      if (inTable) {
        let tHtml = '<div class="overflow-x-auto my-3"><table class="w-full text-xs text-left border-collapse border border-slate-200 shadow-xs rounded-lg overflow-hidden">';
        tableRows.forEach((row, rIdx) => {
          tHtml += rIdx === 0 ? '<tr class="bg-slate-100 font-semibold text-slate-900">' : '<tr class="border-t border-slate-200 hover:bg-slate-50/70">';
          row.forEach((cell) => {
            const tag = rIdx === 0 ? "th" : "td";
            tHtml += `<${tag} class="p-2.5 border-r border-slate-200 leading-relaxed align-top">${formatInline(cell)}</${tag}>`;
          });
          tHtml += "</tr>";
        });
        tHtml += "</table></div>";
        processed.push(tHtml);
        inTable = false;
        tableRows = [];
      }
      processed.push(line);
    }
  }

  if (inTable) {
    let tHtml = '<div class="overflow-x-auto my-3"><table class="w-full text-xs text-left border-collapse border border-slate-200 shadow-xs rounded-lg overflow-hidden">';
    tableRows.forEach((row, rIdx) => {
      tHtml += rIdx === 0 ? '<tr class="bg-slate-100 font-semibold text-slate-900">' : '<tr class="border-t border-slate-200 hover:bg-slate-50/70">';
      row.forEach((cell) => {
        const tag = rIdx === 0 ? "th" : "td";
        tHtml += `<${tag} class="p-2.5 border-r border-slate-200 leading-relaxed align-top">${formatInline(cell)}</${tag}>`;
      });
      tHtml += "</tr>";
    });
    tHtml += "</table></div>";
    processed.push(tHtml);
  }

  return processed
    .map((l) => {
      if (l.startsWith("<div class=\"overflow-x-auto")) return l;
      if (l.startsWith("# ")) {
        return `<h1 class="text-xl md:text-2xl font-bold uppercase tracking-tight text-slate-900 mt-3 mb-1 pb-1.5 border-b-2 border-slate-900">${formatInline(l.slice(2))}</h1>`;
      }
      if (l.startsWith("## ")) {
        return `<h2 class="text-sm md:text-base font-bold uppercase tracking-wider text-indigo-700 mt-5 mb-2 pb-1 border-b border-slate-200 flex items-center gap-2">${formatInline(l.slice(3))}</h2>`;
      }
      if (l.startsWith("### ")) {
        return `<h3 class="text-xs md:text-sm font-semibold text-slate-900 mt-3 mb-1">${formatInline(l.slice(4))}</h3>`;
      }
      if (l.startsWith("• ") || l.startsWith("- ") || l.startsWith("* ")) {
        return `<li class="text-xs text-slate-700 ml-4 mb-1 leading-relaxed list-disc">${formatInline(l.slice(2))}</li>`;
      }
      if (l.startsWith("---")) {
        return `<hr class="my-3.5 border-slate-200" />`;
      }
      if (!l.trim()) return '<div class="h-1.5"></div>';
      return `<p class="text-xs text-slate-700 leading-relaxed mb-1.5">${formatInline(l)}</p>`;
    })
    .join("\n");
}

export default function CMSDashboard({ initialData }: { initialData: PortfolioCMSData }) {
  const [data, setData] = useState<PortfolioCMSData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<CMSTab>("projects");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal state
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);
  const [editingBlog, setEditingBlog] = useState<CMSBlogPost | null>(null);

  // Uploading states
  const [isUploading, setIsUploading] = useState(false);

  // Hidden file inputs
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const portraitFileInputRef = useRef<HTMLInputElement>(null);
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const blogCoverFileInputRef = useRef<HTMLInputElement>(null);

  // New tech input state
  const [newTechName, setNewTechName] = useState("");
  const [newTechCategory, setNewTechCategory] = useState("Framework");

  // ═══════════════════════════════════════════
  // AI STUDIO & PDF SYNC STATES
  // ═══════════════════════════════════════════
  const [aiAction, setAiAction] = useState<"generate_cv" | "parse_pdf_sync" | "tailor_job" | "analyze_portfolio">("generate_cv");
  const [aiLanguage, setAiLanguage] = useState<"en" | "id">("en");
  const [aiCustomTemplate, setAiCustomTemplate] = useState("");
  const [aiJobDesc, setAiJobDesc] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModelInfo, setAiModelInfo] = useState("Groq GPT-OSS 20B");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [outputViewMode, setOutputViewMode] = useState<"document" | "raw">("document");

  // PDF Parser Diff States
  const [isAnalyzingPDF, setIsAnalyzingPDF] = useState(false);
  const [pdfDiffResult, setPdfDiffResult] = useState<{
    analysisSummary: string;
    newProjects: CMSProject[];
    newExperiences: CMSExperience[];
    newSkills: { name: string; category: string }[];
    profileUpdates?: { roleTag?: string; philosophyBio?: string; locationText?: string };
  } | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedProfileUpdates, setSelectedProfileUpdates] = useState(true);
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null);

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
        showToast("All changes saved successfully!");
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

  // ═══════════════════════════════════════════
  // AI STUDIO HANDLERS
  // ═══════════════════════════════════════════
  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/cms/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: aiAction,
          language: aiLanguage,
          customTemplate: aiCustomTemplate,
          jobDescription: aiJobDesc,
          portfolioData: data,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAiOutput(json.result);
        if (json.modelUsed) setAiModelInfo(json.modelUsed);
        setOutputViewMode("document");
        showToast("AI generation completed!");
      } else {
        showToast(json.error || "AI generation failed", "error");
      }
    } catch (err) {
      showToast("Network error during AI execution", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleTranslateOutput = async (targetLang: "en" | "id") => {
    if (!aiOutput.trim()) {
      showToast("Please generate or enter content to translate", "error");
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch("/api/cms/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "translate",
          language: targetLang,
          contentToTranslate: aiOutput,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setAiOutput(json.result);
        setAiLanguage(targetLang);
        showToast(`Translated to ${targetLang === "id" ? "Bahasa Indonesia" : "English"}!`);
      } else {
        showToast(json.error || "Translation failed", "error");
      }
    } catch (err) {
      showToast("Network error during translation", "error");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyOutput = () => {
    if (!aiOutput) return;
    navigator.clipboard.writeText(aiOutput);
    setIsCopied(true);
    showToast("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadMD = () => {
    if (!aiOutput) return;
    const blob = new Blob([aiOutput], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Dareean_CV_${aiLanguage.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded CV (.md) file!");
  };

  // PDF Export / Print Handler
  const handleDownloadPDF = () => {
    if (!aiOutput) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Pop-up blocked. Please allow pop-ups to export PDF.", "error");
      return;
    }

    const htmlContent = convertMarkdownToHTML(aiOutput);
    const documentTitle = `Dareean_CV_${aiLanguage.toUpperCase()}_${new Date().toISOString().slice(0, 10)}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${aiLanguage}">
        <head>
          <meta charset="utf-8" />
          <title>${documentTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            @page {
              size: A4;
              margin: 15mm 15mm 15mm 15mm;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #0F172A;
              background-color: #FFFFFF;
              margin: 0;
              padding: 0;
              font-size: 11px;
              line-height: 1.5;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            h1 { font-size: 18px; font-weight: 700; margin: 0 0 4px 0; text-transform: uppercase; color: #0F172A; border-bottom: 1.5px solid #0F172A; padding-bottom: 4px; }
            h2 { font-size: 13px; font-weight: 700; margin: 14px 0 6px 0; text-transform: uppercase; color: #4338CA; border-bottom: 1px solid #E2E8F0; padding-bottom: 3px; break-after: avoid; }
            h3 { font-size: 11px; font-weight: 600; margin: 8px 0 2px 0; color: #0F172A; }
            p { margin: 0 0 6px 0; color: #334155; }
            ul { margin: 4px 0 8px 18px; padding: 0; }
            li { margin-bottom: 3px; color: #334155; }
            strong { font-weight: 600; color: #0F172A; }
            hr { border: none; border-top: 1px solid #E2E8F0; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10.5px; page-break-inside: avoid; }
            th { background-color: #F1F5F9 !important; font-weight: 600; text-align: left; padding: 6px 8px; border: 1px solid #CBD5E1; color: #0F172A; }
            td { padding: 6px 8px; border: 1px solid #CBD5E1; color: #334155; vertical-align: top; }
            a { color: #4338CA; text-decoration: none; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="cv-container">
            ${htmlContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    showToast("Opening PDF Print & Save Dialog...");
  };

  // ═══════════════════════════════════════════
  // PDF CV PARSER & CMS SYNC HANDLERS
  // ═══════════════════════════════════════════
  const handleAnalyzePDF = async (file?: File, useExistingDoc: boolean = false) => {
    setIsAnalyzingPDF(true);
    setPdfDiffResult(null);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (useExistingDoc) {
        formData.append("useExistingDoc", "true");
      }

      const res = await fetch("/api/cms/ai/parse-pdf", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const diff = json.diff;
        setPdfDiffResult(diff);
        // Pre-select all detected new items
        setSelectedProjects(diff.newProjects ? diff.newProjects.map((p: CMSProject) => p.id) : []);
        setSelectedExperiences(diff.newExperiences ? diff.newExperiences.map((e: CMSExperience) => e.id) : []);
        setSelectedSkills(diff.newSkills ? diff.newSkills.map((s: { name: string }) => s.name) : []);
        setSelectedProfileUpdates(true);
        showToast("PDF analyzed! Review the differences below.");
      } else {
        showToast(json.error || "Failed to analyze document", "error");
      }
    } catch (err) {
      showToast("Network error while analyzing PDF", "error");
    } finally {
      setIsAnalyzingPDF(false);
    }
  };

  const handleApplySyncToCMS = async () => {
    if (!pdfDiffResult) return;

    let updatedProjects = [...data.projects];
    let updatedExperiences = [...data.experiences];
    let updatedSkills = [...data.about.techStack];
    let updatedAbout = { ...data.about };

    // Merge selected projects
    if (pdfDiffResult.newProjects) {
      const toAdd = pdfDiffResult.newProjects.filter((p) => selectedProjects.includes(p.id));
      const titlesToAdd = toAdd.map((p) => p.title.toLowerCase());
      updatedProjects = [
        ...toAdd,
        ...updatedProjects.filter((p) => !titlesToAdd.includes(p.title.toLowerCase())),
      ];
    }

    // Merge selected experiences
    if (pdfDiffResult.newExperiences) {
      const toAddExp = pdfDiffResult.newExperiences.filter((e) => selectedExperiences.includes(e.id));
      const expKeysToAdd = toAddExp.map((e) => `${e.role}-${e.organization}`.toLowerCase());
      updatedExperiences = [
        ...toAddExp,
        ...updatedExperiences.filter((e) => !expKeysToAdd.includes(`${e.role}-${e.organization}`.toLowerCase())),
      ];
    }

    // Merge selected skills
    if (pdfDiffResult.newSkills) {
      const toAddSkills = pdfDiffResult.newSkills.filter((s) => selectedSkills.includes(s.name));
      const existingSkillNames = updatedSkills.map((s) => s.name.toLowerCase());
      toAddSkills.forEach((s) => {
        if (!existingSkillNames.includes(s.name.toLowerCase())) {
          updatedSkills.push(s);
        }
      });
    }

    // Merge profile updates if selected
    if (selectedProfileUpdates && pdfDiffResult.profileUpdates) {
      if (pdfDiffResult.profileUpdates.roleTag) {
        updatedAbout.roleTag = pdfDiffResult.profileUpdates.roleTag;
      }
      if (pdfDiffResult.profileUpdates.philosophyBio) {
        updatedAbout.philosophyBio = pdfDiffResult.profileUpdates.philosophyBio;
      }
      if (pdfDiffResult.profileUpdates.locationText) {
        updatedAbout.locationText = pdfDiffResult.profileUpdates.locationText;
      }
    }

    const newData: PortfolioCMSData = {
      ...data,
      projects: updatedProjects,
      experiences: updatedExperiences,
      about: {
        ...updatedAbout,
        techStack: updatedSkills,
      },
    };

    setData(newData);

    // Auto-save to server
    try {
      setIsSaving(true);
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      const json = await res.json();
      if (json.success) {
        showToast("🎉 Successfully applied and saved CV updates to CMS!", "success");
      } else {
        showToast("Updates applied locally. Click 'Save Changes' to commit.", "success");
      }
    } catch {
      showToast("Updates applied locally. Click 'Save Changes' to commit.", "success");
    } finally {
      setIsSaving(false);
    }
  };

  const navGroups = [
    {
      groupTitle: "MAIN WORKSPACES",
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
      groupTitle: "EDITORIAL & FEED",
      items: [
        {
          id: "writing",
          label: "Writing & Stories",
          icon: FileText,
          count: data.stories.length,
        },
        {
          id: "blogs",
          label: "Blog Posts (Cerita/Pencapaian)",
          icon: BookOpen,
          count: (data.blogs || []).length,
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
      groupTitle: "AI & INTELLIGENCE",
      items: [
        {
          id: "ai",
          label: "AI Studio & CV Sync",
          icon: Sparkles,
          count: null,
        },
      ],
    },
    {
      groupTitle: "SYSTEM SETTINGS",
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
            className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg border text-xs font-mono font-medium shadow-lg flex items-center gap-2.5 ${
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
        ref={blogCoverFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && editingBlog) {
            handleFileUpload(file, "blogs", (url) => {
              setEditingBlog({ ...editingBlog, coverImage: url });
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
        accept=".pdf,.docx"
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

      <input
        type="file"
        ref={pdfFileInputRef}
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setSelectedCvFile(file);
            setPdfDiffResult(null);
          }
        }}
      />

      {/* ═══════════════════════════════════════════
          SIDEBAR
          ═══════════════════════════════════════════ */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-white border-r border-[#E2E8F0] duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "w-64 translate-x-0 flex-shrink-0" : "-translate-x-full w-0 lg:w-64 flex-shrink-0"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#E2E8F0]">
          <Link href="/cms" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              D
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0F172A] tracking-tight leading-tight">
                Dareean Studio
              </div>
              <div className="text-[11px] text-[#64748B] font-mono leading-tight">
                CMS Studio
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="block lg:hidden p-1 text-[#64748B] hover:text-[#0F172A]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <div className="px-2.5 text-[10px] font-mono font-semibold uppercase text-[#64748B] tracking-wider">
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
                        className={`w-full h-9 flex items-center justify-between px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isActive
                            ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold border border-[#E0E7FF]"
                            : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={15} className={isActive ? "text-[#4F46E5]" : "text-[#64748B]"} />
                          <span>{item.label}</span>
                        </div>

                        {item.count !== null && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
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
        <div className="p-4 border-t border-[#E2E8F0] space-y-2 bg-white">
          <Link
            href="/"
            target="_blank"
            className="flex h-9 items-center justify-between px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] hover:text-[#0F172A] font-medium transition-colors"
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
            className="w-full flex h-8 items-center gap-2 px-3 rounded-lg text-xs text-[#64748B] hover:text-rose-600 font-medium transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════
          MAIN WORKSPACE
          ═══════════════════════════════════════════ */}
      <div
        data-lenis-prevent
        className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#F8FAFC]"
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E2E8F0] shadow-xs">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                <Menu size={16} />
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#64748B] font-medium">Dashboard</span>
                <span className="text-[#CBD5E1]">/</span>
                <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                  <currentNav.icon size={14} className="text-[#4F46E5]" />
                  <span>{currentNav.label}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8 pr-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:bg-white focus:outline-none w-48 md:w-60 transition-all"
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex h-9 items-center gap-2 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
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
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 lg:p-10 space-y-8">
          {/* Top 4 KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                Total Projects
              </div>
              <div className="text-2xl font-bold font-mono text-[#0F172A] mt-1.5">
                {data.projects.length}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                Featured on Home
              </div>
              <div className="text-2xl font-bold font-mono text-[#4F46E5] mt-1.5">
                {featuredCount}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                Milestones
              </div>
              <div className="text-2xl font-bold font-mono text-[#0F172A] mt-1.5">
                {data.experiences.length}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                Tech Stack
              </div>
              <div className="text-2xl font-bold font-mono text-[#0F172A] mt-1.5">
                {data.about.techStack.length}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              TAB 1: PROJECTS
              ═══════════════════════════════════════════ */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                    Projects &amp; Selected Works
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Click the star icon to feature a project on the portfolio landing page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewProject}
                  className="inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition-colors cursor-pointer shadow-xs flex-shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className={`rounded-xl border overflow-hidden flex flex-col justify-between bg-white shadow-xs transition-all ${
                        project.featured ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/15" : "border-[#E2E8F0] hover:border-[#94A3B8]"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/10] bg-[#F1F5F9] border-b border-[#E2E8F0] overflow-hidden">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#94A3B8]">
                            No preview image
                          </div>
                        )}

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-[#0F172A] font-mono text-[10px] font-semibold border border-[#E2E8F0] shadow-xs">
                            {project.category} · {project.year}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleProjectFeatured(project.id)}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                              project.featured
                                ? "bg-[#4F46E5] text-white shadow-xs"
                                : "bg-white/95 backdrop-blur-xs text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
                            }`}
                            title={project.featured ? "Featured on Home" : "Click to feature"}
                          >
                            <Star size={13} className={project.featured ? "fill-white" : ""} />
                          </button>
                        </div>
                      </div>

                      {/* Info Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-[#0F172A] line-clamp-1 leading-snug">
                            {project.title}
                          </h4>
                          <p className="text-xs text-[#64748B] line-clamp-2 mt-1.5 leading-relaxed">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mt-3.5">
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
                        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setEditingProject(project)}
                            className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg bg-[#F8FAFC] hover:border-[#4F46E5] border border-[#E2E8F0] text-[#0F172A] text-xs font-mono transition-colors cursor-pointer"
                          >
                            <Edit3 size={12} className="text-[#4F46E5]" />
                            <span>Edit Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id, project.title)}
                            className="p-1.5 text-[#64748B] hover:text-rose-600 transition cursor-pointer"
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
              TAB 2: HERO & NARRATIVE
              ═══════════════════════════════════════════ */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              {/* Live Preview Box */}
              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
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
              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Headline Text
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      Line 1
                    </label>
                    <input
                      type="text"
                      value={data.hero.headlineLine1}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, headlineLine1: e.target.value } })
                      }
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      Line 2
                    </label>
                    <input
                      type="text"
                      value={data.hero.headlineLine2}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, headlineLine2: e.target.value } })
                      }
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4F46E5] mb-1.5">
                      Accent Word
                    </label>
                    <input
                      type="text"
                      value={data.hero.headlineAccent}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, headlineAccent: e.target.value } })
                      }
                      className="w-full h-10 px-3.5 rounded-lg bg-[#EEF2FF] border border-[#4F46E5]/40 text-xs font-mono font-semibold text-[#4F46E5] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-[#0F172A]">
                      Subtitle Narrative
                    </label>
                    <AIAssistantButton
                      fieldType="bio"
                      currentValue={data.hero.subtitle}
                      context={{ title: data.about.roleTag }}
                      onApply={(val) => setData({ ...data, hero: { ...data.hero, subtitle: val } })}
                      compact
                      label="AI Subtitle"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={data.hero.subtitle}
                    onChange={(e) =>
                      setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })
                    }
                    className="w-full p-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 3 Core Focus Pillars */}
              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  3 Core Focus Pillars
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {data.hero.pillars.map((pillar, index) => (
                    <div key={pillar.id || index} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3.5">
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
                          className="h-7 px-2.5 rounded bg-white border border-[#E2E8F0] text-[10px] font-mono text-[#64748B] text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#0F172A] mb-1">Title</label>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const updated = [...data.hero.pillars];
                            updated[index].title = e.target.value;
                            setData({ ...data, hero: { ...data.hero, pillars: updated } });
                          }}
                          className="w-full h-9 px-3 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#0F172A] mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={pillar.desc}
                          onChange={(e) => {
                            const updated = [...data.hero.pillars];
                            updated[index].desc = e.target.value;
                            setData({ ...data, hero: { ...data.hero, pillars: updated } });
                          }}
                          className="w-full p-3 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#64748B] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Narrative Statement */}
              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Scroll Reveal Narrative Statement
                </h3>
                <textarea
                  rows={4}
                  value={data.narrative.statement}
                  onChange={(e) =>
                    setData({ ...data, narrative: { ...data.narrative, statement: e.target.value } })
                  }
                  className="w-full p-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
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
              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Profile Identity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-[#4F46E5] mb-3.5 shadow-xs">
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
                      className="inline-flex h-8 items-center gap-1.5 px-3.5 rounded-lg bg-[#4F46E5] text-white text-xs font-mono font-medium hover:bg-[#4338CA] transition cursor-pointer mb-2.5 shadow-xs"
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

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={data.about.fullName}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, fullName: e.target.value } })
                        }
                        className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                        Role Tag
                      </label>
                      <input
                        type="text"
                        value={data.about.roleTag}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, roleTag: e.target.value } })
                        }
                        className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                        Portrait Image URL
                      </label>
                      <input
                        type="text"
                        value={data.about.portraitImage}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, portraitImage: e.target.value } })
                        }
                        className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={data.about.locationText}
                        onChange={(e) =>
                          setData({ ...data, about: { ...data.about, locationText: e.target.value } })
                        }
                        className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Statement */}
              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Philosophy &amp; Biography
                </h3>

                <div>
                  <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={data.about.philosophyHeading}
                    onChange={(e) =>
                      setData({ ...data, about: { ...data.about, philosophyHeading: e.target.value } })
                    }
                    className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-[#0F172A]">
                      Bio Narrative
                    </label>
                    <AIAssistantButton
                      fieldType="bio"
                      currentValue={data.about.philosophyBio}
                      context={{ title: data.about.fullName, role: data.about.roleTag }}
                      onApply={(val) => setData({ ...data, about: { ...data.about, philosophyBio: val } })}
                      compact
                      label="AI Bio"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={data.about.philosophyBio}
                    onChange={(e) =>
                      setData({ ...data, about: { ...data.about, philosophyBio: e.target.value } })
                    }
                    className="w-full p-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-[#0F172A]">
                        Resume PDF URL
                      </label>
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => resumeFileInputRef.current?.click()}
                        className="text-[11px] font-mono text-[#4F46E5] font-semibold hover:underline cursor-pointer"
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
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      Status Badge
                    </label>
                    <input
                      type="text"
                      value={data.about.statusTag}
                      onChange={(e) =>
                        setData({ ...data, about: { ...data.about, statusTag: e.target.value } })
                      }
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Tech Stack Skills ({data.about.techStack.length} chips)
                </h3>

                <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  {data.about.techStack.map((tech, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] shadow-xs"
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

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
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
                    className="flex-1 h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] focus:outline-none"
                  />

                  <select
                    value={newTechCategory}
                    onChange={(e) => setNewTechCategory(e.target.value)}
                    className="h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] focus:outline-none"
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
                    className="h-10 px-5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition cursor-pointer shadow-xs flex-shrink-0"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
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
                  className="inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition cursor-pointer shadow-xs flex-shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Article</span>
                </button>
              </div>

              <div className="space-y-5">
                {data.stories.map((story, index) => (
                  <div key={story.id} className="p-5 md:p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                      <input
                        type="text"
                        value={story.title}
                        onChange={(e) => {
                          const updated = [...data.stories];
                          updated[index].title = e.target.value;
                          setData({ ...data, stories: updated });
                        }}
                        className="font-semibold text-sm text-[#0F172A] bg-transparent border-b border-transparent hover:border-[#E2E8F0] focus:border-[#4F46E5] outline-none px-1 flex-1 mr-4"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete article "${story.title}"?`)) {
                            const updated = data.stories.filter((s) => s.id !== story.id);
                            setData({ ...data, stories: updated });
                          }
                        }}
                        className="p-1.5 text-[#64748B] hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">Date</label>
                        <input
                          type="text"
                          value={story.date}
                          onChange={(e) => {
                            const updated = [...data.stories];
                            updated[index].date = e.target.value;
                            setData({ ...data, stories: updated });
                          }}
                          className="w-full h-9 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">Category</label>
                        <input
                          type="text"
                          value={story.category}
                          onChange={(e) => {
                            const updated = [...data.stories];
                            updated[index].category = e.target.value;
                            setData({ ...data, stories: updated });
                          }}
                          className="w-full h-9 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">Read Time</label>
                        <input
                          type="text"
                          value={story.readTime}
                          onChange={(e) => {
                            const updated = [...data.stories];
                            updated[index].readTime = e.target.value;
                            setData({ ...data, stories: updated });
                          }}
                          className="w-full h-9 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-[#0F172A]">Excerpt / Caption</label>
                        <AIAssistantButton
                          fieldType="article_caption"
                          currentValue={story.excerpt}
                          context={{ title: story.title, category: story.category }}
                          onApply={(val) => {
                            const updated = [...data.stories];
                            updated[index].excerpt = val;
                            setData({ ...data, stories: updated });
                          }}
                          compact
                          label="AI Caption"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={story.excerpt}
                        onChange={(e) => {
                          const updated = [...data.stories];
                          updated[index].excerpt = e.target.value;
                          setData({ ...data, stories: updated });
                        }}
                        className="w-full p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] focus:border-[#4F46E5] outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB: BLOG POSTS (KESEHARIAN & ACHIEVEMENTS)
              ═══════════════════════════════════════════ */}
          {activeTab === "blogs" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight flex items-center gap-2">
                    <BookOpen size={18} className="text-[#4F46E5]" />
                    <span>Blog Posts &amp; Cerita Keseharian</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Kelola cerita harian, jurnal kegiatan, dan pencapaian yang tampil di halaman /blog publik.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newBlog: CMSBlogPost = {
                      id: Date.now(),
                      title: "Judul Cerita / Pencapaian Baru",
                      slug: `post-${Date.now()}`,
                      date: new Date().toISOString().split("T")[0],
                      category: "Daily Life",
                      excerpt: "Ringkasan cerita keseharian atau pencapaian Anda...",
                      content: "Tuliskan isi cerita lengkap Anda di sini...",
                      coverImage: "/assets/dareean_web.png",
                      readTime: "3 min read",
                      tags: ["Daily Life", "Achievement"],
                      featured: false,
                    };
                    setEditingBlog(newBlog);
                  }}
                  className="inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition cursor-pointer shadow-xs flex-shrink-0"
                >
                  <Plus size={14} />
                  <span>Tambah Blog Baru</span>
                </button>
              </div>

              {/* Grid of Blog Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(data.blogs || [])
                  .filter((b) =>
                    searchQuery
                      ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
                      : true
                  )
                  .map((blog) => (
                    <div
                      key={blog.id}
                      className={`rounded-xl border overflow-hidden flex flex-col justify-between bg-white shadow-xs transition-all ${
                        blog.featured
                          ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/15"
                          : "border-[#E2E8F0] hover:border-[#94A3B8]"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/10] bg-[#F1F5F9] border-b border-[#E2E8F0] overflow-hidden">
                        {blog.coverImage ? (
                          <Image
                            src={blog.coverImage}
                            alt={blog.title}
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#94A3B8]">
                            Tanpa Sampul
                          </div>
                        )}

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border shadow-xs ${
                              blog.category === "Achievement"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : blog.category === "Daily Life"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : blog.category === "Tech"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                            }`}
                          >
                            {blog.category}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = (data.blogs || []).map((b) =>
                                b.id === blog.id ? { ...b, featured: !b.featured } : b
                              );
                              setData({ ...data, blogs: updated });
                            }}
                            className={`p-1.5 rounded-md transition cursor-pointer ${
                              blog.featured
                                ? "bg-[#4F46E5] text-white shadow-xs"
                                : "bg-white/95 text-[#64748B] border border-[#E2E8F0]"
                            }`}
                            title={blog.featured ? "Featured on Home/Blog" : "Click to feature"}
                          >
                            <Star size={13} className={blog.featured ? "fill-white" : ""} />
                          </button>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B] mb-1">
                            <Calendar size={12} />
                            <span>{blog.date}</span>
                            <span>·</span>
                            <Clock size={12} />
                            <span>{blog.readTime}</span>
                          </div>
                          <h4 className="font-semibold text-sm text-[#0F172A] line-clamp-2 leading-snug">
                            {blog.title}
                          </h4>
                          <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                            {blog.excerpt}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="pt-2 flex flex-wrap gap-1">
                          {blog.tags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[10px] font-mono text-[#64748B]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#4F46E5] hover:underline"
                        >
                          <Eye size={12} />
                          <span>Preview</span>
                        </Link>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingBlog({ ...blog })}
                            className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#4F46E5] transition cursor-pointer"
                            title="Edit Post"
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = (data.blogs || []).filter((b) => b.id !== blog.id);
                              setData({ ...data, blogs: updated });
                              showToast("Blog post deleted!");
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "journey" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                    Journey Milestones &amp; Experience
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Entries displayed in the /journey timeline ledger.
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
                  className="inline-flex h-9 items-center justify-center gap-1.5 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition cursor-pointer shadow-xs flex-shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-5">
                {data.experiences.map((exp, index) => (
                  <div key={exp.id} className="p-5 md:p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                      <div className="flex items-center gap-2.5 flex-1">
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
                          className="font-semibold text-sm text-[#0F172A] bg-transparent border-b border-transparent hover:border-[#E2E8F0] focus:border-[#4F46E5] outline-none px-1"
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
                          className="h-8 px-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
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
                          className="p-1.5 text-[#64748B] hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.dateStart}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].dateStart = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full h-9 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">End Date</label>
                        <input
                          type="text"
                          placeholder="Present (or YYYY-MM)"
                          value={exp.dateEnd || ""}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].dateEnd = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full h-9 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">Display Title</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[index].title = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          className="w-full h-9 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-[#0F172A]">Description</label>
                        <AIAssistantButton
                          fieldType="experience_description"
                          currentValue={exp.description}
                          context={{ role: exp.role, organization: exp.organization, category: exp.category }}
                          onApply={(val) => {
                            const updated = [...data.experiences];
                            updated[index].description = val;
                            setData({ ...data, experiences: updated });
                          }}
                          compact
                          label="AI Description"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[index].description = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] focus:border-[#4F46E5] outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB: AI STUDIO & CV BUILDER (GROQ)
              ═══════════════════════════════════════════ */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              {/* Top Banner Card */}
              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shadow-xs">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                          Groq AI Analyzer &amp; CV Sync Studio
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-[10px] font-mono text-[#4F46E5] font-semibold">
                          LPU Powered
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Parse PDF/Docx resumes, auto-sync missing projects to CMS, and generate ATS CVs using Groq.
                      </p>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className="flex items-center gap-2 bg-[#F8FAFC] p-1.5 rounded-lg border border-[#E2E8F0]">
                    <span className="text-[11px] font-mono font-medium text-[#64748B] px-2 flex items-center gap-1.5">
                      <Languages size={13} className="text-[#4F46E5]" />
                      Language:
                    </span>
                    <button
                      type="button"
                      onClick={() => setAiLanguage("en")}
                      className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                        aiLanguage === "en"
                          ? "bg-white text-[#4F46E5] shadow-xs border border-[#E2E8F0]"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      EN (English)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiLanguage("id")}
                      className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                        aiLanguage === "id"
                          ? "bg-white text-[#4F46E5] shadow-xs border border-[#E2E8F0]"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      ID (Indonesia)
                    </button>
                  </div>
                </div>

                {/* 4 Mode Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setAiAction("parse_pdf_sync")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      aiAction === "parse_pdf_sync"
                        ? "bg-[#EEF2FF]/60 border-[#4F46E5] ring-1 ring-[#4F46E5]/20 shadow-xs"
                        : "bg-white border-[#E2E8F0] hover:border-[#94A3B8]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                        <FileUp size={15} className={aiAction === "parse_pdf_sync" ? "text-[#4F46E5]" : "text-[#64748B]"} />
                        <span>1. PDF CV Sync to CMS</span>
                      </div>
                      {aiAction === "parse_pdf_sync" && (
                        <CheckCircle2 size={14} className="text-[#4F46E5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Upload PDF/Docx CV to find missing projects &amp; auto-update CMS.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiAction("generate_cv")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      aiAction === "generate_cv"
                        ? "bg-[#EEF2FF]/60 border-[#4F46E5] ring-1 ring-[#4F46E5]/20 shadow-xs"
                        : "bg-white border-[#E2E8F0] hover:border-[#94A3B8]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                        <FileCode size={15} className={aiAction === "generate_cv" ? "text-[#4F46E5]" : "text-[#64748B]"} />
                        <span>2. Generate ATS CV</span>
                      </div>
                      {aiAction === "generate_cv" && (
                        <CheckCircle2 size={14} className="text-[#4F46E5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Build an executive ATS resume from your current portfolio database.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiAction("tailor_job")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      aiAction === "tailor_job"
                        ? "bg-[#EEF2FF]/60 border-[#4F46E5] ring-1 ring-[#4F46E5]/20 shadow-xs"
                        : "bg-white border-[#E2E8F0] hover:border-[#94A3B8]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                        <Wand2 size={15} className={aiAction === "tailor_job" ? "text-[#4F46E5]" : "text-[#64748B]"} />
                        <span>3. Tailor to Job Vacancy</span>
                      </div>
                      {aiAction === "tailor_job" && (
                        <CheckCircle2 size={14} className="text-[#4F46E5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Paste a target vacancy to calculate match score and custom CV.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiAction("analyze_portfolio")}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      aiAction === "analyze_portfolio"
                        ? "bg-[#EEF2FF]/60 border-[#4F46E5] ring-1 ring-[#4F46E5]/20 shadow-xs"
                        : "bg-white border-[#E2E8F0] hover:border-[#94A3B8]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                        <Lightbulb size={15} className={aiAction === "analyze_portfolio" ? "text-[#4F46E5]" : "text-[#64748B]"} />
                        <span>4. Portfolio Audit</span>
                      </div>
                      {aiAction === "analyze_portfolio" && (
                        <CheckCircle2 size={14} className="text-[#4F46E5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Audit bio, headlines, and project STAR bullet points.
                    </p>
                  </button>
                </div>
              </div>

              {/* ═══════════════════════════════════════════
                  MODE 1: PDF CV PARSER & CMS SYNC
                  ═══════════════════════════════════════════ */}
              {aiAction === "parse_pdf_sync" && (
                <div className="space-y-6">
                  {/* Upload & Trigger Card */}
                  <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                      <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider">
                        Upload PDF/Docx CV to Detect Differences
                      </h3>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#4F46E5] text-[11px] font-mono font-medium border border-[#E0E7FF]">
                        <Languages size={12} />
                        <span>Regulasi: Auto-Konversi ke Bahasa Indonesia Baku</span>
                      </span>
                    </div>

                    {/* Upload Dropzone vs File Preview */}
                    {!selectedCvFile ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Option 1: Upload Dropzone */}
                        <div
                          onClick={() => pdfFileInputRef.current?.click()}
                          className="p-6 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#4F46E5] bg-[#F8FAFC] hover:bg-[#EEF2FF]/30 transition-all flex flex-col items-center justify-center text-center cursor-pointer space-y-2.5"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] text-[#4F46E5] flex items-center justify-center shadow-xs">
                            <FileUp size={22} />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-[#0F172A]">
                              Click to Upload PDF or DOCX CV
                            </div>
                            <div className="text-[11px] text-[#64748B] mt-0.5">
                              Supports .pdf and .docx resume files
                            </div>
                          </div>
                        </div>

                        {/* Option 2: Quick Analyze Existing File */}
                        <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                              <FileCode size={15} className="text-[#4F46E5]" />
                              <span>Use public/documents/resume.docx</span>
                            </div>
                            <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed">
                              Extract content from your existing repository resume document to check if any projects, experiences, or skills are missing from the CMS.
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={isAnalyzingPDF}
                            onClick={() => handleAnalyzePDF(undefined, true)}
                            className="w-full inline-flex h-9 items-center justify-center gap-2 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                          >
                            {isAnalyzingPDF ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                <span>Analyzing with Groq AI...</span>
                              </>
                            ) : (
                              <>
                                <GitMerge size={14} />
                                <span>Analyze resume.docx vs CMS</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Single Focused Preview Card when File Uploaded */
                      <div className="p-6 rounded-xl border border-[#4F46E5]/40 bg-[#EEF2FF]/40 space-y-4 shadow-2xs">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-white border border-[#E0E7FF] text-[#4F46E5] flex items-center justify-center shrink-0 shadow-2xs font-bold">
                              <FileCheck size={24} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm text-[#0F172A] truncate">
                                {selectedCvFile.name}
                              </div>
                              <div className="text-xs font-mono text-[#64748B] flex items-center gap-2 mt-1">
                                <span>{(selectedCvFile.size / 1024).toFixed(1)} KB</span>
                                <span>•</span>
                                <span className="uppercase text-[#4F46E5] font-semibold">
                                  {selectedCvFile.name.split('.').pop()} File Ready
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCvFile(null);
                              if (pdfFileInputRef.current) pdfFileInputRef.current.value = "";
                            }}
                            className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-white transition cursor-pointer"
                            title="Remove uploaded file"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="pt-4 border-t border-[#E0E7FF] flex flex-col sm:flex-row items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => pdfFileInputRef.current?.click()}
                            className="h-9 px-4 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition cursor-pointer"
                          >
                            Ganti File CV
                          </button>

                          <button
                            type="button"
                            disabled={isAnalyzingPDF}
                            onClick={() => handleAnalyzePDF(selectedCvFile)}
                            className="w-full sm:w-auto h-10 px-6 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                          >
                            {isAnalyzingPDF ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" />
                                <span>Analyzing with Groq AI...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles size={14} />
                                <span>Analyze Uploaded CV with Groq AI</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Diff & Sync Review Panel */}
                  {pdfDiffResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                        <div>
                          <h4 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                            <GitMerge size={16} className="text-[#4F46E5]" />
                            <span>AI Comparison Summary &amp; Updates Found</span>
                          </h4>
                          <p className="text-[11px] font-mono text-[#64748B] mt-0.5">
                            Select the items you want to apply to your CMS database.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleApplySyncToCMS}
                          disabled={isSaving}
                          className="inline-flex h-9 items-center justify-center gap-2 px-5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex-shrink-0"
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Applying Updates...</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownToLine size={14} />
                              <span>Apply Selected Updates to CMS</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Analysis Summary */}
                      {pdfDiffResult.analysisSummary && (
                        <div className="p-4 rounded-xl bg-[#EEF2FF]/50 border border-[#E0E7FF] text-xs text-[#0F172A] leading-relaxed">
                          <div className="font-semibold font-mono text-[11px] text-[#4F46E5] uppercase tracking-wider mb-1">
                            Executive Analysis:
                          </div>
                          <p className="whitespace-pre-line text-[#334155]">{pdfDiffResult.analysisSummary}</p>
                        </div>
                      )}

                      {/* New Projects Section */}
                      {pdfDiffResult.newProjects && pdfDiffResult.newProjects.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-2">
                              <Layers size={14} className="text-[#4F46E5]" />
                              <span>New / Updated Projects Found ({pdfDiffResult.newProjects.length})</span>
                            </div>
                            <span className="text-[11px] font-mono text-[#64748B]">
                              Check to import into Projects workspace
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pdfDiffResult.newProjects.map((p) => {
                              const isChecked = selectedProjects.includes(p.id);
                              return (
                                <div
                                  key={p.id}
                                  onClick={() =>
                                    setSelectedProjects(
                                      isChecked
                                        ? selectedProjects.filter((id) => id !== p.id)
                                        : [...selectedProjects, p.id]
                                    )
                                  }
                                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                                    isChecked
                                      ? "bg-white border-[#4F46E5] ring-1 ring-[#4F46E5]/20 shadow-xs"
                                      : "bg-[#F8FAFC] border-[#E2E8F0] opacity-75"
                                  }`}
                                >
                                  <div className="mt-0.5 text-[#4F46E5]">
                                    {isChecked ? <CheckSquare size={16} /> : <Square size={16} className="text-[#94A3B8]" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <h5 className="font-semibold text-xs text-[#0F172A] truncate">
                                        {p.title}
                                      </h5>
                                      <span className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[10px] font-mono text-[#64748B]">
                                        {p.year}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-[#64748B] line-clamp-2 mt-1">
                                      {p.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {p.technologies.slice(0, 3).map((t, idx) => (
                                        <span
                                          key={idx}
                                          className="px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[9px] font-mono text-[#64748B]"
                                        >
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* New Experiences Section */}
                      {pdfDiffResult.newExperiences && pdfDiffResult.newExperiences.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-2">
                            <Compass size={14} className="text-[#4F46E5]" />
                            <span>Milestones &amp; Work Experiences Found ({pdfDiffResult.newExperiences.length})</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pdfDiffResult.newExperiences.map((exp) => {
                              const isChecked = selectedExperiences.includes(exp.id);
                              return (
                                <div
                                  key={exp.id}
                                  onClick={() =>
                                    setSelectedExperiences(
                                      isChecked
                                        ? selectedExperiences.filter((id) => id !== exp.id)
                                        : [...selectedExperiences, exp.id]
                                    )
                                  }
                                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                                    isChecked
                                      ? "bg-white border-[#4F46E5] ring-1 ring-[#4F46E5]/20 shadow-xs"
                                      : "bg-[#F8FAFC] border-[#E2E8F0] opacity-75"
                                  }`}
                                >
                                  <div className="mt-0.5 text-[#4F46E5]">
                                    {isChecked ? <CheckSquare size={16} /> : <Square size={16} className="text-[#94A3B8]" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-xs text-[#0F172A]">
                                      {exp.role} <span className="text-[#64748B]">@ {exp.organization}</span>
                                    </div>
                                    <div className="text-[10px] font-mono text-[#4F46E5] mt-0.5">
                                      {exp.dateStart} – {exp.dateEnd || "Present"} ({exp.category})
                                    </div>
                                    <p className="text-[11px] text-[#64748B] line-clamp-2 mt-1">
                                      {exp.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* New Tech Skills Section */}
                      {pdfDiffResult.newSkills && pdfDiffResult.newSkills.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-2">
                            <Tag size={14} className="text-[#4F46E5]" />
                            <span>Missing Tech Stack Skills to Add ({pdfDiffResult.newSkills.length})</span>
                          </div>

                          <div className="flex flex-wrap gap-2 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                            {pdfDiffResult.newSkills.map((s) => {
                              const isChecked = selectedSkills.includes(s.name);
                              return (
                                <button
                                  type="button"
                                  key={s.name}
                                  onClick={() =>
                                    setSelectedSkills(
                                      isChecked
                                        ? selectedSkills.filter((name) => name !== s.name)
                                        : [...selectedSkills, s.name]
                                    )
                                  }
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                    isChecked
                                      ? "bg-white text-[#4F46E5] border border-[#4F46E5] shadow-xs font-semibold"
                                      : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                                  }`}
                                >
                                  <span>{s.name}</span>
                                  <span className="text-[10px] text-[#94A3B8]">({s.category})</span>
                                  {isChecked && <Check size={12} className="text-[#4F46E5]" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════
                  MODE 2, 3, 4: PROMPT CONFIG & OUTPUT
                  ═══════════════════════════════════════════ */}
              {aiAction !== "parse_pdf_sync" && (
                <div className="space-y-6">
                  {/* Input Configuration Box */}
                  <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
                    <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                      Prompt Configuration &amp; Template
                    </h3>

                    {/* Job Description input if tailor_job active */}
                    {aiAction === "tailor_job" && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-[#0F172A]">
                          Paste Target Job Vacancy / Description
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Paste job requirements, responsibilities, or company profile here..."
                          value={aiJobDesc}
                          onChange={(e) => setAiJobDesc(e.target.value)}
                          className="w-full p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:bg-white focus:outline-none leading-relaxed"
                        />
                      </div>
                    )}

                    {/* Custom Template / Instructions input */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="block text-xs font-medium text-[#0F172A]">
                          Custom Template Structure &amp; Guidelines (Optional)
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setAiCustomTemplate(
                                `Strictly follow the official template structure from public/documents/resume.docx:\n1. HEADER: DAREEAN AHMAD RAFFI MARDIN | Undergraduate Informatics Engineering | Palu, Indonesia | dmardin@gmail.com | +62-853-4072-5481 | github.com/Dareean\n2. PROFESSIONAL SUMMARY: 3-4 crisp high-impact sentences on React/Next.js, UI/UX, and event leadership (I-Fest).\n3. TECHNICAL PROJECTS: Format: Title – Subtitle | Role | Year -> Org/Company | Duration -> STAR Achievement bullets -> Technologies Used (Blade/Livewire, React/Next.js/TypeScript, Tailwind).\n4. LEADERSHIP & ORGANIZATIONAL EXPERIENCE: Informatics Festival 2026 (Person In Charge), Palu Developer Day, HammerCode, Programming Tadulako.\n5. PROFESSIONAL WORK EXPERIENCE: PT Telkom Indonesia (B2B Business Services & Internal Monitoring Dashboard), PT Educa Sisfomedia (Web Programmer).\n6. EDUCATION: Teknik Informatika | Bachelor (GPA: 3.8/4.0), Tadulako University (2024 – Present).\n7. SKILLS: Categorize into Core, Styling & UI, Tools & Cloud, and Soft Skills.`
                              )
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#4F46E5] hover:underline cursor-pointer font-medium"
                          >
                            <FileCode size={12} />
                            <span>Load public/documents/resume.docx Template</span>
                          </button>

                          <span className="text-[#CBD5E1]">·</span>

                          <a
                            href="/documents/resume.docx"
                            download
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-[#64748B] hover:text-[#0F172A] hover:underline"
                            title="Download original template file"
                          >
                            <Download size={12} />
                            <span>Original (.docx)</span>
                          </a>
                        </div>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="E.g. Follow Harvard resume format: 1 page summary, technical skills in 4 columns, emphasize leadership and metrics..."
                        value={aiCustomTemplate}
                        onChange={(e) => setAiCustomTemplate(e.target.value)}
                        className="w-full p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:bg-white focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <div className="text-[11px] font-mono text-[#64748B] flex items-center gap-2">
                        <Bot size={14} className="text-[#4F46E5]" />
                        <span>Model: {aiModelInfo}</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateAI}
                        disabled={aiLoading}
                        className="w-full sm:w-auto inline-flex h-10 items-center justify-center gap-2 px-6 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        {aiLoading ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Generating with Groq...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Run AI Generation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* AI Output Workspace */}
                  {aiOutput && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-[#0F172A]">
                              Generated Curriculum Vitae
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-[10px] font-mono text-[#4F46E5] font-semibold">
                              {aiLanguage === "id" ? "Bahasa Indonesia" : "English (EN)"}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-[#64748B] mt-0.5">
                            Executive ATS-ready document layout with instant PDF download.
                          </p>
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* View Mode Toggle */}
                          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0] mr-1">
                            <button
                              type="button"
                              onClick={() => setOutputViewMode("document")}
                              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                                outputViewMode === "document"
                                  ? "bg-white text-[#4F46E5] font-semibold shadow-xs"
                                  : "text-[#64748B] hover:text-[#0F172A]"
                              }`}
                            >
                              📄 PDF Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => setOutputViewMode("raw")}
                              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                                outputViewMode === "raw"
                                  ? "bg-white text-[#4F46E5] font-semibold shadow-xs"
                                  : "text-[#64748B] hover:text-[#0F172A]"
                              }`}
                            >
                              📝 Raw Code
                            </button>
                          </div>

                          {/* Translate button */}
                          <button
                            type="button"
                            disabled={isTranslating}
                            onClick={() => handleTranslateOutput(aiLanguage === "en" ? "id" : "en")}
                            className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] transition-colors cursor-pointer"
                            title={`Translate to ${aiLanguage === "en" ? "Indonesian" : "English"}`}
                          >
                            <Languages size={13} className="text-[#4F46E5]" />
                            <span>
                              {isTranslating
                                ? "Translating..."
                                : aiLanguage === "en"
                                ? "Translate to ID"
                                : "Translate to EN"}
                            </span>
                          </button>

                          {/* Copy button */}
                          <button
                            type="button"
                            onClick={handleCopyOutput}
                            className="inline-flex h-8 items-center gap-1.5 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#4F46E5] text-xs font-mono text-[#0F172A] transition-colors cursor-pointer"
                          >
                            {isCopied ? (
                              <>
                                <CheckCheck size={13} className="text-[#4F46E5]" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} className="text-[#4F46E5]" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>

                          {/* Download PDF Primary Button */}
                          <button
                            type="button"
                            onClick={handleDownloadPDF}
                            className="inline-flex h-8 items-center gap-1.5 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition-colors cursor-pointer shadow-xs"
                          >
                            <Printer size={13} />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>

                      {/* Visual Document View (A4 Paper Aesthetic) */}
                      {outputViewMode === "document" ? (
                        <div className="p-6 md:p-10 rounded-xl bg-white border border-[#CBD5E1] shadow-md max-w-4xl mx-auto my-2">
                          <div
                            className="prose prose-slate max-w-none text-xs leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(aiOutput) }}
                          />
                        </div>
                      ) : (
                        <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-x-auto">
                          <pre className="font-mono text-xs text-[#0F172A] whitespace-pre-wrap leading-relaxed">
                            {aiOutput}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════
              TAB 6: CLOUD & SETTINGS
              ═══════════════════════════════════════════ */}
          {activeTab === "site" && (
            <div className="space-y-6">
              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#0F172A]">
                  <Database size={16} className="text-[#4F46E5]" />
                  <span>Supabase Storage Integration</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Configure <strong>NEXT_PUBLIC_SUPABASE_URL</strong> and <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> in your <strong>.env.local</strong> to stream uploads to your public bucket <strong>portfolio-assets</strong>.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-5">
                <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider border-b border-[#E2E8F0] pb-3">
                  Global Social &amp; Contact Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.site.email}
                      onChange={(e) =>
                        setData({ ...data, site: { ...data.site, email: e.target.value } })
                      }
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      value={data.site.github}
                      onChange={(e) =>
                        setData({ ...data, site: { ...data.site, github: e.target.value } })
                      }
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={data.site.linkedin}
                      onChange={(e) =>
                        setData({ ...data, site: { ...data.site, linkedin: e.target.value } })
                      }
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      Instagram URL
                    </label>
                    <input
                      type="text"
                      value={data.site.instagram}
                      onChange={(e) =>
                        setData({ ...data, site: { ...data.site, instagram: e.target.value } })
                      }
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                    Footer Note
                  </label>
                  <input
                    type="text"
                    value={data.site.footerNote}
                    onChange={(e) =>
                      setData({ ...data, site: { ...data.site, footerNote: e.target.value } })
                    }
                    className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] focus:outline-none"
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
                    <h3 className="font-semibold text-sm text-[#0F172A]">
                      Edit Project Details
                    </h3>
                    <p className="text-[11px] font-mono text-[#64748B]">
                      {editingProject.slug}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="p-1 text-[#64748B] hover:text-[#0F172A] transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* Upload Banner */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-20 rounded-lg bg-white overflow-hidden relative border border-[#E2E8F0] flex-shrink-0">
                    {editingProject.image ? (
                      <Image
                        src={editingProject.image}
                        alt={editingProject.title}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#94A3B8]">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 w-full space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-[#0F172A]">
                        Thumbnail Image
                      </label>
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => projectFileInputRef.current?.click()}
                        className="h-8 px-3 rounded-lg bg-[#4F46E5] text-white text-xs font-mono font-medium hover:bg-[#4338CA] transition cursor-pointer shadow-xs"
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
                      className="w-full h-9 px-3 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-[#0F172A]">
                      Project Title
                    </label>
                    <AIAssistantButton
                      fieldType="project_title"
                      currentValue={editingProject.title}
                      context={{
                        description: editingProject.description,
                        technologies: editingProject.technologies,
                        category: editingProject.category,
                      }}
                      onApply={(val) => setEditingProject({ ...editingProject, title: val })}
                      compact
                    />
                  </div>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
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
                      className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                    Live Demo / Source URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.link}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, link: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-[#0F172A]">
                      Description &amp; Highlights
                    </label>
                    <AIAssistantButton
                      fieldType="project_description"
                      currentValue={editingProject.description}
                      context={{
                        title: editingProject.title,
                        category: editingProject.category,
                        technologies: editingProject.technologies,
                      }}
                      onApply={(val) => setEditingProject({ ...editingProject, description: val })}
                      label="AI Assist"
                    />
                  </div>
                  <textarea
                    rows={4}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full p-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
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
                    className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>

                {/* Featured toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer">
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
                        Displayed in the primary spotlight showcase.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <button
                  type="button"
                  onClick={() => handleDeleteProject(editingProject.id, editingProject.title)}
                  className="text-xs font-mono text-rose-600 hover:underline cursor-pointer"
                >
                  Delete Project
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="h-9 px-4 rounded-lg border border-[#E2E8F0] text-xs font-mono text-[#64748B] hover:text-[#0F172A] bg-white transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => saveProjectModal(editingProject)}
                    className="h-9 px-5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition cursor-pointer shadow-xs"
                  >
                    Done &amp; Update
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            BLOG POST EDIT MODAL
            ═══════════════════════════════════════════ */}
        {editingBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-[#4F46E5]" />
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    {editingBlog.id ? "Edit Blog Post" : "Tambah Blog Post Baru"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="p-1 text-[#64748B] hover:text-[#0F172A] transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* Upload Cover */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-20 rounded-lg bg-white overflow-hidden relative border border-[#E2E8F0] flex-shrink-0">
                    {editingBlog.coverImage ? (
                      <Image
                        src={editingBlog.coverImage}
                        alt={editingBlog.title}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#94A3B8]">
                        Tanpa gambar
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 w-full space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-[#0F172A]">
                        Gambar Sampul (Cover Image)
                      </label>
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => blogCoverFileInputRef.current?.click()}
                        className="h-8 px-3 rounded-lg bg-[#4F46E5] text-white text-xs font-mono font-medium hover:bg-[#4338CA] transition cursor-pointer shadow-xs"
                      >
                        {isUploading ? "Uploading..." : "Upload Cover"}
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Cover Image URL"
                      value={editingBlog.coverImage || ""}
                      onChange={(e) =>
                        setEditingBlog({ ...editingBlog, coverImage: e.target.value })
                      }
                      className="w-full h-9 px-3 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] font-mono focus:border-[#4F46E5] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                    Judul Artikel / Cerita
                  </label>
                  <input
                    type="text"
                    value={editingBlog.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");
                      setEditingBlog({ ...editingBlog, title, slug: slug || editingBlog.slug });
                    }}
                    className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      Kategori
                    </label>
                    <select
                      value={editingBlog.category}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full h-10 px-3 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none"
                    >
                      <option value="Daily Life">Daily Life (Keseharian)</option>
                      <option value="Achievement">Achievement (Pencapaian)</option>
                      <option value="Thoughts">Thoughts (Refleksi)</option>
                      <option value="Tech">Tech &amp; Projects</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      Tanggal Publikasi
                    </label>
                    <input
                      type="date"
                      value={editingBlog.date}
                      onChange={(e) =>
                        setEditingBlog({ ...editingBlog, date: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      Estimasi Waktu Baca
                    </label>
                    <input
                      type="text"
                      value={editingBlog.readTime}
                      onChange={(e) =>
                        setEditingBlog({ ...editingBlog, readTime: e.target.value })
                      }
                      placeholder="e.g. 4 min read"
                      className="w-full h-10 px-3 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                    Ringkasan Singkat (Excerpt)
                  </label>
                  <textarea
                    rows={2}
                    value={editingBlog.excerpt}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, excerpt: e.target.value })
                    }
                    className="w-full p-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#0F172A] focus:border-[#4F46E5] outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                    Isi Cerita / Artikel Lengkap (Markdown Supported)
                  </label>
                  <textarea
                    rows={8}
                    value={editingBlog.content}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog, content: e.target.value })
                    }
                    className="w-full p-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-sans text-[#0F172A] focus:border-[#4F46E5] outline-none leading-relaxed font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                    Tags (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={editingBlog.tags.join(", ")}
                    onChange={(e) =>
                      setEditingBlog({
                        ...editingBlog,
                        tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Daily Life, Achievement, Palu"
                    className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-mono text-[#0F172A] focus:border-[#4F46E5] outline-none"
                  />
                </div>

                {/* Featured toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingBlog.featured}
                      onChange={(e) =>
                        setEditingBlog({ ...editingBlog, featured: e.target.checked })
                      }
                      className="w-4 h-4 text-[#4F46E5] rounded border-[#E2E8F0] focus:ring-[#4F46E5]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#0F172A]">
                        Tampilkan sebagai Artikel Unggulan (Featured)
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Ditampilkan di bagian paling atas halaman Blog dan Beranda.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <button
                  type="button"
                  onClick={() => {
                    const updated = (data.blogs || []).filter((b) => b.id !== editingBlog.id);
                    setData({ ...data, blogs: updated });
                    setEditingBlog(null);
                    showToast("Blog post deleted!");
                  }}
                  className="text-xs font-mono text-rose-600 hover:underline cursor-pointer"
                >
                  Delete Post
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingBlog(null)}
                    className="h-9 px-4 rounded-lg border border-[#E2E8F0] text-xs font-mono text-[#64748B] hover:text-[#0F172A] bg-white transition cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const blogs = data.blogs || [];
                      const index = blogs.findIndex((b) => b.id === editingBlog.id);
                      let updated: CMSBlogPost[];
                      if (index >= 0) {
                        updated = [...blogs];
                        updated[index] = editingBlog;
                      } else {
                        updated = [editingBlog, ...blogs];
                      }
                      setData({ ...data, blogs: updated });
                      setEditingBlog(null);
                      showToast("Blog post saved!");
                    }}
                    className="h-9 px-5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-semibold transition cursor-pointer shadow-xs"
                  >
                    Simpan &amp; Publish
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
