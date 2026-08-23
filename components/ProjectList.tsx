import React, { useRef } from 'react';
import { PROJECTS } from '../constants';
import { motion } from 'framer-motion';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';

const ProjectList: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      id="work" 
      ref={containerRef}
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
              <FolderGit2 size={14} className="text-[#00f3ff]" />
              // Archive &bull; Projects
            </span>
            <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
              Selected<br/>Works
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-1">
              (2024 — 2026)
            </span>
            <span className="text-[11px] font-mono text-[#00f3ff]/80">
              {PROJECTS.length} Featured Projects
            </span>
          </div>
        </motion.div>

        {/* Project List */}
        <div className="relative flex flex-col">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative border-b border-neutral-800/80 py-10 md:py-14 flex flex-col md:flex-row md:items-baseline justify-between cursor-pointer transition-all duration-300 hover:bg-[#00f3ff]/[0.03] px-6 -mx-6 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-baseline gap-4 md:gap-12 z-10 pointer-events-none">
                <span className="text-xs font-mono font-bold text-neutral-600 tracking-widest group-hover:text-[#00f3ff] transition-colors duration-300">
                  0{project.id}
                </span>
                <div>
                  <h3 className="text-3xl md:text-5xl font-medium uppercase tracking-tight text-neutral-200 group-hover:text-white group-hover:font-bold group-hover:translate-x-2 transition-all duration-300 ease-out flex items-center gap-3">
                    {project.title}
                    <ArrowUpRight size={24} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-[#00f3ff] transition-all duration-300" />
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-400 font-light mt-2 max-w-xl group-hover:text-neutral-300 transition-colors">
                    {project.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-6 md:gap-12 z-10 pointer-events-none">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00f3ff]/90 px-3 py-1 rounded-full border border-[#00f3ff]/20 bg-[#00f3ff]/5">
                  {project.category}
                </span>
                <span className="text-sm font-mono text-neutral-500 group-hover:text-white transition-colors duration-300">
                  {project.year}
                </span>
              </div>

              {/* Hover Glow Edge Line */}
              <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f3ff]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <p>&copy; 2026 David Varghese</p>
        <p className="text-neutral-500">4 Works in Total</p>
      </div>
    </div>
  );
};

export default ProjectList;