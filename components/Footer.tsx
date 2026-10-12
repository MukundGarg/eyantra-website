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
      className="bg-[#F3F3F0] border-t border-[#D9D9D5] pt-20 pb-12 relative overflow-hidden select-none"
    >
      {/* ─── Top Divider ─── */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#D9D9D5]" />

      {/* ─── Background Subtle Grid ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(17,18,20,0.12) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ─── Header Watermarks ─── */}
      <div className="absolute top-6 right-8 font-mono text-[10px] text-[#5F6368] hidden md:block">
        MSIT Janakpuri • New Delhi
      </div>
      <div className="absolute top-6 left-8 font-mono text-[10px] text-[#5F6368] hidden md:block">
        e-Yantra Robotics Society
      </div>

      {/* ─── Main Content Columns ─── */}
      <div className="reveal max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10 pt-4">
        {/* Lab Overview */}
        <div className="stagger-1 md:col-span-5">
          <div className="flex items-center gap-2.5 mb-5 group cursor-default">
            <div className="p-2 rounded-lg bg-white border border-[#D9D9D5] group-hover:border-[#d83a32] transition-colors shadow-sm">
              <Iconify icon="lucide:cpu" className="w-5 h-5 text-[#d83a32]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#111214]">
              e-Yantra MSIT
            </span>
          </div>
          <p className="text-[#5F6368] max-w-sm leading-relaxed text-sm font-normal mb-6">
            The student robotics society of Maharaja Surajmal Institute of Technology, dedicated to hands-on embedded systems, autonomous robots, and engineering projects.
          </p>
        </div>

        {/* Navigation */}
        <div className="stagger-2 md:col-span-3">
          <h4 className="text-xs font-bold text-[#d83a32] uppercase tracking-wider mb-5 flex items-center gap-2">
            <span>Navigation</span>
            <span className="w-6 h-[1px] bg-[#d83a32]/30" />
          </h4>
          <ul className="space-y-3 text-[#5F6368] text-sm font-medium">
            <li>
              <Link
                href="/"
                className="hover:text-[#111214] hover:translate-x-1 inline-flex items-center gap-2.5 transition-all group"
              >
                <span className="font-mono text-xs text-[#5F6368] group-hover:text-[#d83a32]">01</span>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="hover:text-[#111214] hover:translate-x-1 inline-flex items-center gap-2.5 transition-all group"
              >
                <span className="font-mono text-xs text-[#5F6368] group-hover:text-[#d83a32]">02</span>
                <span>Projects</span>
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="hover:text-[#111214] hover:translate-x-1 inline-flex items-center gap-2.5 transition-all group"
              >
                <span className="font-mono text-xs text-[#5F6368] group-hover:text-[#d83a32]">03</span>
                <span>Events</span>
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="hover:text-[#111214] hover:translate-x-1 inline-flex items-center gap-2.5 transition-all group"
              >
                <span className="font-mono text-xs text-[#5F6368] group-hover:text-[#d83a32]">04</span>
                <span>Team</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div className="stagger-3 md:col-span-4">
          <h4 className="text-xs font-bold text-[#d83a32] uppercase tracking-wider mb-5 flex items-center gap-2">
            <span>Contact</span>
            <span className="w-6 h-[1px] bg-[#d83a32]/30" />
          </h4>
          <ul className="space-y-4 text-[#5F6368] text-sm">
            <li>
              <a
                href="mailto:contact@eyantramsit.com"
                className="group flex items-start gap-3 hover:text-[#111214] transition-colors"
              >
                <Iconify
                  icon="lucide:mail"
                  className="w-4 h-4 text-[#d83a32] mt-0.5 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs text-[#111214] font-medium font-mono">contact@eyantramsit.com</span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Iconify icon="lucide:map-pin" className="w-4 h-4 text-[#d83a32] mt-0.5 shrink-0" />
              <div className="text-xs font-normal text-[#111214]">
                <div>Maharaja Surajmal Institute of Technology</div>
                <div className="text-[#5F6368] mt-0.5">C-4 Janakpuri, New Delhi - 110058</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Iconify icon="lucide:award" className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs text-[#5F6368] font-medium">
                IIT Bombay e-Yantra Initiative Partner Lab
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Massive E-YANTRA Typography with 3D Depth ─── */}
      <div className="reveal flex justify-center items-center py-4 md:py-6 relative overflow-hidden select-none">
        <h1
          ref={oversizedTextRef}
          className="text-[16vw] leading-none font-black tracking-tighter text-stroke select-none transition-transform duration-300 ease-out opacity-20 hover:opacity-40 hover:text-[#111214]/5 cursor-default"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          E-YANTRA
        </h1>
      </div>

      {/* ─── Footer Bottom Bar ─── */}
      <div className="max-w-7xl mx-auto px-6 border-t border-[#D9D9D5] pt-6 flex flex-col md:flex-row items-center justify-between text-[#5F6368] text-xs gap-4 font-normal">
        <div className="flex items-center gap-2">
          <span className="text-[#d83a32]">●</span>
          <span>&copy; {new Date().getFullYear()} e-Yantra MSIT. Student robotics society.</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#5F6368]">
          <span>Affiliated with MSIT & GGSIPU</span>
          <span>•</span>
          <span className="text-[#111214] font-medium">All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
