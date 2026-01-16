export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description?: string;
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "SOROT",
    category: "Mobile App",
    year: "2025",
    image: "/images/placeholder-sorot.jpg",
    description: "A photography app that captures moments with intelligent filters and AI-powered editing.",
    featured: true,
  },
  {
    id: 2,
    title: "NEXUS",
    category: "Web Platform",
    year: "2024",
    image: "/images/placeholder-nexus.jpg",
    description: "Collaborative workspace platform connecting remote teams across the globe.",
    featured: true,
  },
  {
    id: 3,
    title: "PULSE",
    category: "Dashboard",
    year: "2024",
    image: "/images/placeholder-pulse.jpg",
    description: "Real-time analytics dashboard for monitoring business metrics and KPIs.",
    featured: true,
  },
  {
    id: 4,
    title: "ECHO",
    category: "Mobile App",
    year: "2024",
    image: "/images/placeholder-echo.jpg",
    description: "Voice-first social media platform for authentic audio conversations.",
    featured: false,
  },
  {
    id: 5,
    title: "ORBIT",
    category: "Web App",
    year: "2023",
    image: "/images/placeholder-orbit.jpg",
    description: "Project management tool with AI-powered task prioritization.",
    featured: false,
  },
  {
    id: 6,
    title: "FLOW",
    category: "Design System",
    year: "2023",
    image: "/images/placeholder-flow.jpg",
    description: "Comprehensive design system for scalable enterprise applications.",
    featured: false,
  },
  {
    id: 7,
    title: "SPARK",
    category: "E-Commerce",
    year: "2023",
    image: "/images/placeholder-spark.jpg",
    description: "Modern e-commerce platform with seamless checkout experience.",
    featured: false,
  },
  {
    id: 8,
    title: "PRISM",
    category: "Data Visualization",
    year: "2022",
    image: "/images/placeholder-prism.jpg",
    description: "Interactive data visualization tool for complex datasets.",
    featured: false,
  },
];

export const ABOUT_TEXT =
  "Logic meets Aesthetics. I build digital experiences that are as functional as they are beautiful.";

export interface JourneyItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "milestone" | "project" | "education" | "award" | "experience";
  image?: string;
}

export const JOURNEY_ITEMS: JourneyItem[] = [
  {
    id: 1,
    title: "Started My Development Journey",
    description: "Began learning web development, exploring HTML, CSS, and JavaScript fundamentals.",
    date: "2020-01",
    type: "milestone",
  },
  {
    id: 2,
    title: "First Freelance Project",
    description: "Completed my first paid project - a website for a local business.",
    date: "2021-03",
    type: "project",
  },
  {
    id: 3,
    title: "Learned React & Next.js",
    description: "Deep dive into modern frontend frameworks and built several applications.",
    date: "2021-08",
    type: "education",
  },
  {
    id: 4,
    title: "Joined Tech Startup",
    description: "Started working as a Full Stack Developer, building products from scratch.",
    date: "2022-02",
    type: "experience",
  },
  {
    id: 5,
    title: "Launched PRISM",
    description: "Released my first major side project - a data visualization tool.",
    date: "2022-09",
    type: "project",
  },
  {
    id: 6,
    title: "UI/UX Certification",
    description: "Completed professional certification in User Interface and Experience Design.",
    date: "2023-04",
    type: "education",
  },
  {
    id: 7,
    title: "Best Developer Award",
    description: "Recognized for outstanding contributions and innovative solutions.",
    date: "2023-11",
    type: "award",
  },
  {
    id: 8,
    title: "Launched SOROT",
    description: "Released a photography app with AI-powered editing features.",
    date: "2025-01",
    type: "project",
  },
];
