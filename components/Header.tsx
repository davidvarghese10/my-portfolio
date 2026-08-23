import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { PageTab } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activePage: PageTab;
  onNavigate: (page: PageTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageTab) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-6 text-[#00f3ff] bg-black/40 backdrop-blur-md border-b border-white/5"
    >
      <button 
        onClick={() => handleNav('home')} 
        className="text-md font-bold tracking-tighter uppercase flex flex-col leading-none text-left cursor-pointer hover:opacity-80 transition-opacity"
      >
        <span className="text-[#00f3ff]">David</span>
        <span className="text-white">Varghese</span>
      </button>
      
      <nav className="hidden md:block">
        <ul className="flex items-center space-x-10">
          {NAV_ITEMS.map((item) => {
            const pageKey = item.href as PageTab;
            const isActive = activePage === pageKey;
            return (
              <li key={item.label} className="relative">
                <button 
                  onClick={() => handleNav(pageKey)}
                  className={`text-xs font-bold transition-all duration-300 uppercase tracking-widest px-3 py-1.5 rounded-full cursor-pointer flex items-center ${
                    isActive 
                      ? 'text-[#00f3ff] bg-[#00f3ff]/10 shadow-[0_0_15px_rgba(0,243,255,0.2)] border border-[#00f3ff]/30' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="text-xs font-mono font-medium tracking-widest uppercase hidden md:block text-neutral-400">
        Kerala, IN
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-white p-2 focus:outline-none cursor-pointer"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl"
          >
            {NAV_ITEMS.map((item) => {
              const pageKey = item.href as PageTab;
              const isActive = activePage === pageKey;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNav(pageKey)}
                  className={`text-left text-sm font-bold uppercase tracking-widest py-2 px-3 rounded-lg flex items-center justify-between ${
                    isActive 
                      ? 'text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/30' 
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#00f3ff]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;