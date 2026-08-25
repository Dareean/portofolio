"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, RefreshCw, ChevronLeft } from "lucide-react";

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
    <div className="min-h-screen bg-ink text-white flex flex-col justify-between items-center p-6 relative overflow-hidden">
      {/* Background Noise / Subtle Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Link */}
      <div className="w-full max-w-md pt-4 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-caption font-mono transition-colors duration-200 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md bg-surface-dark border border-white/[0.1] rounded-2xl p-8 md:p-10 shadow-elevation-3 z-10"
      >
        {/* Monogram / Header */}
        <div className="mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-white text-ink font-mono font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-elevation-1">
            D
          </div>
          <h1 className="text-heading-3 font-semibold text-white tracking-tight">
            CMS Control Plane
          </h1>
          <p className="text-caption font-mono text-white/40 mt-1">
            Enter credentials to manage portfolio content
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-400 text-caption font-mono"
          >
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-micro font-mono text-white/50 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                <User size={15} />
              </div>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="dareean"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white font-mono text-body-sm placeholder:text-white/20 focus:border-primary focus:bg-white/[0.08] focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-micro font-mono text-white/50 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                <Lock size={15} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white font-mono text-body-sm placeholder:text-white/20 focus:border-primary focus:bg-white/[0.08] focus:outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/30 hover:text-white/70 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-primary hover:bg-primary-hover text-on-primary text-button-md font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-elevation-1 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Authenticate &amp; Enter</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Hint Footer */}
        <div className="mt-8 pt-4 border-t border-white/[0.06] text-center">
          <p className="text-micro font-mono text-white/30">
            Default credentials: <span className="text-white/50">dareean</span> / <span className="text-white/50">dareean2026</span>
          </p>
        </div>
      </motion.div>

      {/* Footer copyright */}
      <div className="pb-4 text-center z-10">
        <p className="text-micro font-mono text-white/25">
          Dareean Portfolio CMS · Secure Session Management
        </p>
      </div>
    </div>
  );
}
