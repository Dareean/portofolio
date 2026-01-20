export interface Project {
  id: number;
  title: string;
  category: string | string[];  // Can be single or multiple categories
  year: string;
  image: string;
  description?: string;
  featured?: boolean;
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Medicflow - Medical Record Submission",
    link: "https://github.com/Dareean/Medical-Record",
    category: "Web Platform",
    year: "2025",
    image: "/assets/medicflow-showcase2.png",
    description: "Medicflow is a comprehensive medical record platform designed to streamline clinical workflows and facilitate interaction between patients and doctors. It allows users to effortlessly handle patient records, history, and appointments in one place, reducing paperwork and increasing time for patient care.",
    featured: true,
  },
  {
    id: 2,
    title: "Sorot - Geospatial Environmental Reporting Platform",
    link: "https://github.com/Dareean/sorot_app",
    category: ["Mobile App", "Web Platform"],
    year: "2025",
    image: "/assets/sorot-dummy_showcase.png",
    description: "Developed a comprehensive prototype geospatial reporting system enabling citizens to report environmental issues with automatic GPS mapping. The platform features real-time monitoring through QGIS integration and a responsive admin dashboard for efficient issue management.",
    featured: true,
  },
  {
    id: 3,
    title: "JasaKita Application - Services Platform for Migrants",
    link: "https://www.figma.com/proto/JwXmVMkU9HF5rSb8mN9b68/JasaKita?node-id=768-1763&p=f&t=WFD7f1ilxwpXzMR2-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=768%3A1656&show-proto-sidebar=1",
    category: ["UI/UX Design", "Mobile App", "Tournament"],
    year: "2025",
    image: "/assets/jasakita_showcase.png",
    description: "A solution designed for migrants in Palu City who experience difficulty finding trusted local service providers.",
    featured: true,
  },
  {
    id: 4,
    title: "Guard Riders - Smart Helmet",
    link: "https://guardriders.com",
    category: "Tournament",
    year: "2025",
    image: "/assets/rsict_2025.jpeg",
    description: "Joined the 'Guard Riders' team to tackle road safety challenges. We designed a multifunctional smart helmet aimed at reducing accident rates by preventing their primary causes.",
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
  type: "milestone" | "project" | "education" | "award" | "experience" | "community";
  image?: string;
}

export const JOURNEY_ITEMS: JourneyItem[] = [
  {
    id: 1,
    title: "Started My Development Journey",
    description: "Began learning web development, exploring HTML, CSS, and JavaScript fundamentals.",
    date: "2021-06",
    type: "milestone",
  },
  {
    id: 2,
    title: "First Internship",
    description: "Completed my first internship at PT. Educa Studio as a web programmer",
    date: "2023-07",
    type: "experience",
  },
  {
    id: 3,
    title: "Teaching Factory Program Trainee",
    description: "Assigned to follow Teaching Factory Program at PT. Educa Studio, Gamelab Indonesia as a web programmer",
    date: "2023-09",
    type: "experience",
  },
  {
    id: 4,
    title: "Started my first year at university",
    description: "Started my first year at university, majoring in Informatics.",
    date: "2024-08",
    type: "education",
  },
  {
    id: 5,
    title: "First attempt on competing as a team",
    description: "Competing in a campus level competition on UI/UX Design category",
    date: "2025-01",
    type: "award",
  },
  {
    id: 6,
    title: "Programming Tadulako",
    description: "Joined a community based on programming to enhance my programming skills",
    date: "2025-03",
    type: "community",
  },
  {
    id: 7,
    title: "Green Generation Central Sulawesi",
    description: "Participated in a green community program to raise awareness about environmental issues",
    date: "2025-01",
    type: "community",
  },
  {
    id: 8,
    title: "Innovation in Road Safety: Smart Helmet Project (Guard Riders)",
    description: "Collaborated on the design of a smart helmet to enhance road safety; advanced to the competition finals",
    date: "2025-07",
    type: "award",
  },
];

export interface Story {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: "travel" | "life" | "tech" | "creative";
  images: string[];
  content?: string;
}

export const STORIES: Story[] = [
  {
    id: 1,
    title: "Weekend in Bali",
    excerpt: "Exploring the hidden temples and rice terraces of Ubud. A journey through ancient traditions and breathtaking landscapes.",
    date: "2025-01-10",
    category: "travel",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800",
    ],
    content: "Ubud is a place where time seems to slow down. From the emerald green rice terraces of Tegalalang to the sacred Monkey Forest, every corner of this town tells a story of culture and spirituality. During my weekend here, I explored ancient temples, tasted authentic Balinese cuisine, and witnessed traditional dance performances that have been preserved for generations."
  },
  {
    id: 2,
    title: "My Home Office Setup",
    excerpt: "After months of iteration, I finally achieved the perfect workspace. Here's the story behind every decision.",
    date: "2024-12-15",
    category: "life",
    images: [
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800",
      "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=800",
      "https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=800",
    ],
    content: "Creating a productive workspace is an art. It's not just about buying expensive gear, but about understanding your workflow. I chose a minimalist setup with a focus on ergonomics and lighting. The standing desk allows me to stay active, while the ambient lighting creates a focused atmosphere for late-night coding sessions."
  },
  {
    id: 3,
    title: "Building SOROT",
    excerpt: "The challenges and learnings from developing an AI-powered photography app from scratch.",
    date: "2024-11-20",
    category: "tech",
    images: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800",
    ],
    content: "Building SOROT was a journey of discovery. We started with a simple idea: how can we make photography more accessible? The answer lay in AI. By integrating advanced machine learning models, we were able to create an app that understands the scene and suggests the best settings. The road wasn't easy, but the result was worth it."
  },
  {
    id: 4,
    title: "Tokyo at Night",
    excerpt: "Neon lights, quiet alleys, and the electric energy of Shibuya. A visual diary of my first trip to Japan.",
    date: "2024-10-05",
    category: "travel",
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800",
    ],
    content: "Tokyo is a city of contrasts. The quiet discipline of the tea ceremony coexists with the chaotic energy of Shibuya Crossing. My nights in Tokyo were filled with neon lights, delicious street food, and endless exploration. Each alleyway revealed a new secret, a new perspective on this futuristic yet deeply traditional metropolis."
  },
  {
    id: 5,
    title: "Design System Deep Dive",
    excerpt: "Lessons learned building a scalable design system for enterprise applications.",
    date: "2024-08-12",
    category: "creative",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800",
    ],
    content: "Design systems are the backbone of consistent user experiences. In this deep dive, I share my process for creating a scalable system that serves both designers and developers. From tokenizing colors to building atomic components, I cover the strategies that ensure your design system grows with your product."
  },
];

