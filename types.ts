export type PageTab = 'home' | 'profile' | 'education' | 'projects' | 'certificates' | 'achievements' | 'experience' | 'contact' | '404';

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  link?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SkillData {
  subject: string;
  A: number;
  fullMark: number;
}