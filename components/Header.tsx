import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { PageTab } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activePage: PageTab;
  onNavigate: (page: PageTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (page: PageTab) => {
    onNavigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active label for center indicator
  const currentItem = NAV_ITEMS.find((item) => (item.href as PageTab) === activePage);
  const activeLabel = currentItem ? currentItem.label : 'Home';

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-6 text-[#00f3ff] transition-colors duration-300 ${
          menuOpen ? 'bg-transparent border-transparent' : 'bg-black/40 backdrop-blur-md border-b border-white/5'
        }`}
      >
        {/* Brand / Logo */}
        <button 
          type="button"
          onClick={() => handleNav('home')} 
          className="text-md font-bold tracking-tighter uppercase flex flex-col leading-none text-left cursor-pointer hover:opacity-80 transition-opacity z-50 bg-transparent outline-none focus:outline-none select-none"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          <span className="text-[#00f3ff]">David</span>
          <span className="text-white">Varghese</span>
        </button>

        {/* Selected Tab Display at Center Top (hidden on Home, Mobile, and while Menu is Open) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center pointer-events-none">
          <AnimatePresence mode="wait">
            {activePage !== 'home' && !menuOpen && (
              <motion.div
                key={activePage}
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#00f3ff] bg-[#00f3ff]/10 shadow-[0_0_15px_rgba(0,243,255,0.25)] border border-[#00f3ff]/30 backdrop-blur-md pointer-events-auto"
              >
                <span>{activeLabel}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animated Hamburger Button (3 lines directly morph into Over-Under Interlaced 'X') */}
        <motion.button 
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f3ff]/40 shadow-lg cursor-pointer transition-all duration-300 group outline-none focus:outline-none"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          whileTap={{ scale: 0.94 }}
        >
          <svg
            viewBox="0 0 24 24"
            className={`w-6 h-6 transition-all duration-300 ${
              menuOpen ? 'text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.7)]' : 'text-white group-hover:text-[#00f3ff]'
            }`}
            fill="none"
          >
            {/* Top Line -> Top-Left Branch of Interlaced X */}
            <motion.line
              animate={
                menuOpen
                  ? { x1: 4.5, y1: 4.5, x2: 9.5, y2: 9.5, stroke: '#00f3ff' }
                  : { x1: 3.5, y1: 6.5, x2: 20.5, y2: 6.5, stroke: 'currentColor' }
              }
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Middle Line -> Continuous Bottom-Left to Top-Right Diagonal of Interlaced X */}
            <motion.line
              animate={
                menuOpen
                  ? { x1: 4.5, y1: 19.5, x2: 19.5, y2: 4.5, stroke: '#00f3ff' }
                  : { x1: 3.5, y1: 12, x2: 20.5, y2: 12, stroke: 'currentColor' }
              }
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Bottom Line -> Bottom-Right Branch of Interlaced X */}
            <motion.line
              animate={
                menuOpen
                  ? { x1: 14.5, y1: 14.5, x2: 19.5, y2: 19.5, stroke: '#00f3ff' }
                  : { x1: 3.5, y1: 17.5, x2: 20.5, y2: 17.5, stroke: 'currentColor' }
              }
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </motion.button>
      </motion.header>

      {/* Fullscreen Cyberpunk Glass Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-2xl flex flex-col justify-between px-8 md:px-20 pt-28 pb-12 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMenuOpen(false);
            }}
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#00f3ff]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#00f3ff]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Navigation List */}
            <div className="relative z-10 my-auto py-6 max-w-4xl">
              <ul className="space-y-4 md:space-y-6">
                {NAV_ITEMS.map((item, idx) => {
                  const pageKey = item.href as PageTab;
                  const isActive = activePage === pageKey;
                  return (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35, delay: idx * 0.04 }}
                      className="bg-transparent"
                    >
                      <button
                        type="button"
                        onClick={() => handleNav(pageKey)}
                        className={`group flex items-baseline gap-4 md:gap-8 text-left cursor-pointer transition-all duration-300 w-full py-1 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent outline-none focus:outline-none focus:ring-0 select-none ${
                          isActive ? 'text-[#00f3ff]' : 'text-neutral-400 hover:text-white'
                        }`}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                          outline: 'none',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <span className="font-mono text-xs md:text-sm text-neutral-600 group-hover:text-[#00f3ff] transition-colors select-none bg-transparent">
                          {String(idx + 1).padStart(2, '0')} //
                        </span>
                        <span className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tight font-poppins group-hover:translate-x-3 md:group-hover:translate-x-4 transition-transform duration-300 flex items-center gap-4 select-none bg-transparent">
                          {item.label}
                          {isActive && (
                            <span className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#00f3ff] shadow-[0_0_15px_#00f3ff]" />
                          )}
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* Menu Footer Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 pt-8 border-t border-white/10 flex justify-between items-center text-xs font-mono text-neutral-400"
            >
              <div>
                <span className="text-white font-semibold">David Varghese</span> &bull; Kerala, India
              </div>
              <div className="text-neutral-500">
                Portfolio &bull; 2026
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;