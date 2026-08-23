import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollHUD: React.FC = () => {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [activeSection, setActiveSection] = useState('HERO');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribeProgress = scrollYProgress.on('change', (latest) => {
      setScrollPercentage(Math.round(latest * 100));
    });

    const unsubscribeScroll = scrollY.on('change', (latest) => {
      setIsVisible(latest > 200);

      // Determine active section based on scroll position
      const scrollPos = latest + window.innerHeight * 0.3;
      const workEl = document.getElementById('work');
      const profileEl = document.getElementById('profile');
      const contactEl = document.getElementById('contact');

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveSection('CONTACT');
      } else if (profileEl && scrollPos >= profileEl.offsetTop) {
        setActiveSection('PROFILE');
      } else if (workEl && scrollPos >= workEl.offsetTop) {
        setActiveSection('WORK');
      } else {
        setActiveSection('HERO');
      }
    });

    return () => {
      unsubscribeProgress();
      unsubscribeScroll();
    };
  }, [scrollYProgress, scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Precision Scroll Progress Glow Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] to-[#00f3ff] origin-left z-[60] shadow-[0_0_10px_#00f3ff]"
        style={{ scaleX }}
      />

      {/* Floating Scroll HUD & Back to Top in Bottom Left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-3 pointer-events-auto"
      >
        <button
          onClick={scrollToTop}
          id="scroll-to-top-btn"
          aria-label="Scroll to top"
          className="group flex items-center gap-3 px-3.5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-neutral-400 hover:text-[#00f3ff] hover:border-[#00f3ff]/40 transition-all shadow-lg"
        >
          <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-300 text-[#00f3ff]" />
          <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-white/80">
            {activeSection}
          </span>
          <span className="text-[10px] font-mono text-[#00f3ff] font-bold">
            {scrollPercentage.toString().padStart(2, '0')}%
          </span>
        </button>
      </motion.div>
    </>
  );
};

export default ScrollHUD;
