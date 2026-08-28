import React, { useRef } from 'react';
import SkillChart from './SkillChart';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Code2, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      id="profile" 
      ref={containerRef}
      className="pt-36 pb-24 px-6 md:px-12 bg-transparent text-white min-h-screen relative z-10 flex flex-col justify-between"
    >
      <div className="max-w-[90vw] mx-auto w-full">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Title & Bio */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-6 flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#00f3ff]" />
              // Profile &bull; Developer Background
            </span>
            <h3 className="text-4xl md:text-6xl font-medium uppercase leading-[1.1] mb-8 tracking-tight">
              Building practical systems with <span className="text-[#00f3ff]">code</span> &amp; <span className="text-neutral-500">security</span>.
            </h3>
            <div className="space-y-5 text-base md:text-lg font-light leading-relaxed text-neutral-300 max-w-xl">
              <p>
                I’m a Computer Science and Engineering student and aspiring software developer based in Kerala, India. My passion lies in building practical software, cybersecurity, and emerging technologies.
              </p>
              <p className="text-neutral-400 text-sm md:text-base">
                Whether creating AI-assisted fraud detection systems, interactive weather platforms, disease prediction tools, or algorithmic equation solvers, I focus on turning ideas into resilient, real-world solutions.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-neutral-800/80 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-baseline gap-1">
                  <h4 className="text-4xl font-bold font-oswald text-white">CSE</h4>
                </div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00f3ff] mt-1">
                  Student
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-baseline gap-1">
                  <h4 className="text-4xl font-bold font-oswald text-white">4+</h4>
                </div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00f3ff] mt-1">
                  Projects
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-baseline gap-1">
                  <h4 className="text-4xl font-bold font-oswald text-white">5+</h4>
                </div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00f3ff] mt-1">
                  Hackathons
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Skills Radar & Capabilities */}
          <motion.div 
            id="skills" 
            className="lg:w-1/2 w-full pt-4 lg:pt-0"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-6 flex items-center gap-2">
              <Cpu size={14} className="text-[#00f3ff]" />
              // Technical Capabilities
            </span>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden group hover:border-[#00f3ff]/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f3ff]/10 rounded-full blur-2xl pointer-events-none" />
              <SkillChart />
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-6 bg-black/30 backdrop-blur-md border border-white/5 rounded-xl hover:border-[#00f3ff]/20 hover:bg-black/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Code2 size={14} className="text-[#00f3ff]" />
                  <h5 className="font-mono font-bold uppercase text-xs tracking-wider text-white">
                    Core Engineering
                  </h5>
                </div>
                <ul className="space-y-1.5 text-sm text-neutral-400 font-light">
                  <li>OOP in Java &bull; C Programming</li>
                  <li>DSA &bull; Algorithms &amp; Math</li>
                  <li>Python &bull; React &bull; TypeScript</li>
                  <li>Cybersecurity &amp; Threat Detection</li>
                  <li>REST APIs &bull; System Architecture</li>
                </ul>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-6 bg-black/30 backdrop-blur-md border border-white/5 rounded-xl hover:border-[#00f3ff]/20 hover:bg-black/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-[#00f3ff]" />
                  <h5 className="font-mono font-bold uppercase text-xs tracking-wider text-white">
                    Emerging Tech
                  </h5>
                </div>
                <ul className="space-y-1.5 text-sm text-neutral-400 font-light">
                  <li>Applied AI &amp; Machine Learning</li>
                  <li>Interactive UI &amp; Motion Design</li>
                  <li>Hackathon Prototyping</li>
                  <li>Modern Dev Tools &amp; Cloud</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <p>&copy; 2026 David Varghese</p>
        <p className="text-neutral-500">Kerala, India</p>
      </div>
    </div>
  );
};

export default About;