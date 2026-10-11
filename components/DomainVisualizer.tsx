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

interface DomainVisualizerProps {
  activeDomain: number; // 0: Robotics, 1: Embedded, 2: Automation, 3: AI & IoT
}

export default function DomainVisualizer({ activeDomain }: DomainVisualizerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const [animTime, setAnimTime] = useState(0);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // Mouse tilt refs
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  // Continuous animation frame time for kinematics/oscillations
  useEffect(() => {
    if (reducedMotion) return;

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      setAnimTime((now - start) * 0.001);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  // Pointer move handler (desktop tilt)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseTarget.current = { x: nx, y: ny };
  };

  const handleMouseLeave = () => {
    mouseTarget.current = { x: 0, y: 0 };
  };

  // 60FPS damped tilt loop
  useEffect(() => {
    if (reducedMotion) return;

    const loop = () => {
      if (!cardRef.current) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }

      // Max tilt: 3° pitch, 4° yaw
      const targetRotX = -mouseTarget.current.y * 3;
      const targetRotY = mouseTarget.current.x * 4;

      const lerp = 0.08;
      currentRot.current.x += (targetRotX - currentRot.current.x) * lerp;
      currentRot.current.y += (targetRotY - currentRot.current.y) * lerp;

      cardRef.current.style.transform = `
        rotateX(${currentRot.current.x.toFixed(2)}deg)
        rotateY(${currentRot.current.y.toFixed(2)}deg)
      `;

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [reducedMotion]);

  // Kinematic joint angle calculations for Robotics
  const theta1 = Math.sin(animTime * 1.5) * 25 - 15;
  const theta2 = Math.cos(animTime * 1.2) * 35 + 40;

  // Motor rotation angle for Automation
  const motorRot = (animTime * 120) % 360;

  return (
    <div
      className="relative w-full max-w-lg mx-auto select-none"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="relative w-full aspect-[4/3] rounded-2xl border border-[#292D32] bg-[#15181C]/90 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between transition-transform will-change-transform overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#d83a32]/[0.06] blur-[90px] rounded-full pointer-events-none" />

        {/* Top HUD Telemetry Bar */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#292D32]/80 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d83a32] animate-ping" />
            <span className="text-white font-bold tracking-wider uppercase">
              {activeDomain === 0 && "DISCIPLINE 01 // ROBOTICS & KINEMATICS"}
              {activeDomain === 1 && "DISCIPLINE 02 // SILICON & FIRMWARE"}
              {activeDomain === 2 && "DISCIPLINE 03 // CLOSED-LOOP CONTROL"}
              {activeDomain === 3 && "DISCIPLINE 04 // EDGE AI & IOT"}
            </span>
          </div>
          <div className="text-[#A6AAAE] uppercase tracking-widest flex items-center gap-1.5">
            <Iconify icon="lucide:radio" className="w-3.5 h-3.5 text-[#d83a32]" />
            <span>LIVE TELEMETRY</span>
          </div>
        </div>

        {/* Center Canvas: 4 Domain Animated Visualizations */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-2 overflow-hidden">
          {/* ──────────────── 01: ROBOTICS VISUALIZATION ──────────────── */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              activeDomain === 0
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <svg
              className="w-full h-full max-h-[220px]"
              viewBox="0 0 320 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Coordinate Grid */}
              <defs>
                <pattern id="roboGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#292D32" strokeWidth="0.5" strokeDasharray="2 2" />
                </pattern>
              </defs>
              <rect x="10" y="10" width="300" height="200" fill="url(#roboGrid)" opacity="0.4" />

              {/* 3D Origin Axes Triad */}
              <g transform="translate(45, 175)">
                <line x1="0" y1="0" x2="35" y2="0" stroke="#d83a32" strokeWidth="2" />
                <text x="40" y="4" fill="#d83a32" fontSize="9" fontFamily="monospace">X</text>
                <line x1="0" y1="0" x2="0" y2="-35" stroke="#10b981" strokeWidth="2" />
                <text x="-4" y="-40" fill="#10b981" fontSize="9" fontFamily="monospace">Y</text>
                <line x1="0" y1="0" x2="-20" y2="15" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="-28" y="24" fill="#38bdf8" fontSize="8" fontFamily="monospace">Z</text>
              </g>

              {/* Robot Chassis Base */}
              <rect x="110" y="170" width="100" height="14" rx="3" fill="#15181C" stroke="#292D32" strokeWidth="1.5" />
              <circle cx="125" cy="186" r="6" fill="#0B0D10" stroke="#d83a32" strokeWidth="1.5" />
              <circle cx="195" cy="186" r="6" fill="#0B0D10" stroke="#d83a32" strokeWidth="1.5" />

              {/* Kinematic Manipulator Arm Base Joint */}
              <circle cx="160" cy="170" r="8" fill="#15181C" stroke="#d83a32" strokeWidth="2" />

              {/* Link 1 (Rotated by theta1) */}
              <g transform={`translate(160, 170) rotate(${theta1})`}>
                <line x1="0" y1="0" x2="0" y2="-65" stroke="#F3F2EE" strokeWidth="4" strokeLinecap="round" />
                {/* Joint 2 (Elbow) */}
                <circle cx="0" cy="-65" r="6" fill="#0B0D10" stroke="#d83a32" strokeWidth="2" />

                {/* Link 2 (Rotated by theta2 relative to link 1) */}
                <g transform={`translate(0, -65) rotate(${theta2})`}>
                  <line x1="0" y1="0" x2="0" y2="-55" stroke="#d83a32" strokeWidth="3" strokeLinecap="round" />
                  {/* End Effector Gripper */}
                  <circle cx="0" cy="-55" r="4" fill="#F3F2EE" />
                  <path d="M -8 -60 L 0 -55 L 8 -60" stroke="#F3F2EE" strokeWidth="2" fill="none" />
                </g>
              </g>

              {/* Kinematics Telemetry Overlay */}
              <text x="210" y="35" fill="#A6AAAE" fontSize="9" fontFamily="monospace">
                IK.SOLVER: ACTIVE
              </text>
              <text x="210" y="50" fill="#d83a32" fontSize="9" fontFamily="monospace">
                THETA_1: {theta1.toFixed(1)}°
              </text>
              <text x="210" y="65" fill="#d83a32" fontSize="9" fontFamily="monospace">
                THETA_2: {theta2.toFixed(1)}°
              </text>
              <text x="210" y="80" fill="#A6AAAE" fontSize="9" fontFamily="monospace">
                PAYLOAD: 1.5 KG
              </text>
            </svg>
          </div>

          {/* ──────────────── 02: EMBEDDED SYSTEMS VISUALIZATION ──────────────── */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              activeDomain === 1
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <svg
              className="w-full h-full max-h-[220px]"
              viewBox="0 0 320 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* PCB Multi-Layer Traces */}
              <path d="M 40 40 L 110 40 L 130 70 L 130 110" stroke="#292D32" strokeWidth="1.5" />
              <path d="M 40 180 L 100 180 L 130 150 L 130 110" stroke="#292D32" strokeWidth="1.5" />
              <path d="M 280 40 L 220 40 L 190 70 L 190 110" stroke="#292D32" strokeWidth="1.5" />
              <path d="M 280 180 L 210 180 L 190 150 L 190 110" stroke="#292D32" strokeWidth="1.5" />

              {/* Pulsing signal lines */}
              <path
                d="M 40 110 L 130 110"
                stroke="#d83a32"
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeDashoffset={-animTime * 40}
              />
              <path
                d="M 190 110 L 280 110"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeDashoffset={animTime * 40}
              />

              {/* Central Microcontroller Chip */}
              <rect x="130" y="80" width="60" height="60" rx="6" fill="#0B0D10" stroke="#d83a32" strokeWidth="2" />
              <circle cx="140" cy="90" r="2.5" fill="#d83a32" />
              <text x="160" y="112" fill="#F3F2EE" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                AVR 8-BIT
              </text>
              <text x="160" y="124" fill="#A6AAAE" fontSize="7" fontFamily="monospace" textAnchor="middle">
                16.0 MHZ
              </text>

              {/* IC Pins */}
              {[-20, -10, 0, 10, 20].map((offset, idx) => (
                <React.Fragment key={idx}>
                  <line x1="124" y1={110 + offset} x2="130" y2={110 + offset} stroke="#F3F2EE" strokeWidth="1.5" />
                  <line x1="190" y1={110 + offset} x2="196" y2={110 + offset} stroke="#F3F2EE" strokeWidth="1.5" />
                </React.Fragment>
              ))}

              {/* Logic Analyzer Waveform Box at top */}
              <rect x="35" y="25" width="105" height="30" rx="4" fill="#0B0D10" stroke="#292D32" strokeWidth="1" />
              <path
                d="M 40 45 L 50 45 L 50 35 L 60 35 L 60 45 L 70 45 L 70 35 L 80 35 L 80 45 L 90 45 L 90 35 L 100 35 L 100 45 L 110 45 L 110 35 L 120 35 L 120 45 L 130 45"
                stroke="#d83a32"
                strokeWidth="1.5"
                fill="none"
              />
              <text x="40" y="20" fill="#A6AAAE" fontSize="8" fontFamily="monospace">
                SPI_CLOCK // 4MHz
              </text>

              {/* Status Register at bottom */}
              <rect x="180" y="165" width="105" height="30" rx="4" fill="#0B0D10" stroke="#292D32" strokeWidth="1" />
              <text x="188" y="180" fill="#10b981" fontSize="8" fontFamily="monospace">
                REG: 0b10110010
              </text>
              <text x="188" y="190" fill="#A6AAAE" fontSize="7" fontFamily="monospace">
                STATUS: INTERRUPT_OK
              </text>
            </svg>
          </div>

          {/* ──────────────── 03: AUTOMATION VISUALIZATION ──────────────── */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              activeDomain === 2
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <svg
              className="w-full h-full max-h-[220px]"
              viewBox="0 0 320 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Circular Closed-Loop PID Ring */}
              <circle cx="160" cy="110" r="70" stroke="#292D32" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Rotating Encoder Disk */}
              <g transform={`translate(160, 110) rotate(${motorRot})`}>
                <circle cx="0" cy="0" r="38" fill="#15181C" stroke="#d83a32" strokeWidth="2" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                  <line
                    key={ang}
                    x1="0"
                    y1="0"
                    x2={Math.cos((ang * Math.PI) / 180) * 35}
                    y2={Math.sin((ang * Math.PI) / 180) * 35}
                    stroke="#292D32"
                    strokeWidth="1.5"
                  />
                ))}
                <circle cx="0" cy="0" r="10" fill="#0B0D10" stroke="#F3F2EE" strokeWidth="2" />
              </g>

              {/* 4 Loop Nodes on the circle */}
              {/* Top: SENSOR */}
              <g transform="translate(160, 40)">
                <circle cx="0" cy="0" r="14" fill="#0B0D10" stroke="#d83a32" strokeWidth="1.5" />
                <text x="0" y="3" fill="#F3F2EE" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SENS</text>
              </g>

              {/* Right: PID ALGORITHM */}
              <g transform="translate(230, 110)">
                <circle cx="0" cy="0" r="14" fill="#0B0D10" stroke="#10b981" strokeWidth="1.5" />
                <text x="0" y="3" fill="#F3F2EE" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PID</text>
              </g>

              {/* Bottom: ACTUATOR */}
              <g transform="translate(160, 180)">
                <circle cx="0" cy="0" r="14" fill="#0B0D10" stroke="#d83a32" strokeWidth="1.5" />
                <text x="0" y="3" fill="#F3F2EE" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ACT</text>
              </g>

              {/* Left: PLANT */}
              <g transform="translate(90, 110)">
                <circle cx="0" cy="0" r="14" fill="#0B0D10" stroke="#F3F2EE" strokeWidth="1.5" />
                <text x="0" y="3" fill="#F3F2EE" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">MECH</text>
              </g>

              {/* Error Metrics */}
              <text x="25" y="35" fill="#A6AAAE" fontSize="8" fontFamily="monospace">SETPOINT: 1200 RPM</text>
              <text x="25" y="48" fill="#10b981" fontSize="8" fontFamily="monospace">ERROR: ±0.04%</text>
              <text x="25" y="61" fill="#d83a32" fontSize="8" fontFamily="monospace">PWM: 78.4% DUTY</text>
            </svg>
          </div>

          {/* ──────────────── 04: AI & EDGE IOT VISUALIZATION ──────────────── */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              activeDomain === 3
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <svg
              className="w-full h-full max-h-[220px]"
              viewBox="0 0 320 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Neural Synapses connecting Input -> Hidden -> Output */}
              {/* Layer 1 (X: 65, Y: 60, 110, 160) to Layer 2 (X: 160, Y: 45, 90, 130, 175) */}
              {[60, 110, 160].map((y1, i) =>
                [45, 90, 130, 175].map((y2, j) => (
                  <line
                    key={`syn1-${i}-${j}`}
                    x1="65"
                    y1={y1}
                    x2="160"
                    y2={y2}
                    stroke="#292D32"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                ))
              )}

              {/* Layer 2 to Layer 3 (X: 255, Y: 85, 135) */}
              {[45, 90, 130, 175].map((y2, j) =>
                [85, 135].map((y3, k) => (
                  <line
                    key={`syn2-${j}-${k}`}
                    x1="160"
                    y1={y2}
                    x2="255"
                    y2={y3}
                    stroke="#292D32"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                ))
              )}

              {/* Pulsing Synapse Weight Packet */}
              <circle
                cx={65 + ((animTime * 80) % 95)}
                cy={110 + Math.sin(animTime * 3) * 15}
                r="3"
                fill="#d83a32"
              />
              <circle
                cx={160 + ((animTime * 80) % 95)}
                cy={130 + Math.cos(animTime * 3) * 10}
                r="3"
                fill="#10b981"
              />

              {/* Layer 1 Nodes (Input Sensors) */}
              {[60, 110, 160].map((y, idx) => (
                <g key={`l1-${idx}`}>
                  <circle cx="65" cy={y} r="8" fill="#0B0D10" stroke="#d83a32" strokeWidth="2" />
                  <circle cx="65" cy={y} r="3" fill="#d83a32" />
                </g>
              ))}

              {/* Layer 2 Nodes (Quantized Hidden Neurons) */}
              {[45, 90, 130, 175].map((y, idx) => (
                <g key={`l2-${idx}`}>
                  <circle cx="160" cy={y} r="9" fill="#15181C" stroke="#F3F2EE" strokeWidth="2" />
                  <circle cx="160" cy={y} r="3" fill="#10b981" />
                </g>
              ))}

              {/* Layer 3 Nodes (Output Inference Decision) */}
              {[85, 135].map((y, idx) => (
                <g key={`l3-${idx}`}>
                  <circle cx="255" cy={y} r="10" fill="#0B0D10" stroke="#10b981" strokeWidth="2" />
                  <circle cx="255" cy={y} r="4" fill="#10b981" />
                </g>
              ))}

              {/* Telemetry Header Tags */}
              <text x="65" y="30" fill="#A6AAAE" fontSize="8" fontFamily="monospace" textAnchor="middle">
                INPUT_SENSORS
              </text>
              <text x="160" y="25" fill="#F3F2EE" fontSize="8" fontFamily="monospace" textAnchor="middle">
                TINYML_INT8
              </text>
              <text x="255" y="30" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">
                DECISION_OUT
              </text>
            </svg>
          </div>
        </div>

        {/* Bottom Inspection Stats Strip */}
        <div className="relative z-10 pt-3 border-t border-[#292D32]/80 flex items-center justify-between font-mono text-[10px] text-[#A6AAAE]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-zinc-300">
              {activeDomain === 0 && "KINEMATIC TRACE: CONVERGED"}
              {activeDomain === 1 && "FIRMWARE STATUS: EXECUTING"}
              {activeDomain === 2 && "PID LOOP RATE: 1.0 KHZ"}
              {activeDomain === 3 && "INFERENCE LATENCY: 3.8 MS"}
            </span>
          </div>
          <span className="text-[#d83a32] font-bold">STATE LOCKED</span>
        </div>
      </div>
    </div>
  );
}
