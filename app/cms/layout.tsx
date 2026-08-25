import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Studio · Dareean Portfolio",
  description: "Editorial content management system for Dareean portfolio.",
};

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#4F46E5]/15 selection:text-[#0F172A]">
      {children}
    </div>
  );
}
