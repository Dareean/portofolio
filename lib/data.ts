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

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Building My First Mobile App",
    excerpt: "A journey through the development process of SOROT, from concept to launch.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    image: "/images/blog-mobile-app.jpg",
    date: "2025-01-10",
    category: "Development",
  },
  {
    id: 2,
    title: "UI/UX Design Principles I Live By",
    excerpt: "The core design philosophies that shape every project I work on.",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    image: "/images/blog-design.jpg",
    date: "2025-01-05",
    category: "Design",
  },
  {
    id: 3,
    title: "My Daily Routine as a Developer",
    excerpt: "How I structure my day for maximum productivity and creativity.",
    content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
    image: "/images/blog-routine.jpg",
    date: "2024-12-28",
    category: "Lifestyle",
  },
];
