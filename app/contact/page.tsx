"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  ChevronLeft,
  Mail,
  Send,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Loader2,
  CheckCircle2,
  Sparkles,
  Lightbulb,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/Dareean",
      icon: <Github className="w-5 h-5" />,
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/dareean",
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      name: "Email",
      url: "mailto:dmardin@gmail.com",
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-void-black">
      {/* Animated Background */}
      <AnimatedBackground />
      <FloatingNav />

      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-20 md:py-32">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-off-white/60 hover:text-off-white mb-12 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm tracking-wide uppercase">Back</span>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          className="max-w-7xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-off-white/10 backdrop-blur-xl rounded-full border border-off-white/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-off-white" />
              <span className="text-off-white/80 text-sm tracking-wider uppercase">
                Get In Touch
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-off-white mb-6 leading-tight">
              Let&apos;s Create
              <br />
              <span className="text-off-white">Something Great</span>
            </h1>

            <p className="text-off-white/60 text-lg md:text-xl leading-relaxed">
              Have a project in mind or just want to connect? I&apos;m always
              open to discussing new opportunities and creative collaborations.
            </p>
          </div>
        </motion.div>

        {/* Main Content - Bento Grid Style */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Contact Form - Takes 7 columns */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {isSubmitted ? (
                <motion.div
                  className="relative h-full min-h-[600px] bg-gradient-to-br from-off-white/10 to-off-white/5 backdrop-blur-xl rounded-3xl border border-off-white/20 p-12 flex flex-col items-center justify-center overflow-hidden group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Success Animation Background */}
                  <div className="absolute inset-0 bg-off-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="relative z-10"
                  >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-off-white/20 backdrop-blur-xl border border-off-white/40 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full bg-off-white/10 blur-xl animate-pulse" />
                      <CheckCircle2 className="w-12 h-12 text-off-white relative z-10" />
                    </div>

                    <h3 className="font-display text-3xl text-off-white mb-4 text-center">
                      Message Sent!
                    </h3>
                    <p className="text-off-white/70 text-center mb-8 max-w-md">
                      Thank you for reaching out. I&apos;ll get back to you as
                      soon as possible.
                    </p>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 bg-off-white/10 hover:bg-off-white/20 backdrop-blur-xl border border-off-white/30 rounded-full text-off-white text-sm tracking-wider uppercase transition-all duration-300"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="relative h-full bg-gradient-to-br from-off-white/10 to-off-white/5 backdrop-blur-xl rounded-3xl border border-off-white/20 p-8 md:p-10 overflow-hidden group hover:border-off-white/30 transition-all duration-500"
                >
                  {/* Subtle Overlay on Hover */}
                  <div className="absolute inset-0 bg-off-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-2xl bg-off-white/10 backdrop-blur-xl border border-off-white/30 text-off-white text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    <div className="space-y-6">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-off-white/80 mb-3 tracking-wide uppercase"
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-2xl bg-void-black/50 backdrop-blur-xl border border-off-white/20 text-off-white placeholder:text-off-white/30 focus:outline-none focus:border-off-white/50 focus:ring-2 focus:ring-off-white/10 transition-all duration-300"
                          placeholder="John Doe"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-off-white/80 mb-3 tracking-wide uppercase"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-2xl bg-void-black/50 backdrop-blur-xl border border-off-white/20 text-off-white placeholder:text-off-white/30 focus:outline-none focus:border-off-white/50 focus:ring-2 focus:ring-off-white/10 transition-all duration-300"
                          placeholder="john@example.com"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-off-white/80 mb-3 tracking-wide uppercase"
                        >
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-5 py-4 rounded-2xl bg-void-black/50 backdrop-blur-xl border border-off-white/20 text-off-white focus:outline-none focus:border-off-white/50 focus:ring-2 focus:ring-off-white/10 transition-all duration-300 appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-void-black">
                            Select a topic
                          </option>
                          <option
                            value="collaboration"
                            className="bg-void-black"
                          >
                            Project Collaboration
                          </option>
                          <option value="freelance" className="bg-void-black">
                            Freelance Work
                          </option>
                          <option value="job" className="bg-void-black">
                            Job Opportunity
                          </option>
                          <option value="general" className="bg-void-black">
                            General Inquiry
                          </option>
                          <option value="other" className="bg-void-black">
                            Other
                          </option>
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-off-white/80 mb-3 tracking-wide uppercase"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-5 py-4 rounded-2xl bg-void-black/50 backdrop-blur-xl border border-off-white/20 text-off-white placeholder:text-off-white/30 focus:outline-none focus:border-off-white/50 focus:ring-2 focus:ring-off-white/10 transition-all duration-300 resize-none"
                          placeholder="Tell me about your project or just say hi..."
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 rounded-2xl bg-off-white hover:bg-off-white/90 text-void-black font-medium text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group/btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-void-black/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />

                        <span className="relative z-10 flex items-center gap-3">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Message
                            </>
                          )}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Right Sidebar - Takes 5 columns */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Info Cards */}
              <motion.div
                className="bg-gradient-to-br from-off-white/10 to-off-white/5 backdrop-blur-xl rounded-3xl border border-off-white/20 p-8 hover:border-off-white/30 transition-all duration-500 group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-off-white/20 backdrop-blur-xl border border-off-white/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-off-white" />
                  </div>
                  <div>
                    <p className="text-off-white font-semibold text-lg mb-1">
                      Location
                    </p>
                    <p className="text-off-white/60 text-sm leading-relaxed">
                      Palu, Central Sulawesi, Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-off-white/20 backdrop-blur-xl border border-off-white/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-off-white" />
                  </div>
                  <div>
                    <p className="text-off-white font-semibold text-lg mb-1">
                      Availability
                    </p>
                    <p className="text-off-white/60 text-sm leading-relaxed">
                      Open for freelance & collaborations
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="bg-gradient-to-br from-off-white/10 to-off-white/5 backdrop-blur-xl rounded-3xl border border-off-white/20 p-8 hover:border-off-white/30 transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="font-display text-xl text-off-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-off-white" />
                  Connect With Me
                </h3>
                <div className="space-y-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-5 py-4 bg-off-white/10 hover:bg-off-white/20 backdrop-blur-xl border border-off-white/20 rounded-2xl text-off-white transition-all duration-300 group/link"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      whileHover={{ x: 8 }}
                    >
                      <div className="group-hover/link:scale-110 group-hover/link:rotate-12 transition-all duration-300">
                        {social.icon}
                      </div>
                      <span className="font-medium tracking-wide">
                        {social.name}
                      </span>
                      <Send className="w-4 h-4 ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Response Time Card */}
              <motion.div
                className="relative bg-off-white/10 backdrop-blur-xl rounded-3xl border border-off-white/20 p-8 overflow-hidden group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-off-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-off-white/20 backdrop-blur-xl border border-off-white/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-6 h-6 text-off-white" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-off-white mb-2 flex items-center gap-2">
                      Quick Response
                    </h4>
                    <p className="text-off-white/70 text-sm leading-relaxed">
                      I typically respond within 24 hours. Whether it&apos;s
                      about a project, an idea, or just to chat about
                      tech—I&apos;m here!
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
