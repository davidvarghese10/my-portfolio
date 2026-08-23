import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import LiquidBackground from './components/LiquidBackground';
import ScrollHUD from './components/ScrollHUD';
import { PageTab } from './types';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageTab>(() => {
    const hash = window.location.hash.replace('#', '') as PageTab;
    if (['home', 'work', 'profile', 'contact'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  const handleNavigate = (page: PageTab) => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageTab;
      if (['home', 'work', 'profile', 'contact'].includes(hash)) {
        setActivePage(hash);
      } else if (!window.location.hash) {
        setActivePage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Mouse position for custom cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for cursor movement
  const cursorX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const cursorY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  
  // Smooth spring animation for cursor scale
  const cursorScale = useSpring(1, { stiffness: 200, damping: 25 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 10);
      mouseY.set(e.clientY - 10);
    };

    const handleMouseEnter = () => {
      cursorScale.set(2.2);
    };
    
    const handleMouseLeave = () => {
      cursorScale.set(1);
    };

    window.addEventListener('mousemove', moveCursor);

    // Add hover listeners to interactive elements
    const addHoverListeners = () => {
      const hoverables = document.querySelectorAll('a, button, input, .cursor-pointer');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
      const hoverables = document.querySelectorAll('a, button, input, .cursor-pointer');
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [mouseX, mouseY, cursorScale, activePage]);

  return (
    <>
      <LiquidBackground />
      <ScrollHUD />
      
      <div className="relative z-10 cursor-none min-h-screen flex flex-col justify-between">
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

            {activePage === 'work' && (
              <motion.div
                key="work"
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