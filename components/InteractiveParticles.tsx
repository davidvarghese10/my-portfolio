import React, { useEffect, useRef } from 'react';

// Tiny particle with 3D depth layer for multi-plane parallax
interface ParallaxParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number; // 0.15 (deep/far background) to 1.0 (foreground)
  size: number;
  color: string;
  baseAlpha: number;
  alpha: number;
  shimmerSpeed: number;
  shimmerPhase: number;
}

// Stardust cosmic color palette for tiny particles
const PARTICLE_PALETTE = [
  '#ffffff', // Crisp white stardust
  '#00f3ff', // Electric cyan
  '#38bdf8', // Sky / Ice blue
  '#a5b4fc', // Soft celestial indigo
  '#c084fc', // Lavender dust
];

export const InteractiveParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Smooth mouse parallax state (lerped towards target for buttery physics)
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

    // Honor reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initDimensions = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    const initParticles = () => {
      const isMobile = width < 768;
      // High count of tiny stardust motes for dense 3D depth
      const count = isMobile ? 110 : 220;
      particles = [];

      for (let i = 0; i < count; i++) {
        // Initial coordinate with margin so parallax doesn't clip on edges
        const x = Math.random() * width;
        const y = Math.random() * height;

        // Depth distribution: 0.15 (far back) to 1.0 (near)
        // Using power curve gives realistic celestial depth perception
        const depth = 0.15 + Math.pow(Math.random(), 1.4) * 0.85;

        // Tiny size scaled slightly by depth (0.6px in back up to 1.4px in front)
        const size = 0.6 + depth * 0.8;

        // Slow ambient floating drift
        const speed = (0.06 + Math.random() * 0.12) * depth;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        const color = PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)];
        const baseAlpha = 0.2 + depth * 0.6;

        particles.push({
          x,
          y,
          vx,
          vy,
          depth,
          size,
          color,
          baseAlpha,
          alpha: baseAlpha,
          shimmerSpeed: 0.01 + Math.random() * 0.025,
          shimmerPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initDimensions();
    initParticles();

    // Mouse listener: computes normalized offset from viewport center (-1 to +1)
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = width / 2;
      const centerY = height / 2;
      // Parallax travel distance in pixels across maximum mouse travel
      const maxParallaxRange = width < 768 ? 35 : 60;

      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;

      // Inverted (-normX, -normY) so particles move in the OPPOSITE direction of mouse movement
      parallaxRef.current.targetX = -normX * maxParallaxRange;
      parallaxRef.current.targetY = -normY * maxParallaxRange;
    };

    const handleMouseLeave = () => {
      // Gently return toward center when mouse leaves
      parallaxRef.current.targetX = 0;
      parallaxRef.current.targetY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const centerX = width / 2;
        const centerY = height / 2;
        const maxParallaxRange = 30;

        const normX = (touch.clientX - centerX) / centerX;
        const normY = (touch.clientY - centerY) / centerY;

        // Inverted so particles move in opposite direction on touch too
        parallaxRef.current.targetX = -normX * maxParallaxRange;
        parallaxRef.current.targetY = -normY * maxParallaxRange;
      }
    };

    const handleTouchEnd = () => {
      parallaxRef.current.targetX = 0;
      parallaxRef.current.targetY = 0;
    };

    const handleResize = () => {
      initDimensions();
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (document.hidden) return;

      const dt = Math.min((currentTime - lastTime) / 16.67, 2.0);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Smooth inertia lerp for mouse parallax
      const parallax = parallaxRef.current;
      const lerpSpeed = prefersReducedMotion ? 0.02 : 0.06;
      parallax.currentX += (parallax.targetX - parallax.currentX) * lerpSpeed * dt;
      parallax.currentY += (parallax.targetY - parallax.currentY) * lerpSpeed * dt;

      // Update and render each tiny particle with its individual depth-parallax offset
      const margin = 50; // buffer margin for seamless wrapping

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Subtle organic shimmer
        p.shimmerPhase += p.shimmerSpeed * dt;
        const shimmer = Math.sin(p.shimmerPhase) * 0.18;
        p.alpha = Math.max(0.12, Math.min(0.95, p.baseAlpha + shimmer));

        // Ambient gentle drift
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Viewport wrap
        if (p.x < -margin) p.x = width + margin;
        if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height + margin;
        if (p.y > height + margin) p.y = -margin;

        // Calculate rendered position based on multi-plane mouse parallax
        // Foreground particles (high depth) move more than background particles (low depth)
        const renderX = p.x + parallax.currentX * p.depth;
        const renderY = p.y + parallax.currentY * p.depth;

        // Draw tiny stardust particle
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
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
