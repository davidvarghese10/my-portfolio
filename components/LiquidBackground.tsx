import React from 'react';

const LiquidBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Static subtle grid lines (zero scroll re-paint overhead) */}
      <div
        className="absolute inset-0 opacity-[0.028] z-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00f3ff 1px, transparent 1px), linear-gradient(to bottom, #00f3ff 1px, transparent 1px)',
          backgroundSize: '8vw 8vw',
        }}
      />

      {/* Hardware-accelerated native radial gradients (Zero Gaussian blur shader load on both desktop & mobile) */}
      {/* Top-Left Ambient Cyan Glow */}
      <div
        className="absolute top-[-18%] left-[-15%] w-[75vw] h-[75vw] md:w-[60vw] md:h-[60vw] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0, 243, 255, 0.16) 0%, rgba(0, 243, 255, 0.05) 42%, rgba(0, 243, 255, 0) 70%)',
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* Bottom-Right Ambient Deep Blue Glow */}
      <div
        className="absolute bottom-[-22%] right-[-15%] w-[85vw] h-[85vw] md:w-[68vw] md:h-[68vw] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0, 85, 255, 0.14) 0%, rgba(0, 85, 255, 0.05) 45%, rgba(0, 85, 255, 0) 70%)',
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* Center Ambient Cyan Accent */}
      <div
        className="absolute top-[28%] left-[25%] w-[60vw] h-[60vw] md:w-[48vw] md:h-[48vw] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0, 243, 255, 0.09) 0%, rgba(0, 243, 255, 0.02) 45%, rgba(0, 243, 255, 0) 68%)',
          transform: 'translate3d(0,0,0)',
        }}
      />
    </div>
  );
};

export default LiquidBackground;