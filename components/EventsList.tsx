'use client'

import { useState } from 'react'
import EventCard, { EventProps } from './EventCard'

export default function EventsList({ events }: { events: { event: EventProps, variant: "upcoming" | "past" | "ongoing" }[] }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(events.map(e => e.event.category).filter(Boolean)))]

  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(e => e.event.category === activeFilter)

  const ongoingEvents = filteredEvents.filter(e => e.variant === 'ongoing');
  const upcomingEvents = filteredEvents.filter(e => e.variant === 'upcoming');
  const pastEvents = filteredEvents.filter(e => e.variant === 'past');

  return (
    <>
      <div className="reveal flex flex-wrap justify-center gap-2 mb-12" id="event-filters">
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as string)}
            className={`px-4 py-1.5 text-[10px] font-bold font-mono uppercase tracking-widest rounded border transition-all cursor-pointer ${
              activeFilter === filter
                ? "bg-[#d83a32] text-white border-[#d83a32]"
                : "bg-transparent text-[#A6AAAE] border-[#292D32] hover:border-white/20 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-12" id="events-container">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-[#A6AAAE] py-20 font-mono">
            No events found in this category.
          </div>
        ) : (
          <>
            {ongoingEvents.length > 0 && (
              <div>
                <h3 className="text-xl font-bold font-mono text-white mb-6 border-b border-[#292D32] pb-4 reveal">
                  Ongoing Events
                </h3>
                <div className="flex flex-col gap-8 reveal">
                  {ongoingEvents.map((e, i) => (
                    <div key={e.event.title + i} className={`stagger-${(i % 3) + 1}`}>
                      <EventCard event={e.event} variant={e.variant} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {upcomingEvents.length > 0 && (
              <div className={ongoingEvents.length > 0 ? "mt-12" : ""}>
                <h3 className="text-xl font-bold font-mono text-white mb-6 border-b border-[#292D32] pb-4 reveal">
                  Upcoming Events
                </h3>
                <div className="flex flex-col gap-8 reveal">
                  {upcomingEvents.map((e, i) => (
                    <div key={e.event.title + i} className={`stagger-${(i % 3) + 1}`}>
                      <EventCard event={e.event} variant={e.variant} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {pastEvents.length > 0 && (
              <div className={(ongoingEvents.length > 0 || upcomingEvents.length > 0) ? "mt-12" : ""}>
                <h3 className="text-xl font-bold font-mono text-white mb-6 border-b border-[#292D32] pb-4 reveal">
                  Past Events
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
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
  )
}
