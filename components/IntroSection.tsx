"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import CircuitFlow from "@/components/CircuitFlow";
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

const PILLARS = [
  {
    title: "Workshops & Skill Labs",
    desc: "Hands-on technical sessions covering microcontrollers, circuit design, sensor interfacing, and foundational robotics.",
    icon: "lucide:wrench",
  },
  {
    title: "Collaborative Projects",
    desc: "Multidisciplinary student teams building autonomous mobile robots, embedded controllers, and custom mechanisms.",
    icon: "lucide:users",
  },
  {
    title: "Competitions & Hackathons",
    desc: "Representing MSIT in university robotics challenges, design hackathons, and national engineering contests.",
    icon: "lucide:trophy",
  },
];

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [inView, setInView] = useState<boolean>(true);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // IntersectionObserver to observe visibility and pause RAF offscreen
  useEffect(() => {
    const el = sectionRef.current;
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

  // Subtle, settling scroll parallax (small range, no blur or extreme scale)
  useEffect(() => {
    if (!inView || reducedMotion) return;

    const updateScrollParallax = () => {
      const section = sectionRef.current;
      if (!section) {
        rafId.current = requestAnimationFrame(updateScrollParallax);
        return;
      }

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = 1 - rect.top / windowHeight;

      if (progress >= 0 && progress <= 2 && contentRef.current) {
        const entryProgress = Math.min(Math.max((progress - 0.1) / 0.8, 0), 1);
        const transY = (1 - entryProgress) * 16;
        const opacity = Math.min(entryProgress * 1.4, 1);

        contentRef.current.style.transform = `translate3d(0, ${transY.toFixed(1)}px, 0)`;
        contentRef.current.style.opacity = opacity.toFixed(2);
      }

      rafId.current = requestAnimationFrame(updateScrollParallax);
    };

    rafId.current = requestAnimationFrame(updateScrollParallax);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [inView, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 md:py-28 px-6 sm:px-8 lg:px-16 overflow-hidden bg-[var(--bg-primary)] border-t border-b border-[var(--border)]"
    >
      <div
        ref={contentRef}
        className="max-w-6xl mx-auto relative z-10 transition-opacity will-change-transform"
      >
        {/* Section Label */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)]" />
          <span className="text-xs font-mono text-[var(--accent-red)] uppercase tracking-wider font-semibold">
            About e-Yantra MSIT
          </span>
        </div>

        {/* Medium Editorial Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)] max-w-3xl leading-[1.15] mb-6">
          Where theoretical concepts turn into working hardware.
        </h2>

        {/* Short Editorial Paragraphs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[var(--border)]">
          <div className="md:col-span-7 space-y-4">
            <p className="text-base sm:text-lg text-[var(--text-primary)] leading-relaxed font-normal">
              e-Yantra MSIT is the student robotics society of Maharaja Surajmal Institute
              of Technology. We provide an open engineering environment where students explore
              embedded systems, firmware, mechanical design, and autonomous robotics.
            </p>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-normal">
              Rather than staying confined to simulation, members gain practical experience
              building real circuits, writing low-level code, and testing prototypes under
              real-world constraints.
            </p>
          </div>

          <div className="md:col-span-5 md:pl-6 md:border-l md:border-[var(--border)] flex flex-col justify-center space-y-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-1">
                Our Focus
              </span>
              <p className="text-xs sm:text-sm text-[var(--text-primary)] font-medium leading-relaxed">
                Applied robotics, sensor-actuator loops, and collaborative engineering from
                first principles.
              </p>
            </div>
          </div>
        </div>

        {/* Three Core Activities (Presented Simply) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-surface-alt)] text-[var(--text-primary)] flex items-center justify-center mb-4">
                  <Iconify icon={pillar.icon} className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] tracking-tight mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Engineering Workflow Visualizer */}
        <div className="mt-12 sm:mt-16">
          <CircuitFlow />
        </div>
      </div>
    </section>
  );
}

