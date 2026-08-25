import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Control Plane · Dareean Portfolio",
  description: "Dynamic content management system for Dareean portfolio landing page and subpages.",
};

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-canvas text-charcoal">{children}</div>;
}
