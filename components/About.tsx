import React, { useRef } from 'react';
import SkillChart from './SkillChart';
import { motion, useScroll, useTransform } from 'framer-motion';

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Dual-column parallax displacement
  const leftColY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rightColY = useTransform(scrollYProgress, [0, 1], [80, -60]);

  return (
    <div 
      id="profile" 
      ref={containerRef}
      className="py-32 px-6 md:px-12 bg-transparent text-white min-h-screen relative z-10"
    >
      <div className="max-w-[90vw] mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Left Column: Title & Bio with Parallax */}
          <motion.div 
            style={{ y: leftColY }}
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-6">
              // Profile &bull; Philosophy
            </span>
            <h3 className="text-4xl md:text-6xl font-medium uppercase leading-[1.1] mb-12 tracking-tight">
              I help brands stand out through <span className="text-[#00f3ff]">design</span> &amp; <span className="text-neutral-500">technology</span>.
            </h3>
            <div className="space-y-6 text-base md:text-lg font-light leading-relaxed text-neutral-400 max-w-xl">
              <p>
                Based in India, I work as a Creative Developer combining rigorous engineering with a refined design sensibility. I craft memorable, fluid digital products with mathematical precision.
              </p>
              <p>
                Every micro-interaction and physics-based motion is engineered to feel weightless and intentional.
              </p>
            </div>

            {/* Live Stats with Scroll Trigger */}
            <div className="mt-14 grid grid-cols-2 gap-8 border-t border-neutral-800/80 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-baseline gap-1">
                  <h4 className="text-5xl font-bold font-oswald text-white">4+</h4>
                  <span className="text-sm font-mono text-[#00f3ff]">YRS</span>
                </div>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mt-1">
                  Experience
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-baseline gap-1">
                  <h4 className="text-5xl font-bold font-oswald text-white">30+</h4>
                  <span className="text-sm font-mono text-[#00f3ff]">EXP</span>
                </div>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 mt-1">
                  Shipped Projects
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Skills & Radar Chart with Counter-Parallax */}
          <motion.div 
            id="skills" 
            style={{ y: rightColY }}
            className="lg:w-1/2 pt-12 lg:pt-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#00f3ff] mb-6">
              // Core Capabilities
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
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff]" />
                  <h5 className="font-mono font-bold uppercase text-xs tracking-wider text-white">
                    Engineering
                  </h5>
                </div>
                <ul className="space-y-1.5 text-sm text-neutral-400 font-light">
                  <li>React 19 &bull; Next.js</li>
                  <li>TypeScript Architecture</li>
                  <li>Framer Motion &bull; Scroll APIs</li>
                  <li>WebGL &bull; 3D / Shaders</li>
                </ul>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-6 bg-black/30 backdrop-blur-md border border-white/5 rounded-xl hover:border-[#00f3ff]/20 hover:bg-black/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff]" />
                  <h5 className="font-mono font-bold uppercase text-xs tracking-wider text-white">
                    Creative Design
                  </h5>
                </div>
                <ul className="space-y-1.5 text-sm text-neutral-400 font-light">
                  <li>UI / UX Architecture</li>
                  <li>Kinetic &amp; Scroll Motion</li>
                  <li>Generative AI Interfaces</li>
                  <li>Art Direction &bull; Typography</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default About;