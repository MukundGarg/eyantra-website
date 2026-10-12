"use client";

import { useState } from "react";
import EventCard, { EventProps } from "./EventCard";

export default function EventsList({
  events,
}: {
  events: { event: EventProps; variant: "upcoming" | "past" | "ongoing" }[];
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(events.map((e) => e.event.category).filter(Boolean))),
  ];

  const filteredEvents =
    activeFilter === "All"
      ? events
      : events.filter((e) => e.event.category === activeFilter);

  const ongoingEvents = filteredEvents.filter((e) => e.variant === "ongoing");
  const upcomingEvents = filteredEvents.filter((e) => e.variant === "upcoming");
  const pastEvents = filteredEvents.filter((e) => e.variant === "past");

  return (
    <>
      {/* Category Filter Pills */}
      <div className="reveal flex flex-wrap justify-center gap-2 mb-16" id="event-filters">
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as string)}
            className={`px-4 py-2 text-[10px] font-bold font-mono uppercase tracking-widest rounded-full border transition-all cursor-pointer ${
              activeFilter === filter
                ? "bg-[var(--accent-red)] text-white border-[var(--accent-red)] shadow-sm"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)]/30 hover:text-[var(--text-primary)] shadow-sm"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-16 max-w-5xl mx-auto" id="events-container">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-[var(--text-secondary)] py-24 font-mono text-sm border border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-surface)]">
            {"// NO SESSIONS FOUND IN THIS DOMAIN CATEGORY"}
          </div>
        ) : (
          <>
            {/* 1. ONGOING SESSIONS */}
            {ongoingEvents.length > 0 && (
              <div className="relative">
                <div className="flex items-center gap-3 mb-8 border-b border-[var(--border)] pb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-lg md:text-xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
                    Active & Ongoing Workshops
                  </h3>
                </div>
                <div className="flex flex-col gap-8 relative pl-4 md:pl-6 border-l border-emerald-500/40">
                  {ongoingEvents.map((e, i) => (
                    <div key={e.event.title + i} className="relative">
                      <span className="absolute -left-[1.4rem] md:-left-[1.85rem] top-8 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--bg-primary)] shadow-sm" />
                      <EventCard event={e.event} variant={e.variant} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. UPCOMING TIMELINE */}
            {upcomingEvents.length > 0 && (
              <div className="relative">
                <div className="flex items-center gap-3 mb-8 border-b border-[var(--border)] pb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-red)]" />
                  <h3 className="text-lg md:text-xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
                    Upcoming Calendar
                  </h3>
                </div>
                <div className="flex flex-col gap-8 relative pl-4 md:pl-6 border-l border-[var(--accent-red)]/40">
                  {upcomingEvents.map((e, i) => (
                    <div key={e.event.title + i} className="relative">
                      <span className="absolute -left-[1.4rem] md:-left-[1.85rem] top-8 w-3 h-3 rounded-full bg-[var(--accent-red)] border-2 border-[var(--bg-primary)] shadow-sm" />
                      <EventCard event={e.event} variant={e.variant} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. ARCHIVED / PAST SESSIONS */}
            {pastEvents.length > 0 && (
              <div className="relative pt-6">
                <div className="flex items-center gap-3 mb-8 border-b border-[var(--border)] pb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-secondary)]/40" />
                  <h3 className="text-lg md:text-xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
                    Past Archives & Hackathons
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((e, i) => (
                    <div key={e.event.title + i} className={`stagger-${(i % 3) + 1}`}>
                      <EventCard event={e.event} variant={e.variant} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
