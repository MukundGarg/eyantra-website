"use client";

import React, { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import Iconify from "@/components/Iconify";

interface Annotation {
  id: string;
  number: string;
  title: string;
  spec: string;
  detail: string;
  pointX: number;
  pointY: number;
}

const ANNOTATIONS: Annotation[] = [
  {
    id: "mcu",
    number: "01",
    title: "Microcontroller",
    spec: "ATmega328P • 8-bit AVR",
    detail: "32KB Flash memory, 2KB SRAM, running at 16 MHz.",
    pointX: 68,
    pointY: 52,
  },
  {
    id: "digital-io",
    number: "02",
    title: "Digital I/O & PWM",
    spec: "14 Digital Pins (6 PWM)",
    detail: "Configurable GPIO lines for sensor triggers and motor speed modulation.",
    pointX: 52,
    pointY: 18,
  },
  {
    id: "analog",
    number: "03",
    title: "Analog Inputs",
    spec: "6 Channels • 10-bit ADC",
    detail: "Direct voltage sampling for potentiometers, line sensors, and analog transceivers.",
    pointX: 74,
    pointY: 66,
  },
  {
    id: "usb",
    number: "04",
    title: "USB Interface",
    spec: "ATmega16U2 Serial Bridge",
    detail: "Hardware UART-to-USB communication for firmware flashing and telemetry debugging.",
    pointX: 22,
    pointY: 42,
  },
  {
    id: "power",
    number: "05",
    title: "Power Regulation",
    spec: "Dual LDO Regulators",
    detail: "7–12V DC input regulated down to clean 5V and 3.3V power rails.",
    pointX: 35,
    pointY: 74,
  },
];

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
  return window.innerWidth < 1024;
};

export default function ArduinoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardWrapperRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

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

  // Normalized mouse target coordinates (-1 to 1)
  const mouseTarget = useRef({ x: 0, y: 0 });
  // Interpolated rotation & translation
  const currentRot = useRef({ x: 8, y: -12, z: 0 });
  const currentPos = useRef({ y: 0 });
  const scrollProgress = useRef(0);

  const [activeId, setActiveId] = useState<string>("mcu");
  const [inView, setInView] = useState(true);

  const activeAnnotation = ANNOTATIONS.find((a) => a.id === activeId) || ANNOTATIONS[0];

  // IntersectionObserver to pause loop when scrolled out of view
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

  // Mouse move handler (restrained range)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reducedMotion || isMobile) return;
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      mouseTarget.current = { x: nx, y: ny };
    },
    [reducedMotion, isMobile]
  );

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1.2);
      scrollProgress.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  // Gentle, settled RAF render loop (restrained angles, smooth easing)
  useEffect(() => {
    if (!inView) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const loop = () => {
      if (!boardWrapperRef.current) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }

      if (reducedMotion) {
        boardWrapperRef.current.style.transform =
          "rotateX(6deg) rotateY(-8deg) rotateZ(0deg) translateY(0px) scale(1)";
        return;
      }

      const p = scrollProgress.current;

      // Restrained max tilt angles: max ~3.5° pitch, 4.5° yaw
      const maxRotX = isMobile ? 0 : 3.5;
      const maxRotY = isMobile ? 0 : 4.5;

      const targetRotX = 8 - mouseTarget.current.y * maxRotX + p * 5;
      const targetRotY = -12 + mouseTarget.current.x * maxRotY + p * 6;
      const targetRotZ = mouseTarget.current.x * 0.8;

      const lerpFactor = 0.045; // Slow, intentional easing
      currentRot.current.x += (targetRotX - currentRot.current.x) * lerpFactor;
      currentRot.current.y += (targetRotY - currentRot.current.y) * lerpFactor;
      currentRot.current.z += (targetRotZ - currentRot.current.z) * lerpFactor;

      const targetTransY = p * 24;
      currentPos.current.y += (targetTransY - currentPos.current.y) * lerpFactor;
      const targetScale = Math.max(1 - p * 0.08, 0.92);

      boardWrapperRef.current.style.transform = `
        translate3d(0px, ${currentPos.current.y.toFixed(2)}px, 0px)
        rotateX(${currentRot.current.x.toFixed(2)}deg)
        rotateY(${currentRot.current.y.toFixed(2)}deg)
        rotateZ(${currentRot.current.z.toFixed(2)}deg)
        scale(${targetScale.toFixed(3)})
      `;

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [inView, reducedMotion, isMobile]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-5rem)] flex items-center pt-24 pb-16 md:py-28 px-6 sm:px-8 lg:px-16 overflow-hidden"
    >
      {/* Subtle warm backdrop wash (no harsh HUD circles or grids) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[420px] md:w-[600px] h-[420px] md:h-[600px] bg-[#d83a32]/[0.025] blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Identity + Editorial Headline + Copy + CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111214]/[0.03] border border-[#111214]/[0.08] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
              <span className="text-xs font-mono tracking-wider uppercase text-[#111214] font-medium">
                e-Yantra MSIT
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-[#111214] leading-[1.08] mb-6">
              Build. Experiment. Engineer.
            </h1>

            {/* Body */}
            <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-xl font-normal mb-8">
              The student robotics society of Maharaja Surajmal Institute of Technology,
              where ideas become working systems through hands-on engineering, projects and
              competitions.
            </p>

            {/* Restrained CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/projects"
                className="cta-press inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111214] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#d83a32] transition-colors shadow-xs"
              >
                <span>Explore Projects</span>
                <Iconify icon="lucide:arrow-right" className="w-4 h-4" />
              </Link>
              <Link
                href="/team"
                className="cta-press inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#D9D9D5] text-[#111214] text-xs uppercase tracking-wider font-medium hover:border-[#111214] hover:bg-[#111214]/[0.02] transition-colors shadow-2xs"
              >
                <span>Meet the Team</span>
                <Iconify icon="lucide:arrow-right" className="w-4 h-4 opacity-70" />
              </Link>
            </div>
          </div>

          {/* Right Column: Arduino Board as Hero Visual + Focused Component Inspector */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            {/* 3D Board Stage */}
            <div
              className="relative w-full max-w-[500px] sm:max-w-[560px] aspect-[16/11] flex items-center justify-center"
              style={{ perspective: "1200px" }}
            >
              <div
                ref={boardWrapperRef}
                className="relative w-full h-full flex items-center justify-center transition-transform will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(8deg) rotateY(-12deg) rotateZ(0deg)",
                }}
              >
                {/* Soft ground shadow */}
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-10 rounded-[100%] bg-black/[0.08] blur-xl pointer-events-none"
                  style={{ transform: "translateZ(-40px)" }}
                />

                {/* Arduino Uno Board Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/arduino-3d-transparent.webp"
                  alt="Arduino Uno R3 Microcontroller Board"
                  className="w-full h-auto object-contain filter drop-shadow-[0_16px_28px_rgba(17,18,20,0.12)] relative z-10"
                  draggable={false}
                />

                {/* Hotspot Indicators (Subtle, accessible pins) */}
                {ANNOTATIONS.map((anno) => {
                  const isSelected = activeId === anno.id;
                  return (
                    <button
                      key={anno.id}
                      type="button"
                      aria-label={`Inspect ${anno.title}`}
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer p-1.5 focus:outline-hidden"
                      style={{
                        left: `${anno.pointX}%`,
                        top: `${anno.pointY}%`,
                        transform: "translate(-50%, -50%) translateZ(24px)",
                      }}
                      onClick={() => setActiveId(anno.id)}
                      onMouseEnter={() => setActiveId(anno.id)}
                      onFocus={() => setActiveId(anno.id)}
                    >
                      <span className="relative flex items-center justify-center">
                        <span
                          className={`w-3 h-3 rounded-full border border-white transition-all duration-200 ${
                            isSelected
                              ? "bg-[#d83a32] ring-3 ring-[#d83a32]/25 scale-125"
                              : "bg-[#111214] ring-2 ring-black/10 hover:bg-[#d83a32] hover:scale-110"
                          }`}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Focused Component Inspector (Generous negative space, single focal point) */}
            <div className="w-full max-w-lg mt-6">
              {/* Quick Tab Selector */}
              <div className="flex items-center justify-between gap-1 p-1 bg-[#F3F3F0] rounded-lg border border-[#D9D9D5]/70 mb-3 overflow-x-auto no-scrollbar">
                {ANNOTATIONS.map((anno) => {
                  const isSelected = activeId === anno.id;
                  return (
                    <button
                      key={anno.id}
                      type="button"
                      onClick={() => setActiveId(anno.id)}
                      className={`px-2.5 py-1 text-[11px] font-mono tracking-tight rounded-md whitespace-nowrap transition-colors ${
                        isSelected
                          ? "bg-white text-[#111214] font-medium shadow-2xs border border-[#D9D9D5]"
                          : "text-[#5F6368] hover:text-[#111214]"
                      }`}
                    >
                      {anno.number} {anno.title}
                    </button>
                  );
                })}
              </div>

              {/* Active Callout Details */}
              <div className="p-3.5 rounded-xl border border-[#D9D9D5] bg-white shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold text-[#d83a32] tracking-wider uppercase">
                      {activeAnnotation.number} • {activeAnnotation.title}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#111214] tracking-tight">
                    {activeAnnotation.spec}
                  </span>
                </div>
                <p className="text-xs text-[#5F6368] leading-relaxed">
                  {activeAnnotation.detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

