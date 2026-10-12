"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Iconify from "@/components/Iconify";
import DomainVisualizer from "@/components/DomainVisualizer";

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

const DOMAINS = [
  {
    num: "01",
    title: "Robotics",
    subtitle: "Autonomous Navigation & Kinematics",
    desc: "Designing and engineering autonomous ground vehicles, robotic arms, and mechanical chassis built to overcome complex physical terrain.",
    tags: ["Inverse Kinematics", "ROS 2", "Motor Controllers", "LiDAR SLAM"],
    icon: "lucide:bot",
  },
  {
    num: "02",
    title: "Embedded Systems",
    subtitle: "Silicon, Firmware & Custom PCBs",
    desc: "Low-level bare-metal firmware, custom multi-layer PCB design, hardware timers, and real-time sensor communication protocols.",
    tags: ["ARM Cortex & AVR", "SPI / I2C / UART", "KiCad Schematics", "FreeRTOS"],
    icon: "lucide:cpu",
  },
  {
    num: "03",
    title: "Automation",
    subtitle: "Closed-Loop Control & Mechatronics",
    desc: "Precise industrial feedback loops, PID motion tuning, sensor telemetry fusion, and automated electromechanical pipelines.",
    tags: ["PID Algorithms", "Encoder Feedback", "Actuator Arrays", "Power Electronics"],
    icon: "lucide:zap",
  },
  {
    num: "04",
    title: "AI & Edge IoT",
    subtitle: "Intelligent Edge Computing & Vision",
    desc: "Deploying quantized machine learning models directly on microcontroller silicon for low-latency computer vision and sensor telemetry.",
    tags: ["TinyML Inference", "Edge Vision", "Sensor Fusion", "Wireless Telemetry"],
    icon: "lucide:brain-circuit",
  },
];

export default function DomainsSection() {
  const [activeDomain, setActiveDomain] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // Scroll Spy to automatically activate domain closest to viewport center
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const windowCenter = window.innerHeight * 0.48;
          let closestIndex = 0;
          let minDistance = Infinity;

          rowRefs.current.forEach((el, index) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const elCenter = rect.top + rect.height / 2;
            const dist = Math.abs(elCenter - windowCenter);

            if (dist < minDistance) {
              minDistance = dist;
              closestIndex = index;
            }
          });

          // Only trigger state update if domain index changed
          setActiveDomain((prev) => (prev !== closestIndex ? closestIndex : prev));

          // Parallax background drift
          if (backgroundRef.current && sectionRef.current && !reducedMotion) {
            const secRect = sectionRef.current.getBoundingClientRect();
            const bgY = (secRect.top / window.innerHeight) * -25;
            backgroundRef.current.style.transform = `translate3d(0, ${bgY.toFixed(1)}px, 0)`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="py-36 md:py-48 px-6 md:px-12 relative overflow-hidden bg-[#FAFAF8] select-none border-b border-[#D9D9D5]"
    >
      {/* Layer 1: Background Parallax Coordinate Grid & Rings */}
      <div
        ref={backgroundRef}
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

        {/* Layer 2: Subtle radial geometry */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#d83a32]/[0.02] blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-black/[0.03] pointer-events-none" />

        {/* Layer 3: Technical coordinate marks */}
        <div className="hidden lg:block absolute top-20 right-16 font-mono text-[10px] text-[#5F6368] tracking-widest uppercase">
          SEC.03 {"//"} DOMAIN_ARCHITECTURE {"//"} STICKY_HUD_ACTIVE
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-[#D9D9D5] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
              <span className="text-xs font-mono text-[#d83a32] uppercase tracking-widest font-bold">
                Disciplines {"//"} Laboratory Domains
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono tracking-tighter text-[#111214]">
              Engineering <span className="text-[#d83a32]">Disciplines</span>
            </h2>
          </div>
          <p className="text-sm font-mono text-[#5F6368] max-w-sm mt-4 md:mt-0 font-light leading-relaxed">
            Scroll to inspect each track. Four specialized technical domains converging into unified autonomous robotics.
          </p>
        </div>

        {/* Mobile Visualizer Presentation (clean card above domains on mobile) */}
        <div className="lg:hidden mb-12">
          <DomainVisualizer activeDomain={activeDomain} />
        </div>

        {/* Desktop Two-Column Layout (LEFT: Interactive Rows, RIGHT: Sticky Visualizer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* LEFT: Scroll-Spied Domain Rows */}
          <div
            className="lg:col-span-7 divide-y divide-[#D9D9D5]"
            style={{ perspective: "1000px" }}
          >
            {DOMAINS.map((domain, index) => {
              const isActive = activeDomain === index;

              return (
                <div
                  key={domain.num}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  onClick={() => setActiveDomain(index)}
                  onMouseEnter={() => setActiveDomain(index)}
                  className={`py-10 md:py-14 transition-all duration-500 cursor-pointer will-change-transform ${
                    isActive
                      ? "opacity-100 scale-[1.02] translate-x-2"
                      : "opacity-45 scale-[0.98] hover:opacity-75"
                  }`}
                  style={{
                    transform: isActive
                      ? "translate3d(8px, 0, 15px)"
                      : "translate3d(0, 0, -8px)",
                  }}
                >
                  <div className="flex items-baseline gap-6 md:gap-8 mb-3">
                    <span
                      className={`text-sm md:text-base font-mono font-bold transition-colors ${
                        isActive ? "text-[#d83a32]" : "text-[#5F6368]"
                      }`}
                    >
                      {domain.num}
                    </span>

                    <div className="flex items-center gap-3">
                      <h3
                        className={`text-2xl sm:text-3xl md:text-4xl font-mono font-bold tracking-tight transition-colors ${
                          isActive ? "text-[#111214]" : "text-[#5F6368]"
                        }`}
                      >
                        {domain.title}
                      </h3>
                      <div
                        className={`p-1.5 rounded-lg transition-all ${
                          isActive
                            ? "bg-[#d83a32]/10 text-[#d83a32] border border-[#d83a32]/30"
                            : "bg-transparent text-zinc-400"
                        }`}
                      >
                        <Iconify icon={domain.icon} className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-mono uppercase tracking-widest text-[#d83a32] mb-3 pl-10 md:pl-12 font-medium">
                    {domain.subtitle}
                  </p>

                  <div className="pl-10 md:pl-12">
                    <p
                      className={`text-sm leading-relaxed font-light mb-4 transition-colors ${
                        isActive ? "text-[#111214]" : "text-[#5F6368]"
                      }`}
                    >
                      {domain.desc}
                    </p>

                    {/* Staggered Tag Illumination */}
                    <div className="flex flex-wrap gap-2">
                      {domain.tags.map((tag, tagIdx) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-mono px-2.5 py-1 rounded transition-all duration-300 ${
                            isActive
                              ? "bg-white text-[#111214] border border-[#d83a32]/40 shadow-xs font-medium"
                              : "bg-[#F3F3F0] text-[#5F6368] border border-[#D9D9D5]"
                          }`}
                          style={{
                            transitionDelay: isActive ? `${tagIdx * 60}ms` : "0ms",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Sticky Persistent Domain Visualizer (Desktop only) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-32 self-start">
            <DomainVisualizer activeDomain={activeDomain} />
          </div>
        </div>
      </div>
    </section>
  );
}
