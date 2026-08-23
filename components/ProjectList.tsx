import React, { useState, useRef } from 'react';
import { PROJECTS } from '../constants';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

const ProjectList: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  // Floating image cursor follower
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothImageX = useSpring(mouseX, { stiffness: 180, damping: 20 });
  const smoothImageY = useSpring(mouseY, { stiffness: 180, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div 
      id="work" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="py-32 px-6 md:px-12 bg-transparent relative z-10 min-h-screen"
    >
      <div className="max-w-[90vw] mx-auto">
        {/* Section Header with Scroll Parallax */}
        <motion.div 
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex items-end justify-between mb-16 border-b border-neutral-800 pb-8"
        >
          <div>
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-4">
              // Archive &bull; Index
            </span>
            <h2 className="liquid-glass-text text-6xl md:text-8xl font-bold uppercase tracking-tighter">
              Selected<br/>Works
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-1">
              (2021 — 2024)
            </span>
            <span className="text-[11px] font-mono text-[#00f3ff]/80">
              {PROJECTS.length} Featured Cases
            </span>
          </div>
        </motion.div>

        {/* Project List with Scroll Motion */}
        <div className="relative flex flex-col">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
              className="group relative border-b border-neutral-800/80 py-12 md:py-16 flex flex-col md:flex-row md:items-baseline justify-between cursor-pointer transition-all duration-300 hover:bg-[#00f3ff]/[0.03] px-6 -mx-6 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-baseline gap-4 md:gap-12 z-10 pointer-events-none">
                <span className="text-xs font-mono font-bold text-neutral-600 tracking-widest group-hover:text-[#00f3ff] transition-colors duration-300">
                  0{project.id}
                </span>
                <div>
                  <h3 className="text-4xl md:text-6xl font-medium uppercase tracking-tight text-neutral-300 group-hover:text-white group-hover:font-bold group-hover:translate-x-3 transition-all duration-300 ease-out flex items-center gap-3">
                    {project.title}
                    <ArrowUpRight size={28} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-[#00f3ff] transition-all duration-300" />
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-500 font-light mt-2 max-w-md hidden md:block group-hover:text-neutral-400 transition-colors">
                    {project.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-8 md:gap-20 z-10 pointer-events-none">
                <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-neutral-500 group-hover:text-[#00f3ff] transition-colors duration-300 px-3 py-1 rounded-full border border-transparent group-hover:border-[#00f3ff]/20">
                  {project.category}
                </span>
                <span className="text-sm font-mono text-neutral-600 group-hover:text-white transition-colors duration-300">
                  {project.year}
                </span>
              </div>

              {/* Hover Glow Edge Line */}
              <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f3ff]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Hover Image Preview (Scroll-Aware) */}
      {hoveredProject && (
        <motion.div
          className="fixed pointer-events-none z-30 hidden lg:block w-[320px] h-[200px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,243,255,0.15)] border border-[#00f3ff]/30 bg-neutral-950"
          style={{
            left: smoothImageX,
            top: smoothImageY,
            x: 24,
            y: -100,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <img
            src={hoveredProject.image}
            alt={hoveredProject.title}
            className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-xs font-mono text-[#00f3ff] uppercase tracking-wider">
              {hoveredProject.title} &bull; {hoveredProject.category}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectList;