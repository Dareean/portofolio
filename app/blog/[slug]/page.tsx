import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCMSData, CMSBlogPost } from "@/lib/cms";
import Footer from "@/components/Footer";
import ArticleReaderClient from "./ArticleReaderClient";

interface BlogSlugProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogSlugProps): Promise<Metadata> {
  const cmsData = getCMSData();
  const blog = (cmsData.blogs || []).find((b) => b.slug === params.slug);

  if (!blog) {
    return {
      title: "Post Not Found · Dareean Portfolio",
    };
  }

  return {
    title: `${blog.title} · Dareean's Journal`,
    description: blog.excerpt,
    openGraph: {
      title: `${blog.title} · Dareean's Journal`,
      description: blog.excerpt,
      images: blog.coverImage ? [{ url: blog.coverImage }] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default function SingleBlogPostPage({ params }: BlogSlugProps) {
  const cmsData = getCMSData();
  const blogs = cmsData.blogs || [];
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) {
    notFound();
  }

  // Related posts (excluding current post)
  const relatedPosts = blogs.filter((b) => b.id !== blog.id).slice(0, 2);

  return (
    <main className="min-h-screen bg-canvas text-charcoal pt-28 md:pt-32 pb-20 px-6 md:px-8 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-24 left-1/3 w-[500px] h-[500px] bg-primary/[0.025] rounded-full blur-3xl pointer-events-none -z-10" />

      <ArticleReaderClient
        blog={blog}
        cmsData={cmsData}
        relatedPosts={relatedPosts}
      />

      <div className="mt-28">
        <Footer />
      </div>
    </main>
  );
}
