import { Project, NavItem, SkillData } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: 'home' },
  { label: 'Work', href: 'work' },
  { label: 'Profile', href: 'profile' },
  { label: 'Contact', href: 'contact' },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Intevra",
    category: "AI & Security",
    year: "2025",
    image: "https://picsum.photos/800/600?grayscale&random=10",
    description: "AI integrated interview fraud detection system."
  },
  {
    id: 2,
    title: "Aether",
    category: "Interactive Web",
    year: "2025",
    image: "https://picsum.photos/800/600?grayscale&random=20",
    description: "Immersive Regional Weather Experience Application."
  },
  {
    id: 3,
    title: "MediSense AI",
    category: "Healthcare AI",
    year: "2024",
    image: "https://picsum.photos/800/600?grayscale&random=30",
    description: "A disease prediction system based on the symptoms provided."
  },
  {
    id: 4,
    title: "Equora",
    category: "Python & Algorithms",
    year: "2024",
    image: "https://picsum.photos/800/600?grayscale&random=40",
    description: "Python-Based Mathematical Equation Solver."
  }
];

export const SKILLS_DATA: SkillData[] = [
  { subject: 'Python & AI', A: 95, fullMark: 100 },
  { subject: 'React & TS', A: 90, fullMark: 100 },
  { subject: 'Cybersecurity', A: 85, fullMark: 100 },
  { subject: 'Algorithms', A: 90, fullMark: 100 },
  { subject: 'Cloud & Tools', A: 80, fullMark: 100 },
  { subject: 'UI / UX Design', A: 85, fullMark: 100 },
];