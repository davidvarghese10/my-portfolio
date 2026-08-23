import React from 'react';
import { NAV_ITEMS } from '../constants';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-6 text-[#00f3ff] bg-black/30 backdrop-blur-md border-b border-white/5"
    >
      <div className="text-md font-bold tracking-tighter uppercase flex flex-col leading-none">
        <span>David</span>
        <span>Varghese</span>
      </div>
      
      <nav className="hidden md:block">
        <ul className="flex space-x-12">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a 
                href={item.href} 
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-xs font-bold text-neutral-400 hover:text-[#00f3ff] transition-colors uppercase tracking-widest"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-xs font-medium tracking-widest uppercase hidden md:block text-neutral-400">
        Kerala, IN
      </div>

      <div className="md:hidden text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>
    </motion.header>
  );
};

export default Header;