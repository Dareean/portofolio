export interface Project {
  id: number;
  title: string;
  category: string | string[]; // Can be single or multiple categories
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
    description:
      "Medicflow is a comprehensive medical record platform designed to streamline clinical workflows and facilitate interaction between patients and doctors. It allows users to effortlessly handle patient records, history, and appointments in one place, reducing paperwork and increasing time for patient care.",
    featured: true,
  },
  {
    id: 2,
    title: "Sorot - Geospatial Environmental Reporting Platform",
    link: "https://github.com/Dareean/sorot_app",
    category: ["Mobile App", "Web Platform"],
    year: "2025",
    image: "/assets/sorot-dummy_showcase.png",
    description:
      "Developed a comprehensive prototype geospatial reporting system enabling citizens to report environmental issues with automatic GPS mapping. The platform features real-time monitoring through QGIS integration and a responsive admin dashboard for efficient issue management.",
    featured: false,
  },
  {
    id: 3,
    title: "JasaKita Application - Services Platform for Migrants",
    link: "https://www.figma.com/proto/JwXmVMkU9HF5rSb8mN9b68/JasaKita?node-id=768-1763&p=f&t=WFD7f1ilxwpXzMR2-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=768%3A1656&show-proto-sidebar=1",
    category: ["UI/UX Design", "Mobile App", "Tournament"],
    year: "2025",
    image: "/assets/jasakita_showcase.png",
    description:
      "A solution designed for migrants in Palu City who experience difficulty finding trusted local service providers.",
    featured: true,
  },
  {
    id: 4,
    title: "Guard Riders - Smart Helmet",
    link: "https://guardriders.com",
    category: "Tournament",
    year: "2025",
    image: "/assets/rsict_2025.jpeg",
    description:
      "Joined the 'Guard Riders' team to tackle road safety challenges. We designed a multifunctional smart helmet aimed at reducing accident rates by preventing their primary causes.",
    featured: false,
  },
  {
    id: 5,
    title: "DreamPOS - Inventory Management System",
    link: "https://github.com/Dareean/dreampos",
    category: "Web Platform",
    year: "2024",
    image: "/assets/dreampos_showcase.jpeg",
    description:
      "A comprehensive web-based inventory management system designed to efficiently manage stock, products, brands, and categories. Features include product management with image upload, multi-level category organization, role-based access control (Admin/User), automatic barcode generation, Excel export functionality, and tax rate management. Built with PHP, MySQL, Bootstrap, and integrated with PHPMailer for email notifications and PHPSpreadsheet for data export. Perfect for retail stores, warehouses, and businesses needing organized inventory tracking.",
    featured: true,
  },
  {
    id: 6,
    title: "Digital Library - React Dashboard",
    link: "digital-libray.vercel.app",
    category: "Web Platform",
    year: "2024",
    image: "/assets/digital_library.jpeg",
    description:
      "Modern digital library system built as a Single-Page Application with React and Vite. Features comprehensive book management with CRUD operations, integration with external APIs (Open Library & Gutendex), role-based authentication (Admin/User), book request system, reading history tracking, and dark mode support. Includes search & filter functionality, responsive design, and Swagger API documentation. Built with React 19, Node.js, Express, and Tailwind CSS for a seamless user experience.",
    featured: false,
  },
  {
    id: 7,
    title: "Employee Management System",
    link: "https://sistem-manajemen-karyawan-seven.vercel.app/",
    category: "Web Platform",
    year: "2024",
    image: "/assets/sistem-manajemen-karyawan.png",
    description:
      "Full-stack HR management application with automated payroll system. Features include employee CRUD operations, real-time attendance tracking with check-in/check-out, automated salary calculations based on work hours and overtime, role-based dashboards (Admin/Employee), analytics with weekly attendance charts, and JWT authentication. Built with Node.js 20, Express 5, React 19, Prisma ORM, SQLite database, and Tailwind CSS. Perfect for small to medium companies needing centralized HR operations.",
    featured: false,
  },
  {
    id: 8,
    title: "Batik Heritage - Cultural Showcase Website",
    link: "projekmagang.vercel.app",
    category: "Web Platform",
    year: "2024",
    image: "/assets/batik_web.jpeg",
    description:
      "Landing page showcase for Indonesian batik collection with focus on cultural education and product promotion. Features include hero section with regional batik highlights (Solo, Yogyakarta, Cirebon, Pekalongan), comprehensive history section, product gallery organized by origin, smooth scroll navigation, contact form, FAQ section, and customer testimonials. Built with HTML5, SCSS modular architecture, Bootstrap 5, AOS animations, and responsive design for optimal viewing across all devices. Completed during internship program.",
    featured: false,
  },
];

export const ABOUT_TEXT =
  "Bringing stories to life, one pixel at a time. I build digital experiences that are as functional as they are beautiful.";

export interface JourneyItem {
  id: number;
  title: string;
  description: string;
  date: string;
  type:
    | "milestone"
    | "project"
    | "education"
    | "award"
    | "experience"
    | "community";
  image?: string;
}

export const JOURNEY_ITEMS: JourneyItem[] = [
  {
    id: 1,
    title: "Started My Development Journey",
    description:
      "Began learning web development, exploring HTML, CSS, and JavaScript fundamentals.",
    date: "2021-06",
    type: "milestone",
  },
  {
    id: 2,
    title: "First Internship",
    description:
      "Completed my first internship at PT. Educa Studio as a web programmer",
    date: "2023-07",
    type: "experience",
  },
  {
    id: 3,
    title: "Teaching Factory Program Trainee",
    description:
      "Assigned to follow Teaching Factory Program at PT. Educa Studio, Gamelab Indonesia as a web programmer",
    date: "2023-09",
    type: "experience",
  },
  {
    id: 4,
    title: "Started my first year at university",
    description:
      "Started my first year at university, majoring in Informatics.",
    date: "2024-08",
    type: "education",
  },
  {
    id: 5,
    title: "First attempt on competing as a team",
    description:
      "Competing in a campus level competition on UI/UX Design category",
    date: "2025-01",
    type: "award",
  },
  {
    id: 6,
    title: "Programming Tadulako",
    description:
      "Joined a community based on programming to enhance my programming skills",
    date: "2025-03",
    type: "community",
  },
  {
    id: 7,
    title: "Green Generation Central Sulawesi",
    description:
      "Participated in a green community program to raise awareness about environmental issues",
    date: "2025-01",
    type: "community",
  },
  {
    id: 8,
    title: "Innovation in Road Safety: Smart Helmet Project (Guard Riders)",
    description:
      "Collaborated on the design of a smart helmet to enhance road safety; advanced to the competition finals",
    date: "2025-07",
    type: "award",
  },
];

// Experience data for scrollytelling page
export interface Experience {
  id: number;
  title: string;
  role: string;
  organization: string;
  dateStart: string;
  dateEnd?: string; // undefined means "Present"
  description: string;
  highlights?: string[];
  category:
    | "education"
    | "work"
    | "award"
    | "community"
    | "volunteer"
    | "committee";
  image?: string;
}

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    title: "Started My Development Journey",
    role: "Self-taught Developer",
    organization: "Personal Learning",
    dateStart: "2021-06",
    dateEnd: "2023-06",
    description:
      "Began learning web development, exploring HTML, CSS, and JavaScript fundamentals. Built small projects to solidify understanding.",
    highlights: ["HTML/CSS", "JavaScript", "Responsive Design"],
    category: "education",
  },
  {
    id: 2,
    title: "Web Programmer Internship",
    role: "Web Programmer Intern",
    organization: "PT. Educa Studio",
    dateStart: "2023-07",
    dateEnd: "2023-09",
    description:
      "Completed my first internship focusing on web development. Gained hands-on experience with real-world projects and professional workflows.",
    highlights: [
      "Professional Development",
      "Team Collaboration",
      "Web Development",
    ],
    category: "work",
  },
  {
    id: 3,
    title: "Teaching Factory Program",
    role: "Web Programmer Trainee",
    organization: "Gamelab Indonesia",
    dateStart: "2023-09",
    dateEnd: "2024-06",
    description:
      "Assigned to follow Teaching Factory Program at PT. Educa Studio, Gamelab Indonesia. Developed production-ready web applications.",
    highlights: [
      "Production Environment",
      "Industry Standards",
      "Full-Stack Development",
    ],
    category: "work",
  },
  {
    id: 4,
    title: "Started University",
    role: "Informatics Student",
    organization: "University",
    dateStart: "2024-08",
    description:
      "Began my bachelor's degree in Informatics, combining formal education with practical development experience.",
    highlights: ["Computer Science", "Software Engineering", "Algorithms"],
    category: "education",
  },
  {
    id: 5,
    title: "UI/UX Design Competition",
    role: "UI/UX Designer",
    organization: "Campus Level Competition",
    dateStart: "2025-01",
    dateEnd: "2025-01",
    description:
      "First attempt competing as a team in a campus-level UI/UX Design competition. Developed innovative solutions for user experience challenges.",
    highlights: ["User Research", "Interface Design", "Prototyping"],
    category: "award",
  },
  {
    id: 6,
    title: "Programming Tadulako",
    role: "Community Member",
    organization: "Programming Community",
    dateStart: "2025-01",
    description:
      "Joined a programming-focused community to enhance skills and connect with fellow developers.",
    highlights: ["Networking", "Knowledge Sharing", "Skill Development"],
    category: "community",
  },
  {
    id: 7,
    title: "Green Generation Central Sulawesi",
    role: "Communications Officers",
    organization: "Environmental Community",
    dateStart: "2025-01",
    description:
      "Participated in a green community program to raise awareness about environmental issues and sustainable practices.",
    highlights: [
      "Environmental Awareness",
      "Community Service",
      "Sustainability",
    ],
    category: "community",
  },
  {
    id: 8,
    title: "Guard Riders - Smart Helmet",
    role: "Team Member",
    organization: "Road Safety Innovation",
    dateStart: "2025-05",
    dateEnd: "2025-07",
    description:
      "Collaborated on the design of a smart helmet to enhance road safety. Advanced to the competition finals with innovative safety features.",
    highlights: ["IoT Development", "Safety Innovation", "Competition Finals"],
    category: "award",
    image: "/assets/rsict_2025.jpeg",
  },
  {
    id: 9,
    title: "Commemoration Day - Faculty of Engineering, Tadulako University",
    role: "Volunteer & Exhibitor",
    organization: "Faculty of Engineering, Tadulako University",
    dateStart: "2025-06",
    dateEnd: "2025-10",
    description:
      "Contributed to the annual commemoration event of the Faculty of Engineering by showcasing innovative student projects at the Expo Innovation exhibition. Collaborated with fellow students and lecture to help demonstrate technological solutions and engage visitors with interactive displays.",
    highlights: [
      "Innovation Showcase",
      "Project Exhibition",
      "Team Collaboration",
      "Public Engagement",
    ],
    category: "volunteer",
  },
  {
    id: 10,
    title: "HammerCode - Programming Community",
    role: "Community Member",
    organization: "HammerCode",
    dateStart: "2025-12",
    description:
      "Recently an active member of HammerCode, a passionate programming community focused on collaborative learning, code sharing, and building innovative projects together. Engaging in workshops, code reviews, and hackathon preparations with fellow developers.",
    highlights: [
      "Collaborative Learning",
      "Code Reviews",
      "Open Source",
      "Hackathons",
    ],
    category: "community",
  },
  {
    id: 11,
    title: "I-Fest 2025",
    role: "Liason Officer",
    organization:
      "Computer Science Student Association (HMTI) of Tadulako University",
    dateStart: "2025-11",
    dateEnd: "2025-12",
    description:
      "Served as Liaison Officer for I-Fest 2025, the annual informatics festival organized by HMTI. Coordinated communication between committee divisions, managed external partnerships, and ensured smooth information flow between stakeholders throughout the event preparation and execution.",
    highlights: [
      "Cross-team Coordination",
      "Stakeholder Management",
      "Event Logistics",
      "Communication",
    ],
    category: "volunteer",
  },
  {
    id: 12,
    title: "I-Fest 2026",
    role: "PIC - Person In Charge",
    organization:
      "Computer Science Student Association (HMTI) of Tadulako University",
    dateStart: "2026-01",
    description:
      "Leading as Person In Charge (PIC) for I-Fest 2026, taking on greater responsibility in organizing the annual informatics festival. Overseeing event planning, managing committee teams, coordinating with sponsors and speakers, and driving the vision for an impactful student-led tech event.",
    highlights: [
      "Leadership",
      "Event Management",
      "Team Coordination",
      "Strategic Planning",
    ],
    category: "committee",
  },
  {
    id: 13,
    title: "Palu Developer Day 2026",
    role: "Public Relations Committee",
    organization: "Hammercode - Programming Community",
    dateStart: "2025-11",
    dateEnd: "2026-01",
    description:
      "Served as part of the Public Relations team for Palu Developer Day 2026, the premier tech conference organized by Hammercode Palu. Responsible for managing media relations, creating promotional content, coordinating with speakers and sponsors, and building community engagement through strategic communication across multiple channels.",
    highlights: [
      "Media Relations",
      "Content Creation",
      "Community Engagement",
      "Speaker Coordination",
    ],
    category: "committee",
  },
  {
    id: 14,
    title: "Active Member of HMTI",
    role: "Member",
    organization:
      "Computer Science Student Association (HMTI) of Tadulako University",
    dateStart: "2025-11",
    description:
      "Active member of Himpunan Mahasiswa Teknik Informatika (HMTI), the official student association for Computer Science at Tadulako University. Participating in various activities including workshops, seminars, and collaborative projects to enhance technical skills and foster a strong community among informatics students.",
    highlights: [
      "Workshop Participation",
      "Technical Seminars",
      "Student Community",
      "Collaborative Learning",
    ],
    category: "community",
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
    excerpt:
      "Exploring the hidden temples and rice terraces of Ubud. A journey through ancient traditions and breathtaking landscapes.",
    date: "2025-01-10",
    category: "travel",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800",
    ],
    content:
      "Ubud is a place where time seems to slow down. From the emerald green rice terraces of Tegalalang to the sacred Monkey Forest, every corner of this town tells a story of culture and spirituality. During my weekend here, I explored ancient temples, tasted authentic Balinese cuisine, and witnessed traditional dance performances that have been preserved for generations.",
  },
  {
    id: 2,
    title: "My Home Office Setup",
    excerpt:
      "After months of iteration, I finally achieved the perfect workspace. Here's the story behind every decision.",
    date: "2024-12-15",
    category: "life",
    images: [
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800",
      "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=800",
      "https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=800",
    ],
    content:
      "Creating a productive workspace is an art. It's not just about buying expensive gear, but about understanding your workflow. I chose a minimalist setup with a focus on ergonomics and lighting. The standing desk allows me to stay active, while the ambient lighting creates a focused atmosphere for late-night coding sessions.",
  },
  {
    id: 3,
    title: "Building SOROT",
    excerpt:
      "The challenges and learnings from developing an AI-powered photography app from scratch.",
    date: "2024-11-20",
    category: "tech",
    images: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800",
    ],
    content:
      "Building SOROT was a journey of discovery. We started with a simple idea: how can we make photography more accessible? The answer lay in AI. By integrating advanced machine learning models, we were able to create an app that understands the scene and suggests the best settings. The road wasn't easy, but the result was worth it.",
  },
  {
    id: 4,
    title: "Tokyo at Night",
    excerpt:
      "Neon lights, quiet alleys, and the electric energy of Shibuya. A visual diary of my first trip to Japan.",
    date: "2024-10-05",
    category: "travel",
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800",
    ],
    content:
      "Tokyo is a city of contrasts. The quiet discipline of the tea ceremony coexists with the chaotic energy of Shibuya Crossing. My nights in Tokyo were filled with neon lights, delicious street food, and endless exploration. Each alleyway revealed a new secret, a new perspective on this futuristic yet deeply traditional metropolis.",
  },
  {
    id: 5,
    title: "Design System Deep Dive",
    excerpt:
      "Lessons learned building a scalable design system for enterprise applications.",
    date: "2024-08-12",
    category: "creative",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800",
    ],
    content:
      "Design systems are the backbone of consistent user experiences. In this deep dive, I share my process for creating a scalable system that serves both designers and developers. From tokenizing colors to building atomic components, I cover the strategies that ensure your design system grows with your product.",
  },
];
