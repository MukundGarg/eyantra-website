"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let observer: IntersectionObserver | null = null;

    function initScrollReveals() {
      if (prefersReducedMotion) {
        document.querySelectorAll(".reveal, .reveal-left, .reveal-scale").forEach((el) => {
          el.classList.add("revealed");
        });
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              if (observer) observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -60px 0px",
        }
      );

      document.querySelectorAll(".reveal, .reveal-left, .reveal-scale").forEach((el) => {
        if (observer) observer.observe(el);
      });
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

    // Wrap initialization in a small delay to ensure DOM is ready after navigation
    const timeoutId = setTimeout(() => {
      initScrollReveals();
    }, 50);
    
    const cleanupNav = initNavbarScroll();

    return () => {
      clearTimeout(timeoutId);
      if (observer) observer.disconnect();
      if (cleanupNav) cleanupNav();
    };
  }, [pathname]);

  return <>{children}</>;
}
