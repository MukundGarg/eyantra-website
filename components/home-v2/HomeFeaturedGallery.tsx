"use client";

import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Iconify from "@/components/Iconify";
import styles from "./HomeFeaturedGallery.module.css";

export interface MasonryItem {
  id: string;
  img: string | null;
  url: "/events" | "/projects";
  height: number;
  title: string;
  description: string | null;
  category: string;
  createdAt: string;
  displayDate: string;
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface HomeFeaturedGalleryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
}

const columnGap = 20;
const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function getColumns(width: number) {
  if (width >= 900) return 3;
  if (width >= 580) return 2;
  return 1;
}

function getStartPosition(
  item: GridItem,
  direction: NonNullable<HomeFeaturedGalleryProps["animateFrom"]>,
  containerWidth: number,
  containerHeight: number,
) {
  if (direction === "random") {
    direction = (["top", "bottom", "left", "right"] as const)[
      Math.floor(Math.random() * 4)
    ];
  }

  switch (direction) {
    case "top":
      return { x: item.x, y: -item.h };
    case "bottom":
      return { x: item.x, y: containerHeight + item.h };
    case "left":
      return { x: -item.w, y: item.y };
    case "right":
      return { x: containerWidth + item.w, y: item.y };
    case "center":
      return {
        x: containerWidth / 2 - item.w / 2,
        y: containerHeight / 2 - item.h / 2,
      };
    default:
      return { x: item.x, y: item.y + 100 };
  }
}

export default function HomeFeaturedGallery({
  items,
  ease = "power3.out",
  duration = 0.8,
  stagger = 0.1,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = true,
  colorShiftOnHover = true,
}: HomeFeaturedGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const hasAnimated = useRef(false);
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useBrowserLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useBrowserLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useBrowserLayoutEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  const { grid, containerHeight } = useMemo(() => {
    if (width === 0 || items.length === 0) {
      return { grid: [] as GridItem[], containerHeight: 0 };
    }

    const columns = Math.min(getColumns(width), items.length);
    const columnHeights = Array.from({ length: columns }, () => 0);
    const itemWidth = (width - columnGap * (columns - 1)) / columns;
    const layout = items.map((item) => {
      const column = columnHeights.indexOf(Math.min(...columnHeights));
      const height = Math.max(340, (item.height / 400) * itemWidth);
      const nextItem: GridItem = {
        ...item,
        x: column * (itemWidth + columnGap),
        y: columnHeights[column],
        w: itemWidth,
        h: height,
      };
      columnHeights[column] += height + columnGap;
      return nextItem;
    });

    return {
      grid: layout,
      containerHeight: Math.max(...columnHeights) - columnGap,
    };
  }, [items, width]);

  useBrowserLayoutEffect(() => {
    if (!grid.length || !isVisible || !containerRef.current) return;

    const context = gsap.context(() => {
      grid.forEach((item, index) => {
        const element = itemRefs.current.get(item.id);
        if (!element) return;

        const target = {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          scale: 1,
        };

        if (reducedMotion) {
          gsap.set(element, { ...target, opacity: 1, filter: "blur(0px)" });
        } else if (!hasAnimated.current) {
          const start = getStartPosition(
            item,
            animateFrom,
            width,
            containerHeight,
          );
          gsap.fromTo(
            element,
            {
              opacity: 0,
              ...start,
              width: item.w,
              height: item.h,
              ...(blurToFocus ? { filter: "blur(14px)" } : {}),
            },
            {
              ...target,
              opacity: 1,
              ...(blurToFocus ? { filter: "blur(0px)" } : {}),
              duration,
              ease,
              delay: index * stagger,
              overwrite: "auto",
            },
          );
        } else {
          gsap.to(element, {
            ...target,
            duration,
            ease,
            overwrite: "auto",
          });
        }
      });
    }, containerRef);

    hasAnimated.current = true;
    return () => context.revert();
  }, [
    animateFrom,
    blurToFocus,
    containerHeight,
    duration,
    ease,
    grid,
    isVisible,
    reducedMotion,
    stagger,
    width,
  ]);

  const handleMouseEnter = (element: HTMLAnchorElement) => {
    if (scaleOnHover && !reducedMotion) {
      gsap.to(element, {
        scale: hoverScale,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeave = (element: HTMLAnchorElement) => {
    if (scaleOnHover && !reducedMotion) {
      gsap.to(element, {
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.gallery}
      style={{ height: containerHeight || undefined, minHeight: 360 }}
      role="group"
      aria-label="Featured events and projects"
    >
      {grid.map((item, index) => (
        <Link
          key={item.id}
          ref={(element) => {
            if (element) itemRefs.current.set(item.id, element);
            else itemRefs.current.delete(item.id);
          }}
          className={styles.card}
          href={item.url}
          aria-label={`${item.title}. ${item.description || "Explore this e-Yantra update."}`}
          style={{ width: item.w, height: item.h }}
          onMouseEnter={(event) => handleMouseEnter(event.currentTarget)}
          onMouseLeave={(event) => handleMouseLeave(event.currentTarget)}
        >
          <div className={styles.imageFrame}>
            {item.img ? (
              <Image
                src={item.img}
                alt=""
                fill
                sizes="(max-width: 580px) 90vw, (max-width: 900px) 45vw, 30vw"
                unoptimized
                className={styles.image}
              />
            ) : (
              <span className={styles.imageFallback} aria-hidden="true">
                eY
              </span>
            )}
            {colorShiftOnHover && <span className={styles.colorOverlay} />}
            <span className={styles.imageIndex}>
              {String(index + 1).padStart(2, "0")}
              <span> / {String(items.length).padStart(2, "0")}</span>
            </span>
          </div>
          <div className={styles.cardCopy}>
            <div className={styles.meta}>
              <span>{item.category}</span>
              <time dateTime={item.createdAt}>
                {item.displayDate}
              </time>
            </div>
            <h3>{item.title}</h3>
            <p>
              {item.description ||
                "Discover what the e-Yantra MSIT community has been building."}
            </p>
            <span className={styles.cardLink}>
              {item.url === "/events" ? "Explore event" : "View project"}
              <Iconify icon="lucide:arrow-up-right" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
