import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const LiquidBackground: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 });

  // Parallax and morph transformations driven by scroll
  const blob1Y = useTransform(smoothProgress, [0, 1], ['0%', '80%']);
  const blob1Rotate = useTransform(smoothProgress, [0, 1], [0, 180]);
  const blob1Scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.3, 0.9]);

  const blob2Y = useTransform(smoothProgress, [0, 1], ['0%', '-60%']);
  const blob2Rotate = useTransform(smoothProgress, [0, 1], [0, -120]);
  const blob2Scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.8, 1.4]);

  const blob3Y = useTransform(smoothProgress, [0, 1], ['0%', '40%']);
  const blob3Opacity = useTransform(smoothProgress, [0, 0.5, 1], [0.1, 0.22, 0.12]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.07] z-20 mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle grid lines reacting slightly to scroll */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage: 'linear-gradient(to right, #00f3ff 1px, transparent 1px), linear-gradient(to bottom, #00f3ff 1px, transparent 1px)',
          backgroundSize: '8vw 8vw',
          y: useTransform(smoothProgress, [0, 1], [0, -150])
        }}
      />

      {/* Gradient Blob 1 - Neon Blue with Scroll Parallax */}
      <motion.div
        style={{
          y: blob1Y,
          rotate: blob1Rotate,
          scale: blob1Scale
        }}
        animate={{
          x: [0, 60, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#00f3ff] opacity-[0.16] blur-[110px]"
      />

      {/* Gradient Blob 2 - Deep Indigo/Blue shift with Counter-Scroll Parallax */}
      <motion.div
        style={{
          y: blob2Y,
          rotate: blob2Rotate,
          scale: blob2Scale
        }}
        animate={{
          x: [0, -60, 40, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[65vw] h-[65vw] rounded-full bg-[#0055ff] opacity-[0.12] blur-[130px]"
      />

      {/* Gradient Blob 3 - Center Ambient Accent */}
      <motion.div
        style={{
          y: blob3Y,
          opacity: blob3Opacity
        }}
        animate={{
          x: [-40, 40, -40],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[30%] left-[30%] w-[45vw] h-[45vw] rounded-full bg-[#00f3ff] blur-[100px]"
      />
    </div>
  );
};

export default LiquidBackground;