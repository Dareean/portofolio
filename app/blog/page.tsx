import { Metadata } from "next";
import { getCMSData } from "@/lib/cms";
import Footer from "@/components/Footer";
import BlogClientView from "./BlogClientView";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights · Dareean Ahmad Raffi",
  description: "Featured insights, personal stories, daily life logs, and software engineering reflections by Dareean Ahmad Raffi in Palu, Central Sulawesi.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const cmsData = await getCMSData();

  return (
    <main className="min-h-screen bg-canvas text-charcoal pt-28 md:pt-32 pb-20 px-4 sm:px-6 md:px-8 relative overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* ── Main Blog Client View (Header, Filter Pills, and 3-Column Card Grid) ── */}
        <BlogClientView cmsData={cmsData} />

        {/* ── Bottom Section: "Reach Out Today" (Reference Style) ── */}
        <section className="rounded-3xl bg-surface-soft/50 border border-hairline p-8 sm:p-12 md:p-14 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-surface border border-hairline text-[11px] font-mono uppercase tracking-wider text-steel shadow-xs">
                Contact Us
              </div>

              <h2 className="text-heading-2 md:text-display-sm font-semibold text-charcoal tracking-tight">
                Reach Out Today
              </h2>

              <p className="text-body-md text-slate leading-relaxed font-light">
                Punya pertanyaan, ide kolaborasi proyek, atau ingin mengundang untuk mentoring komunitas teknologi di Palu? Saya selalu terbuka untuk berdiskusi.
              </p>

              <div className="pt-4 space-y-2 text-body-sm font-mono">
                <div>
                  <span className="text-steel block text-micro uppercase">Email</span>
                  <a
                    href={`mailto:${cmsData.site.email || "dareean.business@gmail.com"}`}
                    className="text-charcoal hover:text-[#4F46E5] font-semibold transition-colors"
                  >
                    {cmsData.site.email || "dareean.business@gmail.com"}
                  </a>
                </div>

                <div className="pt-2">
                  <span className="text-steel block text-micro uppercase">Location</span>
                  <span className="text-charcoal">Palu, Central Sulawesi, Indonesia</span>
                </div>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-6 rounded-2xl bg-surface border border-hairline p-6 sm:p-8 space-y-4 shadow-elevation-1">
              <h3 className="font-semibold text-charcoal text-body-md">
                Let&apos;s Build Something Impactful
              </h3>

              <p className="text-body-sm text-slate font-light leading-relaxed">
                Kirim pesan langsung atau hubungi melalui LinkedIn untuk mendiskusikan arsitektur web modern, sistem geospasial, atau konsultasi teknis.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-mono font-medium transition-colors shadow-xs"
                >
                  <Mail size={14} />
                  <span>Kirim Pesan / Form</span>
                </Link>

                <Link
                  href={cmsData.site.linkedin || "https://linkedin.com/in/dareean"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-surface-soft hover:bg-surface border border-hairline text-charcoal text-xs font-mono font-medium transition-colors"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-28">
        <Footer siteData={cmsData.site} />
      </div>
    </main>
  );
}
