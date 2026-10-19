/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface CelebrationEffectsProps {
  show: boolean;
  xpGained: number;
  streakCount: number;
  reducedMotion?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  shape: 'star' | 'circle' | 'heart' | 'sparkle';
  alpha: number;
  decay: number;
}

const PASTEL_COLORS = ['#B8E6D1', '#DCD0F5', '#FFC8B8', '#FFE7A0', '#A2E3FA', '#FFB7D5'];

export const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({
  show,
  xpGained,
  streakCount,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!show || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const count = 55;

    // Center burst origin
    const originX = width / 2;
    const originY = height / 2.3;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 3.5 + Math.random() * 7;
      const shapes: Particle['shape'][] = ['star', 'circle', 'sparkle', 'circle'];
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 6 + Math.random() * 8,
        color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.015,
      });
    }

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16; // gravity
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          // 5-point star
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(
              Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
              -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size
            );
            ctx.lineTo(
              Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2.2),
              -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2.2)
            );
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'sparkle') {
          // 4-point sparkle diamond
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.4, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.4, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // cute smooth circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      if (particles.some((p) => p.alpha > 0)) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [show, reducedMotion]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {!reducedMotion && <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />}

      {/* Floating Center Celebration Banner */}
      <div className="relative z-10 flex flex-col items-center gap-2 animate-bounce-cute">
        <div className="bg-white/95 border-2 border-[#B8E6D1] rounded-3xl px-8 py-5 shadow-xl flex flex-col items-center gap-1.5 backdrop-blur-xs">
          <div className="text-3xl font-extrabold text-[#2C3E50] tracking-tight flex items-center gap-2">
            <span>✨ 정답이야! 최고야! ✨</span>
          </div>

          <div className="flex items-center gap-2 text-lg font-bold text-emerald-600">
            <span className="bg-[#FFE7A0] text-amber-900 px-3 py-1 rounded-full text-base font-extrabold shadow-xs">
              +{xpGained} XP
            </span>
            <span>경험치 획득!</span>
          </div>

          {streakCount >= 3 && (
            <div className="mt-1 bg-gradient-to-r from-orange-400 to-amber-400 text-white font-extrabold text-sm px-4 py-1 rounded-full shadow-sm flex items-center gap-1.5">
              <span>🔥</span>
              <span>{streakCount}연속 정답 성공!</span>
              <span>🔥</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
