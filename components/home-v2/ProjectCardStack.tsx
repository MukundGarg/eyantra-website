"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
import type { Project } from "@/types/index";
import Iconify from "@/components/Iconify";
import styles from "./ProjectCardStack.module.css";

type FeaturedProject = Pick<
  Project,
  | "id"
  | "title"
  | "short_description"
  | "category"
  | "tech_stack"
  | "cover_image"
  | "demo_url"
  | "github_url"
  | "year"
>;

const SWAP_DURATION = 520;
const SWAP_INTERVAL = 2800;

export default function ProjectCardStack({
  projects,
}: {
  projects: FeaturedProject[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const swapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSwappingRef = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  const advance = useCallback(() => {
    if (projects.length < 2 || isSwappingRef.current) return;

    if (reducedMotion) {
      setActiveIndex((current) => (current + 1) % projects.length);
      return;
    }

    isSwappingRef.current = true;
    setIsSwapping(true);
    setExitingIndex(activeIndex);
    swapTimeout.current = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
      setExitingIndex(null);
      isSwappingRef.current = false;
      setIsSwapping(false);
    }, SWAP_DURATION);
  }, [activeIndex, projects.length, reducedMotion]);

  useEffect(() => {
    if (projects.length < 2 || paused || reducedMotion) return;

    const interval = window.setInterval(advance, SWAP_INTERVAL);
    return () => window.clearInterval(interval);
  }, [advance, paused, projects.length, reducedMotion]);

  useEffect(
    () => () => {
      if (swapTimeout.current) clearTimeout(swapTimeout.current);
    },
    [],
  );

  const moveTo = (index: number) => {
    if (index === activeIndex || isSwappingRef.current) return;
    if (swapTimeout.current) clearTimeout(swapTimeout.current);

    if (reducedMotion) {
      setActiveIndex(index);
      return;
    }

    isSwappingRef.current = true;
    setIsSwapping(true);
    setExitingIndex(activeIndex);
    swapTimeout.current = setTimeout(() => {
      setActiveIndex(index);
      setExitingIndex(null);
      isSwappingRef.current = false;
      setIsSwapping(false);
    }, SWAP_DURATION);
  };

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);
  const handleFocus = () => setPaused(true);
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
  };

  return (
    <div
      className={styles.deck}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      role="group"
      aria-label="Featured projects"
    >
      <div className={styles.cards} aria-live="polite">
        {projects.map((project, index) => {
          const slot = (index - activeIndex + projects.length) % projects.length;
          const isExiting = exitingIndex === index;
          const href =
            [project.demo_url, project.github_url].find(
              (url) =>
                url &&
                ((url.startsWith("/") && !url.startsWith("//")) ||
                  /^https?:\/\//i.test(url)),
            ) || "/projects";
          const external = href.startsWith("http");
          const technologies = project.tech_stack?.slice(0, 3) ?? [];

          return (
            <a
              className={`${styles.card} ${isExiting ? styles.exiting : ""}`}
              data-slot={slot}
              href={href}
              key={project.id}
              tabIndex={slot === 0 && !isExiting ? 0 : -1}
              aria-hidden={slot !== 0 || isExiting}
              aria-label={`${project.title}. ${project.short_description ?? "View project details"}`}
              onClick={(event) => {
                if (slot !== 0) {
                  event.preventDefault();
                  moveTo(index);
                }
              }}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              <div className={styles.imageArea}>
                {project.cover_image ? (
                  <Image
                    src={project.cover_image}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 82vw, 520px"
                    unoptimized
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imageFallback} aria-hidden="true">
                    <span>eY</span>
                  </div>
                )}
                <span className={styles.imageWash} />
                <span className={styles.projectNumber}>
                  {String(index + 1).padStart(2, "0")}
                  <span> / {String(projects.length).padStart(2, "0")}</span>
                </span>
              </div>

              <div className={styles.cardCopy}>
                <div className={styles.meta}>
                  <span>{project.category || "Student project"}</span>
                  {project.year ? <span>{project.year}</span> : null}
                </div>
                <h3>{project.title}</h3>
                <p>
                  {project.short_description ||
                    "A student-built project from the e-Yantra MSIT community."}
                </p>
                {technologies.length > 0 && (
                  <ul className={styles.techList} aria-label="Technologies">
                    {technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                )}
                <span className={styles.cardArrow} aria-hidden="true">
                  <Iconify icon="lucide:arrow-up-right" />
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {projects.length > 1 && (
        <div className={styles.controls} aria-label="Project showcase controls">
          <button
            className={styles.control}
            type="button"
            onClick={() =>
              moveTo((activeIndex - 1 + projects.length) % projects.length)
            }
            disabled={isSwapping}
            aria-label="Previous project"
          >
            <Iconify icon="lucide:arrow-left" />
          </button>
          <div className={styles.pagination} aria-label="Choose a project">
            {projects.map((project, index) => (
              <button
                className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ""}`}
                key={project.id}
                type="button"
                onClick={() => moveTo(index)}
                disabled={isSwapping}
                aria-label={`Show project ${index + 1}: ${project.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
          <button
            className={styles.control}
            type="button"
            onClick={advance}
            disabled={isSwapping}
            aria-label="Next project"
          >
            <Iconify icon="lucide:arrow-right" />
          </button>
        </div>
      )}
    </div>
  );
}
