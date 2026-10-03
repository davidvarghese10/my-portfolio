import { Project, NavItem, SkillData } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: 'home' },
  { label: 'Profile', href: 'profile' },
  { label: 'Education', href: 'education' },
  { label: 'Projects', href: 'projects' },
  { label: 'Certificates', href: 'certificates' },
  { label: 'Achievements', href: 'achievements' },
  { label: 'Experience', href: 'experience' },
  { label: 'Contact', href: 'contact' },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "EcoTrail",
    category: "Sustainable Tech",
    year: "2026",
    image: "https://picsum.photos/800/600?grayscale&random=50",
    description: "Sustainable transport planner.",
    link: "https://ecotrail-sustainable-transport-planner.ai.studio/"
  },
  {
    id: 2,
    title: "Intevra",
    category: "AI & Security",
    year: "2026",
    image: "https://picsum.photos/800/600?grayscale&random=10",
    description: "AI integrated interview fraud detection system.",
    link: "https://github.com/davidvarghese10/ai-for-hiring-3.git"
  },
  {
    id: 3,
    title: "FolioBind",
    category: "Document Utility",
    year: "2026",
    image: "https://picsum.photos/800/600?grayscale&random=60",
    description: "A versatile document merger that combines multiple PDF, DOCX, and PPTX files into a single document in your preferred supported format.",
    link: "https://davidvarghese10.github.io/folio-bind/"
  },
  {
    id: 4,
    title: "Aether",
    category: "Interactive Web",
    year: "2026",
    image: "https://picsum.photos/800/600?grayscale&random=20",
    description: "Immersive Regional Weather Experience Application.",
    link: "https://github.com/davidvarghese10/Aether.git"
  },
  {
    id: 5,
    title: "MediSense AI",
    category: "Healthcare AI",
    year: "2026",
    image: "https://picsum.photos/800/600?grayscale&random=30",
    description: "A disease prediction system based on the symptoms provided.",
    link: "https://github.com/davidvarghese10/medisense-ai.git"
  },
  {
    id: 6,
    title: "chip8-emulator",
    category: "Systems & C++",
    year: "2026",
    image: "https://picsum.photos/800/600?grayscale&random=70",
    description: "Hardware-accurate CHIP-8 virtual machine emulator implemented in C++ with SDL2 for rendering and input handling.",
    link: "https://github.com/davidvarghese10/chip8-emulator.git"
  },
  {
    id: 7,
    title: "Equora",
    category: "Python & Algorithms",
    year: "2023",
    image: "https://picsum.photos/800/600?grayscale&random=40",
    description: "Python-Based Mathematical Equation Solver."
  }
];

export const SKILLS_DATA: SkillData[] = [
  { subject: 'Python & AI', A: 95, fullMark: 100 },
  { subject: 'React & TS', A: 90, fullMark: 100 },
  { subject: 'OOP in Java', A: 88, fullMark: 100 },
  { subject: 'C & C++', A: 92, fullMark: 100 },
  { subject: 'DSA', A: 90, fullMark: 100 },
  { subject: 'MySQL', A: 88, fullMark: 100 },
  { subject: 'Cybersecurity', A: 85, fullMark: 100 },
  { subject: 'Cloud & Tools', A: 90, fullMark: 100 },
  { subject: 'UI / UX Design', A: 98, fullMark: 100 },
];