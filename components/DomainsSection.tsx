"use client";

import React, { useState } from "react";
import Iconify from "@/components/Iconify";

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
  const [activeDomain, setActiveDomain] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d83a32]/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="reveal mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-[#292D32] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
              <span className="text-xs font-mono text-[#d83a32] uppercase tracking-widest font-bold">
                Disciplines {"//"} Laboratory Domains
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter text-white">
              Engineering <span className="text-[#d83a32]">Disciplines</span>
            </h2>
          </div>
          <p className="text-sm font-mono text-[#A6AAAE] max-w-sm mt-4 md:mt-0 font-light leading-relaxed">
            Four specialized technical tracks converging to form robust autonomous hardware systems.
          </p>
        </div>

        <div className="divide-y divide-[#292D32]/80">
          {DOMAINS.map((domain, index) => {
            const isHovered = activeDomain === index;

            return (
              <div
                key={domain.num}
                className="group py-10 md:py-14 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveDomain(index)}
                onMouseLeave={() => setActiveDomain(null)}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex items-baseline gap-6 md:gap-10">
                    <span
                      className={`text-sm md:text-base font-mono transition-colors ${
                        isHovered ? "text-[#d83a32]" : "text-[#A6AAAE]/50"
                      }`}
                    >
                      {domain.num}
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3
                          className={`text-3xl md:text-5xl font-mono font-bold tracking-tight transition-transform duration-300 ${
                            isHovered ? "text-white translate-x-2" : "text-zinc-300"
                          }`}
                        >
                          {domain.title}
                        </h3>
                        <Iconify
                          icon={domain.icon}
                          className={`w-5 h-5 transition-all ${
                            isHovered ? "text-[#d83a32] opacity-100" : "text-zinc-600 opacity-40"
                          }`}
                        />
                      </div>
                      <p className="text-xs font-mono uppercase tracking-widest text-[#A6AAAE] mt-2">
                        {domain.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="lg:max-w-md xl:max-w-lg lg:pl-6">
                    <p className="text-sm text-[#A6AAAE] leading-relaxed font-light mb-4">
                      {domain.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {domain.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-mono px-2.5 py-1 rounded transition-colors ${
                            isHovered
                              ? "bg-white/10 text-white border border-white/20"
                              : "bg-white/[0.03] text-[#A6AAAE] border border-white/5"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
