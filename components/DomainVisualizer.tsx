"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const [inView, setInView] = useState<boolean>(true);

  // SVG direct DOM animation refs (eliminates React setState on animation frames)
  // 01: Robotics refs
  const armLink1Ref = useRef<SVGGElement>(null);
  const armLink2Ref = useRef<SVGGElement>(null);
  const theta1TextRef = useRef<SVGTextElement>(null);
  const theta2TextRef = useRef<SVGTextElement>(null);

  // 02: Embedded Systems refs
  const sigLine1Ref = useRef<SVGPathElement>(null);
  const sigLine2Ref = useRef<SVGPathElement>(null);

  // 03: Automation refs
  const encoderDiskRef = useRef<SVGGElement>(null);

  // 04: AI & Edge IoT refs
  const packet1Ref = useRef<SVGCircleElement>(null);
  const packet2Ref = useRef<SVGCircleElement>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // Mouse tilt refs
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  // IntersectionObserver to pause RAF loop when visualizer is offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  // High-performance 60FPS animation loop: updates tilt and active SVG elements directly via refs
  useEffect(() => {
    if (!inView || reducedMotion) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) * 0.001;

      // 1. Damped Card Tilt (max 3° pitch, 4° yaw)
      if (cardRef.current) {
        const targetRotX = -mouseTarget.current.y * 3;
        const targetRotY = mouseTarget.current.x * 4;
        const lerp = 0.08;
        currentRot.current.x += (targetRotX - currentRot.current.x) * lerp;
        currentRot.current.y += (targetRotY - currentRot.current.y) * lerp;

        cardRef.current.style.transform = `
          rotateX(${currentRot.current.x.toFixed(2)}deg)
          rotateY(${currentRot.current.y.toFixed(2)}deg)
        `;
      }

      // 2. Direct SVG DOM Updates per active domain (Zero React re-renders)
      if (activeDomain === 0) {
        // Robotics: forward/inverse kinematics calculations
        const t1 = Math.sin(elapsed * 1.5) * 25 - 15;
        const t2 = Math.cos(elapsed * 1.2) * 35 + 40;

        if (armLink1Ref.current) {
          armLink1Ref.current.setAttribute("transform", `translate(160, 170) rotate(${t1.toFixed(1)})`);
        }
        if (armLink2Ref.current) {
          armLink2Ref.current.setAttribute("transform", `translate(0, -65) rotate(${t2.toFixed(1)})`);
        }
        if (theta1TextRef.current) {
          theta1TextRef.current.textContent = `THETA_1: ${t1.toFixed(1)}°`;
        }
        if (theta2TextRef.current) {
          theta2TextRef.current.textContent = `THETA_2: ${t2.toFixed(1)}°`;
        }
      } else if (activeDomain === 1) {
        // Embedded: signal lines stroke dash offset
        const offset = (elapsed * 40).toFixed(1);
        if (sigLine1Ref.current) {
          sigLine1Ref.current.style.strokeDashoffset = `-${offset}px`;
        }
        if (sigLine2Ref.current) {
          sigLine2Ref.current.style.strokeDashoffset = `${offset}px`;
        }
      } else if (activeDomain === 2) {
        // Automation: motor encoder ring continuous rotation
        const motorRot = ((elapsed * 120) % 360).toFixed(1);
        if (encoderDiskRef.current) {
          encoderDiskRef.current.setAttribute("transform", `translate(160, 110) rotate(${motorRot})`);
        }
      } else if (activeDomain === 3) {
        // AI & IoT: synapse weight packets traveling along neural layers
        const pProgress = (elapsed * 80) % 95;
        const cx1 = (65 + pProgress).toFixed(1);
        const cy1 = (110 + Math.sin(elapsed * 3) * 15).toFixed(1);
        const cx2 = (160 + pProgress).toFixed(1);
        const cy2 = (130 + Math.cos(elapsed * 3) * 10).toFixed(1);

        if (packet1Ref.current) {
          packet1Ref.current.setAttribute("cx", cx1);
          packet1Ref.current.setAttribute("cy", cy1);
        }
        if (packet2Ref.current) {
          packet2Ref.current.setAttribute("cx", cx2);
          packet2Ref.current.setAttribute("cy", cy2);
        }
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [inView, reducedMotion, activeDomain]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg mx-auto select-none"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="relative w-full aspect-[4/3] rounded-2xl border border-[#D9D9D5] bg-white/95 backdrop-blur-xl p-5 shadow-[0_12px_28px_rgba(17,18,20,0.06)] flex flex-col justify-between transition-transform will-change-transform overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#d83a32]/[0.03] blur-[90px] rounded-full pointer-events-none" />

        {/* Top HUD Telemetry Bar */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#D9D9D5] font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d83a32]" />
            <span className="text-[#111214] font-semibold tracking-wider uppercase font-mono">
              {activeDomain === 0 && "01 • ROBOTICS & KINEMATICS"}
              {activeDomain === 1 && "02 • EMBEDDED & HARDWARE"}
              {activeDomain === 2 && "03 • AUTOMATION & CONTROL"}
              {activeDomain === 3 && "04 • AI & CONNECTED DEVICES"}
            </span>
          </div>
          <div className="text-[#5F6368] font-mono tracking-wider text-[9px] uppercase">
            <span>INTERACTIVE MODEL</span>
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
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#D9D9D5" strokeWidth="0.75" strokeDasharray="2 2" />
                </pattern>
              </defs>
              <rect x="10" y="10" width="300" height="200" fill="url(#roboGrid)" opacity="0.6" />

              {/* 3D Origin Axes Triad */}
              <g transform="translate(45, 175)">
                <line x1="0" y1="0" x2="35" y2="0" stroke="#d83a32" strokeWidth="2" />
                <text x="40" y="4" fill="#d83a32" fontSize="9" fontFamily="monospace">X</text>
                <line x1="0" y1="0" x2="0" y2="-35" stroke="#10b981" strokeWidth="2" />
                <text x="-4" y="-40" fill="#10b981" fontSize="9" fontFamily="monospace">Y</text>
                <line x1="0" y1="0" x2="-20" y2="15" stroke="#0284c7" strokeWidth="1.5" />
                <text x="-28" y="24" fill="#0284c7" fontSize="8" fontFamily="monospace">Z</text>
              </g>

              {/* Robot Chassis Base */}
              <rect x="110" y="170" width="100" height="14" rx="3" fill="#F3F3F0" stroke="#D9D9D5" strokeWidth="1.5" />
              <circle cx="125" cy="186" r="6" fill="#FFFFFF" stroke="#d83a32" strokeWidth="1.5" />
              <circle cx="195" cy="186" r="6" fill="#FFFFFF" stroke="#d83a32" strokeWidth="1.5" />

              {/* Kinematic Manipulator Arm Base Joint */}
              <circle cx="160" cy="170" r="8" fill="#FFFFFF" stroke="#d83a32" strokeWidth="2" />

              {/* Link 1 (Controlled via direct ref) */}
              <g ref={armLink1Ref} transform="translate(160, 170) rotate(-15)">
                <line x1="0" y1="0" x2="0" y2="-65" stroke="#111214" strokeWidth="4" strokeLinecap="round" />
                {/* Joint 2 (Elbow) */}
                <circle cx="0" cy="-65" r="6" fill="#FFFFFF" stroke="#d83a32" strokeWidth="2" />

                {/* Link 2 (Controlled via direct ref) */}
                <g ref={armLink2Ref} transform="translate(0, -65) rotate(40)">
                  <line x1="0" y1="0" x2="0" y2="-55" stroke="#d83a32" strokeWidth="3" strokeLinecap="round" />
                  {/* End Effector Gripper */}
                  <circle cx="0" cy="-55" r="4" fill="#111214" />
                  <path d="M -8 -60 L 0 -55 L 8 -60" stroke="#111214" strokeWidth="2" fill="none" />
                </g>
              </g>

              {/* Kinematics Overlay (Updated directly via text refs) */}
              <text x="210" y="35" fill="#5F6368" fontSize="9" fontFamily="monospace">
                ARM KINEMATICS
              </text>
              <text ref={theta1TextRef} x="210" y="50" fill="#d83a32" fontSize="9" fontFamily="monospace">
                THETA_1: -15.0°
              </text>
              <text ref={theta2TextRef} x="210" y="65" fill="#d83a32" fontSize="9" fontFamily="monospace">
                THETA_2: 40.0°
              </text>
              <text x="210" y="80" fill="#5F6368" fontSize="9" fontFamily="monospace">
                2-LINK ARM
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
              <path d="M 40 40 L 110 40 L 130 70 L 130 110" stroke="#D9D9D5" strokeWidth="1.5" />
              <path d="M 40 180 L 100 180 L 130 150 L 130 110" stroke="#D9D9D5" strokeWidth="1.5" />
              <path d="M 280 40 L 220 40 L 190 70 L 190 110" stroke="#D9D9D5" strokeWidth="1.5" />
              <path d="M 280 180 L 210 180 L 190 150 L 190 110" stroke="#D9D9D5" strokeWidth="1.5" />

              {/* Pulsing signal lines (Controlled via ref strokeDashoffset) */}
              <path
                ref={sigLine1Ref}
                d="M 40 110 L 130 110"
                stroke="#d83a32"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <path
                ref={sigLine2Ref}
                d="M 190 110 L 280 110"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* Central Microcontroller Chip */}
              <rect x="130" y="80" width="60" height="60" rx="6" fill="#FFFFFF" stroke="#d83a32" strokeWidth="2" />
              <circle cx="140" cy="90" r="2.5" fill="#d83a32" />
              <text x="160" y="112" fill="#111214" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                MCU ARCH
              </text>
              <text x="160" y="124" fill="#5F6368" fontSize="7" fontFamily="monospace" textAnchor="middle">
                HARDWARE BUS
              </text>

              {/* IC Pins */}
              {[-20, -10, 0, 10, 20].map((offset, idx) => (
                <React.Fragment key={idx}>
                  <line x1="124" y1={110 + offset} x2="130" y2={110 + offset} stroke="#111214" strokeWidth="1.5" />
                  <line x1="190" y1={110 + offset} x2="196" y2={110 + offset} stroke="#111214" strokeWidth="1.5" />
                </React.Fragment>
              ))}

              {/* Logic Analyzer Waveform Box at top */}
              <rect x="35" y="25" width="105" height="30" rx="4" fill="#FAFAF8" stroke="#D9D9D5" strokeWidth="1" />
              <path
                d="M 40 45 L 50 45 L 50 35 L 60 35 L 60 45 L 70 45 L 70 35 L 80 35 L 80 45 L 90 45 L 90 35 L 100 35 L 100 45 L 110 45 L 110 35 L 120 35 L 120 45 L 130 45"
                stroke="#d83a32"
                strokeWidth="1.5"
                fill="none"
              />
              <text x="40" y="20" fill="#5F6368" fontSize="8" fontFamily="monospace">
                LOGIC TRACE // SYNC
              </text>

              {/* Status Register at bottom */}
              <rect x="180" y="165" width="105" height="30" rx="4" fill="#FAFAF8" stroke="#D9D9D5" strokeWidth="1" />
              <text x="188" y="180" fill="#10b981" fontSize="8" fontFamily="monospace">
                I/O // STABLE
              </text>
              <text x="188" y="190" fill="#5F6368" fontSize="7" fontFamily="monospace">
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
              <circle cx="160" cy="110" r="70" stroke="#D9D9D5" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Rotating Encoder Disk (Controlled via ref transform) */}
              <g ref={encoderDiskRef} transform="translate(160, 110) rotate(0)">
                <circle cx="0" cy="0" r="38" fill="#FAFAF8" stroke="#d83a32" strokeWidth="2" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                  <line
                    key={ang}
                    x1="0"
                    y1="0"
                    x2={Math.cos((ang * Math.PI) / 180) * 35}
                    y2={Math.sin((ang * Math.PI) / 180) * 35}
                    stroke="#D9D9D5"
                    strokeWidth="1.5"
                  />
                ))}
                <circle cx="0" cy="0" r="10" fill="#FFFFFF" stroke="#111214" strokeWidth="2" />
              </g>

              {/* 4 Loop Nodes on the circle */}
              <g transform="translate(160, 40)">
                <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#d83a32" strokeWidth="1.5" />
                <text x="0" y="3" fill="#111214" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SENS</text>
              </g>

              <g transform="translate(230, 110)">
                <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#10b981" strokeWidth="1.5" />
                <text x="0" y="3" fill="#111214" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PID</text>
              </g>

              <g transform="translate(160, 180)">
                <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#d83a32" strokeWidth="1.5" />
                <text x="0" y="3" fill="#111214" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ACT</text>
              </g>

              <g transform="translate(90, 110)">
                <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#111214" strokeWidth="1.5" />
                <text x="0" y="3" fill="#111214" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">MECH</text>
              </g>

              {/* Loop Status Metrics */}
              <text x="25" y="35" fill="#5F6368" fontSize="8" fontFamily="monospace">CLOSED LOOP</text>
              <text x="25" y="48" fill="#10b981" fontSize="8" fontFamily="monospace">PID FEEDBACK</text>
              <text x="25" y="61" fill="#d83a32" fontSize="8" fontFamily="monospace">ENCODER CONTROL</text>
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
              {[60, 110, 160].map((y1, i) =>
                [45, 90, 130, 175].map((y2, j) => (
                  <line
                    key={`syn1-${i}-${j}`}
                    x1="65"
                    y1={y1}
                    x2="160"
                    y2={y2}
                    stroke="#D9D9D5"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                ))
              )}

              {[45, 90, 130, 175].map((y2, j) =>
                [85, 135].map((y3, k) => (
                  <line
                    key={`syn2-${j}-${k}`}
                    x1="160"
                    y1={y2}
                    x2="255"
                    y2={y3}
                    stroke="#D9D9D5"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                ))
              )}

              {/* Pulsing Synapse Weight Packets (Controlled via ref cx/cy) */}
              <circle
                ref={packet1Ref}
                cx="65"
                cy="110"
                r="3"
                fill="#d83a32"
              />
              <circle
                ref={packet2Ref}
                cx="160"
                cy="130"
                r="3"
                fill="#10b981"
              />

              {/* Layer 1 Nodes (Input Sensors) */}
              {[60, 110, 160].map((y, idx) => (
                <g key={`l1-${idx}`}>
                  <circle cx="65" cy={y} r="8" fill="#FFFFFF" stroke="#d83a32" strokeWidth="2" />
                  <circle cx="65" cy={y} r="3" fill="#d83a32" />
                </g>
              ))}

              {/* Layer 2 Nodes (Quantized Hidden Neurons) */}
              {[45, 90, 130, 175].map((y, idx) => (
                <g key={`l2-${idx}`}>
                  <circle cx="160" cy={y} r="9" fill="#FAFAF8" stroke="#111214" strokeWidth="2" />
                  <circle cx="160" cy={y} r="3" fill="#10b981" />
                </g>
              ))}

              {/* Layer 3 Nodes (Output Inference Decision) */}
              {[85, 135].map((y, idx) => (
                <g key={`l3-${idx}`}>
                  <circle cx="255" cy={y} r="10" fill="#FFFFFF" stroke="#10b981" strokeWidth="2" />
                  <circle cx="255" cy={y} r="4" fill="#10b981" />
                </g>
              ))}

              {/* Tags */}
              <text x="65" y="30" fill="#5F6368" fontSize="8" fontFamily="monospace" textAnchor="middle">
                INPUT_SENSORS
              </text>
              <text x="160" y="25" fill="#111214" fontSize="8" fontFamily="monospace" textAnchor="middle">
                NEURAL_NET
              </text>
              <text x="255" y="30" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">
                DECISION_OUT
              </text>
            </svg>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="relative z-10 pt-3 border-t border-[#D9D9D5] flex items-center justify-between font-mono text-[10px] text-[#5F6368]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
            <span className="text-[#111214] font-medium">
              {activeDomain === 0 && "Robotics Simulation"}
              {activeDomain === 1 && "Hardware Bus Schematic"}
              {activeDomain === 2 && "PID Motion Control"}
              {activeDomain === 3 && "Neural Network Graph"}
            </span>
          </div>
          <span className="text-[#5F6368]">e-Yantra MSIT</span>
        </div>
      </div>
    </div>
  );
}
