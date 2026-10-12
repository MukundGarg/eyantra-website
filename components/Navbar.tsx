"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Iconify from "@/components/Iconify";

export default function Navbar() {
  const pathname = usePathname();
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
    { name: "Team", href: "/team" },
    { name: "Projects", href: "/projects" },
    { name: "Events", href: "/events" },
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
            ? "bg-white/90 backdrop-blur-2xl border-[#D9D9D5] shadow-[0_8px_30px_rgba(17,18,20,0.06)]"
            : "bg-[#FAFAF8]/85 backdrop-blur-md border-[#D9D9D5]/80 shadow-[0_4px_20px_rgba(17,18,20,0.03)]"
        }`}
      >
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-2 h-2 rounded-full bg-[#d83a32] group-hover:scale-125 transition-transform" />
            <span className="text-sm font-semibold tracking-wide uppercase text-[#111214] group-hover:text-[#d83a32] transition-colors">
              e-Yantra MSIT
            </span>
          </Link>

          <button
            className="md:hidden text-[#5F6368] hover:text-[#111214] focus:outline-none p-1 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Iconify icon={isOpen ? "lucide:x" : "lucide:menu"} className="w-5 h-5" />
          </button>
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
                  isActive ? "text-[#111214] font-semibold" : "text-[#5F6368] hover:text-[#111214]"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#d83a32] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
