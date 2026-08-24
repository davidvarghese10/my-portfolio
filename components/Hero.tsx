import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PageTab } from '../types';

interface HeroProps {
  onNavigate?: (page: PageTab) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Kinetic scroll parallax transformations
  const davidX = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const davidY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const davidOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const vargheseX = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const vargheseY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const vargheseOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const badgeY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const scrollIndicatorY = useTransform(scrollYProgress, [0, 0.25], [0, 30]);

  const handleWorkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('projects');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col justify-between px-6 md:px-12 pt-8 pb-12 bg-transparent relative overflow-hidden"
    >
      <div className="mt-28 md:mt-36">
        <motion.div 
          style={{ y: badgeY, opacity: badgeOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse" />
          <p className="text-xs md:text-sm font-mono uppercase tracking-widest text-neutral-400">
            Aspiring Software Developer &bull; 2026
          </p>
        </motion.div>
      </div>

      <div className="w-full relative z-10 my-auto py-6">
        <motion.h1 
          style={{ x: davidX, y: davidY, opacity: davidOpacity }}
          className="liquid-glass-text liquid-hover font-oswald text-[18vw] md:text-[15vw] leading-[0.8] font-bold uppercase tracking-tighter whitespace-nowrap cursor-default pb-4 will-change-transform"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          David
        </motion.h1>
        <motion.h1 
          style={{ x: vargheseX, y: vargheseY, opacity: vargheseOpacity }}
          className="liquid-glass-text liquid-hover font-oswald text-[18vw] md:text-[15vw] leading-[0.8] font-bold uppercase tracking-tighter whitespace-nowrap ml-0 md:ml-24 cursor-default pb-4 will-change-transform"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Varghese
        </motion.h1>

        {/* About Me Section below name */}
        <motion.div 
          style={{ y: badgeY, opacity: badgeOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 md:mt-8 ml-0 md:ml-24 max-w-2xl backdrop-blur-md bg-black/40 p-6 rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="text-xs font-mono text-[#00f3ff] uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff]" />
            // About Me
          </div>
          <p className="text-neutral-300 text-sm md:text-base font-normal leading-relaxed">
            I’m a CSE student and an aspiring software developer with an interest in cybersecurity and emerging technologies. I enjoy building practical projects, participating in hackathons, and exploring new tools and technologies. I’m always looking to improve my technical and problem-solving skills and turn ideas into useful solutions.
          </p>
        </motion.div>
      </div>

      <motion.div 
        style={{ opacity: scrollIndicatorOpacity, y: scrollIndicatorY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex justify-between items-end border-t border-neutral-800/80 pt-6 mt-6"
      >
        <button 
          onClick={handleWorkClick}
          className="group flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 hover:text-[#00f3ff] transition-colors cursor-pointer"
        >
          <span className="w-6 h-[1px] bg-neutral-600 group-hover:w-10 group-hover:bg-[#00f3ff] transition-all duration-300" />
          Explore Works &rarr;
        </button>
        <div className="text-xs font-mono text-neutral-500 hidden sm:block">
          &copy; 2026 David Varghese
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;