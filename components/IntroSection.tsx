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

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const bodyTextRef = useRef<HTMLDivElement>(null);
  const backgroundLayerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [inView, setInView] = useState<boolean>(true);

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
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      className="relative py-28 md:py-36 px-6 md:px-12 overflow-hidden bg-[#F3F3F0]/60 border-t border-b border-[#D9D9D5] select-none"
    >
      {/* ── Section Handoff: Vertical Red Signal Pulse from Hero ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-[#d83a32] via-[#d83a32]/40 to-transparent pointer-events-none z-20">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
      </div>

      {/* Layer 1: Background Parallax Grid */}
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

        {/* Layer 2: Faint radial geometry */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/[0.015] via-[#d83a32]/[0.015] to-transparent pointer-events-none" />
      </div>

      {/* Layer 3: Main Content Container */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Label */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#d83a32]" />
          <span className="text-xs font-mono text-[#d83a32] uppercase tracking-wider font-semibold">
            About e-Yantra MSIT
          </span>
          <span className="hidden sm:inline text-xs text-[#5F6368]">
            • Student Robotics Society
          </span>
        </div>

        {/* A. SCROLL-DRIVEN DYNAMIC TYPOGRAPHY */}
        <div
          className="mb-14"
          style={{ perspective: "1000px" }}
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05]">
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
            <p className="text-lg md:text-xl text-[#111214] leading-relaxed font-normal">
              We are MSIT&apos;s student robotics society. We bring together engineering students to design, prototype, and build autonomous robots and embedded systems.
            </p>
            <p className="text-sm text-[#5F6368] leading-relaxed">
              From circuit design and microcontroller programming to mechanical fabrication and algorithmic control, our members learn engineering by building real hardware.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col justify-center md:pl-8 border-l border-[#D9D9D5] text-xs text-[#5F6368] space-y-3 font-medium">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
              <span className="text-[#111214]">Hands-on hardware & embedded workshops</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111214]/40" />
              <span>Collaborative robotics & automation projects</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111214]/40" />
              <span>National competition & hackathon teams</span>
            </div>
          </div>
        </div>

        {/* C. INTERACTIVE CIRCUIT FLOW VISUALIZATION */}
        <div className="mt-12">
          <CircuitFlow />
        </div>
      </div>
    </section>
  );
}
