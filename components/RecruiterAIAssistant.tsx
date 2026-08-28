"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RotateCcw,
  ExternalLink,
  Mail,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  "Apa proyek terbaik Dareean & tech stack-nya?",
  "Ceritakan peran Dareean di I-Fest 2026 & komunitas!",
  "Berapa lama pengalaman Dareean di Next.js & Full-Stack?",
  "Apakah Dareean terbuka untuk tawaran kerja / internship?",
  "Bagaimana cara menghubungi Dareean langsung?",
];

export default function RecruiterAIAssistant() {
  const pathname = usePathname();

  // Hide chatbot on CMS pages & login form
  if (pathname?.startsWith("/cms")) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo! Saya **Dareean AI Copilot** 🤖. Saya siap menjawab pertanyaan seputar keahlian teknis, proyek unggulan, peran kepemimpinan, dan ketersediaan kerja Dareean. Ada yang ingin Anda ketahui?",
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);
    setHasInteracted(true);

    try {
      const res = await fetch("/api/recruiter-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: Message = {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: data.error || "Maaf, terjadi sedikit kendala koneksi AI. Silakan coba kembali.",
          timestamp: "Error",
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const networkErrorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        content: "Gagal terhubung dengan server AI. Periksa koneksi internet Anda.",
        timestamp: "Error",
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Halo! Saya **Dareean AI Copilot** 🤖. Percakapan telah direset. Silakan tanyakan apa pun tentang profil & proyek Dareean!",
        timestamp: "Just now",
      },
    ]);
    setHasInteracted(false);
  };

  // Basic formatting helper for bolding and bullets
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Bullet list items
      const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
      const cleanLine = isBullet ? line.replace(/^[\s•\-]+/, "").trim() : line;

      // Parse bold text **text**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-semibold text-charcoal">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-primary font-bold leading-relaxed shrink-0">•</span>
            <span className="leading-relaxed">{formattedParts}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="leading-relaxed my-0.5">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* ── FLOATING TRIGGER BADGE ── */}
      <div className="fixed bottom-6 right-6 z-40 font-sans">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 10 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsOpen(true)}
              className="group flex items-center gap-3 pl-2.5 pr-4 py-2 rounded-full bg-white/95 text-[#0F172A] shadow-xl hover:shadow-2xl border border-[#E2E8F0] hover:border-[#4F46E5]/50 backdrop-blur-md transition-all duration-300 cursor-pointer select-none"
            >
              {/* Avatar with beacon */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#E2E8F0] shadow-2xs shrink-0">
                <Image
                  src="/assets/foto_closeup.jpg"
                  alt="Dareean"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>

              {/* Text info */}
              <div className="text-left">
                <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors flex items-center gap-1.5 leading-none">
                  <span>Ask AI</span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE]/60 text-[9px] font-mono font-semibold text-[#4F46E5]">
                    <Sparkles size={9} className="text-[#4F46E5]" />
                    <span>Copilot</span>
                  </span>
                </div>
                <div className="text-[10px] text-[#64748B] mt-1 leading-none font-medium">
                  Tanyakan apa saja seputar Dareean
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── MODAL CHAT WINDOW ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 z-50 flex items-end sm:items-center justify-center p-0 sm:p-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 25 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full sm:w-[420px] h-[85vh] sm:h-[590px] max-h-[690px] bg-white border border-[#E2E8F0] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden font-sans overscroll-contain"
            >
              {/* Header */}
              <div className="px-4 py-3.5 bg-[#F8FAFC]/90 border-b border-[#E2E8F0] backdrop-blur-md flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#E2E8F0] shrink-0 shadow-2xs">
                    <Image
                      src="/assets/foto_closeup.jpg"
                      alt="Dareean Ahmad Raffi"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[#0F172A] leading-tight">
                        Dareean AI Copilot
                      </h4>
                      <span className="px-1.5 py-0.5 rounded bg-[#EEF2FF] border border-[#C7D2FE]/70 text-[#4F46E5] text-[9px] font-mono font-semibold">
                        Live CMS
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Online · Siap menjawab pertanyaan Anda</span>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleResetChat}
                    title="Reset percakapan"
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 transition cursor-pointer"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    title="Tutup AI Copilot"
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/50 transition cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="flex-1 p-4 overflow-y-auto overscroll-contain space-y-3.5 text-xs text-[#0F172A] bg-white scroll-smooth"
              >
                {messages.map((msg) => {
                  const isAi = msg.role === "assistant";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isAi ? "items-start" : "items-end justify-end"}`}
                    >
                      {isAi && (
                        <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]/70 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          <Bot size={13} />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs leading-relaxed ${
                          isAi
                            ? "bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-tl-xs"
                            : "bg-[#4F46E5] text-white rounded-br-xs"
                        }`}
                      >
                        {isAi ? renderFormattedText(msg.content) : msg.content}

                        <div
                          className={`text-[9px] mt-1.5 font-mono ${
                            isAi ? "text-[#94A3B8] text-right" : "text-white/70 text-right"
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* AI Typing Indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]/70 flex items-center justify-center shrink-0 shadow-2xs">
                      <Bot size={13} />
                    </div>
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-xs bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-1.5 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]/60 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]/60 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]/60 animate-bounce" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Suggestions */}
              {!hasInteracted && messages.length <= 1 && (
                <div className="px-3.5 py-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="text-[10px] font-mono text-[#64748B] font-semibold uppercase tracking-wider mb-1.5 px-0.5">
                    Pertanyaan Populer Recruiter:
                  </div>
                  <div
                    data-lenis-prevent
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto overscroll-contain"
                  >
                    {QUICK_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(q)}
                        className="text-[11px] text-left px-3 py-1 rounded-full bg-white border border-[#E2E8F0] hover:border-[#4F46E5]/50 text-[#0F172A] hover:text-[#4F46E5] transition-all cursor-pointer shadow-2xs font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] backdrop-blur-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Tanya seputar skill, proyek, atau kontak..."
                    disabled={isLoading}
                    className="flex-1 h-10 px-3.5 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#4F46E5] focus:outline-none transition shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="h-10 w-10 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-xs shrink-0"
                    title="Kirim pesan"
                  >
                    <Send size={14} />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-2 px-1">
                  <span>Powered by Groq LLM &amp; Live CMS</span>
                  <a
                    href="mailto:dareean.business@gmail.com"
                    className="hover:text-[#4F46E5] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Mail size={10} />
                    <span>Email Dareean</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
