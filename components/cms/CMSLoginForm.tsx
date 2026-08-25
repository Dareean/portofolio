"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  Shield,
} from "lucide-react";

interface CMSLoginFormProps {
  onSuccess: () => void;
}

export default function CMSLoginForm({ onSuccess }: CMSLoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cms/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between items-center p-6 font-sans">
      {/* Top Navigation */}
      <div className="w-full max-w-md pt-6 flex items-center justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#64748B] hover:text-[#0F172A] transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Main Login Box */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm"
      >
        {/* Monogram / Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#4F46E5] text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
              D
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#4F46E5] font-semibold">
                Studio Console
              </div>
              <h1 className="text-lg font-semibold text-[#0F172A] tracking-tight">
                CMS Access
              </h1>
            </div>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Enter administrator credentials to manage portfolio content.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-mono"
          >
            <AlertCircle size={14} className="flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-[#64748B] uppercase tracking-wider mb-1.5 font-medium">
              Username / Gmail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                <User size={14} />
              </div>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="dmardin@gmail.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-mono text-xs focus:border-[#4F46E5] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#64748B] uppercase tracking-wider mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                <Lock size={14} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] font-mono text-xs focus:border-[#4F46E5] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-end text-[11px] font-mono text-[#64748B]">
          <span className="flex items-center gap-1">
            <Shield size={12} className="text-[#4F46E5]" />
            Session Auth
          </span>
        </div>
      </motion.div>

      {/* Footer copyright */}
      <div className="pb-6 text-center">
        <p className="text-[11px] font-mono text-[#64748B]">
          Dareean Portfolio · Content Management
        </p>
      </div>
    </div>
  );
}
