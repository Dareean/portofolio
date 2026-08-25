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
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between items-center p-6 relative">
      {/* Top Header Link */}
      <div className="w-full max-w-sm pt-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-steel hover:text-charcoal text-caption font-mono transition-colors duration-200 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Login Card — Clean Editorial / Swiss Style */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm bg-surface border border-hairline rounded-xl p-8 shadow-elevation-1 z-10"
      >
        {/* Monogram / Header */}
        <div className="mb-6 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-charcoal text-white font-mono font-bold text-sm flex items-center justify-center">
              D
            </div>
            <div>
              <div className="text-micro font-mono uppercase tracking-widest text-primary font-semibold">
                Control Plane
              </div>
              <h1 className="text-heading-4 font-semibold text-charcoal tracking-tight">
                CMS Access
              </h1>
            </div>
          </div>
          <p className="text-caption text-slate">
            Enter administrator credentials to manage portfolio content.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-caption font-mono"
          >
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steel">
                <User size={14} />
              </div>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="dareean"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-micro font-mono text-steel uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-steel">
                <Lock size={14} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-canvas border border-hairline text-charcoal font-mono text-body-sm focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-steel hover:text-charcoal transition-colors cursor-pointer"
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
              className="w-full py-2.5 rounded-lg bg-charcoal hover:bg-ink-deep text-white text-button-md font-mono font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-elevation-1"
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

        {/* Credentials hint */}
        <div className="mt-6 pt-4 border-t border-hairline text-center">
          <p className="text-micro font-mono text-muted">
            Default credentials: <span className="text-steel font-semibold">dareean</span> / <span className="text-steel font-semibold">dareean2026</span>
          </p>
        </div>
      </motion.div>

      {/* Footer copyright */}
      <div className="pb-6 text-center z-10">
        <p className="text-micro font-mono text-muted">
          Dareean Portfolio · Integrated Content Management
        </p>
      </div>
    </div>
  );
}
