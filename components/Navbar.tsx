"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Iconify from "@/components/Iconify";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Smooth fade in on load
    const t = setTimeout(() => setMounted(true), 100);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Events", href: "/events" },
    { name: "Team", href: "/team" },
    { name: "Bunty", href: "/bunty" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-8 ${
        isScrolled ? "pt-3 pb-2" : "pt-6 pb-4"
      } ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
    >
      <nav
        id="main-nav"
        className={`max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between border rounded-full transition-all duration-300 px-6 py-2.5 relative ${
          isScrolled
            ? "bg-[var(--bg-surface)]/90 backdrop-blur-2xl border-[var(--border)] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            : "bg-[var(--bg-primary)]/85 backdrop-blur-md border-[var(--border)]/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        }`}
      >
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-red)] group-hover:scale-125 transition-transform" />
            <span className="text-sm font-semibold tracking-wide uppercase text-[var(--text-primary)] group-hover:text-[var(--accent-red)] transition-colors">
              e-Yantra MSIT
            </span>
          </Link>

          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={mounted && theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] border border-[var(--border)]/60 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] cursor-pointer"
            >
              <Iconify
                icon={mounted && theme === "dark" ? "lucide:sun" : "lucide:moon"}
                className="w-4 h-4"
              />
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-hidden p-1 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <Iconify icon={isOpen ? "lucide:x" : "lucide:menu"} className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-6 md:gap-7 w-full md:w-auto mt-4 md:mt-0 pb-3 md:pb-0`}
        >
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`relative text-xs tracking-wider uppercase transition-colors py-1 font-medium ${
                  isActive
                    ? "text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--accent-red)] rounded-full" />
                )}
              </Link>
            );
          })}

          {/* Desktop Theme Toggle Button */}
          <div className="hidden md:flex items-center pl-2 border-l border-[var(--border)]">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={mounted && theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)] border border-transparent hover:border-[var(--border)] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] cursor-pointer"
            >
              <Iconify
                icon={mounted && theme === "dark" ? "lucide:sun" : "lucide:moon"}
                className="w-4 h-4 transition-transform hover:rotate-12"
              />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

