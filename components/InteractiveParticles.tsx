import React, { useEffect, useRef } from 'react';

// Tiny particle with 3D depth layer for multi-plane parallax
interface ParallaxParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number; // 0.2 (far back) to 1.0 (near)
  size: number;
  colorIndex: number;
  baseAlpha: number;
  alpha: number;
  shimmerSpeed: number;
  shimmerPhase: number;
}

// Pre-defined color palette
const PALETTE_COLORS = [
  '#ffffff', // Crisp white
  '#00f3ff', // Cyan
  '#38bdf8', // Ice blue
  '#a5b4fc', // Soft indigo
  '#c084fc', // Lavender
];

export const InteractiveParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parallax physics coordinates
  const parallaxRef = useRef<{
    currentX: number;
    currentY: number;
    targetX: number;
    targetY: number;
  }>({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  });

  // Sensor state refs
  const sensorStateRef = useRef<{
    baselineGamma: number | null;
    baselineBeta: number | null;
    hasOrientationData: boolean;
    lastOrientationTime: number;
  }>({
    baselineGamma: null,
    baselineBeta: null,
    hasOrientationData: false,
    lastOrientationTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: ParallaxParticle[] = [];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initDimensions = () => {
      const isMobile = window.innerWidth < 768;
      // High-DPI support: cap at 2 for crisp rendering on OLED/Retina
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    const initParticles = () => {
      const isMobile = window.innerWidth < 768;
      // 55 particles on mobile (minimal CPU), 110 on desktop
      const count = isMobile ? 55 : 110;
      particles = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const depth = 0.2 + Math.pow(Math.random(), 1.4) * 0.8;
        // Crisp visible sizes: 1.0px in back to 2.0px in foreground
        const size = 0.9 + depth * 1.0;

        // Gentle ambient drift
        const speed = (0.04 + Math.random() * 0.08) * depth;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        const colorIndex = Math.floor(Math.random() * PALETTE_COLORS.length);
        const baseAlpha = 0.25 + depth * 0.55;

        particles.push({
          x,
          y,
          vx,
          vy,
          depth,
          size,
          colorIndex,
          baseAlpha,
          alpha: baseAlpha,
          shimmerSpeed: 0.01 + Math.random() * 0.02,
          shimmerPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initDimensions();
    initParticles();

    // 1. Desktop Mouse Movement
    const handleMouseMove = (e: MouseEvent) => {
      // If mobile accelerometer is actively providing data, let the phone drive it
      if (sensorStateRef.current.hasOrientationData) return;

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRange = 65;

      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;

      // Inverted: move in opposite direction of mouse
      parallaxRef.current.targetX = -normX * maxRange;
      parallaxRef.current.targetY = -normY * maxRange;
    };

    const handleMouseLeave = () => {
      if (!sensorStateRef.current.hasOrientationData) {
        parallaxRef.current.targetX = 0;
        parallaxRef.current.targetY = 0;
      }
    };

    // 2. Mobile DeviceOrientation (Gyroscope / Accelerometer)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      const gamma = e.gamma; // Roll: tilt left (<0) / right (>0)
      const beta = e.beta;   // Pitch: tilt forward/back

      const sensor = sensorStateRef.current;
      sensor.hasOrientationData = true;
      sensor.lastOrientationTime = performance.now();

      // Establish baseline on first reading
      if (sensor.baselineGamma === null || sensor.baselineBeta === null) {
        sensor.baselineGamma = gamma;
        // Typical portrait holding angle is ~45deg
        sensor.baselineBeta = beta;
        return;
      }

      // Delta from baseline holding angle
      const deltaX = gamma - sensor.baselineGamma;
      const deltaY = beta - sensor.baselineBeta;

      // 22-degree tilt produces full travel range
      const tiltSensitivity = 22;
      const normX = Math.max(-1, Math.min(1, deltaX / tiltSensitivity));
      const normY = Math.max(-1, Math.min(1, deltaY / tiltSensitivity));

      // 70px dynamic travel range so the motion is distinctly visible on mobile
      const maxRange = 70;

      // Inverted:
      // Phone tilt right (normX > 0) -> particles move left (-normX)
      // Phone tilt forward/down (normY > 0) -> particles move up (-normY)
      parallaxRef.current.targetX = -normX * maxRange;
      parallaxRef.current.targetY = -normY * maxRange;
    };

    // 3. Fallback: DeviceMotion (Acceleration with Gravity)
    // Works reliably across all Android WebViews and mobile browsers even if orientation is restricted
    const handleMotion = (e: DeviceMotionEvent) => {
      const sensor = sensorStateRef.current;
      // Skip if deviceorientation is already providing active readings
      if (performance.now() - sensor.lastOrientationTime < 1500) return;

      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null) return;

      sensor.hasOrientationData = true;

      // Detect iOS vs Android gravity sign differences
      const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
      const sign = isIOS ? -1 : 1;

      // Lateral tilt: acc.x typically ranges from -7 to +7 m/s²
      const normX = Math.max(-1, Math.min(1, (acc.x * sign) / 5.5));
      // Normal phone upright pitch has acc.y around 7 to 9.8 m/s²
      const normY = Math.max(-1, Math.min(1, (acc.y - 7.5) / 5.5));

      const maxRange = 65;
      parallaxRef.current.targetX = normX * maxRange;
      parallaxRef.current.targetY = -normY * maxRange;
    };

    // Recalibrate baseline on tap/touch so user's natural posture is always centered
    const handleUserInteraction = () => {
      // Trigger iOS 13+ permission request if needed
      requestIOSPermission();
    };

    // 4. Touch Parallax Fallback (in case user testing in emulator or sensors unavailable)
    const handleTouchMove = (e: TouchEvent) => {
      // Only active if no physical accelerometer data has been received
      if (sensorStateRef.current.hasOrientationData) return;

      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRange = 40;

        const normX = (touch.clientX - centerX) / centerX;
        const normY = (touch.clientY - centerY) / centerY;

        parallaxRef.current.targetX = -normX * maxRange;
        parallaxRef.current.targetY = -normY * maxRange;
      }
    };

    const handleTouchEnd = () => {
      if (!sensorStateRef.current.hasOrientationData) {
        parallaxRef.current.targetX = 0;
        parallaxRef.current.targetY = 0;
      }
    };

    // iOS 13+ Permission Handler
    const requestIOSPermission = async () => {
      try {
        const OrientationAny = window.DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<'granted' | 'denied'>;
        };

        if (typeof OrientationAny?.requestPermission === 'function') {
          const res = await OrientationAny.requestPermission();
          if (res === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
            window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, { passive: true });
          }
        }

        const MotionAny = window.DeviceMotionEvent as unknown as {
          requestPermission?: () => Promise<'granted' | 'denied'>;
        };

        if (typeof MotionAny?.requestPermission === 'function') {
          const res = await MotionAny.requestPermission();
          if (res === 'granted') {
            window.addEventListener('devicemotion', handleMotion, { passive: true });
          }
        }
      } catch {
        // Fallback silently if permission prompt is declined or unsupported
      }
    };

    const handleResize = () => {
      initDimensions();
      initParticles();
    };

    // Register all sensor listeners immediately (Android Chrome / standard browsers activate immediately)
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    window.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, { passive: true });
    window.addEventListener('devicemotion', handleMotion, { passive: true });

    // Desktop mouse listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Touch & interaction listeners
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Loop with Visibility API
    let lastTime = performance.now();
    let isLoopRunning = true;

    const render = (currentTime: number) => {
      if (!isLoopRunning) return;

      animationFrameId = requestAnimationFrame(render);

      const dt = Math.min((currentTime - lastTime) / 16.67, 2.0);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Smooth inertia interpolation (higher lerp for responsive feeling)
      const parallax = parallaxRef.current;
      const lerpSpeed = prefersReducedMotion ? 0.03 : 0.08;
      parallax.currentX += (parallax.targetX - parallax.currentX) * lerpSpeed * dt;
      parallax.currentY += (parallax.targetY - parallax.currentY) * lerpSpeed * dt;

      const margin = 50;

      // Batch particle drawing by color to maximize GPU performance
      for (let c = 0; c < PALETTE_COLORS.length; c++) {
        ctx.fillStyle = PALETTE_COLORS[c];
        ctx.beginPath();

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.colorIndex !== c) continue;

          // Subtle organic shimmer
          if (!prefersReducedMotion) {
            p.shimmerPhase += p.shimmerSpeed * dt;
          }

          // Gentle ambient drift
          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // Viewport boundary wrap
          if (p.x < -margin) p.x = width + margin;
          if (p.x > width + margin) p.x = -margin;
          if (p.y < -margin) p.y = height + margin;
          if (p.y > height + margin) p.y = -margin;

          // Opposite parallax position
          const renderX = p.x + parallax.currentX * p.depth;
          const renderY = p.y + parallax.currentY * p.depth;

          // Add to current path batch
          ctx.moveTo(renderX + p.size, renderY);
          ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
        }

        ctx.fill();
      }
    };

    // Pause animation completely when screen is off / tab inactive to save battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isLoopRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isLoopRunning) {
          isLoopRunning = true;
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      isLoopRunning = false;
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener);
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="parallax-particles-canvas"
      className="fixed inset-0 z-[1] pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
};

export default InteractiveParticles;
