import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppleHelloLoaderProps {
  onExitStart?: () => void;
  onComplete: () => void;
}

export const AppleHelloLoader: React.FC<AppleHelloLoaderProps> = ({ onExitStart, onComplete }) => {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Begin fading out right after the 2.8s handwriting completes
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
      onExitStart?.();
      setTimeout(() => {
        onComplete();
      }, 320);
    }, 2850);

    return () => {
      clearTimeout(finishTimer);
    };
  }, [onExitStart, onComplete]);

  const handleSkip = () => {
    setIsFinished(true);
    onExitStart?.();
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  const helloPath = "M-109.06069946289062,95.92639923095703 C1.9544999599456787,157.6403045654297 103.11389923095703,236.9969940185547 217.881103515625,372.07550048828125 C296,464.2846984863281 337.9999084472656,569.5725708007812 340,642.1939697265625 C341,696.1920166015625 314.6702880859375,737.156005859375 266,737.156005859375 C212,737.156005859375 178,696.1920166015625 157,602.1610107421875 C134,498.82000732421875 117,380.239990234375 74,0 L78.21453094482422,37.160953521728516 C100.22924041748047,230.68260192871094 184,372 291,372 C355,372 395.6745910644531,321 384.1253967285156,248 C377.6238098144531,205 370.0873107910156,161 361.3063049316406,110 C351.0714111328125,46 380.3254089355469,-4 468.96173095703125,-4 C598.2246704101562,-4 739.2435302734375,67.83381652832031 811.4124145507812,179.0941619873047 C836,217 846,251 847,284 C848,344 814,389 754,389 C678,389 620,303 620,193 C620,75 684,-8 819.9180908203125,-8 C1004.7244873046875,-8 1209.4246826171875,213.84754943847656 1303.4808349609375,461.42327880859375 C1330.037353515625,531.3258056640625 1340,596.2349243164062 1340,641.593994140625 C1340,695.3764038085938 1323,736.673583984375 1275,736.673583984375 C1228,736.673583984375 1197,700.1784057617188 1169,642.5543823242188 C1136.1939697265625,575.7216186523438 1111.927734375,479.32598876953125 1102,370.3599853515625 C1077,96.94000244140625 1133,-4 1266.152099609375,-4 C1427.6083984375,-4 1607.1151123046875,220.92921447753906 1698.771728515625,462.18878173828125 C1725.037353515625,531.3258056640625 1735,596.2349243164062 1735,641.593994140625 C1735,695.3764038085938 1718,736.673583984375 1670,736.673583984375 C1623,736.673583984375 1592,700.1784057617188 1564,642.5543823242188 C1531.1939697265625,575.7216186523438 1506.927734375,479.32598876953125 1497,370.3599853515625 C1472,96.94000244140625 1528,-4 1646.906005859375,-4 C1765.623779296875,-4 1830.114990234375,99.48485565185547 1868.77880859375,209.3712158203125 C1907,318 1954,385 2052,385 C2133,385 2197,325 2197,212 C2197,87 2115.90087890625,-7 2013.41845703125,-8 C1923.234130859375,-9 1864,64 1870,174 C1877,296 1951,385 2048,385 C2104,385 2151.03564453125,360.1071472167969 2188,333 C2288.21435546875,259.8928527832031 2365.4287109375,305.0714416503906 2395,377.3571472167969";

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.02,
            transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } 
          }}
          onClick={handleSkip}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0d0e12] cursor-pointer select-none overflow-hidden will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        >
          {/* Hardware-accelerated GPU Ambient Glow Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <div 
              className="w-[550px] h-[260px] rounded-full opacity-60 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.22) 0%, rgba(2,132,199,0.12) 45%, rgba(13,14,18,0) 70%)',
                transform: 'translate3d(0,0,0)',
                willChange: 'opacity'
              }}
            />
          </div>

          {/* Authentic Official Apple "hello" SVG Canvas */}
          <div 
            className="relative z-10 w-[90vw] max-w-[780px] flex items-center justify-center p-4"
            style={{ transform: 'translate3d(0,0,0)' }}
          >
            <svg
              viewBox="-130 -30 2560 790"
              className="w-full h-auto overflow-visible"
              fill="none"
              shapeRendering="geometricPrecision"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Liquid Glass Neon Blue Linear Gradient */}
                <linearGradient id="neonBlueGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E0F2FE" />
                  <stop offset="25%" stopColor="#38BDF8" />
                  <stop offset="65%" stopColor="#0284C7" />
                  <stop offset="90%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#BAE6FD" />
                </linearGradient>

                {/* Inner Highlight for Glass Sheen */}
                <linearGradient id="glassSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              <g transform="scale(1, -1) translate(0, -728.156005859375)">
                {/* 1. Fast GPU Outer Neon Tube Glow (Wide transparent stroke - 0 CPU filter overhead) */}
                <motion.path
                  d={helloPath}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="76"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.22"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2.8,
                    ease: [0.38, 0.04, 0.22, 1],
                  }}
                />

                {/* 2. Main Liquid Glass Neon Blue Stroke */}
                <motion.path
                  d={helloPath}
                  fill="none"
                  stroke="url(#neonBlueGlass)"
                  strokeWidth="56"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2.8,
                    ease: [0.38, 0.04, 0.22, 1],
                  }}
                />

                {/* 3. Fine Inner Glass Specular Sheen Core */}
                <motion.path
                  d={helloPath}
                  fill="none"
                  stroke="url(#glassSheen)"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.85"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2.8,
                    ease: [0.38, 0.04, 0.22, 1],
                  }}
                />
              </g>
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppleHelloLoader;
