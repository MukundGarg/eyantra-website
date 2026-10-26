"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import Iconify from "@/components/Iconify";
import { useTheme } from "@/components/ThemeProvider";
import ForceFieldBackground from "@/components/home-v2/ForceFieldBackground";
import YantraSculpture from "@/components/home-v2/YantraSculpture";
import styles from "@/components/home-v2/HomeV2Hero.module.css";

type PointerMotion = {
  x: number;
  y: number;
};

export default function HomeV2Hero() {
  const { theme } = useTheme();
  const heroRef = useRef<HTMLElement>(null);
  const pointer = useRef<PointerMotion>({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      y: ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
    };
    heroRef.current?.style.setProperty(
      "--pointer-x",
      `${((pointer.current.x + 1) / 2) * 100}%`,
    );
    heroRef.current?.style.setProperty(
      "--pointer-y",
      `${((pointer.current.y + 1) / 2) * 100}%`,
    );
    heroRef.current?.style.setProperty(
      "--pointer-shift-x",
      `${pointer.current.x * -12}px`,
    );
    heroRef.current?.style.setProperty(
      "--pointer-shift-y",
      `${pointer.current.y * -9}px`,
    );
  };

  const resetPointer = () => {
    pointer.current = { x: 0, y: 0 };
    heroRef.current?.style.setProperty("--pointer-x", "54%");
    heroRef.current?.style.setProperty("--pointer-y", "48%");
    heroRef.current?.style.setProperty("--pointer-shift-x", "0px");
    heroRef.current?.style.setProperty("--pointer-shift-y", "0px");
  };

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      data-theme={theme}
      aria-labelledby="home-v2-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.ambient} aria-hidden="true" />
      <ForceFieldBackground
        pointer={pointer}
        reducedMotion={reducedMotion}
        isDark={theme === "dark"}
      />

      <div className={styles.heroInner}>
        <div className={styles.intro}>
          <span className={styles.statusLight} />
          <span>Student-built robotics, MSIT Delhi</span>
        </div>

        <div className={styles.stage}>
          <div className={styles.stageGlow} aria-hidden="true" />
          <div className={styles.stageFloor} aria-hidden="true" />
          <div className={styles.stageWord} aria-hidden="true">
            BUILD
          </div>
          <YantraSculpture
            pointer={pointer}
            reducedMotion={reducedMotion}
            isDark={theme === "dark"}
          />
        </div>

        <div className={styles.copy}>
          <p className={styles.kicker}>Curiosity becomes creation</p>
          <h1 id="home-v2-title">
            e-Yantra
            <span>makes it move.</span>
          </h1>
          <div className={styles.copyBottom}>
            <p className={styles.description}>
              We’re the student robotics community at MSIT. Come imagine what
              we can build together.
            </p>
            <Link href="/projects" className={styles.cta}>
              <span>See what we make</span>
              <Iconify icon="lucide:arrow-up-right" className={styles.ctaIcon} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
