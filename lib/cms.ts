import fs from "fs";
import path from "path";
import { isSupabaseConfigured, getServiceSupabase, STORAGE_BUCKET } from "@/lib/supabase";

export interface HeroPillar {
  id: string;
  num: string;
  title: string;
  icon: string;
  tags: string;
  desc: string;
}

export interface HeroConfig {
  badge: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineAccent: string;
  subtitle: string;
  ctaWorkText: string;
  ctaJourneyText: string;
  pillars: HeroPillar[];
}

export interface NarrativeConfig {
  tag: string;
  statement: string;
}

export interface TechItem {
  name: string;
  category: string;
}

export interface CommunityRole {
  org: string;
  role: string;
}

export interface AboutConfig {
  portraitImage: string;
  fullName: string;
  roleTag: string;
  locationText: string;
  philosophyHeading: string;
  philosophyBio: string;
  resumeUrl: string;
  statusTag: string;
  timeZone: string;
  communityRoles: CommunityRole[];
  techStack: TechItem[];
}

export interface CMSProject {
  id: number;
  title: string;
  slug: string;
  category: string;
  year: number;
  image: string;
  link: string;
  featured: boolean;
  description: string;
  technologies: string[];
  metrics?: { label: string; value: string }[];
}

export interface CMSStory {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  link: string;
}

export interface CMSExperience {
  id: number;
  title: string;
  role: string;
  organization: string;
  dateStart: string;
  dateEnd?: string;
  description: string;
  highlights: string[];
  category: "work" | "internship" | "education" | "award" | "community" | "volunteer" | "committee";
  image?: string;
}

export interface SiteConfig {
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  footerNote: string;
}

export interface CMSBlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  category: "Daily Life" | "Achievement" | "Thoughts" | "Tech";
  excerpt: string;
  content: string;
  coverImage?: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export interface PortfolioCMSData {
  hero: HeroConfig;
  narrative: NarrativeConfig;
  about: AboutConfig;
  projects: CMSProject[];
  stories: CMSStory[];
  blogs: CMSBlogPost[];
  experiences: CMSExperience[];
  site: SiteConfig;
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio_cms.json");

export const DEFAULT_CMS_DATA: PortfolioCMSData = {
  hero: {
    badge: "Portfolio & Craft",
    headlineLine1: "FROM PIXEL",
    headlineLine2: "TO",
    headlineAccent: "PEOPLE.",
    subtitle: "Bridging technical execution with human impact — focusing on scalable web systems, geospatial tools, and developer communities.",
    ctaWorkText: "Explore Selected Work",
    ctaJourneyText: "Read My Journey",
    pillars: [
      {
        id: "fullstack",
        num: "01",
        title: "Full-Stack Systems",
        icon: "Layers",
        tags: "React · Next.js · TypeScript · API",
        desc: "Engineering high-performance web platforms and scalable backends with modular, resilient architecture.",
      },
      {
        id: "geospatial",
        num: "02",
        title: "Geospatial & IoT",
        icon: "Compass",
        tags: "QGIS · Spatial Data · Telemetry",
        desc: "Merging real-world sensors, automated mapping, and interactive dashboards to solve tangible environmental problems.",
      },
      {
        id: "community",
        num: "03",
        title: "Community & Leadership",
        icon: "Users",
        tags: "Mentorship · Tadulako · I-Fest",
        desc: "Leading tech initiatives and mentoring developer communities across Central Sulawesi to empower the next generation.",
      },
    ],
  },
  narrative: {
    tag: "Narrative & Ethos",
    statement: "I see code not just as syntax, but as a bridge between ideas and human reality. My journey is defined by a relentless curiosity — from building scalable software platforms to nurturing tech communities in Central Sulawesi. From pixel to people.",
  },
  about: {
    portraitImage: "/assets/foto_closeup.jpg",
    fullName: "Dareean Ahmad Raffi",
    roleTag: "Full-Stack & UI/UX",
    locationText: "Palu, Central Sulawesi · 0°53' S",
    philosophyHeading: "From pixel to people — turning complex engineering into human-centered software.",
    philosophyBio: "I see code not merely as syntax, but as a bridge between ideas and reality. Based in Central Sulawesi, I combine formal computer science fundamentals with hands-on product craft.",
    resumeUrl: "/assets/CV-Rafi(English).pdf",
    statusTag: "Remote Ready",
    timeZone: "Asia/Makassar",
    communityRoles: [
      { org: "Programming Tadulako", role: "Mentor Lead" },
      { org: "I-Fest 2026", role: "PIC" },
    ],
    techStack: [
      { name: "Next.js 14", category: "Framework" },
      { name: "TypeScript", category: "Language" },
      { name: "React 19", category: "Library" },
      { name: "Tailwind CSS", category: "Styling" },
      { name: "Node.js", category: "Backend" },
      { name: "Prisma ORM", category: "Database" },
      { name: "QGIS", category: "Spatial" },
      { name: "Figma", category: "Design" },
      { name: "Python", category: "Language" },
      { name: "IoT / ESP32", category: "Hardware" },
    ],
  },
  projects: [],
  stories: [],
  blogs: [],
  experiences: [],
  site: {
    email: "dareean.business@gmail.com",
    github: "https://github.com/Dareean",
    linkedin: "https://linkedin.com/in/dareean",
    instagram: "https://instagram.com/dareean",
    footerNote: "Bringing stories to life, one pixel at a time. Based in Palu, Central Sulawesi.",
  },
};

/**
 * Reads CMS data from local file system synchronously (Local Fallback)
 */
export function getCMSDataSync(): PortfolioCMSData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(fileContent) as PortfolioCMSData;
    }
  } catch (error) {
    console.error("Error reading CMS data from local file:", error);
  }

  return DEFAULT_CMS_DATA;
}

/**
 * Reads CMS data asynchronously from Supabase Storage (Cloud) with fallback to local file system
 */
export async function getCMSData(): Promise<PortfolioCMSData> {
  // 1. If Supabase is configured, fetch latest data from cloud bucket
  if (isSupabaseConfigured()) {
    try {
      const client = getServiceSupabase();
      if (client) {
        const { data, error } = await client.storage
          .from(STORAGE_BUCKET)
          .download("cms/portfolio_cms.json");

        if (!error && data) {
          const text = await data.text();
          return JSON.parse(text) as PortfolioCMSData;
        }
      }
    } catch (err) {
      console.warn("Supabase CMS fetch error, falling back to local file:", err);
    }
  }

  // 2. Fallback to local file
  return getCMSDataSync();
}

/**
 * Saves updated CMS data atomically to Supabase Storage (Cloud) and file system
 */
export async function saveCMSData(
  data: PortfolioCMSData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data || typeof data !== "object") {
      return { success: false, error: "Invalid CMS data structure" };
    }

    const jsonString = JSON.stringify(data, null, 2);
    let supabaseSaved = false;

    // 1. Save to Supabase Storage (Persistent across serverless / Vercel deployments)
    if (isSupabaseConfigured()) {
      try {
        const client = getServiceSupabase();
        if (client) {
          const { error: uploadError } = await client.storage
            .from(STORAGE_BUCKET)
            .upload("cms/portfolio_cms.json", Buffer.from(jsonString), {
              contentType: "application/json",
              upsert: true,
            });

          if (!uploadError) {
            supabaseSaved = true;
          } else {
            console.warn("Supabase Storage save warning:", uploadError.message);
          }
        }
      } catch (err) {
        console.warn("Supabase storage save exception:", err);
      }
    }

    // 2. Save to local filesystem if writable (local dev environment)
    let localSaved = false;
    try {
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const tempPath = `${DATA_FILE_PATH}.tmp.${Date.now()}`;
          fs.writeFileSync(tempPath, jsonString, "utf-8");

          try {
            fs.renameSync(tempPath, DATA_FILE_PATH);
          } catch {
            fs.writeFileSync(DATA_FILE_PATH, jsonString, "utf-8");
            if (fs.existsSync(tempPath)) {
              try {
                fs.unlinkSync(tempPath);
              } catch {}
            }
          }

          localSaved = true;
          break;
        } catch {
          const start = Date.now();
          while (Date.now() - start < 50 * attempt) {}
        }
      }
    } catch (fsErr: any) {
      // In serverless deployment (EROFS: read-only file system), ignore if Supabase succeeded
      if (fsErr?.code !== "EROFS" && !supabaseSaved) {
        console.warn("Filesystem save warning:", fsErr);
      }
    }

    if (supabaseSaved || localSaved) {
      return { success: true };
    }

    return {
      success: false,
      error: "Failed to persist CMS data: Read-only serverless filesystem and Supabase was unreachable.",
    };
  } catch (error: any) {
    console.error("Error saving CMS data:", error);
    return { success: false, error: error?.message || "Failed to persist data" };
  }
}
