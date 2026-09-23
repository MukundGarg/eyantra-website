"use client";
import Iconify from "@/components/Iconify";

import { useEffect } from "react";

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function initScrollReveals() {
      if (prefersReducedMotion) {
        document.querySelectorAll(".reveal, .reveal-left, .reveal-scale").forEach((el) => {
          el.classList.add("revealed");
        });
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -60px 0px",
        }
      );

      document.querySelectorAll(".reveal, .reveal-left, .reveal-scale").forEach((el) => observer.observe(el));
    }

    function initNavbarScroll() {
      const nav = document.getElementById("main-nav");
      if (!nav) return;

      let ticking = false;
      const scrollThreshold = 80;

      function onScroll() {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (window.scrollY > scrollThreshold) {
              nav!.classList.add("nav-scrolled");
            } else {
              nav!.classList.remove("nav-scrolled");
            }
            ticking = false;
          });
          ticking = true;
        }
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    initScrollReveals();
    const cleanupNav = initNavbarScroll();

    return () => {
      if (cleanupNav) cleanupNav();
    };
  }, []);

  return <>{children}</>;
}
