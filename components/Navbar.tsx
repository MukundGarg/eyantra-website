"use client";
import Iconify from "@/components/Iconify";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Team", href: "/team" },
    { name: "Projects", href: "/projects" },
    { name: "Events", href: "/events" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 pt-6 px-4">
      <nav
        id="main-nav"
        className="max-w-5xl mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl"
      >
        <Link href="/" className="flex items-center gap-2">
          <Iconify icon="lucide:cpu" className="w-5 h-5 text-[#d83a32]" />
          <span className="text-lg font-bold font-mono tracking-tight text-white">e-Yantra MSIT</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 px-6 py-2 transition-transform active:scale-95">
            <span className="absolute inset-0 border border-white/10 rounded-full"></span>
            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#d83a32_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute inset-[1px] rounded-full bg-[#15181C]"></span>
            <span className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              Join Us <Iconify icon="lucide:arrow-right" className="w-3 h-3 cta-arrow" />
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
