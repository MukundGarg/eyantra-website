"use client";

import React, { useRef, useEffect } from "react";

/**
 * BuntyVisual renders the ethereal, luminous avatar of Bunty.
 *
 * Design Spec:
 * - Minimal character, head only, floating gently on a clean light off-white background
 * - Diffused glowing sphere of flowing aurora light, blending cyan, violet, and soft blue gradients
 * - Soft, foggy edges blending into the background
 * - Glowing, clean geometric white vector lines:
 *     - Notion-style high curved eyebrows
 *     - Simple dot eyes
 *     - Prominent 'L' shaped nose line
 *     - Neutral and calm mouth expression
 * - Ethereal, translucent, abstract, 3D render, soft light
 */
export default function BuntyVisual({ className = "" }: { className?: string }) {
  const tiltRef = useRef<HTMLDivElement>(null);

  // Subtle interactive parallax tilt on mouse move layered on top of continuous floating
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!tiltRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      tiltRef.current.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    };

    const handlePointerLeave = () => {
      if (tiltRef.current) {
        tiltRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
      }
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      className={`relative flex items-center justify-center select-none py-10 ${className}`}
      style={{ minHeight: "380px" }}
    >
      {/* ─── Layer 1: Ambient Outer Foggy Aurora Aura that blends into background ─── */}
      <div
        className="absolute w-80 h-80 md:w-[460px] md:h-[460px] rounded-full pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(103, 232, 249, 0.45) 0%, rgba(167, 139, 250, 0.35) 40%, rgba(59, 130, 246, 0.25) 65%, transparent 100%)",
          animation: "bunty-aurora-pulse 7s ease-in-out infinite alternate",
        }}
      />

      {/* ─── Layer 2: Mouse Parallax Wrapper ─── */}
      <div
        ref={tiltRef}
        className="relative transition-transform duration-300 ease-out flex items-center justify-center"
      >
        {/* ─── Layer 3: Continuous Floating Sphere Head ─── */}
        <div
          className="relative w-60 h-60 md:w-72 md:h-72 rounded-full flex items-center justify-center"
          style={{
            animation: "bunty-float 6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
            willChange: "transform",
          }}
        >
          {/* Base 3D Sphere Aurora Shading */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(165, 243, 252, 0.85) 24%, rgba(192, 132, 252, 0.8) 54%, rgba(96, 165, 250, 0.65) 78%, rgba(147, 197, 253, 0.25) 100%)",
              boxShadow:
                "0 0 60px rgba(103, 232, 249, 0.55), 0 0 120px rgba(168, 85, 247, 0.4), inset 0 0 45px rgba(255, 255, 255, 0.85)",
            }}
          />

          {/* Flowing Aurora Light Sweep (Clockwise rotation) */}
          <div
            className="absolute inset-0 rounded-full opacity-70 mix-blend-overlay pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, #38bdf8 0deg, #c084fc 120deg, #818cf8 240deg, #38bdf8 360deg)",
              filter: "blur(22px)",
              animation: "bunty-spin 14s linear infinite",
            }}
          />

          {/* Secondary Counter-Flowing Aurora Stream (Counter-clockwise rotation for liquid fluid feel) */}
          <div
            className="absolute inset-2 rounded-full opacity-50 mix-blend-soft-light pointer-events-none"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, #c084fc 0deg, #67e8f9 120deg, #93c5fd 240deg, #c084fc 360deg)",
              filter: "blur(18px)",
              animation: "bunty-spin-reverse 20s linear infinite",
            }}
          />

          {/* Translucent 3D Glass / Caustic Rim Reflection */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "1.5px solid rgba(255, 255, 255, 0.7)",
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 55%, rgba(192, 132, 252, 0.15) 100%)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Notion-style minimal white geometric vector face features */}
          <svg
            viewBox="0 0 200 200"
            className="relative z-10 w-44 h-44 md:w-56 md:h-56 filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.85)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* High curved Notion-style eyebrows */}
            <path
              d="M 54 74 Q 68 58 82 72"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.95"
            />
            <path
              d="M 118 72 Q 132 58 146 74"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Simple dot eyes */}
            <circle cx="68" cy="88" r="3.6" fill="#FFFFFF" />
            <circle cx="132" cy="88" r="3.6" fill="#FFFFFF" />

            {/* Prominent 'L' shaped nose line */}
            <path
              d="M 99 82 L 99 114 L 111 114"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />

            {/* Calm, neutral subtle mouth line */}
            <path
              d="M 88 136 Q 100 138 112 136"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Soft cheek light glints */}
            <circle cx="56" cy="106" r="6" fill="#FFFFFF" opacity="0.22" filter="blur(2px)" />
            <circle cx="144" cy="106" r="6" fill="#FFFFFF" opacity="0.22" filter="blur(2px)" />
          </svg>

          {/* Ambient subtle floating aura ring */}
          <div
            className="absolute -inset-4 rounded-full pointer-events-none border border-cyan-300/40 dark:border-violet-400/30"
            style={{
              animation: "bunty-halo 9s ease-in-out infinite alternate",
            }}
          />
        </div>
      </div>
    </div>
  );
}
