"use client";

import { useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import Iconify from "@/components/Iconify";
import EngineeringLab3D, { STATIONS, type StationId } from "@/components/EngineeringLab3D";
import { useTheme } from "@/components/ThemeProvider";

export default function EngineeringLabHero() {
  const { theme } = useTheme();
  const [activeStationId, setActiveStationId] = useState<StationId>("electronics");
  const stageRef = useRef<HTMLDivElement>(null);
  const activeStation =
    STATIONS.find((station) => station.id === activeStationId) ?? STATIONS[2];

  const resetPointer = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--hero-pointer-x", "50%");
    stage.style.setProperty("--hero-pointer-y", "50%");
    stage.style.setProperty("--hero-tilt-x", "0deg");
    stage.style.setProperty("--hero-tilt-y", "0deg");
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resetPointer();
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    stage.style.setProperty("--hero-pointer-x", `${(x + 1) * 50}%`);
    stage.style.setProperty("--hero-pointer-y", `${(y + 1) * 50}%`);
    stage.style.setProperty("--hero-tilt-x", `${-y * 1.4}deg`);
    stage.style.setProperty("--hero-tilt-y", `${x * 1.8}deg`);
  };

  return (
    <section
      id="home-hero"
      className="home-hero"
      aria-labelledby="home-hero-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="home-hero-atmosphere" aria-hidden="true" />
      <div className="home-hero-grid" aria-hidden="true" />
      <div className="home-hero-coordinate" aria-hidden="true">
        28°37&apos;N&nbsp;&nbsp; 77°05&apos;E
      </div>

      <div className="home-hero-inner">
        <div className="home-hero-intro">
          <p className="home-hero-eyebrow">
            <span />
            e-Yantra MSIT&nbsp; / &nbsp;Robotics Society
          </p>
          <h1 id="home-hero-title">
            Ideas into
            <br />
            <span>motion.</span>
          </h1>
          <p className="home-hero-copy">
            We turn curiosity into circuits, code and machines that move.
            A student robotics community at MSIT, New Delhi.
          </p>
          <Link className="home-hero-link" href="#home-work">
            Explore what we build
            <Iconify icon="lucide:arrow-down-right" className="h-4 w-4" />
          </Link>
        </div>

        <div className="home-hero-wordmark" aria-hidden="true">
          E/Y
        </div>

        <div
          ref={stageRef}
          className="home-hero-stage"
          aria-label="Interactive e-Yantra robotics workbench"
        >
          <div className="home-hero-stage-glow" aria-hidden="true" />
          <EngineeringLab3D
            activeStation={activeStationId}
            onStationSelect={setActiveStationId}
            isDark={theme === "dark"}
          />
          <div className="home-hero-stage-label">
            <span>THE WORKING LAB</span>
            <span>PHASE {activeStation.step} / 05</span>
          </div>
        </div>

        <div className="home-hero-bottom">
          <div className="home-hero-caption">
            <span className="home-hero-caption-mark">01</span>
            <p>
              <strong>{activeStation.name}</strong>
              <span>{activeStation.subtitle}</span>
            </p>
          </div>
          <nav className="home-hero-phases" aria-label="Robotics build phases">
            {STATIONS.map((station) => (
              <button
                key={station.id}
                type="button"
                aria-label={`Select phase ${station.step}: ${station.name}`}
                aria-pressed={station.id === activeStationId}
                onClick={() => setActiveStationId(station.id)}
              >
                {station.step}
              </button>
            ))}
          </nav>
          <span className="home-hero-scroll-hint">
            SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
          </span>
        </div>
      </div>
    </section>
  );
}
