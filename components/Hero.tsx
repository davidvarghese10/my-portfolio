import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero: React.FC = () => {
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

  const handleWorkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex flex-col justify-between px-6 md:px-12 pt-8 pb-16 bg-transparent relative overflow-hidden"
    >
      <div className="mt-32 md:mt-40">
        <motion.div 
          style={{ y: badgeY, opacity: badgeOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse" />
          <p className="text-xs md:text-sm font-mono uppercase tracking-widest text-neutral-400">
            Creative Developer &bull; 2025
          </p>
        </motion.div>
      </div>

      <div className="w-full relative z-10">
        <motion.h1 
          style={{ x: davidX, y: davidY, opacity: davidOpacity }}
          className="liquid-glass-text liquid-hover font-oswald text-[18vw] md:text-[15vw] leading-[0.8] font-bold uppercase tracking-tighter whitespace-nowrap cursor-default pb-4 will-change-transform"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          David
        </motion.h1>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12">
          <motion.h1 
             style={{ x: vargheseX, y: vargheseY, opacity: vargheseOpacity }}
             className="liquid-glass-text liquid-hover font-oswald text-[18vw] md:text-[15vw] leading-[0.8] font-bold uppercase tracking-tighter whitespace-nowrap ml-0 md:ml-24 cursor-default pb-4 will-change-transform"
             initial={{ y: 100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Varghese
          </motion.h1>
          <motion.div 
            style={{ y: badgeY, opacity: badgeOpacity }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-4 md:mt-0 max-w-xs backdrop-blur-md bg-black/40 p-5 rounded-xl border border-white/10 shadow-2xl"
          >
            <div className="text-[10px] font-mono text-[#00f3ff] uppercase tracking-widest mb-1">// Focus</div>
            <p className="text-neutral-300 text-sm md:text-base font-normal leading-snug">
              Crafting interactive digital experiences, motion design &amp; creative web engineering.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div 
        style={{ opacity: scrollIndicatorOpacity, y: scrollIndicatorY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="flex justify-between items-end border-t border-neutral-800/80 pt-6"
      >
        <a 
          href="#work" 
          onClick={handleWorkClick}
          className="group flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 hover:text-[#00f3ff] transition-colors"
        >
          <span className="w-6 h-[1px] bg-neutral-600 group-hover:w-10 group-hover:bg-[#00f3ff] transition-all duration-300" />
          Explore Works
        </a>
        <div className="flex flex-col items-center gap-2 text-neutral-500">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Scroll</span>
          <div className="w-5 h-9 rounded-full border border-neutral-700 flex justify-center pt-2">
            <motion.div 
              animate={{ y: [0, 8, 0], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-[#00f3ff]"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;