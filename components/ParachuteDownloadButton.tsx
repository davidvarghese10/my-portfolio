import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParachuteDownloadButtonProps {
  className?: string;
  onDownloaded?: () => void;
}

type DownloadState = 'idle' | 'downloading' | 'completed';

const COLOR_CYAN = '#2ee9c7'; // Exact mint/cyan shade from video

const ParachuteDownloadButton: React.FC<ParachuteDownloadButtonProps> = ({ 
  className = '',
  onDownloaded 
}) => {
  const [state, setState] = useState<DownloadState>('idle');
  const [progress, setProgress] = useState(0);

  const startDownload = () => {
    if (state !== 'idle') return;
    setState('downloading');
    setProgress(0);
  };

  useEffect(() => {
    if (state !== 'downloading') return;

    let startTime: number | null = null;
    const duration = 3000; // ~3.0s matching the video pacing exactly
    let frameId: number;

    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        frameId = requestAnimationFrame(tick);
      } else {
        // 100% reached -> Frame 00:03 landed state
        setState('completed');

        // Trigger file download
        try {
          const a = document.createElement('a');
          a.href = './David_Varghese_Resume.pdf';
          a.download = 'David_Varghese_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (err) {
          console.error('Download error:', err);
        }

        if (onDownloaded) {
          onDownloaded();
        }

        // Return to idle state after 3.8 seconds so user can replay/download again
        setTimeout(() => {
          setState('idle');
          setProgress(0);
        }, 3800);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [state, onDownloaded]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center cursor-pointer group"
            onClick={startDownload}
            title="Click to Download Resume"
          >
            {/* Frame 00:00 - Exact circular ring with solid filled downward arrow */}
            <div 
              className="relative flex items-center justify-center w-[72px] h-[72px] rounded-full transition-transform duration-200 group-hover:scale-105"
              style={{
                border: `3px solid ${COLOR_CYAN}`,
                boxShadow: `0 0 16px rgba(46, 233, 199, 0.25)`
              }}
            >
              {/* Solid filled downward arrow matching frame 00:00 */}
              <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                {/* Arrow stem */}
                <rect x="8.5" y="1" width="7" height="13" fill={COLOR_CYAN} rx="0.5" />
                {/* Arrow triangle head */}
                <path d="M 1 13 L 12 26 L 23 13 Z" fill={COLOR_CYAN} />
              </svg>
            </div>
            
            {/* Subtle contextual hint */}
            <span className="text-[11px] font-mono tracking-widest text-[#638c85] uppercase mt-3 group-hover:text-[#2ee9c7] transition-colors">
              Download Resume
            </span>
          </motion.div>
        )}

        {(state === 'downloading' || state === 'completed') && (
          <motion.div
            key="animating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center w-[280px] h-[130px]"
          >
            {/* Upper area: Parachute during downloading, Chevron on completion */}
            <div className="relative w-full h-[76px] flex items-center justify-center">
              {state === 'downloading' && (
                <motion.div
                  animate={{ 
                    y: [-3, 3, -3],
                    rotate: [-4.5, 4.5, -4.5]
                  }}
                  transition={{ 
                    y: { repeat: Infinity, duration: 1.6, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
                  }}
                  className="flex flex-col items-center"
                >
                  {/* Frame 00:01 & 00:02 - Exact Parachute + Upward Arrow */}
                  <svg width="56" height="66" viewBox="0 0 56 66" fill="none">
                    {/* Parachute Canopy Dome */}
                    <path 
                      d="M 2 20 Q 28 0 54 20 Q 45 16 37 20 Q 28 16 19 20 Q 11 16 2 20 Z" 
                      fill={COLOR_CYAN} 
                    />
                    
                    {/* 4 Suspension Lines meeting at arrow apex */}
                    <line x1="2" y1="20" x2="28" y2="38" stroke={COLOR_CYAN} strokeWidth="1" strokeOpacity="0.8" />
                    <line x1="19" y1="20" x2="28" y2="38" stroke={COLOR_CYAN} strokeWidth="1" strokeOpacity="0.8" />
                    <line x1="37" y1="20" x2="28" y2="38" stroke={COLOR_CYAN} strokeWidth="1" strokeOpacity="0.8" />
                    <line x1="54" y1="20" x2="28" y2="38" stroke={COLOR_CYAN} strokeWidth="1" strokeOpacity="0.8" />

                    {/* Upward Pointing Solid Arrow (same arrow as idle, flipped up) */}
                    {/* Triangular Head */}
                    <path d="M 28 38 L 18 49 L 38 49 Z" fill={COLOR_CYAN} />
                    {/* Stem */}
                    <rect x="25" y="49" width="6" height="14" fill={COLOR_CYAN} rx="0.5" />
                  </svg>
                </motion.div>
              )}

              {/* Frame 00:03 - Parachute disappears, thick down chevron rests directly on the line */}
              {state === 'completed' && (
                <motion.div
                  initial={{ y: 0, opacity: 0, scale: 0.6 }}
                  animate={{ y: 26, opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="flex items-center justify-center"
                >
                  <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
                    <path 
                      d="M 3 3 L 11 10 L 19 3" 
                      stroke={COLOR_CYAN} 
                      strokeWidth="3.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </motion.div>
              )}
            </div>

            {/* Horizontal Progress Track Line */}
            <div 
              className="w-full h-[3px] rounded-full overflow-hidden relative"
              style={{ backgroundColor: 'rgba(46, 233, 199, 0.18)' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-75"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: COLOR_CYAN,
                  boxShadow: `0 0 8px ${COLOR_CYAN}`
                }}
              />
            </div>

            {/* Percentage Text directly below the line (Frame 00:01: 31%, 00:02: 72%, 00:03: 100%) */}
            <div className="mt-3.5 flex items-center justify-center w-full">
              <span 
                className="font-mono text-xs tracking-wider tabular-nums font-medium"
                style={{ color: '#638c85' }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParachuteDownloadButton;
