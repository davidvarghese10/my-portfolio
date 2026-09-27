import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { Github, Linkedin, Instagram } from 'lucide-react';

interface DockItemData {
  title: string;
  href: string;
  icon: React.ReactNode;
  brandColor: string;
  glowColor: string;
}

const LeetCodeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
  </svg>
);

const DOCK_ITEMS: DockItemData[] = [
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/in/david-varghese-solchadav-group/',
    icon: <Linkedin size={21} strokeWidth={1.75} />,
    brandColor: 'hover:!text-[#0A66C2] hover:!border-[#0A66C2]/80 hover:bg-[#0A66C2]/20',
    glowColor: 'rgba(10, 102, 194, 0.75)',
  },
  {
    title: 'GitHub',
    href: 'https://github.com/davidvarghese10',
    icon: <Github size={21} strokeWidth={1.75} />,
    brandColor: 'hover:!text-white hover:!border-[#00f3ff]/80 hover:bg-[#00f3ff]/25',
    glowColor: 'rgba(0, 243, 255, 0.5)',
  },
  {
    title: 'LeetCode',
    href: 'https://leetcode.com/u/david_1000/',
    icon: <LeetCodeIcon className="w-[21px] h-[21px]" />,
    brandColor: 'hover:!text-[#FFA116] hover:!border-[#FFA116]/80 hover:bg-[#FFA116]/15',
    glowColor: 'rgba(255, 161, 22, 0.5)',
  },
  {
    title: 'Instagram',
    href: 'https://instagram.com',
    icon: <Instagram size={21} strokeWidth={1.75} />,
    brandColor: 'hover:!text-[#E1306C] hover:!border-[#E1306C]/80 hover:bg-[#E1306C]/15',
    glowColor: 'rgba(225, 48, 108, 0.5)',
  },
];

interface DockIconItemProps {
  item: DockItemData;
  mouseX: MotionValue<number>;
}

const DockIconItem: React.FC<DockIconItemProps> = ({ item, mouseX }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  // Measure distance between mouse and icon center X
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

// macOS dock magnification interpolation - expands upwards from the bottom while keeping the bottom line still
  const widthSync = useTransform(distance, [-110, 0, 110], [46, 62, 46]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 15 });

  const iconScaleSync = useTransform(distance, [-110, 0, 110], [1, 1.25, 1]);
  const iconScale = useSpring(iconScaleSync, { mass: 0.1, stiffness: 220, damping: 15 });

  return (
    <div className="flex flex-col items-center justify-end relative">
      {/* Dock Magnifying Icon Button */}
      <motion.a
        ref={ref}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.title}
        style={{ width, height: width }}
        className={`group relative rounded-2xl flex items-center justify-center origin-bottom text-[#00f3ff]/80 bg-[#00f3ff]/[0.08] border border-[#00f3ff]/30 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.45),0_0_12px_rgba(0,243,255,0.12),inset_0_1px_1.5px_rgba(0,243,255,0.4)] transition-colors duration-200 cursor-pointer ${item.brandColor}`}
      >
        {/* Neon blue glass top specular sheen */}
        <div className="absolute inset-x-0 top-0 h-[40%] rounded-t-2xl pointer-events-none bg-gradient-to-b from-[#00f3ff]/30 via-[#00f3ff]/10 to-transparent" />

        {/* Hover Ambient Glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: `0 0 22px ${item.glowColor}` }}
        />

        {/* Magnified Icon */}
        <motion.div 
          style={{ scale: iconScale }}
          className="relative z-10 flex items-center justify-center transition-colors"
        >
          {item.icon}
        </motion.div>
      </motion.a>
    </div>
  );
};

export const FloatingDock: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div 
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`relative inline-flex flex-col items-center ${className}`}
    >
      {/* Dock Outer Ambient Neon Blue Glow */}
      <div className="absolute -inset-1.5 rounded-[34px] bg-gradient-to-r from-[#00f3ff]/30 via-[#00cce0]/15 to-[#00f3ff]/30 blur-xl pointer-events-none -z-10" />

      {/* Dock Body / Island */}
      <div
        className="relative flex items-end h-[68px] pb-2.5 sm:pb-3 gap-2.5 sm:gap-3.5 px-3.5 sm:px-4 rounded-[28px] bg-gradient-to-b from-[#00f3ff]/15 via-black/80 to-black/95 backdrop-blur-2xl border border-[#00f3ff]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,243,255,0.22),inset_0_1px_2px_rgba(0,243,255,0.5)]"
      >
        {/* Top Rim Neon Blue Specular Highlight */}
        <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00f3ff]/70 to-transparent pointer-events-none" />

        {/* Dock Items */}
        {DOCK_ITEMS.map((item) => (
          <DockIconItem key={item.title} item={item} mouseX={mouseX} />
        ))}
      </div>

      {/* Soft Ground Shadow with Subtle Neon Blue Cast */}
      <div className="w-[82%] h-3.5 -mt-1 rounded-full bg-[#00f3ff]/20 blur-md pointer-events-none -z-20" />
    </div>
  );
};

export default FloatingDock;
