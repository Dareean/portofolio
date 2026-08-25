"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Check,
  Languages,
  X,
  FileText,
  Type,
  Maximize2,
  Sparkle,
  ArrowRight,
  Copy,
  CheckCheck,
} from "lucide-react";

interface AIAssistantButtonProps {
  fieldType:
    | "project_description"
    | "project_title"
    | "article_title"
    | "article_caption"
    | "experience_description"
    | "bio"
    | "general";
  currentValue?: string;
  onApply: (newText: string) => void;
  context?: {
    title?: string;
    category?: string;
    technologies?: string[] | string;
    role?: string;
    organization?: string;
    year?: string | number;
    description?: string;
    [key: string]: any;
  };
  label?: string;
  className?: string;
  compact?: boolean;
}

export function AIAssistantButton({
  fieldType,
  currentValue = "",
  onApply,
  context = {},
  label = "AI Assist",
  className = "",
  compact = false,
}: AIAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleRunAI = async (
    action: "generate_description" | "generate_caption" | "generate_title" | "polish" | "translate"
  ) => {
    setIsLoading(true);
    setErrorMsg(null);
    setActiveAction(action);

    try {
      const res = await fetch("/api/cms/ai/generate-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          fieldType,
          currentValue,
          context,
          language,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setGeneratedResult(json.result);
      } else {
        setErrorMsg(json.error || "Failed to generate AI suggestion");
      }
    } catch (err) {
      setErrorMsg("Network error while communicating with Groq AI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (textToApply?: string) => {
    const text = textToApply || generatedResult;
    if (text) {
      onApply(text);
      setIsOpen(false);
      setGeneratedResult(null);
    }
  };

  const handleCopySuggestion = (textToCopy?: string) => {
    const text = textToCopy || generatedResult;
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Determine quick action presets based on fieldType
  const getActionPresets = () => {
    switch (fieldType) {
      case "project_description":
      case "experience_description":
        return [
          {
            id: "generate_description",
            label: "Auto-Generate STAR Description",
            icon: Wand2,
            desc: "Draft structured STAR bullets based on title & tech stack",
          },
          {
            id: "polish",
            label: "Polish & Enhance Impact",
            icon: Sparkles,
            desc: "Fix tone, grammar, and add metric highlights",
          },
          {
            id: "generate_caption",
            label: "Shorten into Caption (1-2 sentences)",
            icon: FileText,
            desc: "Condense long text into crisp card summary",
          },
        ];
      case "article_caption":
        return [
          {
            id: "generate_caption",
            label: "Auto-Generate Excerpt Caption",
            icon: Sparkles,
            desc: "Create engaging 1-2 sentence article summary",
          },
          {
            id: "polish",
            label: "Refine Tone & Polish",
            icon: Wand2,
            desc: "Improve narrative flow and terminology",
          },
        ];
      case "project_title":
      case "article_title":
        return [
          {
            id: "generate_title",
            label: "Suggest 3 Catchy Titles",
            icon: Type,
            desc: "Create memorable options from description/tech",
          },
          {
            id: "polish",
            label: "Polish Title",
            icon: Sparkles,
            desc: "Make current title sound crisp & professional",
          },
        ];
      case "bio":
        return [
          {
            id: "polish",
            label: "Refine Philosophy Bio",
            icon: Sparkles,
            desc: "Elevate tone and engineering narrative",
          },
          {
            id: "generate_description",
            label: "Draft Bio from Skills",
            icon: Wand2,
            desc: "Generate professional bio from technical background",
          },
        ];
      default:
        return [
          {
            id: "generate_description",
            label: "Auto-Generate Content",
            icon: Wand2,
            desc: "Draft content based on context",
          },
          {
            id: "polish",
            label: "Polish & Refine",
            icon: Sparkles,
            desc: "Improve tone and clarity",
          },
          {
            id: "generate_caption",
            label: "Condense into Short Caption",
            icon: FileText,
            desc: "Create 1-2 sentence summary",
          },
        ];
    }
  };

  const actionPresets = getActionPresets();
  const displayLabel = label.replace(/^[✨🪄⚡️]\s*/, "");

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Trigger Button */}
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE]/70 text-[#4F46E5] hover:text-[#3730A3] text-[11px] font-sans font-medium transition-all cursor-pointer shadow-2xs"
          title="Copilot AI Assistant"
        >
          <Sparkles size={11} className="text-[#4F46E5]" />
          <span>{displayLabel}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex h-7 items-center gap-1.5 px-2.5 rounded-md bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#C7D2FE]/70 text-[#4F46E5] hover:text-[#3730A3] text-[11px] font-sans font-medium transition-all cursor-pointer shadow-2xs"
        >
          <Sparkles size={12} className="text-[#4F46E5]" />
          <span>{displayLabel}</span>
        </button>
      )}

      {/* Popover Dropdown Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden font-sans"
          >
            {/* Popover Header */}
            <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shadow-2xs">
                  <Sparkles size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A] leading-tight flex items-center gap-2">
                    <span>Copilot AI Assistant</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#EEF2FF] border border-[#E0E7FF] text-[9px] font-mono font-semibold text-[#4F46E5]">
                      Groq AI
                    </span>
                  </div>
                  <div className="text-[10px] font-medium text-[#64748B] mt-0.5 capitalize">
                    {fieldType.replace(/_/g, " ")}
                  </div>
                </div>
              </div>

              {/* Language Selector & Close */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage(language === "id" ? "en" : "id")}
                  className="h-7 px-2.5 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#4F46E5] text-[11px] font-sans font-medium text-[#0F172A] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Toggle Language"
                >
                  <Languages size={12} className="text-[#4F46E5]" />
                  <span>{language === "id" ? "ID" : "EN"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-[#64748B] hover:text-[#0F172A] transition cursor-pointer rounded-md hover:bg-[#E2E8F0]/50"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 space-y-3 bg-white">
              {/* Presets List */}
              {!generatedResult && !isLoading && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-semibold uppercase text-[#64748B] px-0.5 tracking-wider">
                    Select Copilot Action:
                  </div>

                  {actionPresets.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleRunAI(preset.id as any)}
                        className="w-full text-left p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EEF2FF]/60 hover:border-[#4F46E5]/40 transition-all group flex items-start gap-3 cursor-pointer shadow-2xs"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] group-hover:border-[#4F46E5] text-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5 transition-all shadow-2xs">
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors font-sans">
                            {preset.label}
                          </div>
                          <div className="text-[11px] text-[#64748B] line-clamp-1 leading-snug mt-0.5 font-sans">
                            {preset.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Translate action option if current value exists */}
                  {currentValue && (
                    <button
                      type="button"
                      onClick={() => handleRunAI("translate")}
                      className="w-full text-left p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EEF2FF]/60 hover:border-[#4F46E5]/40 transition-all group flex items-center justify-between cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] group-hover:border-[#4F46E5] text-[#4F46E5] flex items-center justify-center shrink-0 shadow-2xs">
                          <Languages size={14} />
                        </div>
                        <span className="text-xs font-semibold text-[#0F172A] group-hover:text-[#4F46E5] font-sans">
                          Translate to {language === "id" ? "English" : "Bahasa Indonesia"}
                        </span>
                      </div>
                      <ArrowRight size={13} className="text-[#64748B] group-hover:text-[#4F46E5]" />
                    </button>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="py-8 px-4 text-center space-y-3">
                  <div className="relative w-10 h-10 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-[#4F46E5]/20 border-t-[#4F46E5] animate-spin" />
                    <Sparkles size={16} className="text-[#4F46E5] animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      Generating with Copilot AI...
                    </div>
                    <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                      Synthesizing contextual insights
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-2">
                  <div className="font-semibold">Generation Error</div>
                  <p className="text-[11px]">{errorMsg}</p>
                  <button
                    type="button"
                    onClick={() => setErrorMsg(null)}
                    className="text-[11px] font-mono text-rose-700 underline cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Result Preview & Action Bar */}
              {generatedResult && !isLoading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-0.5">
                    <div className="text-[10px] font-mono font-semibold uppercase text-[#4F46E5] flex items-center gap-1.5">
                      <Sparkle size={12} className="text-[#4F46E5]" />
                      <span>Copilot AI Suggestion</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGeneratedResult(null)}
                      className="text-[11px] font-medium text-[#64748B] hover:text-[#0F172A] underline cursor-pointer"
                    >
                      Back to options
                    </button>
                  </div>

                  {/* Suggestion Textbox */}
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] max-h-52 overflow-y-auto font-sans text-xs text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                    {generatedResult}
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopySuggestion()}
                        className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-xs font-medium text-[#0F172A] transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title="Copy text"
                      >
                        {isCopied ? (
                          <>
                            <CheckCheck size={13} className="text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} className="text-[#64748B]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRunAI(activeAction as any)}
                        className="h-8 w-8 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition cursor-pointer flex items-center justify-center shadow-2xs"
                        title="Regenerate"
                      >
                        <RefreshCw size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplySuggestion()}
                      className="h-8 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      <span>Apply to Field</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
