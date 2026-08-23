import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import LiquidBackground from './components/LiquidBackground';
import ScrollHUD from './components/ScrollHUD';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const App: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Mouse position for custom cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for cursor movement
  const cursorX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const cursorY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  
  // Smooth spring animation for cursor scale
  const cursorScale = useSpring(1, { stiffness: 200, damping: 25 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Offset by 10px to center the 20px cursor
      mouseX.set(e.clientX - 10);
      mouseY.set(e.clientY - 10);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      cursorScale.set(2.5); // Scale up smoothly on hover
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      cursorScale.set(1); // Scale down smoothly
    };

    window.addEventListener('mousemove', moveCursor);

    // Add hover listeners to interactive elements
    const addHoverListeners = () => {
      const hoverables = document.querySelectorAll('a, button, input, .cursor-pointer');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Initial add
    addHoverListeners();

    // Re-add listeners when DOM changes (simple observer)
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
      const hoverables = document.querySelectorAll('a, button, input, .cursor-pointer');
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [mouseX, mouseY, cursorScale]);

  return (
    <>
      <LiquidBackground />
      <ScrollHUD />
      
      <div className="relative z-10 cursor-none">
        <Header />
        
        <main>
          <Hero />
          <ProjectList />
          <About />
          <Footer />
        </main>

        <AIChat />
      </div>

      {/* Custom Liquid Glass Cursor */}
      <motion.div
        className="glass-cursor fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          scale: cursorScale,
        }}
      />
    </>
  );
};

export default App;