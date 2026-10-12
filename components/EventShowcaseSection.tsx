"use client";

import React, { useState, useEffect, useRef, useId, useSyncExternalStore } from "react";
import Link from "next/link";
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

export interface EventData {
  id?: string;
  title: string;
  eventType: string;
  shortDescription: string;
  image?: string;
  eventDate?: string;
  status?: "upcoming" | "past" | "ongoing" | string;
  link?: string;
}

interface EventShowcaseProps {
  events?: Array<{
    id?: string;
    title?: string;
    event_type?: string;
    short_description?: string;
    cover_image?: string;
    event_date?: string;
    status?: string;
    registration_url?: string;
  }>;
}

/* ─────────────────────────────────────────────────────────────
   1. ROBO RACE SVG VISUALIZER
   ───────────────────────────────────────────────────────────── */
function RoboRaceVisualizer({ isReducedMotion }: { isReducedMotion: boolean }) {
  const uid = useId();
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 overflow-hidden select-none">
      {/* Telemetry Corner Header */}
      <div className="flex items-center justify-between z-10 font-mono text-[11px] text-[#5F6368] border-b border-[#D9D9D5] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d83a32] animate-ping" />
          <span className="text-[#111214] font-semibold tracking-wider">TRACK_TELEMETRY // APEX_01</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#5F6368]">PATH // ACTIVE</span>
          <span className="text-[#d83a32] bg-[#d83a32]/10 px-2 py-0.5 rounded border border-[#d83a32]/20 font-medium">
            SYSTEM // VERIFIED
          </span>
        </div>
      </div>

      {/* SVG Circuit Canvas */}
      <div className="relative flex-1 flex items-center justify-center my-2">
        <svg
          viewBox="0 0 540 320"
          className="w-full h-full max-h-[300px] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`raceGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d83a32" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ff5a52" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d83a32" stopOpacity="0.1" />
            </linearGradient>
            <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Ground Plane */}
          <g opacity="0.6">
            <line x1="20" y1="80" x2="520" y2="80" stroke="#D9D9D5" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="20" y1="160" x2="520" y2="160" stroke="#D9D9D5" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="20" y1="240" x2="520" y2="240" stroke="#D9D9D5" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="140" y1="20" x2="140" y2="300" stroke="#D9D9D5" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="270" y1="20" x2="270" y2="300" stroke="#D9D9D5" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="400" y1="20" x2="400" y2="300" stroke="#D9D9D5" strokeWidth="0.75" strokeDasharray="3 3" />
          </g>

          {/* Track Outer Curbs */}
          <path
            d="M 60 160 C 60 70, 160 50, 270 50 C 400 50, 480 90, 480 160 C 480 230, 390 270, 270 270 C 150 270, 60 250, 60 160 Z"
            stroke="#D9D9D5"
            strokeWidth="38"
            strokeLinejoin="round"
          />

          {/* Track Asphalt Surface */}
          <path
            d="M 60 160 C 60 70, 160 50, 270 50 C 400 50, 480 90, 480 160 C 480 230, 390 270, 270 270 C 150 270, 60 250, 60 160 Z"
            stroke="#F3F3F0"
            strokeWidth="32"
            strokeLinejoin="round"
          />

          {/* Animated Centerline Path */}
          <path
            id={`racePath-${uid}`}
            d="M 60 160 C 60 70, 160 50, 270 50 C 400 50, 480 90, 480 160 C 480 230, 390 270, 270 270 C 150 270, 60 250, 60 160 Z"
            stroke="#d83a32"
            strokeWidth="2"
            strokeDasharray="8 6"
            className={isReducedMotion ? "" : "race-path-anim"}
            opacity="0.9"
          />

          {/* Sector Checkpoint 1 (Apex Left) */}
          <g transform="translate(60, 160)">
            <circle r="14" fill="none" stroke="#d83a32" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" style={{ animationDuration: "8s" }} />
            <circle r="5" fill="#d83a32" />
            <text x="-40" y="24" fill="#5F6368" fontSize="9" fontFamily="monospace">CP_01: HAIRPIN</text>
          </g>

          {/* Sector Checkpoint 2 (Top High Speed Straight) */}
          <g transform="translate(270, 50)">
            <circle r="12" fill="none" stroke="#ff5a52" strokeWidth="1" opacity="0.6" />
            <circle r="4" fill="#ff5a52" />
            <text x="-34" y="-12" fill="#5F6368" fontSize="9" fontFamily="monospace">CP_02: SPRINT</text>
          </g>

          {/* Sector Checkpoint 3 (Chicane Right) */}
          <g transform="translate(480, 160)">
            <circle r="14" fill="none" stroke="#d83a32" strokeWidth="1" strokeDasharray="2 2" />
            <circle r="5" fill="#d83a32" />
            <text x="-15" y="26" fill="#5F6368" fontSize="9" fontFamily="monospace">CP_03: APEX</text>
          </g>

          {/* Finish Line Telemetry Gate */}
          <g transform="translate(270, 270)">
            <line x1="-16" y1="-14" x2="-16" y2="14" stroke="#111214" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
            <line x1="16" y1="-14" x2="16" y2="14" stroke="#111214" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
            <text x="-26" y="24" fill="#111214" fontSize="9" fontWeight="bold" fontFamily="monospace">FINISH GATE</text>
          </g>

          {/* Moving Robot Marker on Track */}
          <g filter={`url(#glow-${uid})`}>
            {/* Smooth SVG Path Animation Follower */}
            <g>
              {!isReducedMotion && (
                <animateMotion
                  path="M 60 160 C 60 70, 160 50, 270 50 C 400 50, 480 90, 480 160 C 480 230, 390 270, 270 270 C 150 270, 60 250, 60 160 Z"
                  dur="7s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              )}
              {/* Rover Body */}
              <rect x="-11" y="-7" width="22" height="14" rx="3" fill="#FFFFFF" stroke="#d83a32" strokeWidth="1.5" />
              {/* Heading Direction Arrow */}
              <polygon points="8,0 3,-4 3,4" fill="#ff5a52" />
              {/* Wheels */}
              <rect x="-9" y="-9" width="5" height="2" fill="#111214" />
              <rect x="4" y="-9" width="5" height="2" fill="#111214" />
              <rect x="-9" y="7" width="5" height="2" fill="#111214" />
              <rect x="4" y="7" width="5" height="2" fill="#111214" />
              {/* Radar pulse wave */}
              <circle r="16" fill="none" stroke="#d83a32" strokeWidth="0.8" opacity="0.5" />
            </g>
          </g>
        </svg>
      </div>

      {/* Telemetry Footer Gauges */}
      <div className="grid grid-cols-3 gap-3 border-t border-[#D9D9D5] pt-3 font-mono text-[10px] text-[#5F6368] z-10">
        <div className="bg-[#FAFAF8] border border-[#D9D9D5] p-2 rounded">
          <div className="text-[#5F6368]">TRAJECTORY</div>
          <div className="text-[#111214] text-xs font-semibold mt-0.5">PATH // ACTIVE</div>
        </div>
        <div className="bg-[#FAFAF8] border border-[#D9D9D5] p-2 rounded">
          <div className="text-[#5F6368]">CONTROL LOOP</div>
          <div className="text-[#d83a32] text-xs font-semibold mt-0.5">LOOP // READY</div>
        </div>
        <div className="bg-[#FAFAF8] border border-[#D9D9D5] p-2 rounded">
          <div className="text-[#5F6368]">TELEMETRY</div>
          <div className="text-emerald-600 text-xs font-semibold mt-0.5">TRACKING // ONLINE</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. ROBO SOCCER SVG VISUALIZER
   ───────────────────────────────────────────────────────────── */
function RoboSoccerVisualizer({ isReducedMotion }: { isReducedMotion: boolean }) {
  const uid = useId();
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 overflow-hidden select-none">
      {/* Telemetry Corner Header */}
      <div className="flex items-center justify-between z-10 font-mono text-[11px] text-[#5F6368] border-b border-[#D9D9D5] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[#111214] font-semibold tracking-wider">ARENA_TACTICS // PITCH_GRID</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#5F6368]">FORMATION: DUAL-AGENT</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
            CONTROL LOOP // READY
          </span>
        </div>
      </div>

      {/* Soccer Pitch Canvas */}
      <div className="relative flex-1 flex items-center justify-center my-2">
        <svg
          viewBox="0 0 540 320"
          className="w-full h-full max-h-[300px] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id={`ballGlow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Arena Boundary */}
          <rect x="40" y="30" width="460" height="260" rx="8" stroke="#D9D9D5" strokeWidth="1.5" fill="#FAFAF8" />

          {/* Halfway Line */}
          <line x1="270" y1="30" x2="270" y2="290" stroke="#D9D9D5" strokeWidth="1" strokeDasharray="4 4" />

          {/* Center Circle & Spot */}
          <circle cx="270" cy="160" r="50" stroke="#D9D9D5" strokeWidth="1" fill="none" />
          <circle cx="270" cy="160" r="3" fill="#5F6368" />

          {/* Left Goal Area (Blue/Zinc Zone) */}
          <rect x="15" y="110" width="25" height="100" stroke="#D9D9D5" strokeWidth="1.5" fill="#FFFFFF" />
          <rect x="40" y="90" width="60" height="140" stroke="#D9D9D5" strokeWidth="1" fill="none" />

          {/* Right Goal Area (Red Team Target Zone) */}
          <rect x="500" y="110" width="25" height="100" stroke="#d83a32" strokeWidth="1.5" strokeOpacity="0.8" fill="#FFFFFF" />
          <rect x="440" y="90" width="60" height="140" stroke="#d83a32" strokeWidth="1" strokeOpacity="0.4" fill="none" />

          {/* Tactical Coordinate Markers */}
          <text x="50" y="46" fill="#5F6368" fontSize="8" fontFamily="monospace">ZONE // ALPHA</text>
          <text x="430" y="46" fill="#5F6368" fontSize="8" fontFamily="monospace">ZONE // BETA</text>
          <text x="245" y="280" fill="#5F6368" fontSize="8" fontFamily="monospace">MIDFIELD_X0</text>

          {/* Tactical Ball Pass Trajectory (Dashed Vector) */}
          <path
            d="M 190 200 Q 320 120 480 150"
            stroke="#ff5a52"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          <polygon points="485,150 475,145 476,155" fill="#ff5a52" />

          {/* Agent 1: Striker Bot (Red Team #d83a32) */}
          <g transform="translate(190, 200)">
            {/* Heading Cone */}
            <path d="M 0 0 L 40 -20 L 40 20 Z" fill="#d83a32" opacity="0.1" />
            <circle r="15" fill="#FFFFFF" stroke="#d83a32" strokeWidth="2" />
            <circle r="5" fill="#d83a32" />
            <line x1="0" y1="0" x2="22" y2="-10" stroke="#d83a32" strokeWidth="1.5" />
            <text x="-24" y="26" fill="#111214" fontSize="8" fontWeight="bold" fontFamily="monospace">RED_STRIKER</text>
          </g>

          {/* Agent 2: Red Team Support Bot */}
          <g transform="translate(140, 80)">
            <circle r="14" fill="#FFFFFF" stroke="#d83a32" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle r="4" fill="#d83a32" opacity="0.8" />
            <line x1="0" y1="0" x2="16" y2="12" stroke="#d83a32" strokeWidth="1.2" opacity="0.6" />
            <text x="-20" y="-18" fill="#5F6368" fontSize="8" fontFamily="monospace">RED_WING</text>
          </g>

          {/* Opponent Bot (Defending Near Goal) */}
          <g transform="translate(420, 140)">
            <circle r="14" fill="#FFFFFF" stroke="#71717a" strokeWidth="1.5" />
            <circle r="4" fill="#71717a" />
            <line x1="0" y1="0" x2="-14" y2="6" stroke="#71717a" strokeWidth="1.2" />
            <text x="-24" y="-18" fill="#71717a" fontSize="8" fontFamily="monospace">OPP_KEEPER</text>
          </g>

          {/* Glowing Ball with Motion */}
          <g filter={`url(#ballGlow-${uid})`}>
            <circle cx="340" cy="148" r="7" fill="#ffffff" stroke="#ff5a52" strokeWidth="1.5" />
            {!isReducedMotion && (
              <circle cx="340" cy="148" r="14" fill="none" stroke="#d83a32" strokeWidth="0.8" opacity="0.4" className="animate-ping" style={{ animationDuration: "3s" }} />
            )}
          </g>
        </svg>
      </div>

      {/* Telemetry Footer Gauges */}
      <div className="grid grid-cols-3 gap-3 border-t border-[#D9D9D5] pt-3 font-mono text-[10px] text-[#5F6368] z-10">
        <div className="bg-[#FAFAF8] border border-[#D9D9D5] p-2 rounded">
          <div className="text-[#5F6368]">TACTICS</div>
          <div className="text-[#111214] text-xs font-semibold mt-0.5">COORDINATED</div>
        </div>
        <div className="bg-[#FAFAF8] border border-[#D9D9D5] p-2 rounded">
          <div className="text-[#5F6368]">TARGET</div>
          <div className="text-emerald-600 text-xs font-semibold mt-0.5">TARGET // ACQUIRED</div>
        </div>
        <div className="bg-[#FAFAF8] border border-[#D9D9D5] p-2 rounded">
          <div className="text-[#5F6368]">SENSOR LINK</div>
          <div className="text-[#d83a32] text-xs font-semibold mt-0.5">LINK // ONLINE</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. ROBO FORGE SVG VISUALIZER (EXPLODED CAD ASSEMBLY)
   ───────────────────────────────────────────────────────────── */
function RoboForgeVisualizer({ isReducedMotion }: { isReducedMotion: boolean }) {
  const uid = useId();
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 overflow-hidden select-none">
      {/* Telemetry Corner Header */}
      <div className="flex items-center justify-between z-10 font-mono text-[11px] text-[#5F6368] border-b border-[#D9D9D5] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[#111214] font-semibold tracking-wider">CAD_EXPLODED {"//"} FAB_STACK</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#5F6368]">CAD // ACTIVE</span>
          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
            ASSEMBLY // ACTIVE
          </span>
        </div>
      </div>

      {/* Exploded Isometric Stack Canvas */}
      <div className="relative flex-1 flex items-center justify-center my-2">
        <svg
          viewBox="0 0 540 320"
          className="w-full h-full max-h-[300px] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`pcbGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FAFAF8" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <filter id={`forgeGlow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Vertical Assembly Guide Lines connecting layers */}
          <line x1="160" y1="50" x2="160" y2="260" stroke="#d83a32" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <line x1="380" y1="50" x2="380" y2="260" stroke="#d83a32" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <line x1="270" y1="40" x2="270" y2="270" stroke="#D9D9D5" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.6" />

          {/* LAYER 4 (TOP): SENSORY ARRAY (y ~ 55) */}
          <g transform="translate(270, 55)">
            <ellipse cx="0" cy="0" rx="45" ry="16" fill="#FFFFFF" stroke="#d83a32" strokeWidth="1.5" />
            <ellipse cx="0" cy="-6" rx="28" ry="10" fill="#FAFAF8" stroke="#ff5a52" strokeWidth="1" />
            <circle cx="0" cy="-6" r="3" fill="#ff5a52" />
            {/* Sensor Scan Fan */}
            <path d="M 0 -6 L 40 -16 A 42 16 0 0 1 -40 -16 Z" fill="#d83a32" opacity="0.12" />
            {!isReducedMotion && (
              <circle cx="0" cy="-6" r="16" fill="none" stroke="#d83a32" strokeWidth="0.8" opacity="0.4" className="animate-ping" style={{ animationDuration: "3s" }} />
            )}
            <text x="60" y="4" fill="#d83a32" fontSize="9" fontFamily="monospace" fontWeight="bold">L4: SENSORY ARRAY</text>
          </g>

          {/* LAYER 3: MCU EMBEDDED CONTROLLER BOARD (y ~ 125) */}
          <g transform="translate(270, 125)">
            {/* PCB polygon in isometric view */}
            <polygon points="-110,-12 0,-34 110,-12 0,10" fill={`url(#pcbGrad-${uid})`} stroke="#d83a32" strokeWidth="1.5" />
            {/* Microcontroller Package */}
            <polygon points="-30,-14 0,-20 30,-14 0,-8" fill="#F3F3F0" stroke="#111214" strokeWidth="1" strokeOpacity="0.4" />
            <text x="-8" y="-12" fill="#111214" fontSize="6" fontFamily="monospace">MCU</text>
            {/* Active Traces */}
            <line x1="-70" y1="-12" x2="-35" y2="-14" stroke="#ff5a52" strokeWidth="1.2" strokeDasharray="4 2" />
            <line x1="35" y1="-14" x2="70" y2="-12" stroke="#ff5a52" strokeWidth="1.2" strokeDasharray="4 2" />
            <text x="125" y="0" fill="#111214" fontSize="9" fontFamily="monospace" fontWeight="bold">L3: EMBEDDED STACK</text>
          </g>

          {/* LAYER 2: MOTOR & GEARBOX MODULES (y ~ 190) */}
          <g transform="translate(270, 190)">
            {/* Left Motor Module */}
            <g transform="translate(-85, -5)">
              <rect x="-24" y="-8" width="48" height="16" rx="3" fill="#FFFFFF" stroke="#D9D9D5" strokeWidth="1" />
              <line x1="-24" y1="0" x2="-32" y2="0" stroke="#ff5a52" strokeWidth="2.5" />
              <ellipse cx="-32" cy="0" rx="3" ry="8" fill="#F3F3F0" stroke="#111214" strokeWidth="0.8" />
              <text x="-20" y="4" fill="#5F6368" fontSize="7" fontFamily="monospace">ACTUATOR_L</text>
            </g>
            {/* Right Motor Module */}
            <g transform="translate(85, -5)">
              <rect x="-24" y="-8" width="48" height="16" rx="3" fill="#FFFFFF" stroke="#D9D9D5" strokeWidth="1" />
              <line x1="24" y1="0" x2="32" y2="0" stroke="#ff5a52" strokeWidth="2.5" />
              <ellipse cx="32" cy="0" rx="3" ry="8" fill="#F3F3F0" stroke="#111214" strokeWidth="0.8" />
              <text x="-20" y="4" fill="#5F6368" fontSize="7" fontFamily="monospace">ACTUATOR_R</text>
            </g>
            <text x="125" y="0" fill="#5F6368" fontSize="9" fontFamily="monospace" fontWeight="bold">L2: ACTUATION DRIVE</text>
          </g>

          {/* LAYER 1 (BASE): STRUCTURAL CHASSIS PLATE (y ~ 255) */}
          <g transform="translate(270, 255)">
            <polygon points="-130,-12 0,-38 130,-12 0,14" fill="#FFFFFF" stroke="#111214" strokeWidth="1.5" strokeOpacity="0.7" />
            <polygon points="-125,-12 0,-35 125,-12 0,11" fill="none" stroke="#d83a32" strokeWidth="1" strokeDasharray="6 3" />
            {/* Cutout mount holes */}
            <circle cx="-50" cy="-12" r="3" fill="#FAFAF8" stroke="#111214" strokeWidth="0.5" />
            <circle cx="50" cy="-12" r="3" fill="#FAFAF8" stroke="#111214" strokeWidth="0.5" />
            <circle cx="0" cy="-12" r="4" fill="#FAFAF8" stroke="#111214" strokeWidth="0.5" />
            <text x="145" y="2" fill="#111214" fontSize="9" fontFamily="monospace" fontWeight="bold">L1: STRUCTURAL BASE</text>
          </g>
        </svg>
      </div>

      {/* Telemetry Footer Gauges */}
      <div className="grid grid-cols-3 gap-3 border-t border-[#D9D9D5] pt-3 font-mono text-[10px] text-[#5F6368] z-10">
        <div className="bg-[#FAFAF8] border border-[#D9D9D5] p-2 rounded">
          <div className="text-[#5F6368]">PIPELINE</div>
          <div className="text-[#111214] text-xs font-semibold mt-0.5">PROTOTYPE</div>
        </div>
        <div className="bg-[#FAFAF8] border border-[#D9D9D5] p-2 rounded">
          <div className="text-[#5F6368]">CIRCUITRY</div>
          <div className="text-amber-700 text-xs font-semibold mt-0.5">MULTI-LAYER</div>
        </div>
        <div className="bg-[#FAFAF8] border border-[#D9D9D5] p-2 rounded">
          <div className="text-[#5F6368]">ASSEMBLY LOCK</div>
          <div className="text-emerald-600 text-xs font-semibold mt-0.5">SYSTEM // VERIFIED</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FLAGSHIP EVENT SHOWCASE COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function EventShowcaseSection({ events = [] }: EventShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Map real Supabase events if available; maintain non-factual decorative states
  const flagshipDefinitions = [
    {
      key: "robo-race",
      queryMatch: ["robo race", "race", "autonomous"],
      defaultTitle: "Robo Race",
      defaultEventType: "High-Speed Autonomous Navigation",
      defaultDesc:
        "Autonomous and semi-autonomous rovers traverse challenging race circuits featuring sharp hairpins, variable-friction surfaces, and live telemetry gates.",
      defaultImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
      telemetry: {
        trackLength: "Multi-Sector Arena Circuit",
        controlMode: "Autonomous Navigation Stack",
        frequency: "Live Telemetry Feed",
      },
      renderVisualizer: (reduced: boolean) => <RoboRaceVisualizer isReducedMotion={reduced} />,
    },
    {
      key: "robo-soccer",
      queryMatch: ["robo soccer", "soccer", "multi-agent"],
      defaultTitle: "Robo Soccer",
      defaultEventType: "Multi-Agent Arena Combat",
      defaultDesc:
        "Dual-differential drive tactical rovers compete in real-time arena play. Fast-paced wireless coordinated strategies test low-latency RF links and drive precision.",
      defaultImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
      telemetry: {
        trackLength: "Enclosed Pitch Arena",
        controlMode: "Coordinated Multi-Agent Strategy",
        frequency: "Tactical Command Link",
      },
      renderVisualizer: (reduced: boolean) => <RoboSoccerVisualizer isReducedMotion={reduced} />,
    },
    {
      key: "robo-forge",
      queryMatch: ["robo forge", "forge", "hackathon", "fabrication", "workshop"],
      defaultTitle: "Robo Forge",
      defaultEventType: "Rapid Prototyping & Fabrication",
      defaultDesc:
        "An intensive hardware engineering sprint where teams go from CAD modeling to laser cutting, PCB assembly, firmware bring-up, and functional testing.",
      defaultImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
      telemetry: {
        trackLength: "Rapid Prototyping Sprint",
        controlMode: "CAD to Functional Hardware",
        frequency: "Full Hardware Integration Lab",
      },
      renderVisualizer: (reduced: boolean) => <RoboForgeVisualizer isReducedMotion={reduced} />,
    },
  ];

  // Resolve events with real Supabase data when available
  const resolvedEvents = flagshipDefinitions.map((flagship) => {
    // Attempt match in events passed from Supabase
    const dbMatch = events.find((e) => {
      const titleLower = (e.title || "").toLowerCase();
      const typeLower = (e.event_type || "").toLowerCase();
      return flagship.queryMatch.some((q) => titleLower.includes(q) || typeLower.includes(q));
    });

    return {
      title: dbMatch?.title || flagship.defaultTitle,
      eventType: dbMatch?.event_type || flagship.defaultEventType,
      shortDescription: dbMatch?.short_description || flagship.defaultDesc,
      image: dbMatch?.cover_image || flagship.defaultImage,
      eventDate: dbMatch?.event_date
        ? new Date(dbMatch.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : undefined,
      status: dbMatch?.status,
      link: dbMatch?.registration_url && dbMatch.registration_url !== "#" ? dbMatch.registration_url : "/events",
      telemetry: flagship.telemetry,
      renderVisualizer: flagship.renderVisualizer,
    };
  });

  // Desktop restrained pointer tilt response on the visualizer stage
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stageRef.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const handlePointerLeave = () => {
    if (!stageRef.current) return;
    stageRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  };

  // Scroll spy to update active index on scroll
  useEffect(() => {
    const triggers = document.querySelectorAll(".event-scroll-trigger");
    if (!triggers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    triggers.forEach((t) => observer.observe(t));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-36 px-6 relative bg-[#F3F3F0]/60 border-t border-[#D9D9D5] overflow-hidden"
    >
      {/* Background Subtle Spatial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#d83a32]/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#D9D9D5] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D9D9D5] mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
              <span className="text-[10px] font-mono text-[#111214] uppercase tracking-widest font-semibold">
                FLAGSHIP ARENAS // COMPETITIONS & LAB SPRINTS
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono tracking-tight text-[#111214]">
              Field <span className="text-[#d83a32]">Operations</span>
            </h2>
          </div>
          <div className="max-w-md text-sm text-[#5F6368] font-normal leading-relaxed">
            High-speed autonomous navigation, multi-agent robotic combat, and hardware fabrication sprints engineered at e-Yantra MSIT.
          </div>
        </div>

        {/* ─── DESKTOP PINNED CINEMATIC EXPERIENCE (>= 1024px) ─── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-start relative">
          {/* LEFT: Scrollable narrative milestones */}
          <div className="lg:col-span-5 space-y-10 relative">
            {/* Event Navigation Tabs */}
            <div className="flex gap-2 p-1.5 bg-white border border-[#D9D9D5] rounded-xl mb-6 shadow-sm">
              {resolvedEvents.map((evt, idx) => (
                <button
                  key={evt.title}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-2 ${
                    activeIndex === idx
                      ? "bg-[#d83a32] text-white shadow-md font-semibold"
                      : "text-[#5F6368] hover:text-[#111214] hover:bg-[#FAFAF8]"
                  }`}
                >
                  <span className="opacity-70 text-[10px]">0{idx + 1}</span>
                  <span>{evt.title.replace("Robo ", "")}</span>
                </button>
              ))}
            </div>

            {/* Event Detail Triggers for Natural Scroll Engagement */}
            {resolvedEvents.map((evt, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={evt.title}
                  data-index={idx}
                  className={`event-scroll-trigger transition-all duration-500 p-8 rounded-2xl border ${
                    isActive
                      ? "bg-white border-[#d83a32] shadow-[0_12px_28px_rgba(17,18,20,0.06)] ring-1 ring-[#d83a32]/20"
                      : "bg-white/60 border-[#D9D9D5] opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-mono text-xs text-[#d83a32] uppercase tracking-wider font-semibold">
                      PHASE 0{idx + 1} {"//"} {evt.eventType}
                    </span>
                    {evt.status && (
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#FAFAF8] border border-[#D9D9D5] text-[#5F6368] font-medium">
                        STATUS: {evt.status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl font-bold font-mono text-[#111214] mb-4 tracking-tight">
                    {evt.title}
                  </h3>

                  <p className="text-sm text-[#5F6368] leading-relaxed mb-6 font-normal">
                    {evt.shortDescription}
                  </p>

                  {/* Real Date if Available */}
                  {evt.eventDate && (
                    <div className="flex items-center gap-2 text-xs font-mono text-[#111214] mb-6 font-medium">
                      <Iconify icon="lucide:calendar" className="w-4 h-4 text-[#d83a32]" />
                      <span>{evt.eventDate}</span>
                    </div>
                  )}

                  {/* Telemetry Bullet Badges */}
                  <div className="space-y-2 border-t border-[#D9D9D5] pt-4 mb-6">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#5F6368]">SPECIFICATION:</span>
                      <span className="text-[#111214] font-medium">{evt.telemetry.trackLength}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#5F6368]">CONTROL ARCH:</span>
                      <span className="text-[#111214] font-medium">{evt.telemetry.controlMode}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#5F6368]">TELEMETRY:</span>
                      <span className="text-[#111214] font-medium">{evt.telemetry.frequency}</span>
                    </div>
                  </div>

                  {/* Action Link to Real /events */}
                  <div className="flex items-center gap-4">
                    <Link
                      href={evt.link}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAFAF8] border border-[#D9D9D5] hover:border-[#d83a32] text-[#111214] hover:text-[#d83a32] font-mono text-xs uppercase tracking-wider transition-all cta-press group shadow-sm font-semibold"
                    >
                      <span>Explore Specification</span>
                      <Iconify
                        icon="lucide:arrow-right"
                        className="w-3.5 h-3.5 text-[#d83a32] group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Pinned 3D Hardware/Arena Visualizer */}
          <div className="lg:col-span-7 sticky top-28">
            <div
              ref={stageRef}
              onMouseMove={handlePointerMove}
              onMouseLeave={handlePointerLeave}
              className="relative rounded-2xl bg-white border border-[#D9D9D5] overflow-hidden shadow-[0_16px_36px_rgba(17,18,20,0.08)] transition-transform duration-200 ease-out"
              style={{
                height: "540px",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Corner HUD Reticles */}
              <div className="absolute top-3 left-3 font-mono text-[9px] text-[#5F6368] pointer-events-none z-30 font-medium">
                ┌ SCHEMATIC_RENDER [MODE: REALTIME]
              </div>
              <div className="absolute top-3 right-3 font-mono text-[9px] text-[#5F6368] pointer-events-none z-30 font-medium">
                SCALE: 1:1 ┐
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[9px] text-[#5F6368] pointer-events-none z-30 font-medium">
                └ e-YANTRA ROBOTICS
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[9px] text-[#5F6368] pointer-events-none z-30 font-medium">
                SYS_VERIFIED ┘
              </div>

              {/* Grid Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(17,18,20,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(17,18,20,0.035) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Stack of 3 Visualizers - Active comes forward in depth */}
              {resolvedEvents.map((evt, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={evt.title}
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateZ(0px) scale(1)"
                        : "translateZ(-60px) scale(0.92)",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    {evt.renderVisualizer(isReducedMotion)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── MOBILE RESPONSIVE STACKED LAYOUT (< 1024px) ─── */}
        <div className="lg:hidden space-y-12">
          {resolvedEvents.map((evt, idx) => (
            <div
              key={evt.title}
              className="rounded-2xl bg-white border border-[#D9D9D5] overflow-hidden shadow-sm"
            >
              {/* Interactive SVG Visualizer at the top */}
              <div className="h-[320px] bg-[#FAFAF8] border-b border-[#D9D9D5] relative">
                <div className="absolute top-2 left-3 font-mono text-[9px] text-[#5F6368] z-20 font-medium">
                  PHASE 0{idx + 1} {"//"} {evt.title.toUpperCase()}
                </div>
                {evt.renderVisualizer(true)}
              </div>

              {/* Content Description */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="font-mono text-xs text-[#d83a32] uppercase tracking-wider font-semibold">
                    {evt.eventType}
                  </span>
                  {evt.status && (
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#FAFAF8] border border-[#D9D9D5] text-[#5F6368] font-medium">
                      {evt.status}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold font-mono text-[#111214] mb-3">
                  {evt.title}
                </h3>

                <p className="text-sm text-[#5F6368] leading-relaxed mb-6 font-normal">
                  {evt.shortDescription}
                </p>

                {evt.eventDate && (
                  <div className="flex items-center gap-2 text-xs font-mono text-[#111214] mb-6 font-medium">
                    <Iconify icon="lucide:calendar" className="w-4 h-4 text-[#d83a32]" />
                    <span>{evt.eventDate}</span>
                  </div>
                )}

                <div className="space-y-2 border-t border-[#D9D9D5] pt-4 mb-6 text-[11px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5F6368]">SPECIFICATION:</span>
                    <span className="text-[#111214] font-medium">{evt.telemetry.trackLength}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5F6368]">CONTROL:</span>
                    <span className="text-[#111214] font-medium">{evt.telemetry.controlMode}</span>
                  </div>
                </div>

                <Link
                  href={evt.link}
                  className="w-full py-3 rounded-xl bg-[#FAFAF8] border border-[#D9D9D5] text-[#111214] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:border-[#d83a32] hover:text-[#d83a32] transition-colors font-semibold shadow-sm"
                >
                  <span>Explore Specification</span>
                  <Iconify icon="lucide:arrow-right" className="w-3.5 h-3.5 text-[#d83a32]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
