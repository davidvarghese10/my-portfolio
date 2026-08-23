import { Project, NavItem, SkillData } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Work', href: '#work' },
  { label: 'Profile', href: '#profile' },
  { label: 'Contact', href: '#contact' },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Obys Agency",
    category: "Design & Dev",
    year: "2023",
    image: "https://picsum.photos/800/600?grayscale&random=10",
    description: "A digital art gallery featuring immersive 3D experiences."
  },
  {
    id: 2,
    title: "Publicis Groupe",
    category: "Corporate",
    year: "2024",
    image: "https://picsum.photos/800/600?grayscale&random=20",
    description: "Fintech dashboard redesign focusing on data clarity."
  },
  {
    id: 3,
    title: "Off-White™",
    category: "E-Commerce",
    year: "2022",
    image: "https://picsum.photos/800/600?grayscale&random=30",
    description: "Minimalist editorial platform for architecture enthusiasts."
  },
  {
    id: 4,
    title: "Cartier",
    category: "Experience",
    year: "2023",
    image: "https://picsum.photos/800/600?grayscale&random=40",
    description: "Spatial audio mapping tool for sound engineers."
  },
  {
    id: 5,
    title: "Spotify Wrapped",
    category: "Campaign",
    year: "2024",
    image: "https://picsum.photos/800/600?grayscale&random=50",
    description: "Rebranding for a high-end motion design studio."
  }
];

export const SKILLS_DATA: SkillData[] = [
  { subject: 'React', A: 100, fullMark: 100 },
  { subject: 'Motion', A: 95, fullMark: 100 },
  { subject: 'Design', A: 85, fullMark: 100 },
  { subject: 'WebGL', A: 80, fullMark: 100 },
  { subject: 'Node.js', A: 70, fullMark: 100 },
  { subject: '3D', A: 75, fullMark: 100 },
];