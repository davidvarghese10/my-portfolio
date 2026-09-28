import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Achievements from './components/Achievements';
import Certificates from './components/Certificates';//hello
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import LiquidBackground from './components/LiquidBackground';
import InteractiveParticles from './components/InteractiveParticles';
import ScrollHUD from './components/ScrollHUD';
import AppleHelloLoader from './components/AppleHelloLoader';
import NotFound from './components/NotFound';
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

const KNOWN_REPO_BASES = ['my-portfolio', 'portfolio'];

// Helper to determine the application's base URL path (e.g., '/' or '/my-portfolio/')
const getBasePath = (): string => {
  if (typeof window === 'undefined') return '/';
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length > 0 && KNOWN_REPO_BASES.includes(segments[0].toLowerCase())) {
    return `/${segments[0]}/`;
  }
  return '/';
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

  // 1. Check search params (e.g. ?page=projects)
  const searchParams = new URLSearchParams(window.location.search);
  const pageParam = (searchParams.get('page') || searchParams.get('tab'))?.toLowerCase();
  if (pageParam) {
    if (VALID_PAGES.includes(pageParam as PageTab)) {
      return pageParam as PageTab;
    }
    if (pageParam === 'work') {
      return 'projects';
    }
    return '404';
  }

  // 2. Fallback check for old hash link (e.g. /#projects)
  const rawHash = window.location.hash.replace('#', '').replace(/^\/+/, '').toLowerCase();
  if (rawHash) {
    if (VALID_PAGES.includes(rawHash as PageTab)) {
      return rawHash as PageTab;
    }
    if (rawHash === 'work') {
      return 'projects';
    }
    return '404';
  }

  // 3. Check pathname (e.g. /, /profile, /projects, or unknown 404 route)
  const segments = window.location.pathname.split('/').filter(Boolean);
  const routeSegments =
    segments.length > 0 && KNOWN_REPO_BASES.includes(segments[0].toLowerCase())
      ? segments.slice(1)
      : segments;

  const filteredSegments = routeSegments.filter(
    (seg) => seg.toLowerCase() !== 'index.html'
  );

  if (filteredSegments.length === 0) {
    return 'home';
  }

  if (filteredSegments.length === 1) {
    const seg = filteredSegments[0].toLowerCase();
    if (VALID_PAGES.includes(seg as PageTab)) {
      return seg as PageTab;
    }
    if (seg === 'work') {
      return 'projects';
    }
  }

  return '404';
};

const TAB_SEQUENCE: PageTab[] = [
  'home',
  'profile',
  'education',
  'projects',
  'certificates',
  'achievements',
  'experience',
  'contact',
];

const TAB_LABELS: Record<string, string> = {
  home: 'Home',
  profile: 'Profile',
  education: 'Education',
  projects: 'Projects',
  certificates: 'Certificates',
  achievements: 'Achievements',
  experience: 'Experience',
  contact: 'Contact',
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageTab>(() => {
    const initialPage = resolveCurrentPage();
    // If URL had a '#' or ?page= query param on a valid page, cleanly replace state in history without '#'
    if (typeof window !== 'undefined' && initialPage !== '404') {
      const targetUrl = getPageUrl(initialPage);
      if (window.location.hash || window.location.search || window.location.pathname !== targetUrl) {
        window.history.replaceState({ page: initialPage }, '', targetUrl);
      }
    }
    return initialPage;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => resolveCurrentPage() !== '404');
  const [isContentReady, setIsContentReady] = useState<boolean>(() => resolveCurrentPage() === '404');
  const [sphereTransitionId, setSphereTransitionId] = useState<number>(0);
  const [isTabTransitioning, setIsTabTransitioning] = useState<boolean>(false);
  const tabTransitionTimerRef = React.useRef<number | null>(null);
  const pullSphereProgressRef = React.useRef<number>(0);
  const mainContentRef = React.useRef<HTMLElement | null>(null);
  const pullIndicatorRef = React.useRef<HTMLDivElement | null>(null);
  const pullLabelRef = React.useRef<HTMLSpanElement | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const getNextTab = (current: PageTab): PageTab => {
    const idx = TAB_SEQUENCE.indexOf(current);
    if (idx === -1) return 'home';
    return TAB_SEQUENCE[(idx + 1) % TAB_SEQUENCE.length];
  };

  const resetMobilePullVisuals = () => {
    pullSphereProgressRef.current = 0;
    if (mainContentRef.current) {
      mainContentRef.current.style.opacity = '';
      mainContentRef.current.style.transform = '';
    }
    if (pullIndicatorRef.current) {
      pullIndicatorRef.current.style.opacity = '0';
      pullIndicatorRef.current.style.transform = 'translate(-50%, 16px)';
    }
  };

  const triggerTabTransition = (page: PageTab, updateHistory = true, fromMobilePull = false) => {
    cursorScale.set(1);
    setIsCertificateModalOpen(false);

    if (updateHistory) {
      const targetUrl = getPageUrl(page);
      if (window.location.pathname !== targetUrl || window.location.hash) {
        window.history.pushState({ page }, '', targetUrl);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === activePage && !isTabTransitioning && !fromMobilePull) {
      resetMobilePullVisuals();
      return;
    }

    if (page === '404') {
      if (tabTransitionTimerRef.current !== null) {
        window.clearTimeout(tabTransitionTimerRef.current);
      }
      resetMobilePullVisuals();
      setIsTabTransitioning(false);
      setActivePage('404');
      return;
    }

    // Update activePage immediately so header indicator reflects the chosen tab,
    // while holding the new tab's elements until particles form a sphere and spread out
    setActivePage(page);
    setIsTabTransitioning(true);
    setSphereTransitionId((prev) => prev + 1);
    resetMobilePullVisuals();

    if (tabTransitionTimerRef.current !== null) {
      window.clearTimeout(tabTransitionTimerRef.current);
    }
    // Slower transition timing: 1460ms for full shrink-to-sphere + hold + spread;
    // 880ms when triggered from mobile pull where sphere is already formed on release
    const revealDelayMs = fromMobilePull ? 880 : 1460;
    tabTransitionTimerRef.current = window.setTimeout(() => {
      setIsTabTransitioning(false);
      tabTransitionTimerRef.current = null;
    }, revealDelayMs);
  };

  const handleNavigate = (page: PageTab) => {
    triggerTabTransition(page, true, false);
  };

  useEffect(() => {
    const handlePopState = () => {
      const currentPage = resolveCurrentPage();
      triggerTabTransition(currentPage, false, false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activePage, isTabTransitioning]);

  // Mobile bottom overscroll pull-to-sphere -> release to switch to next tab
  useEffect(() => {
    let bottomAnchorY: number | null = null;
    let isTrackingBottomPull = false;

    const isAtPageBottom = (): boolean => {
      const scrollEl = document.scrollingElement || document.documentElement;
      const maxScroll = Math.max(0, scrollEl.scrollHeight - window.innerHeight);
      return window.scrollY >= maxScroll - 10;
    };

    const isIgnoredTarget = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;
      // Ignore pulls inside scrollable overlays like AI chat or open fullscreen menu
      return !!target.closest('.overflow-y-auto');
    };

    const updatePullVisuals = (progress: number) => {
      pullSphereProgressRef.current = progress;
      const nextTab = getNextTab(activePage);
      const nextLabel = TAB_LABELS[nextTab] || 'Next';

      if (mainContentRef.current) {
        if (progress > 0.01) {
          const contentOpacity = Math.max(0.08, 1 - progress * 0.88);
          const contentScale = 1 - progress * 0.04;
          mainContentRef.current.style.opacity = contentOpacity.toFixed(3);
          mainContentRef.current.style.transform = `scale(${contentScale.toFixed(3)})`;
        } else {
          mainContentRef.current.style.opacity = '';
          mainContentRef.current.style.transform = '';
        }
      }

      if (pullIndicatorRef.current && pullLabelRef.current) {
        if (progress > 0.04) {
          const isReady = progress >= 0.92;
          pullIndicatorRef.current.style.opacity = Math.min(1, progress * 1.6).toFixed(2);
          pullIndicatorRef.current.style.transform = `translate(-50%, ${Math.round((1 - progress) * 14)}px)`;
          pullIndicatorRef.current.style.borderColor = isReady
            ? 'rgba(0, 243, 255, 0.85)'
            : 'rgba(0, 243, 255, 0.3)';
          pullIndicatorRef.current.style.boxShadow = isReady
            ? '0 0 20px rgba(0, 243, 255, 0.45)'
            : '0 4px 16px rgba(0, 0, 0, 0.5)';
          pullLabelRef.current.textContent = isReady
            ? `Release for ${nextLabel} →`
            : `Scroll down for ${nextLabel} • ${Math.round(progress * 100)}%`;
        } else {
          pullIndicatorRef.current.style.opacity = '0';
          pullIndicatorRef.current.style.transform = 'translate(-50%, 16px)';
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isLoading || isTabTransitioning || isCertificateModalOpen || activePage === '404') {
        bottomAnchorY = null;
        isTrackingBottomPull = false;
        return;
      }
      if (e.touches.length !== 1 || isIgnoredTarget(e.target)) {
        bottomAnchorY = null;
        isTrackingBottomPull = false;
        return;
      }

      if (isAtPageBottom()) {
        bottomAnchorY = e.touches[0].clientY;
        isTrackingBottomPull = true;
      } else {
        bottomAnchorY = null;
        isTrackingBottomPull = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isLoading || isTabTransitioning || isCertificateModalOpen || activePage === '404') return;
      if (e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;

      if (!isAtPageBottom()) {
        bottomAnchorY = null;
        isTrackingBottomPull = false;
        if (pullSphereProgressRef.current > 0) {
          updatePullVisuals(0);
        }
        return;
      }

      // Just reached the bottom during this drag: anchor finger Y here
      if (!isTrackingBottomPull || bottomAnchorY === null) {
        bottomAnchorY = currentY;
        isTrackingBottomPull = true;
        return;
      }

      // User is dragging finger upward (scrolling down further past the bottom)
      const pullPixels = Math.max(0, bottomAnchorY - currentY);
      const DEADZONE_PX = 20;
      const FULL_SPHERE_PULL_PX = 155;

      if (pullPixels <= DEADZONE_PX) {
        if (pullSphereProgressRef.current > 0) {
          updatePullVisuals(0);
        }
        return;
      }

      const progress = Math.min(1, (pullPixels - DEADZONE_PX) / FULL_SPHERE_PULL_PX);
      updatePullVisuals(progress);
    };

    const handleTouchEnd = () => {
      if (!isTrackingBottomPull) return;
      const finalProgress = pullSphereProgressRef.current;
      bottomAnchorY = null;
      isTrackingBottomPull = false;

      if (finalProgress >= 0.92 && !isLoading && !isTabTransitioning && activePage !== '404') {
        const nextTab = getNextTab(activePage);
        triggerTabTransition(nextTab, true, true);
      } else if (finalProgress > 0) {
        updatePullVisuals(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [activePage, isLoading, isTabTransitioning, isCertificateModalOpen]);

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

  if (activePage === '404') {
    return (
      <>
        <LiquidBackground />
        <InteractiveParticles />
        <div className="relative z-10 md:cursor-none min-h-screen flex flex-col justify-between">
          <NotFound onGoHome={() => handleNavigate('home')} />
        </div>
        <motion.div
          className="glass-cursor-dark fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[9999] hidden md:block"
          style={{
            x: cursorX,
            y: cursorY,
            scale: cursorScale,
          }}
        />
      </>
    );
  }

  return (
    <>
      {isLoading && (
        <AppleHelloLoader
          onExitStart={() => setIsContentReady(true)}
          onComplete={() => {
            setIsContentReady(true);
            setIsLoading(false);
          }}
        />
      )}

      <LiquidBackground />
      <InteractiveParticles
        activePage={activePage}
        sphereTransitionId={sphereTransitionId}
        pullSphereProgressRef={pullSphereProgressRef}
      />
      <ScrollHUD />

      {/* Mobile Bottom Pull-to-Sphere Next Tab Indicator */}
      <div
        ref={pullIndicatorRef}
        className="fixed bottom-6 left-1/2 z-50 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md border border-[#00f3ff]/30 text-[#00f3ff] text-xs font-mono uppercase tracking-widest pointer-events-none select-none transition-opacity duration-150"
        style={{ opacity: 0, transform: 'translate(-50%, 16px)' }}
      >
        <span ref={pullLabelRef}>Scroll down for Next</span>
      </div>
      
      <div className="relative z-10 md:cursor-none min-h-screen flex flex-col justify-between">
        <Header activePage={activePage} onNavigate={handleNavigate} isHidden={isCertificateModalOpen} />
        
        <main ref={mainContentRef} className="flex-grow transition-transform duration-75 origin-center">
          <AnimatePresence mode="wait">
            {isContentReady && !isTabTransitioning && activePage === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <Hero onNavigate={handleNavigate} />
              </motion.div>
            )}

            {isContentReady && !isTabTransitioning && activePage === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <ProjectList />
              </motion.div>
            )}

            {isContentReady && !isTabTransitioning && activePage === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <About />
              </motion.div>
            )}

            {isContentReady && !isTabTransitioning && activePage === 'experience' && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <Experience />
              </motion.div>
            )}

            {isContentReady && !isTabTransitioning && activePage === 'education' && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <Education />
              </motion.div>
            )}

            {isContentReady && !isTabTransitioning && activePage === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <Achievements />
              </motion.div>
            )}

            {isContentReady && !isTabTransitioning && activePage === 'certificates' && (
              <motion.div
                key="certificates"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <Certificates onModalChange={setIsCertificateModalOpen} />
              </motion.div>
            )}

            {isContentReady && !isTabTransitioning && activePage === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
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