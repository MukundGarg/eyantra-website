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
      className="py-28 md:py-36 px-6 text-center relative overflow-hidden bg-[#FAFAF8] border-t border-[#D9D9D5]"
    >
      {/* ─── Top Line Divider ─── */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d83a32]/40 to-transparent" />

      {/* ─── Background Subtle Grid ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17,18,20,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(17,18,20,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          backgroundPosition: "center center",
        }}
      />

      {/* ─── Subtle Radial Geometry Behind Headline ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="w-full h-full rounded-full border border-[#D9D9D5] flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border border-dashed border-[#d83a32]/20 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full border border-[#D9D9D5] bg-radial from-[#d83a32]/[0.03] to-transparent" />
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
        {/* Lab Badge */}
        <div className="stagger-1 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#D9D9D5] mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
          <span className="text-xs font-mono text-[#d83a32] uppercase tracking-wider font-semibold">
            Robotics Society • MSIT New Delhi
          </span>
        </div>

        {/* Headline */}
        <h2 className="stagger-2 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter text-[#111214]">
          Built on{" "}
          <span className="text-[#d83a32] inline-block hover:scale-[1.02] transition-transform">
            First Principles
          </span>
        </h2>

        {/* Subtext */}
        <p className="stagger-3 text-base sm:text-lg md:text-xl text-[#5F6368] max-w-2xl mx-auto mb-12 font-normal leading-relaxed">
          Explore the autonomous robots, embedded hardware, and technical documentation produced by student engineers at e-Yantra MSIT.
        </p>

        {/* Buttons */}
        <div className="stagger-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects"
            className="shiny-cta group cta-press w-full sm:w-auto shadow-md"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-white text-xs uppercase tracking-wider font-semibold">
              <span>View Projects</span>
              <Iconify icon="lucide:arrow-right" className="cta-arrow w-4 h-4 text-[#d83a32]" />
            </span>
          </Link>

          <Link
            href="/team"
            className="cta-press group px-7 py-3.5 rounded-full bg-white border border-[#D9D9D5] text-[#111214] text-xs tracking-wider uppercase hover:text-[#d83a32] hover:border-[#d83a32] hover:bg-[#FAFAF8] transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm font-semibold"
          >
            <span>Meet The Team</span>
            <Iconify
              icon="lucide:arrow-right"
              className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#d83a32]"
            />
          </Link>
        </div>

        {/* Metadata */}
        <div className="stagger-5 mt-16 pt-8 border-t border-[#D9D9D5] flex items-center justify-center gap-4 font-mono text-xs text-[#5F6368]">
          <span>MSIT Janakpuri</span>
          <span>•</span>
          <span>New Delhi, India</span>
          <span>•</span>
          <span>e-Yantra Robotics</span>
        </div>
      </div>
    </section>
  );
}
