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
  const [activeNode, setActiveNode] = useState<number>(0);
  const [inView, setInView] = useState<boolean>(true);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // IntersectionObserver to pause progression when offscreen
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

  // Subtle auto-advance progression (calm cadence, pauses when offscreen or reduced-motion)
  useEffect(() => {
    if (!inView || reducedMotion) return;

    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % NODES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [inView, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full my-8 select-none"
    >
      <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 sm:p-8 md:p-10 shadow-2xs">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 mb-8 border-b border-[var(--border)]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-secondary)] font-medium block">
              The Engineering Process
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] tracking-tight mt-1">
              From concept to working prototype
            </h3>
          </div>
          <div className="text-xs font-mono text-[var(--text-secondary)]">
            <span className="text-[var(--accent-red)] font-semibold">0{activeNode + 1}</span> / 05
          </div>
        </div>

        {/* 5-Step Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 lg:gap-4 items-stretch">
          {NODES.map((node, i) => {
            const isActive = activeNode === i;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setActiveNode(i)}
                onMouseEnter={() => setActiveNode(i)}
                className={`group relative text-left p-4 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between focus:outline-hidden ${
                  isActive
                    ? "bg-[var(--bg-surface-alt)] border-[var(--accent-red)] shadow-xs"
                    : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--text-primary)]/30 hover:bg-[var(--bg-surface-alt)]/50"
                }`}
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[11px] font-mono font-medium ${
                      isActive ? "text-[var(--accent-red)]" : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {node.stage}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isActive ? "bg-[var(--accent-red)]" : "bg-[var(--text-primary)]/15 group-hover:bg-[var(--text-primary)]/30"
                    }`}
                  />
                </div>

                {/* Step icon & titles */}
                <div>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                      isActive
                        ? "bg-[var(--accent-red)]/10 text-[var(--accent-red)]"
                        : "bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Iconify icon={node.icon} className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
                    {node.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-tight">
                    {node.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Subtle Progress Bar */}
        <div className="hidden sm:block relative my-6">
          <div className="relative h-1 w-full bg-[var(--bg-surface-alt)] rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-[var(--accent-red)] rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((activeNode + 1) / NODES.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Active Stage Detail Panel */}
        <div className="mt-6 sm:mt-4 p-4 sm:p-5 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] text-[10px] font-mono font-semibold">
              STAGE {NODES[activeNode].stage}
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed font-normal">
              {NODES[activeNode].detail}
            </p>
          </div>
          <span className="text-xs text-[var(--accent-red)] shrink-0 font-medium font-mono uppercase tracking-wider">
            {NODES[activeNode].title}
          </span>
        </div>
      </div>
    </div>
  );
}

