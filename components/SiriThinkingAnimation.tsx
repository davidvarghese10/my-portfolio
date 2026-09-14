import React, { useEffect, useRef } from 'react';

interface SiriThinkingAnimationProps {
  text?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const SiriThinkingAnimation: React.FC<SiriThinkingAnimationProps> = ({
  text = "Thinking...",
  className = "",
  size = 'sm',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      if (document.hidden) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (width === 0 || height === 0) return;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      time += 0.032;

      // Base midline where wave undulates
      const baseHeight = height * 0.49;

      // 1. Deep midnight obsidian background with subtle cool tint
      ctx.fillStyle = '#04070c';
      ctx.fillRect(0, 0, width, height);

      // 2. Diffuse Website Theme Aura (Electric Cyan & Deep Cobalt Blue)
      ctx.save();
      const blurRadius = Math.max(4, Math.round(height * 0.16));
      ctx.filter = `blur(${blurRadius}px)`;

      // Deep electric blue glow on the left
      const leftBlueGlow = ctx.createRadialGradient(
        width * 0.16, baseHeight - height * 0.1, 1,
        width * 0.16, baseHeight - height * 0.1, width * 0.22
      );
      leftBlueGlow.addColorStop(0, 'rgba(0, 102, 255, 0.5)');
      leftBlueGlow.addColorStop(0.5, 'rgba(0, 85, 255, 0.22)');
      leftBlueGlow.addColorStop(1, 'rgba(0, 85, 255, 0)');
      ctx.fillStyle = leftBlueGlow;
      ctx.beginPath();
      ctx.ellipse(width * 0.16, baseHeight - height * 0.1, width * 0.22, height * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Signature Electric Cyan (#00f3ff) diffuse orb in the center
      const centerCyanGlow = ctx.createRadialGradient(
        width * 0.53, baseHeight - height * 0.14, 1,
        width * 0.53, baseHeight - height * 0.14, width * 0.28
      );
      centerCyanGlow.addColorStop(0, 'rgba(0, 243, 255, 0.65)');
      centerCyanGlow.addColorStop(0.45, 'rgba(56, 189, 248, 0.35)');
      centerCyanGlow.addColorStop(1, 'rgba(0, 243, 255, 0)');
      ctx.fillStyle = centerCyanGlow;
      ctx.beginPath();
      ctx.ellipse(width * 0.53, baseHeight - height * 0.14, width * 0.28, height * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ice blue / cobalt glow on the right
      const rightBlueGlow = ctx.createRadialGradient(
        width * 0.86, baseHeight - height * 0.11, 1,
        width * 0.86, baseHeight - height * 0.11, width * 0.24
      );
      rightBlueGlow.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      rightBlueGlow.addColorStop(0.5, 'rgba(0, 140, 255, 0.28)');
      rightBlueGlow.addColorStop(1, 'rgba(0, 140, 255, 0)');
      ctx.fillStyle = rightBlueGlow;
      ctx.beginPath();
      ctx.ellipse(width * 0.86, baseHeight - height * 0.11, width * 0.24, height * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 3. Compute the undulating liquid wave path
      const points: { x: number; y: number }[] = [];
      const steps = 60;
      const stepWidth = width / steps;

      for (let i = 0; i <= steps; i++) {
        const x = i * stepWidth;
        const normX = x / width; // 0 to 1

        // Crest biases proportional to capsule height
        const leftBias = Math.exp(-Math.pow((normX - 0.16) / 0.13, 2)) * (height * 0.11);
        const centerBias = Math.exp(-Math.pow((normX - 0.53) / 0.17, 2)) * (height * 0.085);
        const rightBias = Math.exp(-Math.pow((normX - 0.85) / 0.14, 2)) * (height * 0.12);

        // Traveling harmonic waves
        const wave1 = Math.sin(normX * 8.5 + time * 1.5) * (height * 0.045);
        const wave2 = Math.cos(normX * 13.0 - time * 1.8) * (height * 0.026);
        const wave3 = Math.sin(normX * 4.2 + time * 0.8) * (height * 0.032);

        const dynamicDisplacement = (wave1 + wave2 + wave3) * 0.8;
        const y = baseHeight - leftBias - centerBias - rightBias + dynamicDisplacement;

        points.push({ x, y });
      }

      // 4. Draw Frosted Milky Pearl Silver Fluid Base (bottom half of capsule)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      ctx.lineTo(width, points[points.length - 1].y);
      ctx.lineTo(width, height);
      ctx.closePath();

      // Silky frosted glass fluid with cool ice undertone
      const milkGrad = ctx.createLinearGradient(0, baseHeight - height * 0.25, 0, height);
      milkGrad.addColorStop(0.0, '#e8f4f8');
      milkGrad.addColorStop(0.2, '#d0e5ee');
      milkGrad.addColorStop(0.6, '#9cb8c9');
      milkGrad.addColorStop(1.0, '#506e82');

      ctx.fillStyle = milkGrad;
      ctx.fill();
      ctx.restore();

      // 5. Draw Cohesive Cyan-Blue Liquid Wave Crest
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      // Horizontal gradient matching the website's signature cyan & electric blue palette:
      // Cobalt Blue -> Royal Blue -> Neon Cyan (#00f3ff) -> Ice Highlight -> Sky Blue -> Electric Blue
      const crestGrad = ctx.createLinearGradient(0, 0, width, 0);
      crestGrad.addColorStop(0.00, 'rgba(0, 102, 255, 0.95)');   // Deep Electric Blue
      crestGrad.addColorStop(0.18, 'rgba(0, 140, 255, 1.0)');   // Royal Blue
      crestGrad.addColorStop(0.36, 'rgba(2, 175, 240, 1.0)');   // Vibrant Cyan-Blue
      crestGrad.addColorStop(0.52, 'rgba(0, 243, 255, 1.0)');   // Signature Electric Cyan (#00f3ff)
      crestGrad.addColorStop(0.68, 'rgba(186, 246, 255, 1.0)'); // Luminous Ice Cyan Highlight
      crestGrad.addColorStop(0.84, 'rgba(56, 189, 248, 1.0)');  // Sky Blue
      crestGrad.addColorStop(1.00, 'rgba(0, 119, 255, 0.95)');  // Electric Cobalt

      ctx.fillStyle = crestGrad;
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillRect(0, 0, width, baseHeight + height * 0.2);

      // Smooth vertical blend downward into the milky glass fluid
      const verticalMask = ctx.createLinearGradient(0, baseHeight - height * 0.22, 0, baseHeight + height * 0.26);
      verticalMask.addColorStop(0.0, 'rgba(0,0,0,1)');
      verticalMask.addColorStop(0.45, 'rgba(0,0,0,0.88)');
      verticalMask.addColorStop(1.0, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = verticalMask;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      // 6. Crisp Wave Crest Stroke (cyan & white specular shine)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }

      const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
      strokeGrad.addColorStop(0.05, 'rgba(0, 119, 255, 0.85)');
      strokeGrad.addColorStop(0.30, 'rgba(0, 243, 255, 1)');
      strokeGrad.addColorStop(0.55, 'rgba(235, 253, 255, 1)');
      strokeGrad.addColorStop(0.75, 'rgba(0, 243, 255, 1)');
      strokeGrad.addColorStop(0.95, 'rgba(56, 189, 248, 0.85)');

      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = Math.max(1.1, height * 0.03);
      ctx.filter = 'blur(0.5px)';
      ctx.stroke();
      ctx.restore();

      // 7. Subtle Top Specular Glass Reflection
      const topRim = ctx.createLinearGradient(0, 0, 0, Math.max(4, height * 0.14));
      topRim.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      topRim.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = topRim;
      ctx.fillRect(0, 0, width, Math.max(4, height * 0.12));

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const sizeStyles = {
    xs: 'w-[124px] h-[34px]',
    sm: 'w-[140px] h-[38px]',
    md: 'w-[168px] h-[46px]',
    lg: 'w-[220px] h-[60px]',
  };

  const textSizes = {
    xs: 'text-[12px]',
    sm: 'text-[13.5px]',
    md: 'text-[15px]',
    lg: 'text-[18px]',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ filter: 'drop-shadow(0 10px 24px rgba(0, 0, 0, 0.85))' }}
    >
      {/* Outer Cyan-Blue Breathing Ambient Glow */}
      <div
        className="absolute -inset-1.5 rounded-full opacity-70 blur-md pointer-events-none animate-pulse"
        style={{
          background: 'linear-gradient(90deg, rgba(0,102,255,0.3) 0%, rgba(0,243,255,0.45) 50%, rgba(56,189,248,0.35) 100%)',
          animationDuration: '2.8s',
        }}
      />

      {/* Pill Capsule Container */}
      <div
        className={`relative overflow-hidden rounded-full ${sizeStyles[size]} flex items-center justify-center border border-[#00f3ff]/25`}
        style={{
          boxShadow: `
            inset 0 1.5px 2px rgba(255, 255, 255, 0.45),
            inset 0 -1.5px 2px rgba(0, 243, 255, 0.2),
            inset 0 0 14px rgba(0, 0, 0, 0.7),
            0 6px 20px rgba(0, 243, 255, 0.15),
            0 10px 26px rgba(0, 0, 0, 0.8)
          `,
          background: '#04070c',
        }}
      >
        {/* Animated Liquid Wave Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Glossy Curved Glass Sheen */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.2) 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5)',
          }}
        />

        {/* Centered Crisp White "Thinking..." Typography */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          <span
            className={`text-white font-medium ${textSizes[size]}`}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", "SF Pro Text", "Manrope", sans-serif',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(0, 243, 255, 0.5)',
              letterSpacing: '-0.015em',
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SiriThinkingAnimation;
