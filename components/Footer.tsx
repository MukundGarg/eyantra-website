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
      className="bg-[var(--bg-primary)] border-t border-[var(--border)] pt-20 pb-12 relative overflow-hidden select-none"
    >
      {/* ─── Top Divider ─── */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-[var(--border)]" />

      {/* ─── Background Subtle Grid ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--grid-line) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ─── Header Watermarks ─── */}
      <div className="absolute top-6 right-8 font-mono text-[10px] text-[var(--text-secondary)] hidden md:block">
        MSIT Janakpuri • New Delhi
      </div>
      <div className="absolute top-6 left-8 font-mono text-[10px] text-[var(--text-secondary)] hidden md:block">
        e-Yantra Robotics Society
      </div>

      {/* ─── Main Content Columns ─── */}
      <div className="reveal max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10 pt-4">
        {/* Lab Overview */}
        <div className="stagger-1 md:col-span-5">
          <div className="flex items-center gap-2.5 mb-5 group cursor-default">
            <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] group-hover:border-[var(--accent-red)] transition-colors shadow-sm">
              <Iconify icon="lucide:cpu" className="w-5 h-5 text-[var(--accent-red)]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              e-Yantra MSIT
            </span>
          </div>
          <p className="text-[var(--text-secondary)] max-w-sm leading-relaxed text-sm font-normal mb-6">
            The student robotics society of Maharaja Surajmal Institute of Technology, dedicated to hands-on embedded systems, autonomous robots, and engineering projects.
          </p>
        </div>

        {/* Navigation */}
        <div className="stagger-2 md:col-span-3">
          <h4 className="text-xs font-bold text-[var(--accent-red)] uppercase tracking-wider mb-5 flex items-center gap-2">
            <span>Navigation</span>
            <span className="w-6 h-[1px] bg-[var(--accent-red)]/30" />
          </h4>
          <ul className="space-y-3 text-[var(--text-secondary)] text-sm font-medium">
            <li>
              <Link
                href="/"
                className="hover:text-[var(--text-primary)] hover:translate-x-1 inline-flex items-center gap-2.5 transition-all group"
              >
                <span className="font-mono text-xs text-[var(--text-secondary)] group-hover:text-[var(--accent-red)]">01</span>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="hover:text-[var(--text-primary)] hover:translate-x-1 inline-flex items-center gap-2.5 transition-all group"
              >
                <span className="font-mono text-xs text-[var(--text-secondary)] group-hover:text-[var(--accent-red)]">02</span>
                <span>Projects</span>
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="hover:text-[var(--text-primary)] hover:translate-x-1 inline-flex items-center gap-2.5 transition-all group"
              >
                <span className="font-mono text-xs text-[var(--text-secondary)] group-hover:text-[var(--accent-red)]">03</span>
                <span>Events</span>
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="hover:text-[var(--text-primary)] hover:translate-x-1 inline-flex items-center gap-2.5 transition-all group"
              >
                <span className="font-mono text-xs text-[var(--text-secondary)] group-hover:text-[var(--accent-red)]">04</span>
                <span>Team</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div className="stagger-3 md:col-span-4">
          <h4 className="text-xs font-bold text-[var(--accent-red)] uppercase tracking-wider mb-5 flex items-center gap-2">
            <span>Contact</span>
            <span className="w-6 h-[1px] bg-[var(--accent-red)]/30" />
          </h4>
          <ul className="space-y-4 text-[var(--text-secondary)] text-sm">
            <li>
              <a
                href="mailto:contact@eyantramsit.com"
                className="group flex items-start gap-3 hover:text-[var(--text-primary)] transition-colors"
              >
                <Iconify
                  icon="lucide:mail"
                  className="w-4 h-4 text-[var(--accent-red)] mt-0.5 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs text-[var(--text-primary)] font-medium font-mono">contact@eyantramsit.com</span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Iconify icon="lucide:map-pin" className="w-4 h-4 text-[var(--accent-red)] mt-0.5 shrink-0" />
              <div className="text-xs font-normal text-[var(--text-primary)]">
                <div>Maharaja Surajmal Institute of Technology</div>
                <div className="text-[var(--text-secondary)] mt-0.5">C-4 Janakpuri, New Delhi - 110058</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Iconify icon="lucide:award" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div className="text-xs text-[var(--text-secondary)] font-medium">
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
          className="text-[16vw] leading-none font-black tracking-tighter text-stroke select-none transition-transform duration-300 ease-out opacity-20 hover:opacity-40 hover:text-[var(--text-primary)]/5 cursor-default"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          E-YANTRA
        </h1>
      </div>

      {/* ─── Footer Bottom Bar ─── */}
      <div className="max-w-7xl mx-auto px-6 border-t border-[var(--border)] pt-6 flex flex-col md:flex-row items-center justify-between text-[var(--text-secondary)] text-xs gap-4 font-normal">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent-red)]">●</span>
          <span>&copy; {new Date().getFullYear()} e-Yantra MSIT. Student robotics society.</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
          <span>Affiliated with MSIT & GGSIPU</span>
          <span>•</span>
          <span className="text-[var(--text-primary)] font-medium">All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
