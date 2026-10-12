"use client";

import React, { useRef, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Iconify from "@/components/Iconify";
import ProjectCard, { ProjectProps } from "@/components/ProjectCard";

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

const subscribeMobile = (notify: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", notify, { passive: true });
  return () => window.removeEventListener("resize", notify);
};

const getMobileSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || "ontouchstart" in window;
};

export default function FeaturedProjectsSection({
  projects,
}: {
  projects: ProjectProps[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardColRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dividerPulseRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const [inView, setInView] = useState(true);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    () => false
  );

  // IntersectionObserver to pause scroll loop when section is offscreen
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

  // Continuous 60FPS scroll-driven 3D entrance & inter-card parallax loop
  useEffect(() => {
    if (!inView || reducedMotion || isMobile) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const updateScroll3D = () => {
      const section = sectionRef.current;
      if (!section) {
        rafId.current = requestAnimationFrame(updateScroll3D);
        return;
      }

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress: 0 when top enters bottom of viewport, 1 when center of viewport
      const progress = 1 - rect.top / windowHeight;

      if (progress >= -0.2 && progress <= 2.2) {
        // Clamp entry progress for 3D reveal (0 to 1)
        const entryProgress = Math.min(Math.max((progress - 0.1) / 0.7, 0), 1);

        // Staggered inter-card parallax rates
        const parallaxRates = [-18, 0, 18];

        cardColRefs.current.forEach((col, idx) => {
          if (!col) return;

          // Staggered entry calculation
          const staggerOffset = idx * 0.12;
          const cardEntry = Math.min(
            Math.max((entryProgress - staggerOffset) / (1 - staggerOffset), 0),
            1
          );

          // 3D Entrance transform: translateY(40px -> 0px), scale(0.94 -> 1), rotateX(8deg -> 0deg)
          const transY = (1 - cardEntry) * 45 + (progress - 1) * parallaxRates[idx];
          const scale = 0.94 + cardEntry * 0.06;
          const rotX = (1 - cardEntry) * 7;
          const opacity = Math.min(cardEntry * 1.25, 1);

          col.style.transform = `
            translate3d(0, ${transY.toFixed(1)}px, 0)
            scale(${scale.toFixed(3)})
            rotateX(${rotX.toFixed(2)}deg)
          `;
          col.style.opacity = opacity.toFixed(2);
        });

        // Divider traveling pulse position
        if (dividerPulseRef.current) {
          const pulsePos = Math.min(Math.max((progress - 0.2) * 100, 0), 100);
          dividerPulseRef.current.style.width = `${pulsePos.toFixed(1)}%`;
        }
      }

      rafId.current = requestAnimationFrame(updateScroll3D);
    };

    rafId.current = requestAnimationFrame(updateScroll3D);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [inView, reducedMotion, isMobile]);

  return (
    <section
      ref={sectionRef}
      className="py-36 px-6 md:px-12 bg-[var(--bg-surface)] relative border-t border-[var(--border)] overflow-hidden select-none"
    >
      {/* Background Precision Grid Texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Subtle radial ambient atmosphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[var(--accent-red)]/[0.02] dark:bg-[var(--accent-red)]/[0.035] blur-[140px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header with Animated Telemetry Beacon & Expanding Divider */}
        <div className="relative pb-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)]" />
                <span className="text-xs font-mono text-[var(--accent-red)] uppercase tracking-wider font-semibold">
                  Selected Work • Student Engineering
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
                Featured <span className="text-[var(--accent-red)]">Projects</span>
              </h2>
            </div>

            <Link
              href="/projects"
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2 group transition-colors self-start md:self-end font-semibold"
            >
              <span>View All Projects</span>
              <Iconify
                icon="lucide:arrow-right"
                className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[var(--accent-red)]"
              />
            </Link>
          </div>

          {/* Animated Hairline Divider with Traveling Glow Pulse */}
          <div className="relative h-[1px] w-full bg-[var(--border)] mt-8 overflow-hidden">
            <div
              ref={dividerPulseRef}
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-[var(--accent-red)] to-[var(--text-primary)] transition-all duration-300"
              style={{ width: "25%" }}
            />
          </div>
        </div>

        {/* 3D Staggered Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, i) => (
            <div
              key={project.title + i}
              ref={(el) => {
                cardColRefs.current[i] = el;
              }}
              className="h-full will-change-transform"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
