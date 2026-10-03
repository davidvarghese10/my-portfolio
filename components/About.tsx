import React, { useRef, useState, useEffect } from 'react';
import SkillChart from './SkillChart';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { ShieldCheck, Cpu, Code2, Sparkles } from 'lucide-react';

interface PhysicalDigitRollerProps {
  digit: number;
  delay?: number;
  spins?: number;
  isInView: boolean;
}

const PhysicalDigitRoller: React.FC<PhysicalDigitRollerProps> = ({ digit, delay = 0, spins = 1, isInView }) => {
  const numbers = React.useMemo(
    () => Array.from({ length: spins * 10 + digit + 1 }, (_, i) => i % 10),
    [spins, digit]
  );
  const targetIndex = isInView ? numbers.length - 1 : 0;

  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden align-middle select-none px-0 bg-transparent">
      {/* Clean vertical rolling digit strip */}
      <motion.span
        initial={{ y: 0 }}
        animate={{ y: `-${(targetIndex / numbers.length) * 100}%` }}
        transition={{
          duration: 1.6 + delay * 0.6,
          delay: delay,
          ease: [0.12, 0.95, 0.22, 1], // Smooth physical inertia tumbler curve
        }}
        className="inline-flex flex-col text-center bg-transparent"
      >
        {numbers.map((num, idx) => (
          <span
            key={idx}
            className="h-[1.15em] flex items-center justify-center font-oswald text-white leading-none bg-transparent"
          >
            {num}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

interface PhysicalNumberRollerProps {
  target: number;
  suffix?: string;
  digitGap?: string;
  suffixMargin?: string;
}

const PhysicalNumberRoller: React.FC<PhysicalNumberRollerProps> = ({ 
  target, 
  suffix = '+',
  digitGap,
  suffixMargin = 'ml-[3px]',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const digits = String(target).split('').map(Number);

  const effectiveGapClass = digitGap 
    ? digitGap 
    : target === 10 
      ? 'gap-0' 
      : 'gap-[1.5px]';

  return (
    <span ref={ref} className="inline-flex items-center font-oswald tabular-nums leading-none">
      <span className={`inline-flex items-center ${effectiveGapClass}`}>
        {digits.map((d, i) => (
          <span 
            key={i} 
            className={`inline-flex items-center ${target === 10 && i === 1 ? '-ml-[1px]' : ''}`}
          >
            <PhysicalDigitRoller
              digit={d}
              delay={i * 0.12}
              spins={1}
              isInView={isInView}
            />
          </span>
        ))}
      </span>
      <span className={`font-oswald text-white select-none self-center leading-none ${suffixMargin}`}>
        {suffix}
      </span>
    </span>
  );
};

const TiltSkillsTile: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth springs for 3D rotation with zero layout reflow
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 220, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 220, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.25 }}
        className="relative rounded-2xl bg-black/60 border border-white/10 p-6 md:p-8 shadow-2xl transition-colors duration-300 group hover:border-[#00f3ff]/40 cursor-pointer will-change-transform"
      >
        {/* Ambient Corner Cyan Aura (zero per-frame shader overhead) */}
        <div 
          className="absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none" 
          style={{ 
            background: 'radial-gradient(circle at center, rgba(0,243,255,0.12) 0%, transparent 70%)',
            transform: 'translateZ(0px)',
          }}
        />

        {/* Floating 3D Holographic Stage / Projection Podium */}
        <motion.div 
          className="absolute inset-4 md:inset-6 rounded-2xl bg-[#00f3ff]/[0.03] border border-[#00f3ff]/30 pointer-events-none"
          style={{ 
            transform: 'translateZ(30px)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.7), 0 0 24px rgba(0,243,255,0.14)',
          }}
          animate={{
            translateZ: isHovered ? 42 : 30,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Cyber tech corner brackets visually anchoring the projection plane */}
          <span className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-[#00f3ff]/70" />
          <span className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-[#00f3ff]/70" />
          <span className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-[#00f3ff]/70" />
          <span className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-[#00f3ff]/70" />
        </motion.div>

        {/* Projected Web Graph - physically elevated in 3D space above the tile */}
        <motion.div
          style={{
            transform: 'translateZ(70px)',
            transformStyle: 'preserve-3d',
          }}
          animate={{
            translateZ: isHovered ? 95 : 70,
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative z-20 w-full"
        >
          <SkillChart />
        </motion.div>
      </motion.div>
    </div>
  );
};

const TiltSubCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 240, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 240, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 800 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={`p-6 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl hover:border-[#00f3ff]/30 hover:bg-black/60 transition-colors shadow-lg will-change-transform cursor-pointer ${className}`}
      >
        <div style={{ transform: 'translateZ(16px)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

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
                Whether creating sustainable transport planners, AI-assisted fraud detection systems, interactive weather platforms, disease prediction tools, or algorithmic equation solvers, I focus on turning ideas into resilient, real-world solutions.
              </p>
            </div>

            {/* Highlights Grid with Physical Number Roller Animation */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-neutral-800/80 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-1">
                  <h4 className="text-4xl font-bold font-oswald text-white flex items-center">
                    <PhysicalNumberRoller target={40} suffix="+" />
                  </h4>
                </div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00f3ff] mt-1">
                  Certificates
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-1">
                  <h4 className="text-4xl font-bold font-oswald text-white flex items-center">
                    <PhysicalNumberRoller target={7} suffix="+" />
                  </h4>
                </div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00f3ff] mt-1">
                  Projects
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-1">
                  <h4 className="text-4xl font-bold font-oswald text-white flex items-center">
                    <PhysicalNumberRoller target={10} suffix="+" />
                  </h4>
                </div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00f3ff] mt-1">
                  Hackathons
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Skills Radar Tile with 3D Tilt & Projected Web Graph */}
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
            
            {/* 3D Tilt Card with Projected Web Graph */}
            <TiltSkillsTile />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TiltSubCard>
                <div className="flex items-center gap-2 mb-3">
                  <Code2 size={14} className="text-[#00f3ff]" />
                  <h5 className="font-mono font-bold uppercase text-xs tracking-wider text-white">
                    Core Engineering
                  </h5>
                </div>
                <ul className="space-y-1.5 text-sm text-neutral-400 font-light">
                  <li>C / C++ &bull; SDL2 &bull; Make</li>
                  <li>OOP in Java &bull; Python</li>
                  <li>DSA &bull; Algorithms &amp; Math</li>
                  <li>React &bull; TypeScript &bull; Web</li>
                  <li>MySQL &bull; Relational Databases</li>
                  <li>Cybersecurity &amp; Threat Detection</li>
                  <li>REST APIs &bull; System Architecture</li>
                </ul>
              </TiltSubCard>

              <TiltSubCard>
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
              </TiltSubCard>
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