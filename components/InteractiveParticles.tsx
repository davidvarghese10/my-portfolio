import React, { useEffect, useRef } from 'react';

// Tiny particle with 3D depth layer for multi-plane parallax
interface ParallaxParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number; // 0.15 (far back) to 1.0 (near)
  size: number;
  colorIndex: number;
  baseAlpha: number;
  alpha: number;
  shimmerSpeed: number;
  shimmerPhase: number;
}

// Pre-defined color palette with RGB values for zero-allocation alpha blending
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

  // Raw orientation readings - separated so event listener does virtually 0 work
  const sensorRef = useRef<{
    gamma: number | null;
    beta: number | null;
    hasNewData: boolean;
  }>({
    gamma: null,
    beta: null,
    hasNewData: false,
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
    let isMobile = false;
    let particles: ParallaxParticle[] = [];

    // Check motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initDimensions = () => {
      isMobile = window.innerWidth < 768;
      // Battery saver: on mobile screens, clamp DPR to 1 to reduce GPU fillrate & memory bandwidth by ~75%
      dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    const initParticles = () => {
      // Conservative particle count: 50 on mobile for minimal CPU/battery footprint, 110 on desktop
      const count = isMobile ? 50 : 110;
      particles = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const depth = 0.2 + Math.pow(Math.random(), 1.4) * 0.8;
        const size = 0.65 + depth * 0.75;

        // Very slow, soothing drift
        const speed = (0.05 + Math.random() * 0.08) * depth;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        const colorIndex = Math.floor(Math.random() * PALETTE_COLORS.length);
        const baseAlpha = 0.2 + depth * 0.55;

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

    // Desktop Mouse listener
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxParallaxRange = 55;

      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;

      // Inverted: move in opposite direction
      parallaxRef.current.targetX = -normX * maxParallaxRange;
      parallaxRef.current.targetY = -normY * maxParallaxRange;
    };

    const handleMouseLeave = () => {
      parallaxRef.current.targetX = 0;
      parallaxRef.current.targetY = 0;
    };

    // Mobile Accelerometer (DeviceOrientation)
    // Minimal footprint: the event handler only records raw values to avoid CPU spikes on high-frequency sensors
    let lastSensorTime = 0;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      const now = performance.now();
      // Throttle sensor intake to ~30Hz (every 32ms) to save battery on 60-120Hz sensors
      if (now - lastSensorTime < 32) return;
      lastSensorTime = now;

      sensorRef.current.gamma = e.gamma;
      sensorRef.current.beta = e.beta;
      sensorRef.current.hasNewData = true;
    };

    // Adaptive orientation filter running inside the RAF loop
    let baselineGamma: number | null = null;
    let baselineBeta: number | null = null;

    const processSensorData = () => {
      const sensor = sensorRef.current;
      if (!sensor.hasNewData || sensor.gamma === null || sensor.beta === null) return;
      sensor.hasNewData = false;

      const gamma = sensor.gamma;
      const beta = sensor.beta;

      if (baselineGamma === null || baselineBeta === null) {
        baselineGamma = gamma;
        baselineBeta = beta;
        return;
      }

      // Smooth drift adaptation for baseline
      baselineGamma += (gamma - baselineGamma) * 0.012;
      baselineBeta += (beta - baselineBeta) * 0.012;

      const deltaX = gamma - baselineGamma;
      const deltaY = beta - baselineBeta;

      // Deadband: ignore micro-tremors (< 0.25 deg) to avoid unnecessary recalculations
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > 0.25 || absDeltaY > 0.25) {
        const tiltSensitivity = 22;
        const normX = Math.max(-1, Math.min(1, deltaX / tiltSensitivity));
        const normY = Math.max(-1, Math.min(1, deltaY / tiltSensitivity));
        const maxParallaxRange = 38;

        // Inverted opposite direction
        parallaxRef.current.targetX = -normX * maxParallaxRange;
        parallaxRef.current.targetY = -normY * maxParallaxRange;
      }
    };

    // Optional touch fallback (only if phone is stationary or orientation is denied)
    const handleTouchMove = (e: TouchEvent) => {
      // If accelerometer is providing readings, skip touch parallax to conserve CPU
      if (baselineGamma !== null) return;

      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const centerX = width / 2;
        const centerY = height / 2;
        const maxParallaxRange = 30;

        const normX = (touch.clientX - centerX) / centerX;
        const normY = (touch.clientY - centerY) / centerY;

        parallaxRef.current.targetX = -normX * maxParallaxRange;
        parallaxRef.current.targetY = -normY * maxParallaxRange;
      }
    };

    const handleTouchEnd = () => {
      if (baselineGamma === null) {
        parallaxRef.current.targetX = 0;
        parallaxRef.current.targetY = 0;
      }
    };

    // iOS 13+ permission request on user tap
    const requestOrientationPermission = async () => {
      const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof DeviceOrientationEventAny?.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEventAny.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
          }
        } catch {
          // Gracefully fallback
        }
      }
    };

    const handleResize = () => {
      initDimensions();
      initParticles();
    };

    // Attach passive listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    window.addEventListener('touchstart', requestOrientationPermission, { once: true, passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Loop with Visibility API (0% CPU/battery when tab is inactive)
    let lastTime = performance.now();
    let isLoopRunning = true;

    const render = (currentTime: number) => {
      if (!isLoopRunning) return;

      animationFrameId = requestAnimationFrame(render);

      // Process throttled accelerometer reading
      if (isMobile) {
        processSensorData();
      }

      const dt = Math.min((currentTime - lastTime) / 16.67, 2.0);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Smooth inertia interpolation
      const parallax = parallaxRef.current;
      const lerpSpeed = prefersReducedMotion ? 0.02 : 0.055;
      parallax.currentX += (parallax.targetX - parallax.currentX) * lerpSpeed * dt;
      parallax.currentY += (parallax.targetY - parallax.currentY) * lerpSpeed * dt;

      const margin = 40;

      // Group particles by color index to BATCH draw calls (massively reduces GPU overhead)
      // 5 draw calls total instead of 100+ individual state changes
      for (let c = 0; c < PALETTE_COLORS.length; c++) {
        ctx.fillStyle = PALETTE_COLORS[c];
        ctx.beginPath();

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.colorIndex !== c) continue;

          // Subtle organic shimmer (skip on reduced motion)
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

    // Pause animation completely when tab or phone screen is off to consume 0% battery
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('touchstart', requestOrientationPermission);
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
