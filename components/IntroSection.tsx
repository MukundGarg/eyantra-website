"use client";

import React from "react";

export default function IntroSection() {
  return (
    <section className="py-40 md:py-52 px-6 md:px-12 relative overflow-hidden border-t border-b border-[#292D32]/60 bg-[#0B0D10]">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Editorial Subhead */}
        <div className="reveal flex items-center gap-3 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
          <span className="text-xs font-mono text-[#d83a32] uppercase tracking-widest font-bold">
            CREED {"//"} THE LAB PHILOSOPHY
          </span>
        </div>

        {/* Large Editorial Headline (Arago-inspired whitespace & scale) */}
        <div className="reveal space-y-2 mb-12">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-mono tracking-tighter text-white leading-[1.08]">
            <span className="block text-zinc-400 font-light">Engineering starts</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400">
              where theory ends.
            </span>
          </h2>
        </div>

        {/* Editorial paragraph and telemetry columns */}
        <div className="reveal grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-[#292D32]/80">
          <div className="md:col-span-7">
            <p className="text-lg md:text-xl text-[#A6AAAE] leading-relaxed font-light">
              We believe real understanding only begins when code meets copper, circuits close, and machines begin to move under their own autonomy.
            </p>
            <p className="text-sm text-[#A6AAAE]/70 font-mono mt-4 leading-relaxed">
              Every resistor, capacitor, and clock cycle is a deliberate decision in the pursuit of mechanical and computational harmony.
            </p>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-6 md:pl-8 border-l border-[#292D32]/40">
            <div>
              <span className="text-2xl md:text-3xl font-mono font-bold text-white block">50+</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6AAAE] mt-1 block">
                Prototypes Built
              </span>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-mono font-bold text-[#d83a32] block">100%</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6AAAE] mt-1 block">
                Hardware Driven
              </span>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-mono font-bold text-white block">04</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6AAAE] mt-1 block">
                Lab Tracks
              </span>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-mono font-bold text-[#d83a32] block">16 MHz</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A6AAAE] mt-1 block">
                Clock Rate
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
