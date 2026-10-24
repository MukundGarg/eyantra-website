"use client";

import React, { useState } from "react";
import Link from "next/link";
import Iconify from "@/components/Iconify";
import EngineeringLab3D, { STATIONS, StationId } from "@/components/EngineeringLab3D";
import { useTheme } from "@/components/ThemeProvider";

export default function EngineeringLabHero() {
  const { theme } = useTheme();
  const [activeStationId, setActiveStationId] = useState<StationId>("electronics");

  const currentStation =
    STATIONS.find((s) => s.id === activeStationId) || STATIONS[2];

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center pt-24 pb-16 md:py-24 px-6 sm:px-8 lg:px-12 overflow-hidden">
      {/* Background radial gradient mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--accent-red)]/[0.035] blur-[140px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/[0.025] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ─── Left Editorial Column (~42% desktop) ─── */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] mb-6 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
              <span className="text-xs font-mono tracking-wider uppercase text-[var(--text-secondary)] font-medium">
                e-Yantra MSIT • Student Robotics Society
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08] mb-6">
              From ideas to working robots.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl font-normal mb-8">
              We explore robotics, embedded systems and automation through hands-on projects, learning and collaboration at Maharaja Surajmal Institute of Technology.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <Link
                href="/projects"
                className="cta-press inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs uppercase tracking-wider font-semibold hover:bg-[var(--accent-red)] hover:text-white transition-colors shadow-xs"
              >
                <span>Explore Projects</span>
                <Iconify icon="lucide:arrow-right" className="w-4 h-4" />
              </Link>
              <Link
                href="/team"
                className="cta-press inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] text-xs uppercase tracking-wider font-semibold hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-colors"
              >
                <span>Meet the Team</span>
              </Link>
            </div>

            {/* Interactive Station Inspector Box */}
            <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 sm:p-5 shadow-xs transition-all">
              <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--accent-red)]">
                    PHASE {currentStation.step}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {currentStation.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">
                  Connected Station
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                {currentStation.description}
              </p>

              {/* 5-Station Clickable Pills */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {STATIONS.map((station) => {
                  const isCurrent = station.id === activeStationId;
                  return (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => setActiveStationId(station.id)}
                      className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-[var(--accent-red)] text-white shadow-xs font-semibold"
                          : "bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
                      }`}
                    >
                      <div className="font-mono text-[10px]">{station.step}</div>
                      <div className="text-[9px] uppercase tracking-wider truncate hidden sm:block">
                        {station.id}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── Right 3D Lab Column (~58% desktop) ─── */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <div className="w-full relative rounded-3xl border border-[var(--border)]/70 bg-[var(--bg-surface)]/40 backdrop-blur-xs p-2 sm:p-4 shadow-sm">
              <EngineeringLab3D
                activeStation={activeStationId}
                onStationSelect={(id) => setActiveStationId(id)}
                isDark={theme === "dark"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
