"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Iconify from "@/components/Iconify";

export default function ClosingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle restrained pointer response on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-2px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  return (
    <section
      ref={containerRef}
      className="py-36 md:py-44 px-6 text-center relative overflow-hidden bg-[#0B0D10] border-t border-[#292D32]/60"
    >
      {/* ─── Animated Signal Line Divider ─── */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d83a32]/60 to-transparent">
        <div className="w-24 h-[2px] bg-[#d83a32] shadow-[0_0_12px_#d83a32] animate-[scanline_4s_linear_infinite]" />
      </div>

      {/* ─── Background Subtle Grid ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          backgroundPosition: "center center",
        }}
      />

      {/* ─── Subtle Radial Geometry Behind Headline ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="w-full h-full rounded-full border border-white/[0.04] flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border border-dashed border-[#d83a32]/10 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full border border-white/[0.03] bg-radial from-[#d83a32]/[0.05] to-transparent" />
          </div>
        </div>
      </div>

      {/* ─── Interactive Editorial Container ─── */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="reveal max-w-4xl mx-auto relative z-10 transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Lab Architecture Badge */}
        <div className="stagger-1 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32] animate-pulse" />
          <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">
            LABORATORY ARCHITECTURE // MSIT ROBOTICS
          </span>
          <span className="text-zinc-600 font-mono text-[10px]">{"//"}</span>
          <span className="text-[10px] font-mono text-zinc-400">EST. 2014</span>
        </div>

        {/* Scroll-Linked Scale / Headline with Depth */}
        <h2 className="stagger-2 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-mono mb-8 tracking-tighter text-white">
          Built on{" "}
          <span className="text-[#d83a32] inline-block hover:scale-[1.02] transition-transform">
            First Principles
          </span>
        </h2>

        {/* Technical Subtext */}
        <p className="stagger-3 text-base sm:text-lg md:text-xl text-[#A6AAAE] max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Explore the autonomous robots, custom embedded circuits, and technical documentation produced inside our robotics laboratory.
        </p>

        {/* Depth Buttons / Verified Real Links Only */}
        <div className="stagger-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects"
            className="shiny-cta group cta-press w-full sm:w-auto shadow-xl shadow-black/60"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-white font-mono text-xs uppercase tracking-wider">
              <span>View Repository</span>
              <Iconify icon="lucide:arrow-right" className="cta-arrow w-4 h-4 text-[#d83a32]" />
            </span>
          </Link>

          <Link
            href="/team"
            className="cta-press group px-7 py-3.5 rounded-full bg-[#15181C] border border-[#292D32] text-zinc-300 font-mono text-xs tracking-wider uppercase hover:text-white hover:border-[#d83a32] hover:bg-[#1a1f26] transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg"
          >
            <span>Meet The Engineers</span>
            <Iconify
              icon="lucide:arrow-right"
              className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#d83a32]"
            />
          </Link>
        </div>

        {/* Telemetry Coordinate Metadata */}
        <div className="stagger-5 mt-16 pt-8 border-t border-white/[0.05] flex items-center justify-center gap-6 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          <span>LAT 28.6219° N</span>
          <span>•</span>
          <span>LON 77.0878° E</span>
          <span>•</span>
          <span>E-YANTRA ROBOTICS LAB // MSIT</span>
        </div>
      </div>
    </section>
  );
}
