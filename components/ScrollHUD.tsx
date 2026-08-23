import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollHUD: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <>
      {/* Top Precision Scroll Progress Glow Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] to-[#00f3ff] origin-left z-[60] shadow-[0_0_10px_#00f3ff]"
        style={{ scaleX }}
      />
    </>
  );
};

export default ScrollHUD;
