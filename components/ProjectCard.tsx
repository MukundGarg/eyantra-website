"use client";

import React, { useRef, useEffect, useSyncExternalStore } from "react";
import Iconify from "@/components/Iconify";

export interface ProjectProps {
  image: string | null;
  title: string;
  category: string | null;
  desc: string | null;
  techStack: string[] | null;
  link?: string | null;
  githubUrl?: string | null;
}

const subscribeReducedMotion = (notify: () => void) => {
  if (typeof window === "undefined") return () => {};
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const subscribeMobile = (notify: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", notify, { passive: true });
  return () => window.removeEventListener("resize", notify);
};

const getMobileSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || "ontouchstart" in window;
};

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: ProjectProps;
  index?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    () => false
  );

  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);

  const safeTechStack = project.techStack || [];
  const linkToUse = project.link || project.githubUrl || null;

  // Damped pointer tilt loop (Runs smoothly without React setState re-renders)
  useEffect(() => {
    if (reducedMotion || isMobile) return;

    const loop = () => {
      if (!cardRef.current) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }

      // Max tilt: 4.5° pitch, 5.5° yaw
      const targetRotX = isHovered.current ? -mouseTarget.current.y * 4.5 : 0;
      const targetRotY = isHovered.current ? mouseTarget.current.x * 5.5 : 0;

      const lerp = 0.09;
      currentRot.current.x += (targetRotX - currentRot.current.x) * lerp;
      currentRot.current.y += (targetRotY - currentRot.current.y) * lerp;

      cardRef.current.style.transform = `
        rotateX(${currentRot.current.x.toFixed(2)}deg)
        rotateY(${currentRot.current.y.toFixed(2)}deg)
      `;

      // If resting and not hovered, we can slow down, but keep loop active for responsiveness
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [reducedMotion, isMobile]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseTarget.current = { x: nx, y: ny };
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    mouseTarget.current = { x: 0, y: 0 };
    isHovered.current = false;
  };

  return (
    <div
      className="relative w-full h-full select-none"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="group relative flex flex-col h-full overflow-hidden p-6 border border-[#292D32] bg-[#15181C]/90 hover:border-white/30 transition-colors duration-400 rounded-xl shadow-lg hover:shadow-2xl will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Subtle card ambient red backlighting on hover */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#d83a32]/0 group-hover:bg-[#d83a32]/[0.05] blur-[80px] rounded-full pointer-events-none transition-colors duration-500" />

        {/* ── Image Display Area with Corner HUD Brackets & Parallax Depth ── */}
        <div
          className="w-full h-52 bg-[#0B0D10] border border-[#292D32] rounded-lg mb-6 overflow-hidden relative flex items-center justify-center will-change-transform"
          style={{ transform: "translateZ(12px)" }}
        >
          {project.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
            />
          ) : (
            <Iconify icon="lucide:cpu" className="w-10 h-10 text-[#292D32]" />
          )}

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10]/85 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-30 transition-opacity" />

          {/* HUD Precision Corner Brackets */}
          <span className="absolute top-2 left-2 text-[11px] font-mono text-[#d83a32]/80 leading-none pointer-events-none font-bold select-none">
            ┌
          </span>
          <span className="absolute top-2 right-2 text-[11px] font-mono text-[#d83a32]/80 leading-none pointer-events-none font-bold select-none">
            ┐
          </span>
          <span className="absolute bottom-2 left-2 text-[11px] font-mono text-[#d83a32]/80 leading-none pointer-events-none font-bold select-none">
            └
          </span>
          <span className="absolute bottom-2 right-2 text-[11px] font-mono text-[#d83a32]/80 leading-none pointer-events-none font-bold select-none">
            ┘
          </span>

          {/* Subtle animated scanline beam */}
          <div
            className={`absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#d83a32]/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              reducedMotion ? "hidden" : "animate-[subtle-float_3s_ease-in-out_infinite]"
            }`}
          />

          {/* HUD Index / Telemetry Tag */}
          <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-zinc-300 tracking-widest uppercase flex items-center gap-1.5 pointer-events-none">
            <span className="w-1 h-1 rounded-full bg-[#d83a32]" />
            <span>SYS.0{index + 1}</span>
          </div>
        </div>

        {/* Category Label (Depth Layer 20px) */}
        {project.category && (
          <div
            className="will-change-transform mb-2"
            style={{ transform: "translateZ(20px)" }}
          >
            <span className="text-[#d83a32] font-mono text-[10px] uppercase tracking-widest font-bold">
              {project.category}
            </span>
          </div>
        )}

        {/* Title (Depth Layer 24px) */}
        <h3
          className="text-lg font-bold font-mono text-white tracking-tight mb-2 group-hover:text-white transition-colors will-change-transform"
          style={{ transform: "translateZ(24px)" }}
        >
          {project.title}
        </h3>

        {/* Description (Depth Layer 16px) */}
        {project.desc && (
          <p
            className="text-[#A6AAAE] text-sm mb-6 flex-1 line-clamp-3 font-light leading-relaxed will-change-transform"
            style={{ transform: "translateZ(16px)" }}
          >
            {project.desc}
          </p>
        )}

        {/* Tech Stack Tags (Depth Layer 26px) */}
        {safeTechStack.length > 0 && (
          <div
            className="flex gap-1.5 mb-6 flex-wrap will-change-transform"
            style={{ transform: "translateZ(26px)" }}
          >
            {safeTechStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 bg-white/[0.04] group-hover:bg-white/[0.07] border border-white/10 group-hover:border-white/20 rounded text-[10px] text-zinc-300 font-mono tracking-wider transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Link Button (Depth Layer 30px) */}
        {linkToUse && (
          <div
            className="mt-auto will-change-transform"
            style={{ transform: "translateZ(30px)" }}
          >
            <a
              href={linkToUse}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-white/5 hover:bg-[#d83a32] text-zinc-200 hover:text-white border border-white/10 hover:border-[#d83a32] rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center gap-2"
            >
              Inspect Project{" "}
              <Iconify
                icon="lucide:arrow-right"
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
