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
    subtitle: "Autonomous Navigation & Mechanics",
    desc: "Designing and engineering mobile robots, robotic arms, and mechanical chassis built for competitive arenas and practical tasks.",
    tags: ["Autonomous Navigation", "ROS", "Motor Drivers", "Kinematics"],
    icon: "lucide:bot",
  },
  {
    num: "02",
    title: "Embedded Systems",
    subtitle: "Microcontrollers & Hardware",
    desc: "Developing firmware, designing custom PCBs, and interfacing sensors with microcontrollers like Arduino, STM32, and ESP32.",
    tags: ["C / C++", "Arduino & STM32", "PCB Design", "I2C / SPI / UART"],
    icon: "lucide:cpu",
  },
  {
    num: "03",
    title: "Automation",
    subtitle: "Closed-Loop Control & Sensors",
    desc: "Building motorized systems, PID feedback loops, and automated mechanisms for reliable electromechanical actuation.",
    tags: ["PID Control", "Sensors", "Actuators", "Encoder Feedback"],
    icon: "lucide:zap",
  },
  {
    num: "04",
    title: "AI & IoT",
    subtitle: "Computer Vision & Connected Systems",
    desc: "Integrating camera feeds, sensor telemetry, and connected devices to give robots visual perception and remote monitoring capabilities.",
    tags: ["Computer Vision", "Python", "IoT Protocols", "Edge Inference"],
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
      className="py-28 md:py-36 px-6 md:px-12 relative bg-[var(--bg-primary)] select-none border-b border-[var(--border)]"
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
              "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Layer 2: Subtle radial geometry */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[var(--accent-red)]/[0.02] dark:bg-[var(--accent-red)]/[0.035] blur-[160px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--border)] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)]" />
              <span className="text-xs font-mono text-[var(--accent-red)] uppercase tracking-wider font-semibold">
                Disciplines • Technical Domains
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)]">
              Engineering <span className="text-[var(--accent-red)]">Disciplines</span>
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mt-4 md:mt-0 font-normal leading-relaxed">
            Four specialized technical tracks that collaborate to build autonomous robotics systems at e-Yantra MSIT.
          </p>
        </div>

        {/* Mobile Visualizer Presentation */}
        <div className="lg:hidden mb-12">
          <DomainVisualizer activeDomain={activeDomain} />
        </div>

        {/* Desktop Two-Column Layout (LEFT: Interactive Rows, RIGHT: Sticky Visualizer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* LEFT: Scroll-Spied Domain Rows */}
          <div
            className="lg:col-span-7 divide-y divide-[var(--border)]"
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
                      className={`text-sm md:text-base font-mono font-semibold transition-colors ${
                        isActive ? "text-[var(--accent-red)]" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {domain.num}
                    </span>

                    <div className="flex items-center gap-3">
                      <h3
                        className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight transition-colors ${
                          isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {domain.title}
                      </h3>
                      <div
                        className={`p-1.5 rounded-lg transition-all ${
                          isActive
                            ? "bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/30"
                            : "bg-transparent text-[var(--text-secondary)]/50"
                        }`}
                      >
                        <Iconify icon={domain.icon} className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs uppercase tracking-wider text-[var(--accent-red)] mb-3 pl-10 md:pl-12 font-medium">
                    {domain.subtitle}
                  </p>

                  <div className="pl-10 md:pl-12">
                    <p
                      className={`text-sm leading-relaxed mb-4 transition-colors font-normal ${
                        isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {domain.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {domain.tags.map((tag, tagIdx) => (
                        <span
                          key={tag}
                          className={`text-xs px-2.5 py-1 rounded transition-all duration-300 ${
                            isActive
                              ? "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--accent-red)]/40 shadow-xs font-medium"
                              : "bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] border border-[var(--border)]"
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
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="sticky top-32">
              <DomainVisualizer activeDomain={activeDomain} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
