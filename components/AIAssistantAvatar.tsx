import React, { useEffect, useRef } from 'react';

interface AIAssistantAvatarProps {
  size?: number;
  className?: string;
  glow?: boolean;
  trackCursor?: boolean;
  blink?: boolean;
}

// Exact organic pebble path matching image.png
const PEBBLE_PATH =
  "M 57.5 15.5 " +
  "C 65.5 15.5, 72.8 17.2, 78.5 20.2 " +
  "C 84.2 23.2, 87.6 28.5, 89.2 36.0 " +
  "C 90.2 40.8, 90.0 46.5, 89.2 51.5 " +
  "C 88.0 59.0, 85.0 66.5, 80.5 72.5 " +
  "C 75.5 79.2, 67.5 83.8, 59.5 85.2 " +
  "C 54.5 86.0, 48.5 85.8, 42.0 84.8 " +
  "C 34.0 83.2, 25.5 79.2, 19.5 73.0 " +
  "C 13.5 66.8, 10.0 58.5, 9.5 49.5 " +
  "C 9.0 41.5, 11.5 33.5, 16.0 27.2 " +
  "C 20.5 21.0, 27.8 17.5, 36.5 16.0 " +
  "C 43.5 15.0, 51.0 15.5, 57.5 15.5 Z";

export const AIAssistantAvatar: React.FC<AIAssistantAvatarProps> = ({
  size = 28,
  className = "",
  glow = true,
  trackCursor = true,
  blink = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobGroupRef = useRef<SVGGElement>(null);
  const eyesGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let animFrameId: number;

    // Target displacements
    let targetBodyX = 0;
    let targetBodyY = 0;
    let targetRotate = 0;
    let targetEyeX = 0;
    let targetEyeY = 0;

    // Current animated values (lerped)
    let currentBodyX = 0;
    let currentBodyY = 0;
    let currentRotate = 0;
    let currentEyeX = 0;
    let currentEyeY = 0;

    // Blinking state
    let isBlinking = false;
    let blinkScale = 1;
    let blinkProgress = 0;
    let nextBlinkTime = Date.now() + 3000 + Math.random() * 3000;

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      if (!trackCursor || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      if (distance < 0.001) {
        targetBodyX = 0;
        targetBodyY = 0;
        targetRotate = 0;
        targetEyeX = 0;
        targetEyeY = 0;
        return;
      }

      // Factor based on distance from avatar: responsive and expressive across the screen
      const factor = Math.min(1, distance / 200);
      const angle = Math.atan2(dy, dx);

      // Body visibly translates and tilts along with cursor movement
      const maxBodyX = 4.8;
      const maxBodyY = 3.6;
      targetBodyX = Math.cos(angle) * (factor * maxBodyX);
      targetBodyY = Math.sin(angle) * (factor * maxBodyY);
      targetRotate = Math.cos(angle) * (factor * 5.5); // Natural dynamic body lean (±5.5°)

      // Eyes translate significantly across the face toward the cursor (wide expressive range)
      const maxEyeX = 11.0;
      const maxEyeY = 9.0;
      targetEyeX = Math.cos(angle) * (factor * maxEyeX);
      targetEyeY = Math.sin(angle) * (factor * maxEyeY);
    };

    if (trackCursor) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    const updateFrame = () => {
      if (trackCursor) {
        // Smooth interpolation for body movement
        currentBodyX += (targetBodyX - currentBodyX) * 0.12;
        currentBodyY += (targetBodyY - currentBodyY) * 0.12;
        currentRotate += (targetRotate - currentRotate) * 0.12;

        // Smooth interpolation for eye movement
        currentEyeX += (targetEyeX - currentEyeX) * 0.16;
        currentEyeY += (targetEyeY - currentEyeY) * 0.16;
      }

      // Occasional natural blink (quick vertical scale)
      if (blink) {
        const now = Date.now();
        if (!isBlinking && now >= nextBlinkTime) {
          isBlinking = true;
          blinkProgress = 0;
        }

        if (isBlinking) {
          blinkProgress += 0.18;
          if (blinkProgress <= 1) {
            blinkScale = 1 - Math.sin(blinkProgress * Math.PI) * 0.9;
          } else {
            isBlinking = false;
            blinkScale = 1;
            nextBlinkTime = now + 3500 + Math.random() * 3500;
          }
        }
      }

      // Update body: translation + lean/tilt toward cursor
      if (blobGroupRef.current && trackCursor) {
        blobGroupRef.current.setAttribute(
          'transform',
          `translate(${currentBodyX.toFixed(2)}, ${currentBodyY.toFixed(2)}) rotate(${currentRotate.toFixed(2)}, 50, 50)`
        );
      }

      // Update vertical capsule eyes inside the face: translation + blink scale
      if (eyesGroupRef.current) {
        const eyeTransform = `translate(${currentEyeX.toFixed(2)}, ${currentEyeY.toFixed(2)}) translate(0, 46.5) scale(1, ${blinkScale.toFixed(3)}) translate(0, -46.5)`;
        eyesGroupRef.current.setAttribute('transform', eyeTransform);
      }

      animFrameId = requestAnimationFrame(updateFrame);
    };

    animFrameId = requestAnimationFrame(updateFrame);

    return () => {
      if (trackCursor) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      cancelAnimationFrame(animFrameId);
    };
  }, [trackCursor, blink]);

  // Unique ID for gradients
  const idPrefix = useRef(`avatar-${Math.random().toString(36).substring(2, 8)}`).current;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: glow
          ? 'drop-shadow(0 0 8px rgba(0, 243, 255, 0.85)) drop-shadow(0 0 16px rgba(0, 243, 255, 0.4)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))'
          : 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.6))',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full overflow-visible transition-transform duration-200 hover:scale-108"
      >
        <defs>
          {/* Website Signature Neon Blue Gradient */}
          <linearGradient id={`${idPrefix}-neonGradient`} x1="20%" y1="12%" x2="85%" y2="88%">
            <stop offset="0%" stopColor="#2df7ff" />
            <stop offset="45%" stopColor="#00f3ff" />
            <stop offset="100%" stopColor="#0077ff" />
          </linearGradient>

          {/* Top Specular Sheen for 3D Luster */}
          <linearGradient id={`${idPrefix}-specularSheen`} x1="50%" y1="15%" x2="50%" y2="60%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.55)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Eye Deep Obsidian Fill */}
          <linearGradient id={`${idPrefix}-eyeColor`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#04060d" />
            <stop offset="100%" stopColor="#070c17" />
          </linearGradient>
        </defs>

        {/* 
          ANIMATED BODY GROUP:
          Moves and leans noticeably toward the cursor alongside the eyes.
        */}
        <g ref={blobGroupRef}>
          {/* Ambient Neon Cyan Aura Base */}
          <path
            d={PEBBLE_PATH}
            fill="none"
            stroke="#00f3ff"
            strokeWidth="3.0"
            opacity="0.38"
          />

          {/* The Exact Pebble Body from Reference Image in Website Neon Blue */}
          <path
            d={PEBBLE_PATH}
            fill={`url(#${idPrefix}-neonGradient)`}
          />

          {/* Top Gloss Sheen */}
          <path
            d={PEBBLE_PATH}
            fill={`url(#${idPrefix}-specularSheen)`}
          />

          {/* Delicate Crisp Rim Light */}
          <path
            d={PEBBLE_PATH}
            fill="none"
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth="1.2"
          />

          {/* 
            ANIMATED VERTICAL CAPSULE EYES:
            Nested inside the body so they inherit the body lean and translate smoothly.
          */}
          <g ref={eyesGroupRef}>
            {/* Left Vertical Capsule Eye */}
            <rect
              x="36.8"
              y="37.5"
              width="9.4"
              height="19.0"
              rx="4.7"
              ry="4.7"
              fill={`url(#${idPrefix}-eyeColor)`}
            />

            {/* Right Vertical Capsule Eye (subtly higher matching image geometry) */}
            <rect
              x="59.3"
              y="36.5"
              width="9.4"
              height="19.0"
              rx="4.7"
              ry="4.7"
              fill={`url(#${idPrefix}-eyeColor)`}
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
