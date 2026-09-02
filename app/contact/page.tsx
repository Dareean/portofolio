"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import TopNav from "@/components/TopNav";
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
  Instagram,
} from "lucide-react";
import { useDeviceType } from "@/lib/hooks";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [siteData, setSiteData] = useState<any>(null);
  const deviceInfo = useDeviceType();

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.site) {
          setSiteData(json.data.site);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to send message");
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const email = siteData?.email || "dmardin@gmail.com";
  const github = siteData?.github || "https://github.com/Dareean";
  const linkedin = siteData?.linkedin || "https://www.linkedin.com/in/dareean-ahmad-raffi-mardin-72247a229/";
  const instagram = siteData?.instagram || "https://instagram.com/darenrafi";

  const socialLinks = [
    { name: "GitHub", url: github, icon: <Github className="w-5 h-5" /> },
    { name: "LinkedIn", url: linkedin, icon: <Linkedin className="w-5 h-5" /> },
    { name: "Email", url: `mailto:${email}`, icon: <Mail className="w-5 h-5" /> },
    { name: "Instagram", url: instagram, icon: <Instagram className="w-5 h-5" /> },
  ];

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-canvas">
      {!(deviceInfo.isLowEnd || deviceInfo.prefersReducedMotion) && <AnimatedBackground />}
      <TopNav />

      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        className="fixed top-20 left-6 md:left-8 z-50"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-steel hover:text-charcoal transition-colors group">
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="text-body-sm-medium tracking-wide uppercase">Back</span>
        </Link>
      </motion.div>

      <div className="relative z-10 px-6 md:px-8 pt-24 md:pt-32 pb-20">
        {/* Hero Section */}
        <motion.div className="max-w-container mx-auto mb-16 md:mb-20" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <span className="w-8 h-px bg-primary/40" />
              <span className="text-micro-uppercase text-primary font-semibold tracking-wider">Get In Touch</span>
              <span className="w-8 h-px bg-primary/40" />
            </motion.div>

            <h1 className="text-heading-1 md:text-display-lg text-charcoal font-semibold mb-4 leading-tight">
              Let&apos;s Create<br />
              <span className="text-steel">Something Great</span>
            </h1>

            <p className="text-body-md text-slate leading-relaxed max-w-xl mx-auto">
              Have a project in mind or just want to connect? I&apos;m always open to discussing new opportunities.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Contact Form */}
            <motion.div className="lg:col-span-7" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              {isSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                  className="relative h-full min-h-[500px] bg-canvas border border-hairline rounded-lg p-12 flex flex-col items-center justify-center shadow-elevation-1"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }} className="flex flex-col items-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-heading-4 text-charcoal font-semibold mb-3 text-center">Message Sent!</h3>
                    <p className="text-body-sm text-slate text-center mb-8 max-w-md">
                      Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                    </p>
                    <button onClick={() => setIsSubmitted(false)}
                      className="inline-flex items-center gap-2 px-[18px] py-[10px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200"
                    >
                      <Mail className="w-4 h-4" />
                      Send Another Message
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}
                  className="h-full bg-canvas border border-hairline rounded-lg p-8 md:p-10 shadow-elevation-1"
                >
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-md bg-semantic-error/10 border border-semantic-error/30 text-semantic-error text-body-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-caption-bold text-charcoal mb-2 uppercase tracking-wider">Your Name</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full h-[44px] px-4 bg-canvas border border-hairline-strong rounded-md text-ink placeholder:text-stone/50 focus:outline-none focus:border-primary focus:border-2 transition-all duration-150"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-caption-bold text-charcoal mb-2 uppercase tracking-wider">Email Address</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full h-[44px] px-4 bg-canvas border border-hairline-strong rounded-md text-ink placeholder:text-stone/50 focus:outline-none focus:border-primary focus:border-2 transition-all duration-150"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-caption-bold text-charcoal mb-2 uppercase tracking-wider">Subject</label>
                      <div className="relative">
                        <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required
                          className="w-full h-[44px] px-4 bg-canvas border border-hairline-strong rounded-md text-ink focus:outline-none focus:border-primary focus:border-2 transition-all duration-150 appearance-none cursor-pointer"
                        >
                          <option value="">Select a topic</option>
                          <option value="collaboration">Project Collaboration</option>
                          <option value="freelance">Freelance Work</option>
                          <option value="job">Job Opportunity</option>
                          <option value="general">General Inquiry</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-caption-bold text-charcoal mb-2 uppercase tracking-wider">Message</label>
                      <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6}
                        className="w-full p-4 bg-canvas border border-hairline-strong rounded-md text-ink placeholder:text-stone/50 focus:outline-none focus:border-primary focus:border-2 transition-all duration-150 resize-none"
                        placeholder="Tell me about your project or just say hi..."
                      />
                    </div>

                    <button type="submit" disabled={isSubmitting}
                      className="w-full h-[44px] bg-primary text-on-primary text-button-md font-medium rounded-md hover:bg-primary-pressed transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Right Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              {/* Quick Info - Styled as card-base */}
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-canvas border border-hairline rounded-lg p-6 space-y-6 shadow-elevation-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-caption-bold text-charcoal mb-0.5">Location</p>
                    <p className="text-body-sm text-slate">Palu, Central Sulawesi, Indonesia</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-caption-bold text-charcoal mb-0.5">Availability</p>
                    <p className="text-body-sm text-slate">Open for freelance & collaborations</p>
                  </div>
                </div>
              </motion.div>

              {/* Social Links - Styled as card-base */}
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-canvas border border-hairline rounded-lg p-6 shadow-elevation-1"
              >
                <h3 className="text-heading-5 text-charcoal font-semibold mb-5">
                  Connect With Me
                </h3>
                <div className="space-y-2">
                  {socialLinks.map((social, index) => (
                    <motion.a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3 px-4 py-3 bg-canvas border border-hairline rounded-md text-charcoal hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-200 group"
                    >
                      {social.icon}
                      <span className="text-body-sm-medium">{social.name}</span>
                      <Send className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
