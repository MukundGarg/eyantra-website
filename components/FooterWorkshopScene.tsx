"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import Iconify from "@/components/Iconify";
import CampusMap from "@/components/CampusMap";
import styles from "./FooterWorkshopScene.module.css";

export default function FooterWorkshopScene() {
  const sceneRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--gaze-x", `${(x - 0.72) * 4}px`);
    event.currentTarget.style.setProperty("--gaze-y", `${(y - 0.52) * 3}px`);
    event.currentTarget.style.setProperty("--drift-x", `${(x - 0.5) * -8}px`);
    event.currentTarget.style.setProperty("--drift-y", `${(y - 0.5) * -6}px`);
  };

  const resetPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--gaze-x", "0px");
    event.currentTarget.style.setProperty("--gaze-y", "0px");
    event.currentTarget.style.setProperty("--drift-x", "0px");
    event.currentTarget.style.setProperty("--drift-y", "0px");
  };

  return (
    <footer
      ref={sceneRef}
      className={styles.scene}
      data-visible={isVisible}
      aria-labelledby="footer-scene-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className={styles.sceneGrid} aria-hidden="true" />
      <div className={styles.sceneGlow} aria-hidden="true" />

      <div className={styles.sceneHeader}>
        <p className={styles.eyebrow}>
          <span />
          From the e-Yantra MSIT workshop
        </p>
        <h2 id="footer-scene-title">
          Keep making
          <span> things move.</span>
        </h2>
        <p className={styles.sceneCopy}>
          Curiosity is a good place to start. Your next idea could be the one
          that changes everything.
        </p>
      </div>

      <div className={styles.wordmarkStage}>
        <div className={styles.wordmark} aria-hidden="true">
          E-YANTRA
        </div>
        <div className={styles.groundLine} aria-hidden="true">
          <span />
        </div>
        <div className={styles.doodles} aria-hidden="true">
          <svg className={styles.doodleStar} viewBox="0 0 44 44">
            <path d="M22 2 26 17 42 22 26 26 22 42 17 26 2 22 17 17Z" />
          </svg>
          <svg className={styles.doodleBolt} viewBox="0 0 38 54">
            <path d="M23 2 5 29h12l-3 23 19-30H21Z" />
          </svg>
          <svg className={styles.doodleCircuit} viewBox="0 0 92 56">
            <path d="M2 28h24v-16h20v32h22V18h22" />
            <circle cx="2" cy="28" r="2" />
            <circle cx="90" cy="18" r="2" />
            <circle cx="46" cy="12" r="2" />
          </svg>
        </div>

        <button
          className={styles.robot}
          type="button"
          onClick={() => setIsTalking((current) => !current)}
          aria-label={
            isTalking
              ? "Dismiss the robot's message"
              : "Meet Circuit, the e-Yantra workshop robot"
          }
          aria-pressed={isTalking}
        >
          <span className={styles.robotShadow} aria-hidden="true" />
          <svg
            className={styles.robotSvg}
            viewBox="0 0 190 230"
            role="img"
            aria-labelledby="footer-robot-title"
          >
            <title id="footer-robot-title">Circuit, a little workshop robot</title>
            <defs>
              <linearGradient id="footer-robot-shell" x1="35" y1="38" x2="150" y2="166" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF9EC" />
                <stop offset="1" stopColor="#CDB69A" />
              </linearGradient>
              <linearGradient id="footer-robot-metal" x1="42" y1="155" x2="143" y2="214" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5E5CF" />
                <stop offset="1" stopColor="#B99A7B" />
              </linearGradient>
              <linearGradient id="footer-robot-visor" x1="54" y1="67" x2="134" y2="135" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38302A" />
                <stop offset="1" stopColor="#151413" />
              </linearGradient>
              <radialGradient id="footer-robot-beacon" cx="0" cy="0" r="1" gradientTransform="matrix(3 7 -7 3 92 19)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFB2A0" />
                <stop offset="1" stopColor="#C9362E" />
              </radialGradient>
            </defs>

            <path d="M95 29V17" stroke="#927354" strokeWidth="4" strokeLinecap="round" />
            <circle cx="95" cy="13" r="8" fill="url(#footer-robot-beacon)" />
            <path d="M46 66c0-15 12-27 27-27h44c15 0 27 12 27 27v67c0 15-12 27-27 27H73c-15 0-27-12-27-27V66Z" fill="url(#footer-robot-shell)" stroke="#9E8061" strokeWidth="3" />
            <path d="M57 67c0-9 7-16 16-16h45c9 0 16 7 16 16v48H57V67Z" fill="url(#footer-robot-visor)" stroke="#E3BD84" strokeWidth="4" />
            <path d="M73 83c5-6 12-6 17 0M103 83c5-6 12-6 17 0" stroke="#FFE7B3" strokeWidth="4" strokeLinecap="round" />
            <path d="M84 101c6 8 17 8 23 0" stroke="#FFE7B3" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M35 75h11v39H35c-7 0-12-5-12-12V87c0-7 5-12 12-12ZM155 75h-11v39h11c7 0 12-5 12-12V87c0-7-5-12-12-12Z" fill="#42362F" stroke="#A5825D" strokeWidth="3" />
            <path d="M69 163h52v30c0 7-6 13-13 13H82c-7 0-13-6-13-13v-30Z" fill="url(#footer-robot-metal)" stroke="#9E8061" strokeWidth="3" />
            <path d="M84 179h22" stroke="#8E6D50" strokeWidth="3" strokeLinecap="round" />
            <circle cx="95" cy="178" r="4" fill="#C83B30" />
            <path d="M75 206 69 222M115 206l6 16" stroke="#8D7155" strokeWidth="7" strokeLinecap="round" />
            <path d="M56 221h21M113 221h21" stroke="#E7D3B7" strokeWidth="10" strokeLinecap="round" />
            <path d="m67 221 7 0m48 0h7" stroke="#C83B30" strokeWidth="3" strokeLinecap="round" />
            <path d="M47 170 31 184M143 170l16 14" stroke="#9E8061" strokeWidth="6" strokeLinecap="round" />
            <path d="M29 184 25 195M161 184l4 11" stroke="#D8C2A5" strokeWidth="8" strokeLinecap="round" />
            <circle cx="41" cy="134" r="3" fill="#C83B30" />
            <circle cx="149" cy="134" r="3" fill="#C83B30" />
          </svg>
        </button>

        {isTalking && (
          <div className={styles.speech} role="status">
            <span>Hi, maker!</span>
            Every great build begins with a question.
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <p>Have an idea? Let’s build it together.</p>
        <div>
          <Link className={styles.primaryAction} href="/projects">
            Explore our projects
            <Iconify icon="lucide:arrow-up-right" />
          </Link>
          <a className={styles.secondaryAction} href="mailto:eyantramsit@gmail.com">
            Get in touch
            <Iconify icon="lucide:arrow-up-right" />
          </a>
        </div>
      </div>

      <div className={styles.footerDetails}>
        <div className={styles.footerIdentity}>
          <div className={styles.footerBrand}>
            <span>
              <Iconify icon="lucide:cpu" />
            </span>
            <strong>e-Yantra MSIT</strong>
          </div>
          <p>
            The student robotics society of Maharaja Surajmal Institute of
            Technology, dedicated to hands-on embedded systems, autonomous
            robots, and engineering projects.
          </p>
        </div>

        <nav className={styles.footerNavigation} aria-label="Footer navigation">
          <h3>Navigation</h3>
          <ul>
            {[
              ["01", "Home", "/"],
              ["02", "Projects", "/projects"],
              ["03", "Events", "/events"],
              ["04", "Team", "/team"],
              ["05", "Bunty", "/bunty"],
            ].map(([number, label, href]) => (
              <li key={href}>
                <Link href={href}>
                  <span>{number}</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.footerContact}>
          <h3>Contact</h3>
          <a href="mailto:eyantramsit@gmail.com">
            <Iconify icon="lucide:mail" />
            eyantramsit@gmail.com
          </a>
          <address>
            <Iconify icon="lucide:map-pin" />
            <span>
              Maharaja Surajmal Institute of Technology
              <br />
              C-4 Janakpuri, New Delhi - 110058
            </span>
          </address>
          <CampusMap />
          <a
            className={styles.mapLink}
            href="https://www.openstreetmap.org/?mlat=28.6206698&mlon=77.0924931#map=17/28.6206698/77.0924931"
            target="_blank"
            rel="noopener noreferrer"
          >
            View campus map
            <Iconify icon="lucide:arrow-up-right" />
          </a>
          <p className={styles.footerPartner}>
            <Iconify icon="lucide:award" />
            IIT Bombay e-Yantra Initiative Partner Lab
          </p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>
          <span aria-hidden="true">●</span> © {new Date().getFullYear()} e-Yantra
          MSIT. Student robotics society.
        </span>
        <span>Affiliated with MSIT &amp; GGSIPU · All rights reserved</span>
      </div>
    </footer>
  );
}
