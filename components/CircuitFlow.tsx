"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Iconify from "@/components/Iconify";

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

const NODES = [
  {
    id: "idea",
    stage: "01",
    title: "IDEA",
    subtitle: "Concept & Planning",
    detail: "Brainstorming project goals, system architecture, and mechanism design.",
    icon: "lucide:lightbulb",
  },
  {
    id: "code",
    stage: "02",
    title: "CODE",
    subtitle: "Firmware & Algorithms",
    detail: "Writing microcontroller firmware, motor control algorithms, and sensor logic.",
    icon: "lucide:code-2",
  },
  {
    id: "electronics",
    stage: "03",
    title: "ELECTRONICS",
    subtitle: "Circuits & Power",
    detail: "Designing schematic circuits, interfacing sensors, and assembling breadboards or PCBs.",
    icon: "lucide:cpu",
  },
  {
    id: "build",
    stage: "04",
    title: "BUILD",
    subtitle: "Fabrication & Assembly",
    detail: "Mounting chassis components, wiring actuators, and 3D printing custom brackets.",
    icon: "lucide:wrench",
  },
  {
    id: "test",
    stage: "05",
    title: "TEST",
    subtitle: "Calibration & Trials",
    detail: "Calibrating sensor inputs, tuning control loops, and field-testing under arena conditions.",
    icon: "lucide:check-circle-2",
  },
];

export default function CircuitFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<number>(0);
  const [inView, setInView] = useState<boolean>(true);
  const rafId = useRef<number | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // Mouse tilt refs
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  // IntersectionObserver to pause RAF when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sequential node advancement loop
  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % NODES.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [inView]);

  // Pointer move handler (desktop tilt)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseTarget.current = { x: nx, y: ny };
  };

  const handleMouseLeave = () => {
    mouseTarget.current = { x: 0, y: 0 };
  };

  // 60FPS interpolation loop
  useEffect(() => {
    if (!inView || reducedMotion) return;

    const loop = () => {
      if (!cardRef.current) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }

      // Max tilt: 3.5° pitch, 4.5° yaw
      const targetRotX = -mouseTarget.current.y * 3.5;
      const targetRotY = mouseTarget.current.x * 4.5;

      const lerp = 0.08;
      currentRot.current.x += (targetRotX - currentRot.current.x) * lerp;
      currentRot.current.y += (targetRotY - currentRot.current.y) * lerp;

      cardRef.current.style.transform = `
        rotateX(${currentRot.current.x.toFixed(2)}deg)
        rotateY(${currentRot.current.y.toFixed(2)}deg)
      `;

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [inView, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full my-8 select-none"
      style={{ perspective: "1200px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Tilted Card */}
      <div
        ref={cardRef}
        className="relative w-full rounded-2xl border border-[#D9D9D5] bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl transition-transform will-change-transform overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Subtle background grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#111214 0.8px, transparent 0.8px), linear-gradient(to right, #111214 1px, transparent 1px)",
            backgroundSize: "24px 24px, 48px 48px",
          }}
        />

        {/* Ambient red trace glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-[#d83a32]/[0.03] blur-[80px] rounded-full pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#D9D9D5] text-[11px]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#d83a32]" />
            <span className="text-[#111214] font-semibold tracking-wider uppercase font-mono">
              ENGINEERING WORKFLOW
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#5F6368] font-mono tracking-wider uppercase text-[10px]">
            <span>From concept to prototype</span>
            <span className="text-[#d83a32] font-semibold">STAGE 0{activeNode + 1} / 05</span>
          </div>
        </div>

        {/* Main Interactive Flow Pipeline */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-3 lg:gap-4 items-stretch">
          {NODES.map((node, i) => {
            const isActive = activeNode === i;
            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(i)}
                onMouseEnter={() => setActiveNode(i)}
                className={`group relative p-4 rounded-xl border transition-all duration-400 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-[#FAFAF8] border-[#d83a32] shadow-[0_4px_20px_rgba(216,58,50,0.12)] -translate-y-1"
                    : "bg-[#F3F3F0]/80 border-[#D9D9D5] hover:border-[#111214]/30 hover:bg-white"
                }`}
              >
                {/* Node stage badge & active indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-mono tracking-wider font-semibold ${
                      isActive ? "text-[#d83a32]" : "text-[#5F6368]"
                    }`}
                  >
                    STAGE {node.stage}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      isActive
                        ? "bg-[#d83a32]"
                        : "bg-black/15 group-hover:bg-black/30"
                    }`}
                  />
                </div>

                {/* Node Icon & Titles */}
                <div>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                      isActive
                        ? "bg-[#d83a32]/10 text-[#d83a32] border border-[#d83a32]/30"
                        : "bg-white text-[#5F6368] border border-[#D9D9D5] group-hover:text-[#111214]"
                    }`}
                  >
                    <Iconify icon={node.icon} className="w-5 h-5" />
                  </div>

                  <h4 className="text-sm font-bold text-[#111214] tracking-tight">
                    {node.title}
                  </h4>
                  <p className="text-[11px] text-[#5F6368] mt-0.5 leading-tight font-medium">
                    {node.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Vector Signal Trace Line (Connecting desktop pipeline) */}
        <div className="hidden md:block relative z-10 my-5 px-4">
          <div className="relative h-2 w-full bg-[#F3F3F0] border border-[#D9D9D5] rounded-full overflow-hidden">
            {/* The traveling electrical pulse */}
            <div
              className={`absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[#d83a32] to-[#111214] rounded-full transition-all duration-700 ${
                reducedMotion ? "hidden" : "block"
              }`}
              style={{
                left: `${(activeNode / (NODES.length - 1)) * 80}%`,
              }}
            />
            {/* 5 junction ticks */}
            <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
              {NODES.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    activeNode >= i ? "bg-[#d83a32]" : "bg-black/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Active Node Summary Panel */}
        <div className="relative z-10 mt-4 p-4 rounded-xl bg-[#F3F3F0]/90 border border-[#D9D9D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-white border border-[#D9D9D5] text-[#111214] text-[10px] font-mono font-semibold shadow-xs">
              STAGE {NODES[activeNode].stage}
            </span>
            <p className="text-[#5F6368] leading-relaxed">
              {NODES[activeNode].detail}
            </p>
          </div>
          <div className="text-[11px] text-[#d83a32] shrink-0 font-semibold font-mono tracking-wider uppercase">
            {NODES[activeNode].title}
          </div>
        </div>
      </div>
    </div>
  );
}
