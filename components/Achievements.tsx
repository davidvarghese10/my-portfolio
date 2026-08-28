import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Target, Flame, Star, ExternalLink } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  category: string;
  year: string;
  issuer: string;
  description: string;
  highlight?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "3rd Prize — Vibe Night Hackathon",
    category: "Hackathon & Competition",
    year: "2025",
    issuer: "Abhiyanthriki Tech Fest • Rajagiri School of Engineering & Technology",
    description: "Secured 3rd Prize at Vibe Night, a hackathon conducted as part of the Abhiyanthriki Tech Fest at Rajagiri School of Engineering & Technology.",
    highlight: "3rd Prize Winner"
  },
  {
    id: 2,
    title: "National Level Hackathon Finalist — Hacksus",
    category: "Hackathon & Innovation",
    year: "2025",
    issuer: "Hacksus • Rajagiri School of Engineering & Technology",
    description: "Developed Intevra, an AI-powered interview integrity monitoring and fraud detection system, recognized among the top competing teams nationwide at Hacksus.",
    highlight: "Top Finalist"
  },
  {
    id: 3,
    title: "Smart India Hackathon (SIH)",
    category: "National Hackathon",
    year: "2024 — 2025",
    issuer: "Ministry of Education & AICTE",
    description: "Participated in the Smart India Hackathon, gaining hands-on experience in problem solving and collaborative development.",
    highlight: "Participant"
  },
  {
    id: 4,
    title: "Algorithmic Problem Solving & Competitive Coding",
    category: "Algorithms & Logic",
    year: "2024 — Present",
    issuer: "LeetCode & Coding Platforms",
    description: "Actively solving algorithmic challenges across data structures, graph theory, dynamic programming, and mathematical optimization.",
    highlight: "Active Contributor"
  }
];

const Achievements: React.FC = () => {
  return (
    <div 
      id="achievements" 
      className="pt-36 pb-24 px-6 md:px-12 bg-transparent relative z-10 min-h-screen flex flex-col justify-between"
    >
      <div className="max-w-[90vw] mx-auto w-full">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-16 border-b border-neutral-800 pb-8"
        >
          <div>
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-[#00f3ff]" />
              // Milestones &bull; Honors
            </span>
            <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
              Key<br/>Achievements
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-1">
              (2024 — 2026)
            </span>
            <span className="text-[11px] font-mono text-[#00f3ff]/80">
              {ACHIEVEMENTS.length} Highlighted Milestones
            </span>
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACHIEVEMENTS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#00f3ff]/40 hover:bg-black/60 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] px-3 py-1 rounded-full border border-[#00f3ff]/20 bg-[#00f3ff]/10">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    {item.year}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white group-hover:text-[#00f3ff] transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="text-xs font-mono text-neutral-400 mb-4 flex items-center gap-1.5">
                  <Award size={13} className="text-[#00f3ff]" />
                  {item.issuer}
                </p>

                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.highlight && (
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Star size={12} className="text-[#00f3ff]" />
                    Recognition
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                    {item.highlight}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <p>&copy; 2026 David Varghese</p>
        <p className="text-neutral-500">Milestones &amp; Honors</p>
      </div>
    </div>
  );
};

export default Achievements;
