"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import CircuitFlow from "@/components/CircuitFlow";

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

interface StatItem {
  value: string;
  numValue?: number;
  suffix?: string;
  label: string;
  spec: string;
}

const STATS_DATA: StatItem[] = [
  {
    value: "50+",
    numValue: 50,
    suffix: "+",
    label: "Prototypes Built",
    spec: "Autonomous & Embedded Builds",
  },
  {
    value: "100%",
    numValue: 100,
    suffix: "%",
    label: "Hardware Driven",
    spec: "Bare-Metal to Mechanical",
  },
  {
    value: "04",
    numValue: 4,
    suffix: "",
    label: "Lab Disciplines",
    spec: "Converging Technical Tracks",
  },
  {
    value: "16 MHz",
    label: "Clock Precision",
    spec: "Hardware Cycle Synchronized",
  },
];

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const bodyTextRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const backgroundLayerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [inView, setInView] = useState<boolean>(true);
  const [statsRevealed, setStatsRevealed] = useState<boolean>(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // IntersectionObserver to observe visibility and pause RAF offscreen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && !statsRevealed) {
          setStatsRevealed(true);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [statsRevealed]);

  // Continuous 60fps Scroll Parallax & Typography Depth Loop
  useEffect(() => {
    if (!inView || reducedMotion) return;

    const updateScrollParallax = () => {
      const section = sectionRef.current;
      if (!section) {
        rafId.current = requestAnimationFrame(updateScrollParallax);
        return;
      }

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress normalized from 0 (entering from bottom) to 1 (center) to 2 (scrolling past top)
      const progress = 1 - rect.top / windowHeight;

      if (progress >= -0.2 && progress <= 2.2) {
        // Clamp entry progress for typography reveal (0 to 1 as it reaches center)
        const entryProgress = Math.min(Math.max((progress - 0.15) / 0.7, 0), 1);

        // Line 1: moves upward from depth, scale 0.94 -> 1, blur 8px -> 0px
        if (headlineLine1Ref.current) {
          const transY1 = (1 - entryProgress) * 45;
          const blur1 = (1 - entryProgress) * 6;
          const scale1 = 0.94 + entryProgress * 0.06;
          const opacity1 = Math.min(entryProgress * 1.3, 1);

          headlineLine1Ref.current.style.transform = `translate3d(0, ${transY1.toFixed(1)}px, 0) scale(${scale1.toFixed(3)})`;
          headlineLine1Ref.current.style.filter = `blur(${blur1.toFixed(1)}px)`;
          headlineLine1Ref.current.style.opacity = opacity1.toFixed(2);
        }

        // Line 2: moves slightly faster with depth offset
        if (headlineLine2Ref.current) {
          const transY2 = (1 - entryProgress) * 65;
          const blur2 = (1 - entryProgress) * 8;
          const scale2 = 0.92 + entryProgress * 0.08;
          const opacity2 = Math.min(Math.max((entryProgress - 0.1) * 1.4, 0), 1);

          headlineLine2Ref.current.style.transform = `translate3d(0, ${transY2.toFixed(1)}px, 0) scale(${scale2.toFixed(3)})`;
          headlineLine2Ref.current.style.filter = `blur(${blur2.toFixed(1)}px)`;
          headlineLine2Ref.current.style.opacity = opacity2.toFixed(2);
        }

        // Parallax depth speeds
        // Background: slowest (speed 0.05)
        if (backgroundLayerRef.current) {
          const bgY = (progress - 1) * -30;
          backgroundLayerRef.current.style.transform = `translate3d(0, ${bgY.toFixed(1)}px, 0)`;
        }

        // Body text: medium speed (speed 0.08)
        if (bodyTextRef.current) {
          const bodyY = (progress - 1) * -18;
          bodyTextRef.current.style.transform = `translate3d(0, ${bodyY.toFixed(1)}px, 0)`;
        }

        // Stats: faster parallax (speed 0.12)
        if (statsContainerRef.current) {
          const statsY = (progress - 1) * -28;
          statsContainerRef.current.style.transform = `translate3d(0, ${statsY.toFixed(1)}px, 0)`;
        }
      }

      rafId.current = requestAnimationFrame(updateScrollParallax);
    };

    rafId.current = requestAnimationFrame(updateScrollParallax);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [inView, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative py-36 md:py-48 px-6 md:px-12 overflow-hidden bg-[#F3F3F0]/60 border-t border-b border-[#D9D9D5] select-none"
    >
      {/* ── Section Handoff: Vertical Red Signal Pulse from Hero ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-[#d83a32] via-[#d83a32]/40 to-transparent pointer-events-none z-20">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d83a32] shadow-[0_0_8px_#d83a32] animate-ping" />
      </div>

      {/* Layer 1: Background Parallax Coordinate Grid & Technical Atmosphere */}
      <div
        ref={backgroundLayerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden will-change-transform"
      >
        <div
          className="absolute inset-0 opacity-[0.8]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(17,18,20,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,18,20,0.035) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Layer 2: Large faint radial circular geometry */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/[0.015] via-[#d83a32]/[0.015] to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-black/[0.03] pointer-events-none" />

        {/* Layer 3: Moving technical markers */}
        <div className="absolute top-16 left-8 md:left-16 font-mono text-[10px] text-[#5F6368] tracking-widest uppercase">
          SEC.02 {"//"} ARCHITECTURE_INSPECTION {"//"} TRACE_BUS: 0x4F
        </div>
        <div className="hidden lg:block absolute bottom-12 right-16 font-mono text-[10px] text-[#5F6368] tracking-widest uppercase">
          FEEDBACK {"//"} REAL-TIME SYNCHRONIZATION
        </div>
      </div>

      {/* Layer 4: Main Content Container */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Parallax Header Label with scanline pulse */}
        <div className="flex items-center gap-3 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d83a32]" />
          </span>
          <span className="text-xs font-mono text-[#d83a32] uppercase tracking-widest font-bold">
            CREED {"//"} THE LAB PHILOSOPHY
          </span>
          <span className="hidden sm:inline text-[10px] font-mono text-[#5F6368] tracking-wider">
            [MSIT.ROBOTICS.LAB]
          </span>
        </div>

        {/* A. SCROLL-DRIVEN DYNAMIC TYPOGRAPHY */}
        <div
          className="mb-14"
          style={{ perspective: "1000px" }}
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-mono tracking-tighter leading-[1.05]">
            <span
              ref={headlineLine1Ref}
              className="block text-[#5F6368] font-light will-change-transform"
            >
              Engineering starts
            </span>
            <span
              ref={headlineLine2Ref}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#111214] via-[#111214] to-[#5F6368] will-change-transform mt-1"
            >
              where theory ends.
            </span>
          </h2>
        </div>

        {/* B. PARALLAX TEXT & EDITORIAL COLUMNS */}
        <div
          ref={bodyTextRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#D9D9D5] will-change-transform"
        >
          <div className="md:col-span-7 space-y-4">
            <p className="text-lg md:text-xl text-[#111214] leading-relaxed font-light">
              We believe real understanding only begins when code meets copper, circuits close, and machines begin to move under their own autonomy.
            </p>
            <p className="text-sm text-[#5F6368] font-mono leading-relaxed">
              Every resistor, capacitor, and clock cycle is a deliberate decision in the pursuit of mechanical and computational harmony.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col justify-center md:pl-8 border-l border-[#D9D9D5] text-xs font-mono text-[#5F6368] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
              <span>SUBSYSTEM DISPATCH: 100% IN-HOUSE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111214]/30" />
              <span>FIRMWARE COMPILATION: BARE-METAL C/C++</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111214]/30" />
              <span>ROBOTICS SIMULATION: ROS 2 & GAZEBO</span>
            </div>
          </div>
        </div>

        {/* C. INTERACTIVE CIRCUIT FLOW VISUALIZATION */}
        <div className="mt-12">
          <CircuitFlow />
        </div>

        {/* D. ANIMATED STATS WITH DEPTH & UNDERLINES */}
        <div
          ref={statsContainerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 pt-8 border-t border-[#D9D9D5] will-change-transform"
        >
          {STATS_DATA.map((stat, idx) => {
            const isHovered = hoveredStat === idx;
            return (
              <div
                key={stat.label}
                onMouseEnter={() => setHoveredStat(idx)}
                onMouseLeave={() => setHoveredStat(null)}
                className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isHovered
                    ? "bg-white border-[#d83a32] shadow-[0_4px_20px_rgba(216,58,50,0.12)] -translate-y-1"
                    : "bg-white/80 border-[#D9D9D5] hover:border-[#111214]/30 shadow-xs"
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span
                    className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight transition-colors ${
                      isHovered ? "text-[#d83a32]" : "text-[#111214]"
                    }`}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-mono text-[#5F6368]">
                    0{idx + 1}
                  </span>
                </div>

                {/* Animated technical underline with pulse dot */}
                <div className="relative h-[2px] w-full bg-[#D9D9D5] my-2 overflow-hidden rounded-full">
                  <div
                    className={`absolute top-0 bottom-0 bg-gradient-to-r from-transparent via-[#d83a32] to-[#111214] rounded-full transition-all duration-500 ${
                      statsRevealed || isHovered ? "w-full" : "w-0"
                    }`}
                  />
                </div>

                <h4 className="text-xs font-mono font-bold text-[#111214] uppercase tracking-wider mt-2">
                  {stat.label}
                </h4>
                <p className="text-[10px] font-mono text-[#5F6368] mt-0.5 leading-tight">
                  {stat.spec}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
