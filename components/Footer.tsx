"use client";

import React, { useRef } from "react";
import Iconify from "@/components/Iconify";
import Link from "next/link";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const oversizedTextRef = useRef<HTMLHeadingElement>(null);

  // Subtle perspective response on oversized footer typography
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!oversizedTextRef.current) return;
    const rect = footerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    oversizedTextRef.current.style.transform = `perspective(1000px) rotateX(${y * 12}deg) rotateY(${x * -12}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!oversizedTextRef.current) return;
    oversizedTextRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-[#0B0D10] border-t border-[#292D32] pt-24 pb-12 relative overflow-hidden select-none"
    >
      {/* ─── Animated Top Divider / Signal Scanline ─── */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#292D32] overflow-hidden">
        <div className="w-40 h-full bg-gradient-to-r from-transparent via-[#d83a32] to-transparent animate-[scanline_6s_linear_infinite]" />
      </div>

      {/* ─── Animated Technical Background Grid ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ─── Coordinate Telemetry Watermarks ─── */}
      <div className="absolute top-6 right-8 font-mono text-[9px] text-zinc-600 tracking-widest hidden md:block pointer-events-none">
        [SYS_NODE // 28.6219° N, 77.0878° E // E-YANTRA_MSIT]
      </div>
      <div className="absolute top-6 left-8 font-mono text-[9px] text-zinc-600 tracking-widest hidden md:block pointer-events-none">
        [BAND: 2.4/5.8GHz // BUS: CAN_FD // STATUS: ONLINE]
      </div>

      {/* ─── Main Content Staggered Columns ─── */}
      <div className="reveal max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 relative z-10">
        {/* Lab Overview */}
        <div className="stagger-1 md:col-span-5">
          <div className="flex items-center gap-2.5 mb-6 group cursor-default">
            <div className="p-2 rounded-lg bg-[#15181C] border border-[#292D32] group-hover:border-[#d83a32] transition-colors">
              <Iconify icon="lucide:cpu" className="w-5 h-5 text-[#d83a32]" />
            </div>
            <span className="text-2xl font-bold font-mono tracking-tight text-white">
              e-Yantra MSIT
            </span>
          </div>
          <p className="text-[#A6AAAE] max-w-sm leading-relaxed text-sm font-light mb-6">
            A state-of-the-art robotics and embedded systems laboratory fostering autonomous innovation, hardware experimentation, and technical mastery among MSIT students.
          </p>

          {/* System Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15181C] border border-[#292D32] text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LAB_SYSTEM: OPERATIONAL</span>
          </div>
        </div>

        {/* Verified Internal Navigation */}
        <div className="stagger-2 md:col-span-3">
          <h4 className="text-xs font-bold font-mono text-[#d83a32] uppercase tracking-widest mb-6 flex items-center gap-2">
            <span>Navigation</span>
            <span className="w-6 h-[1px] bg-[#d83a32]/30" />
          </h4>
          <ul className="space-y-3.5 text-[#A6AAAE] text-sm font-mono">
            <li>
              <Link
                href="/"
                className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"
              >
                <span className="text-zinc-600 group-hover:text-[#d83a32] text-xs">01</span>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"
              >
                <span className="text-zinc-600 group-hover:text-[#d83a32] text-xs">02</span>
                <span>Projects</span>
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"
              >
                <span className="text-zinc-600 group-hover:text-[#d83a32] text-xs">03</span>
                <span>Events & Arenas</span>
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="hover:text-white hover:translate-x-1 inline-flex items-center gap-2 transition-all group"
              >
                <span className="text-zinc-600 group-hover:text-[#d83a32] text-xs">04</span>
                <span>Engineering Team</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Verified Contact Details (No Fake Socials) */}
        <div className="stagger-3 md:col-span-4">
          <h4 className="text-xs font-bold font-mono text-[#d83a32] uppercase tracking-widest mb-6 flex items-center gap-2">
            <span>Laboratory Dispatch</span>
            <span className="w-6 h-[1px] bg-[#d83a32]/30" />
          </h4>
          <ul className="space-y-4 text-[#A6AAAE] text-sm">
            <li>
              <a
                href="mailto:contact@eyantramsit.com"
                className="group flex items-start gap-3 hover:text-white transition-colors"
              >
                <Iconify
                  icon="lucide:mail"
                  className="w-4 h-4 text-[#d83a32] mt-0.5 group-hover:scale-110 transition-transform"
                />
                <span className="font-mono text-xs">contact@eyantramsit.com</span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Iconify icon="lucide:map-pin" className="w-4 h-4 text-[#d83a32] mt-0.5" />
              <div className="text-xs font-light text-zinc-300">
                <div>Maharaja Surajmal Institute of Technology</div>
                <div className="text-zinc-500 font-mono mt-0.5">C-4 Janakpuri, New Delhi, India - 110058</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Iconify icon="lucide:activity" className="w-4 h-4 text-emerald-400 mt-0.5" />
              <div className="text-xs font-mono text-zinc-400">
                IIT Bombay e-Yantra Initiative Partner
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Massive Animated E-YANTRA Typography with 3D Depth ─── */}
      <div className="reveal flex justify-center items-center py-6 md:py-10 relative overflow-hidden select-none">
        <h1
          ref={oversizedTextRef}
          className="text-[16vw] leading-none font-bold font-mono tracking-tighter text-stroke select-none transition-transform duration-300 ease-out opacity-20 hover:opacity-40 hover:text-white/10 cursor-default"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          E-YANTRA
        </h1>
      </div>

      {/* ─── Footer Bottom Telemetry Bar (No Fake Socials) ─── */}
      <div className="max-w-7xl mx-auto px-6 border-t border-[#292D32]/80 pt-8 flex flex-col md:flex-row items-center justify-between text-[#A6AAAE] text-[10px] uppercase font-mono tracking-widest gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[#d83a32]">●</span>
          <span>&copy; 2026 e-Yantra MSIT. Designed & engineered by students.</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-500">
          <span>LAT 28.6219° N</span>
          <span>•</span>
          <span>LON 77.0878° E</span>
          <span>•</span>
          <span className="text-zinc-400">ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
}
