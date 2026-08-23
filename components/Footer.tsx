import React, { useRef } from 'react';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Footer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const getInTouchScale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const getInTouchY = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <div 
      id="contact" 
      ref={containerRef}
      className="bg-transparent text-white py-32 px-6 md:px-12 relative z-10 min-h-screen flex flex-col justify-between"
    >
      <div className="max-w-[90vw] mx-auto w-full flex flex-col justify-between flex-grow">
        
        {/* Top Contact Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start"
        >
          <div className="mb-12 md:mb-0">
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-4">
              // Contact
            </span>
            <p className="max-w-md text-neutral-400 font-light text-base md:text-lg">
              Have a project in mind? Let's build something great together. Available for freelance work.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              className="text-neutral-500 hover:text-[#00f3ff] transition-colors"
            >
              <Github size={24} strokeWidth={1.5} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter"
              className="text-neutral-500 hover:text-[#00f3ff] transition-colors"
            >
              <Twitter size={24} strokeWidth={1.5} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="text-neutral-500 hover:text-[#00f3ff] transition-colors"
            >
              <Instagram size={24} strokeWidth={1.5} />
            </a>
            <a 
              href="https://www.linkedin.com/in/david-varghese-solchadav-group/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="text-neutral-500 hover:text-[#00f3ff] transition-colors"
            >
              <Linkedin size={24} strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>

        {/* Big Kinetic CTA Banner with Scroll Scale & Poppins Font */}
        <motion.div 
          style={{ scale: getInTouchScale, y: getInTouchY }}
          className="mt-auto pt-24"
        >
          <a 
            href="mailto:david3005.scd@gmail.com" 
            className="group block relative p-6 md:p-8 -mx-4 rounded-[2.5rem] overflow-hidden backdrop-blur-sm"
          >
            {/* Liquid Swipe Color Background */}
            <div className="absolute inset-0 bg-[#00f3ff] origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
            
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-[10vw] leading-none font-bold uppercase tracking-tight font-poppins text-neutral-200 group-hover:text-black transition-colors duration-300 flex items-center gap-4">
                Get in Touch
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-[8vw] h-[8vw] text-neutral-700 group-hover:text-black transition-colors duration-300 flex-shrink-0"
                >
                  <path d="M6 18 L15.2 8.8" />
                  <path d="M18 6 L9 6" />
                  <path d="M18 10 L18 16" />
                </svg>
              </h2>
            </div>
          </a>
          
          <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-12 border-t border-neutral-900 text-neutral-600 text-xs uppercase tracking-widest font-medium">
            <p>&copy; 2025 David Varghese</p>
            <p>Designed &amp; Developed with Gemini</p>
            <p className="mt-4 md:mt-0">Local Time: {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Footer;