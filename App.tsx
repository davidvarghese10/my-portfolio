import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Achievements from './components/Achievements';
import Certificates from './components/Certificates';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import LiquidBackground from './components/LiquidBackground';
import InteractiveParticles from './components/InteractiveParticles';
import ScrollHUD from './components/ScrollHUD';
import AppleHelloLoader from './components/AppleHelloLoader';
import { PageTab } from './types';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<PageTab>(() => {
    const hash = window.location.hash.replace('#', '') as PageTab;
    if (['home', 'profile', 'experience', 'education', 'projects', 'achievements', 'certificates', 'contact'].includes(hash)) {
      return hash;
    }
    // Backward compatibility for old #work link
    if (hash === ('work' as any)) {
      return 'projects';
    }
    return 'home';
  });

  const handleNavigate = (page: PageTab) => {
    cursorScale.set(1);
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      cursorScale.set(1);
      const hash = window.location.hash.replace('#', '') as PageTab;
      if (['home', 'profile', 'experience', 'education', 'projects', 'achievements', 'certificates', 'contact'].includes(hash)) {
        setActivePage(hash);
      } else if (hash === ('work' as any)) {
        setActivePage('projects');
      } else if (!window.location.hash) {
        setActivePage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Mouse position for custom cursor
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const cursorX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const cursorY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  
  // Responsive spring animation for cursor scale when hovering interactive elements
  const cursorScale = useSpring(1, { stiffness: 200, damping: 25 });

  // Reset cursor scale on page changes
  useEffect(() => {
    cursorScale.set(1);
  }, [activePage]);

  useEffect(() => {
    // Only activate cursor tracking on pointer/hover capable desktop devices
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const isHoverable = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;
      return !!target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
    };

    // Direct position update without expensive DOM traversal on every mouse movement tick
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 10);
      mouseY.set(e.clientY - 10);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (isHoverable(e.target)) {
        cursorScale.set(2.2);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget || !isHoverable(e.relatedTarget)) {
        cursorScale.set(1);
      }
    };

    const handlePointerDown = () => {
      cursorScale.set(1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [mouseX, mouseY, cursorScale]);

  return (
    <>
      {isLoading && (
        <AppleHelloLoader onComplete={() => setIsLoading(false)} />
      )}

      <LiquidBackground />
      <InteractiveParticles />
      <ScrollHUD />
      
      <div className="relative z-10 md:cursor-none min-h-screen flex flex-col justify-between">
        <Header activePage={activePage} onNavigate={handleNavigate} />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            {activePage === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <Hero onNavigate={handleNavigate} />
              </motion.div>
            )}

            {activePage === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <ProjectList />
              </motion.div>
            )}

            {activePage === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <About />
              </motion.div>
            )}

            {activePage === 'experience' && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <Experience />
              </motion.div>
            )}

            {activePage === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <Education />
              </motion.div>
            )}

            {activePage === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <Achievements />
              </motion.div>
            )}

            {activePage === 'certificates' && (
              <motion.div
                key="certificates"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <Certificates />
              </motion.div>
            )}

            {activePage === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <Footer />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AIChat />
      </div>

      {/* Custom Liquid Glass Cursor */}
      <motion.div
        className="glass-cursor fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: cursorScale,
        }}
      />
    </>
  );
};

export default App;
