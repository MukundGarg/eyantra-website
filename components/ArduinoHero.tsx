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
  side: "left" | "right";
  labelY: number;
}

const ANNOTATIONS: Annotation[] = [
  {
    id: "mcu",
    number: "01",
    title: "MICROCONTROLLER",
    spec: "ATmega328P • 8-bit AVR",
    detail: "32KB Flash • 2KB SRAM • 16MHz clock",
    pointX: 68,
    pointY: 52,
    side: "right",
    labelY: 38,
  },
  {
    id: "digital-io",
    number: "02",
    title: "DIGITAL I/O & PWM",
    spec: "14 Digital GPIO pins",
    detail: "6 Hardware PWM channels for motor control",
    pointX: 52,
    pointY: 18,
    side: "right",
    labelY: 12,
  },
  {
    id: "analog",
    number: "03",
    title: "ANALOG INPUT",
    spec: "6 Channels • 10-bit ADC",
    detail: "Successive approximation sensor interface",
    pointX: 74,
    pointY: 66,
    side: "right",
    labelY: 68,
  },
  {
    id: "usb",
    number: "04",
    title: "USB CONTROLLER",
    spec: "ATmega16U2 Serial",
    detail: "High-speed UART bridge & ISP flashing",
    pointX: 22,
    pointY: 42,
    side: "left",
    labelY: 28,
  },
  {
    id: "power",
    number: "05",
    title: "POWER REGULATION",
    spec: "Dual LDO Architecture",
    detail: "7-12V Barrel input • 5V / 3.3V isolated rails",
    pointX: 35,
    pointY: 74,
    side: "left",
    labelY: 62,
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
  return window.innerWidth < 768 || "ontouchstart" in window;
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

  // Target mouse coordinates (-1 to 1)
  const mouseTarget = useRef({ x: 0, y: 0 });
  // Interpolated smooth values
  const currentRot = useRef({ x: 12, y: -18, z: 2 });
  const currentPos = useRef({ x: 0, y: 0, z: 0 });
  const scrollProgress = useRef(0);

  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [annotationsVisible, setAnnotationsVisible] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnotationsVisible(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

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

  // Mouse move handler (smooth normalized coordinate update)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (reducedMotion || isMobile) return;
    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX / innerWidth) * 2 - 1;
    const ny = (e.clientY / innerHeight) * 2 - 1;
    mouseTarget.current = { x: nx, y: ny };
  }, [reducedMotion, isMobile]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1.5);
      scrollProgress.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  // 60FPS damped render loop
  useEffect(() => {
    if (!inView) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) * 0.001;

      if (!boardWrapperRef.current) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }

      if (reducedMotion) {
        boardWrapperRef.current.style.transform =
          "rotateX(10deg) rotateY(-12deg) rotateZ(0deg) translateY(0px) scale(1)";
        return;
      }

      const p = scrollProgress.current;

      const maxMouseRotX = isMobile ? 0 : 10;
      const maxMouseRotY = isMobile ? 0 : 16;

      const targetRotX = 14 - mouseTarget.current.y * maxMouseRotX + p * 15;
      const targetRotY = -16 + mouseTarget.current.x * maxMouseRotY + p * 25;
      const targetRotZ = 1 + mouseTarget.current.x * 2 - p * 8;

      const idleY = Math.sin(elapsed * 1.4) * 6;
      const idleRotX = Math.sin(elapsed * 0.9) * 1.5;
      const idleRotY = Math.cos(elapsed * 1.1) * 1.5;

      const lerpFactor = 0.075;
      currentRot.current.x += (targetRotX + idleRotX - currentRot.current.x) * lerpFactor;
      currentRot.current.y += (targetRotY + idleRotY - currentRot.current.y) * lerpFactor;
      currentRot.current.z += (targetRotZ - currentRot.current.z) * lerpFactor;

      const targetTransY = idleY + p * 80;
      const targetTransX = p * (isMobile ? 0 : 60);
      const targetScale = Math.max(1 - p * 0.22, 0.78);

      currentPos.current.x += (targetTransX - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetTransY - currentPos.current.y) * lerpFactor;

      boardWrapperRef.current.style.transform = `
        translate3d(${currentPos.current.x.toFixed(2)}px, ${currentPos.current.y.toFixed(2)}px, 0px)
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
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-between pt-28 pb-16 px-4 md:px-8 overflow-hidden select-none"
    >
      {/* Background Precision Tech Grid & Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.8]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(17,18,20,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,18,20,0.035) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[1000px] h-[700px] md:h-[1000px] rounded-full border border-black/[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full border border-[#d83a32]/[0.08] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[580px] h-[320px] md:h-[580px] bg-[#d83a32]/[0.03] blur-[130px] rounded-full pointer-events-none" />

        <div className="hidden lg:flex justify-between items-center absolute top-36 left-12 right-12 text-[10px] font-mono tracking-widest text-[#5F6368] uppercase pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32] animate-pulse" />
            <span>DEV.SYS {"//"} ATMEGA328P REV3</span>
          </div>
          <div>COORDINATES {"//"} 28.6219° N, 77.0878° E</div>
          <div>ARCH {"//"} 8-BIT AVR RISC @ 16.000 MHZ</div>
        </div>
      </div>

      {/* Hero Header Typography */}
      <div className="relative z-20 text-center max-w-4xl mx-auto mt-4 md:mt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#D9D9D5] shadow-xs backdrop-blur-md mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d83a32]" />
          </span>
          <span className="text-[11px] font-medium text-[#111214] font-mono tracking-wider uppercase">
            e-Yantra MSIT • Robotics & Embedded Systems
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tighter font-mono leading-[1.02] mb-6">
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#111214] via-[#2A2D32] to-[#5F6368]">
            Think. Build.
          </span>
          <span className="block text-[#d83a32] relative inline-block">
            Innovate.
            <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#d83a32] to-transparent opacity-80" />
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-[#5F6368] max-w-xl mx-auto leading-relaxed font-light">
          Where theoretical computation transforms into real-world physical engineering.
        </p>
      </div>

      {/* Central 3D Interactive Arduino Stage */}
      <div
        className="relative z-10 w-full max-w-6xl flex items-center justify-center my-6 md:my-10"
        style={{ perspective: "1400px" }}
      >
        <div
          ref={boardWrapperRef}
          className="relative w-full max-w-[560px] md:max-w-[720px] aspect-[16/10] flex items-center justify-center transition-transform will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(14deg) rotateY(-16deg) rotateZ(1deg)",
          }}
        >
          <div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[75%] h-16 rounded-[100%] bg-black/15 blur-2xl pointer-events-none"
            style={{ transform: "translateZ(-80px)" }}
          />
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-12 rounded-[100%] bg-[#d83a32]/10 blur-xl pointer-events-none"
            style={{ transform: "translateZ(-60px)" }}
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/arduino-3d-transparent.webp"
            alt="Arduino Uno 3D Hardware Microcontroller Board"
            className="w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(17,18,20,0.22)] relative z-10"
            draggable={false}
          />

          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-20 mix-blend-overlay transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(circle at 45% 35%, rgba(255,255,255,0.4) 0%, rgba(216,58,50,0.1) 40%, transparent 70%)",
            }}
          />

          {ANNOTATIONS.map((anno) => {
            const isTargeted = activeAnnotation === anno.id;
            return (
              <div
                key={anno.id}
                className="absolute z-20 cursor-pointer"
                style={{
                  left: `${anno.pointX}%`,
                  top: `${anno.pointY}%`,
                  transform: "translate(-50%, -50%) translateZ(30px)",
                }}
                onMouseEnter={() => setActiveAnnotation(anno.id)}
                onMouseLeave={() => setActiveAnnotation(null)}
                onClick={() => setActiveAnnotation(activeAnnotation === anno.id ? null : anno.id)}
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full transition-opacity ${
                      isTargeted ? "bg-[#d83a32] opacity-80" : "bg-black/20 opacity-40"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 border border-white transition-colors ${
                      isTargeted ? "bg-[#d83a32] scale-125" : "bg-[#111214] group-hover:bg-[#d83a32]"
                    }`}
                  />
                </span>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          {ANNOTATIONS.map((anno, index) => {
            const isLeft = anno.side === "left";
            const isHovered = activeAnnotation === anno.id;

            return (
              <div
                key={anno.id}
                className={`absolute z-30 pointer-events-auto transition-all duration-700 ${
                  annotationsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  [isLeft ? "left" : "right"]: "2%",
                  top: `${anno.labelY}%`,
                  transitionDelay: `${index * 120}ms`,
                }}
                onMouseEnter={() => setActiveAnnotation(anno.id)}
                onMouseLeave={() => setActiveAnnotation(null)}
              >
                <div
                  className={`group relative p-3 rounded-lg border backdrop-blur-md transition-all duration-300 w-64 ${
                    isHovered
                      ? "bg-white border-[#d83a32] shadow-[0_4px_24px_rgba(216,58,50,0.15)] translate-x-1"
                      : "bg-white/90 border-[#D9D9D5] hover:border-[#111214]/40 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-[#d83a32] tracking-widest font-bold">
                      {anno.number} {"//"} {anno.title}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isHovered ? "bg-[#d83a32]" : "bg-zinc-400"
                      }`}
                    />
                  </div>
                  <h4 className="text-xs font-bold font-mono text-[#111214] tracking-tight">{anno.spec}</h4>
                  <p className="text-[11px] text-[#5F6368] mt-0.5 font-mono leading-tight">{anno.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Telemetry Spec Pills */}
      <div className="lg:hidden w-full max-w-md mx-auto my-4 grid grid-cols-2 gap-2 text-left z-20">
        {ANNOTATIONS.slice(0, 4).map((anno) => (
          <div
            key={anno.id}
            className="p-2.5 rounded-lg border border-[#D9D9D5] bg-white/90 backdrop-blur-sm shadow-xs"
          >
            <span className="text-[9px] font-mono text-[#d83a32] block font-bold tracking-wider">
              {anno.number} {"//"} {anno.title}
            </span>
            <span className="text-[11px] font-mono text-[#111214] block truncate font-medium">{anno.spec}</span>
          </div>
        ))}
      </div>

      {/* Hero Bottom CTAs & Scroll Cue */}
      <div className="relative z-20 flex flex-col items-center gap-6 mt-4 md:mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/projects" className="shiny-cta group cta-press shadow-md">
            <span className="relative z-10 flex items-center gap-2 text-white font-medium font-mono text-xs uppercase tracking-wider">
              Explore Projects <Iconify icon="lucide:arrow-right" className="cta-arrow w-4 h-4" />
            </span>
          </Link>
          <Link
            href="/team"
            className="cta-press group px-6 py-3.5 rounded-full bg-white border border-[#D9D9D5] text-[#111214] font-medium font-mono text-xs tracking-wider uppercase hover:text-[#d83a32] hover:border-[#d83a32] shadow-xs transition-all flex items-center gap-2"
          >
            Engineering Team
            <Iconify
              icon="lucide:arrow-right"
              className="cta-arrow opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4"
            />
          </Link>
        </div>

        <div className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity text-[#5F6368]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F6368]">
            Scroll to Inspect Architecture
          </span>
          <Iconify icon="lucide:chevron-down" className="w-4 h-4 animate-bounce text-[#d83a32]" />
        </div>
      </div>
    </div>
  );
}
