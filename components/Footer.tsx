import React, { useRef } from 'react';
import { Github, Linkedin, Instagram, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      id="contact" 
      ref={containerRef}
      className="bg-transparent text-white pt-36 pb-12 px-6 md:px-12 relative z-10 min-h-screen flex flex-col justify-between"
    >
      <div className="max-w-[90vw] mx-auto w-full flex flex-col justify-between flex-grow">
        
        {/* Top Contact Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start gap-8"
        >
          <div className="max-w-xl">
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-4 flex items-center gap-2">
              <Mail size={14} className="text-[#00f3ff]" />
              // Contact &bull; Get In Touch
            </span>
            <h3 className="text-3xl md:text-5xl font-medium uppercase tracking-tight text-white mb-4">
              Let's connect &amp; build together.
            </h3>
            <p className="text-neutral-400 font-light text-base md:text-lg">
              Have a project, hackathon collaboration, or internship opportunity? Feel free to reach out directly via email or on social platforms.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <a 
              href="https://github.com/davidvarghese10" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub"
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
            >
              <Github size={22} strokeWidth={1.5} />
            </a>
            <a 
              href="https://leetcode.com/u/david_1000/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LeetCode"
              className="p-2 text-neutral-400 hover:text-[#FFA116] hover:bg-white/5 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              {/* Official LeetCode Icon */}
              <div className="w-[22px] h-[22px] flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-5 h-5"
                >
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                </svg>
              </div>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              className="p-2 text-neutral-400 hover:text-[#E1306C] hover:bg-white/5 rounded-xl transition-all duration-300"
            >
              <Instagram size={22} strokeWidth={1.5} />
            </a>
            <a 
              href="https://www.linkedin.com/in/david-varghese-solchadav-group/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="p-2 text-neutral-400 hover:text-[#0A66C2] hover:bg-white/5 rounded-xl transition-all duration-300"
            >
              <Linkedin size={22} strokeWidth={1.5} />
            </a>
          </div>
        </motion.div>

        {/* Kinetic CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-auto pt-16 md:pt-24 flex justify-center w-full"
        >
          <a 
            href="mailto:david3005.scd@gmail.com" 
            className="group relative inline-flex items-center justify-center gap-5 md:gap-6 px-8 py-4 md:px-12 md:py-6 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 hover:border-[#00f3ff]/40 shadow-2xl transition-all"
          >
            {/* Liquid Swipe Color Background */}
            <div className="absolute inset-0 bg-[#00f3ff] origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
            
            {/* Content */}
            <span className="relative z-10 text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight font-poppins text-neutral-200 group-hover:text-black transition-colors duration-300">
              Get in Touch
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="relative z-10 w-6 h-6 md:w-9 md:h-9 text-neutral-400 group-hover:text-black transition-colors duration-300 shrink-0"
            >
              <path d="M6 18 L15.2 8.8" />
              <path d="M18 6 L9 6" />
              <path d="M18 10 L18 16" />
            </svg>
          </a>
        </motion.div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-neutral-900 text-neutral-600 text-xs uppercase tracking-widest font-medium">
          <p>&copy; 2026 David Varghese</p>
          <p>Aspiring Software Developer</p>
          <p className="mt-4 md:mt-0">Local Time: {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</p>
        </div>

      </div>
    </div>
  );
};

export default Footer;