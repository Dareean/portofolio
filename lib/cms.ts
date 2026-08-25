import fs from "fs";
import path from "path";

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
  category: "work" | "education" | "award" | "community" | "volunteer" | "committee";
  image?: string;
}

export interface SiteConfig {
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  footerNote: string;
}

export interface PortfolioCMSData {
  hero: HeroConfig;
  narrative: NarrativeConfig;
  about: AboutConfig;
  projects: CMSProject[];
  stories: CMSStory[];
  experiences: CMSExperience[];
  site: SiteConfig;
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "portfolio_cms.json");

/**
 * Reads CMS data from local file system (Server-side)
 */
export function getCMSData(): PortfolioCMSData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(fileContent) as PortfolioCMSData;
    }
  } catch (error) {
    console.error("Error reading CMS data from file:", error);
  }

  // Fallback default structure
  return {
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
    experiences: [],
    site: {
      email: "dareean.business@gmail.com",
      github: "https://github.com/Dareean",
      linkedin: "https://linkedin.com/in/dareean",
      instagram: "https://instagram.com/dareean",
      footerNote: "Bringing stories to life, one pixel at a time. Based in Palu, Central Sulawesi.",
    },
  };
}

/**
 * Saves updated CMS data atomically to file system (Server-side)
 */
export function saveCMSData(data: PortfolioCMSData): boolean {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving CMS data to file:", error);
    return false;
  }
}
