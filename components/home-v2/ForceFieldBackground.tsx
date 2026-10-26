"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import styles from "./ForceFieldBackground.module.css";

type PointerMotion = {
  x: number;
  y: number;
};

type Particle = {
  originX: number;
  originY: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  opacity: number;
  accent: boolean;
};

export default function ForceFieldBackground({
  pointer,
  isDark,
  reducedMotion,
}: {
  pointer: RefObject<PointerMotion>;
  isDark: boolean;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let particles: Particle[] = [];
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    const draw = (time: number) => {
      if (!reducedMotion && time - lastFrame < 1000 / 30) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;

      context.clearRect(0, 0, width, height);

      const cursorX = ((pointer.current.x + 1) / 2) * width;
      const cursorY = ((pointer.current.y + 1) / 2) * height;
      const radius = Math.min(190, width * 0.2);
      const radiusSquared = radius * radius;
      const baseColor = isDark ? "242, 208, 174" : "94, 68, 55";
      const accentColor = isDark ? "230, 92, 73" : "166, 58, 44";

      for (const particle of particles) {
        if (!reducedMotion) {
          const dx = particle.x - cursorX;
          const dy = particle.y - cursorY;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < radiusSquared && distanceSquared > 0) {
            const distance = Math.sqrt(distanceSquared);
            const force = (1 - distance / radius) * 0.42;
            particle.velocityX += (dx / distance) * force;
            particle.velocityY += (dy / distance) * force;
          }

          particle.velocityX += (particle.originX - particle.x) * 0.035;
          particle.velocityY += (particle.originY - particle.y) * 0.035;
          particle.velocityX *= 0.84;
          particle.velocityY *= 0.84;
          particle.x += particle.velocityX;
          particle.y += particle.velocityY;
        }

        const nearCursor =
          !reducedMotion &&
          (particle.x - cursorX) ** 2 + (particle.y - cursorY) ** 2 <
            radiusSquared;
        context.beginPath();
        context.fillStyle = `rgba(${nearCursor || particle.accent ? accentColor : baseColor}, ${particle.opacity * (nearCursor ? 1.8 : 1)})`;
        context.arc(
          particle.x,
          particle.y,
          particle.radius * (nearCursor ? 1.35 : 1),
          0,
          Math.PI * 2,
        );
        context.fill();
      }

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const spacing = width < 600 ? 22 : 19;
      particles = [];
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const random = seed - Math.floor(seed);
          if (random < 0.18) continue;

          const wave = Math.sin(x * 0.008 + y * 0.013) * 3;
          const originX = x + (random - 0.5) * spacing * 0.5;
          const originY = y + wave + (random - 0.5) * spacing * 0.35;
          particles.push({
            originX,
            originY,
            x: originX,
            y: originY,
            velocityX: 0,
            velocityY: 0,
            radius: 0.55 + random * 0.75,
            opacity: 0.07 + random * 0.11,
            accent: random > 0.965,
          });
        }
      }

      if (reducedMotion) draw(0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [isDark, pointer, reducedMotion]);

  return (
    <canvas
      aria-hidden="true"
      className={styles.canvas}
      ref={canvasRef}
    />
  );
}
