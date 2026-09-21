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

const VALID_PAGES: PageTab[] = [
  'home',
  'profile',
  'experience',
  'education',
  'projects',
  'achievements',
  'certificates',
  'contact',
];

// Helper to determine the application's base URL path (e.g., '/' or '/subfolder/')
const getBasePath = (): string => {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1]?.toLowerCase();
  
  if (lastSegment && (VALID_PAGES.includes(lastSegment as PageTab) || lastSegment === 'work')) {
    segments.pop();
  }
  return segments.length > 0 ? `/${segments.join('/')}/` : '/';
};

// Helper to construct clean URL without '#'
const getPageUrl = (page: PageTab): string => {
  const base = getBasePath();
  if (page === 'home') {
    return base;
  }
  return `${base}${page}`;
};

// Helper to resolve the active page from the current URL
const resolveCurrentPage = (): PageTab => {
  if (typeof window === 'undefined') return 'home';

  // 1. Check pathname (e.g. /profile, /projects)
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1]?.toLowerCase();

  if (lastSegment && VALID_PAGES.includes(lastSegment as PageTab)) {
    return lastSegment as PageTab;
  }
  if (lastSegment === 'work') {
    return 'projects';
  }

  // 2. Check search params (e.g. ?page=projects)
  const searchParams = new URLSearchParams(window.location.search);
  const pageParam = (searchParams.get('page') || searchParams.get('tab'))?.toLowerCase();
  if (pageParam && VALID_PAGES.includes(pageParam as PageTab)) {
    return pageParam as PageTab;
  }
  if (pageParam === 'work') {
    return 'projects';
  }

  // 3. Fallback check for old hash link (e.g. /#projects)
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash && VALID_PAGES.includes(hash as PageTab)) {
    return hash as PageTab;
  }
  if (hash === 'work') {
    return 'projects';
  }

  return 'home';
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState<PageTab>(() => {
    const initialPage = resolveCurrentPage();
    // If URL had a '#' or needed cleanup, cleanly replace state in history without '#'
    if (typeof window !== 'undefined') {
      const targetUrl = getPageUrl(initialPage);
      if (window.location.hash || window.location.pathname !== targetUrl) {
        window.history.replaceState({ page: initialPage }, '', targetUrl);
      }
    }
    return initialPage;
  });
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const handleNavigate = (page: PageTab) => {
    cursorScale.set(1);
    setIsCertificateModalOpen(false);
    setActivePage(page);

    const targetUrl = getPageUrl(page);
    if (window.location.pathname !== targetUrl || window.location.hash) {
      window.history.pushState({ page }, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      cursorScale.set(1);
      const currentPage = resolveCurrentPage();
      setActivePage(currentPage);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Mouse position for custom cursor
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // High-frequency, near-zero inertia spring: gives silky smooth 60/120fps motion with no trailing lag
  const cursorX = useSpring(mouseX, { stiffness: 850, damping: 45, mass: 0.1 });
  const cursorY = useSpring(mouseY, { stiffness: 850, damping: 45, mass: 0.1 });
  
  // Responsive spring animation for cursor scale when hovering interactive elements
  const cursorScale = useSpring(1, { stiffness: 350, damping: 25 });

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
        cursorScale.set(1.8);
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
        <Header activePage={activePage} onNavigate={handleNavigate} isHidden={isCertificateModalOpen} />
        
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
                <Certificates onModalChange={setIsCertificateModalOpen} />
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