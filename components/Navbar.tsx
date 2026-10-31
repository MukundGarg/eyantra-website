"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Iconify from "@/components/Iconify";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./Navbar.module.css";

const links = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
  { name: "Team", href: "/team" },
  { name: "Bunty", href: "/bunty" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    const animationFrame = window.requestAnimationFrame(() => setMounted(true));

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        const focusableItems = Array.from(
          navRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
        ).filter((item) => item.getClientRects().length > 0);
        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];

        if (event.shiftKey && document.activeElement === firstItem) {
          event.preventDefault();
          lastItem?.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
          event.preventDefault();
          firstItem?.focus();
        }
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const renderThemeToggle = () => (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted && theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={styles.themeToggle}
    >
      <Iconify
        icon={mounted && theme === "dark" ? "lucide:sun" : "lucide:moon"}
        className="w-4 h-4"
      />
    </button>
  );

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${
        isOpen ? styles.open : ""
      } ${mounted ? styles.mounted : ""}`}
    >
      <nav ref={navRef} className={styles.nav} aria-label="Primary navigation">
        <div className={styles.topbar}>
          <Link href="/" className={styles.brand} onClick={() => setIsOpen(false)}>
            <span className={styles.brandMark} aria-hidden="true" />
            <span>e-Yantra MSIT</span>
          </Link>

          <div className={styles.mobileActions}>
            {renderThemeToggle()}
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuToggle}
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="primary-navigation-links"
            >
              <Iconify
                icon={isOpen ? "lucide:x" : "lucide:menu"}
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        <div
          id="primary-navigation-links"
          className={styles.linksPanel}
        >
          <ul className={styles.links}>
            {links.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className={styles.linkItem}>
                  <Link
                    ref={index === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`${styles.link} ${isActive ? styles.activeLink : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.desktopThemeToggle}>{renderThemeToggle()}</div>
        </div>

      </nav>
    </header>
  );
}
